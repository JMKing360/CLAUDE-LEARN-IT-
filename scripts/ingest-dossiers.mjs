#!/usr/bin/env node
// Ingest covenant dossiers into Cloudflare Vectorize for the Mogire AI RAG
// layer. Run once after the Vectorize index is created, and re-run whenever
// the dossiers are updated (vector IDs are deterministic — updates overwrite).
//
// Setup (one-time, in the Cloudflare dashboard):
//   1. Workers & Pages → Vectorize → Create index
//        name:       mogire-ai-dossiers   (any name; match VECTORIZE_INDEX env)
//        dimensions: 1024                  (matches voyage-3)
//        metric:     cosine
//   2. Pages project → Settings → Functions → Vectorize bindings → Add
//        variable name:  HOM_VECTORIZE
//        index:          mogire-ai-dossiers
//      (Both Production AND Preview scopes.)
//
// Required env vars to run this script:
//   VOYAGE_API_KEY          Voyage AI key (dash.voyageai.com → API Keys)
//   CLOUDFLARE_ACCOUNT_ID   dash.cloudflare.com → right sidebar → Account ID
//   CLOUDFLARE_API_TOKEN    My Profile → API Tokens → Create Token →
//                            template: "Edit Cloudflare Workers" → restrict
//                            to the account → Vectorize: Edit
//   VECTORIZE_INDEX         optional, defaults to "mogire-ai-dossiers"
//
// Run:
//   cd /path/to/CLAUDE-LEARN-IT-
//   VOYAGE_API_KEY=... CLOUDFLARE_ACCOUNT_ID=... CLOUDFLARE_API_TOKEN=... \
//     node scripts/ingest-dossiers.mjs
//
// What it does:
//   - Reads every .md file under data/dossiers/covenants/
//   - Chunks each file by H2 (## ...) section. Sections shorter than
//     MIN_CHUNK_CHARS are merged with their neighbour.
//   - Tags chunks with {covenant, run, section_title, source_file}
//   - Embeds chunks via Voyage AI (voyage-3, input_type: "document")
//     in batches of 32
//   - Upserts to Vectorize via the REST API. Vector IDs are
//     <covenant>:<run>:<section_index> so re-runs overwrite cleanly.
//
// Output: prints per-file progress + a final summary count.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);
const DOSSIER_DIR = join(REPO, 'data', 'dossiers', 'covenants');

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const VECTORIZE_INDEX = process.env.VECTORIZE_INDEX || 'mogire-ai-dossiers';
const VOYAGE_MODEL = 'voyage-3';
const EMBED_BATCH = 32;
const MIN_CHUNK_CHARS = 400;
const MAX_CHUNK_CHARS = 4500;

function need(name, val) {
  if (!val) {
    console.error(`Missing required env var: ${name}`);
    process.exit(2);
  }
}
need('VOYAGE_API_KEY', VOYAGE_API_KEY);
need('CLOUDFLARE_ACCOUNT_ID', CLOUDFLARE_ACCOUNT_ID);
need('CLOUDFLARE_API_TOKEN', CLOUDFLARE_API_TOKEN);

if (!existsSync(DOSSIER_DIR)) {
  console.error(`Dossier directory not found: ${DOSSIER_DIR}`);
  process.exit(2);
}

// Parse filename like "Self_run3.md" → { covenant: "Self", run: 3 }
function parseDossierFilename(name) {
  const m = name.match(/^([A-Za-z]+)_run(\d+)\.md$/);
  if (!m) return null;
  return { covenant: m[1], run: parseInt(m[2], 10) };
}

// Split markdown into chunks by H2 (## ...) section. Merge short sections
// into their neighbour, split overly long sections at the next H3 or by char
// length. Returns [{section_title, text}].
function chunkMarkdown(md) {
  const lines = md.split('\n');
  const sections = [];
  let current = { title: '(preamble)', text: [] };

  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      if (current.text.length) sections.push({ title: current.title, text: current.text.join('\n').trim() });
      current = { title: line.replace(/^#+\s+/, '').trim(), text: [] };
    } else {
      current.text.push(line);
    }
  }
  if (current.text.length) sections.push({ title: current.title, text: current.text.join('\n').trim() });

  // Merge sections shorter than MIN_CHUNK_CHARS into the next one
  const merged = [];
  let buffer = null;
  for (const s of sections) {
    if (!s.text) continue;
    if (buffer) {
      buffer.text += '\n\n' + s.title + '\n' + s.text;
      buffer.title = buffer.title + ' + ' + s.title;
      if (buffer.text.length >= MIN_CHUNK_CHARS) {
        merged.push(buffer);
        buffer = null;
      }
    } else if (s.text.length < MIN_CHUNK_CHARS) {
      buffer = { title: s.title, text: s.text };
    } else {
      merged.push(s);
    }
  }
  if (buffer) merged.push(buffer);

  // Split overly long sections at MAX_CHUNK_CHARS on paragraph boundaries
  const final = [];
  for (const s of merged) {
    if (s.text.length <= MAX_CHUNK_CHARS) {
      final.push(s);
      continue;
    }
    const paras = s.text.split(/\n\n+/);
    let part = '';
    let partIdx = 1;
    for (const p of paras) {
      if ((part + '\n\n' + p).length > MAX_CHUNK_CHARS && part) {
        final.push({ title: `${s.title} (part ${partIdx})`, text: part.trim() });
        partIdx++;
        part = p;
      } else {
        part = part ? part + '\n\n' + p : p;
      }
    }
    if (part) final.push({ title: `${s.title} (part ${partIdx})`, text: part.trim() });
  }
  return final;
}

async function embed(texts) {
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${VOYAGE_API_KEY}`
    },
    body: JSON.stringify({
      input: texts,
      model: VOYAGE_MODEL,
      input_type: 'document'
    })
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Voyage embed failed: ${res.status} ${t.slice(0, 400)}`);
  }
  const data = await res.json();
  return data.data.map((d) => d.embedding);
}

async function upsertVectors(vectors) {
  // Cloudflare Vectorize REST: insert is upsert when id collides.
  // Per-call payload limit ~5MB; we chunk into batches of 100.
  const BATCH = 100;
  for (let i = 0; i < vectors.length; i += BATCH) {
    const batch = vectors.slice(i, i + BATCH);
    // The REST API accepts NDJSON in the body: one JSON object per line.
    const body = batch.map((v) => JSON.stringify(v)).join('\n');
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/vectorize/v2/indexes/${VECTORIZE_INDEX}/upsert`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-ndjson',
        authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`
      },
      body
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Vectorize upsert failed: ${res.status} ${t.slice(0, 400)}`);
    }
  }
}

(async function main() {
  const files = readdirSync(DOSSIER_DIR).filter((f) => f.endsWith('.md')).sort();
  console.log(`Found ${files.length} dossier files in ${DOSSIER_DIR}`);

  const allVectors = [];
  let totalChunks = 0;

  for (const file of files) {
    const meta = parseDossierFilename(file);
    if (!meta) {
      console.warn(`  skip (filename does not match pattern): ${file}`);
      continue;
    }
    const md = readFileSync(join(DOSSIER_DIR, file), 'utf8');
    const chunks = chunkMarkdown(md);
    console.log(`  ${file}: ${chunks.length} chunks`);
    totalChunks += chunks.length;

    // Embed in batches
    for (let i = 0; i < chunks.length; i += EMBED_BATCH) {
      const batch = chunks.slice(i, i + EMBED_BATCH);
      const texts = batch.map((c) => `${c.title}\n\n${c.text}`);
      const embeddings = await embed(texts);
      for (let j = 0; j < batch.length; j++) {
        const sectionIdx = i + j;
        const id = `${meta.covenant.toLowerCase()}:${meta.run}:${sectionIdx}`;
        allVectors.push({
          id,
          values: embeddings[j],
          metadata: {
            covenant: meta.covenant,
            run: meta.run,
            section_index: sectionIdx,
            section_title: batch[j].title,
            source_file: file,
            text: batch[j].text.slice(0, 4000) // truncate for return
          }
        });
      }
    }
  }

  console.log(`\nEmbedded ${allVectors.length} chunks. Upserting to Vectorize index "${VECTORIZE_INDEX}"...`);
  await upsertVectors(allVectors);
  console.log(`\nDone. ${allVectors.length} vectors written to ${VECTORIZE_INDEX}.`);
  console.log(`\nVerify with:`);
  console.log(`  curl -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \\`);
  console.log(`    https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/vectorize/v2/indexes/${VECTORIZE_INDEX}/info`);
})().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});

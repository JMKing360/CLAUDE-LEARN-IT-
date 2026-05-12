// Cloudflare Pages Function: Mogire AI — pattern synthesis layer.
//
// Path: POST /api/mogire-ai
// Trigger: Frontend (KOORA or First Hour results screen) — fires once
//          automatically on results render (mode:"auto") and again for each
//          Q&A prompt the participant submits (mode:"qa"). The function:
//          1) builds a 6-layer system prompt that captures Dr Mogire's voice
//             and the instrument's frame,
//          2) optionally retrieves RAG context from a Cloudflare Vectorize
//             index (when bound) for grounding in Dr Mogire's body of work,
//          3) optionally pulls a longitudinal-memory blob from KV (when
//             bound) so returning participants get continuity across takes,
//          4) calls Anthropic Claude (Opus 4.7, adaptive thinking, high
//             effort) with prompt caching on the stable prefix, and
//          5) writes the resulting prompt count + a memory summary back to
//             KV.
//
// Why raw fetch and not @anthropic-ai/sdk:
//   The repo has no build pipeline — vanilla HTML + Cloudflare Pages
//   Functions with zero npm install step. Adding the SDK would force a
//   package.json + node_modules bundling stage that no other file in this
//   tree assumes. functions/api/capi.js already calls Meta CAPI via fetch
//   for the same reason; staying consistent. If a build step lands later,
//   migrate to the SDK and use the same Messages API call shape (it maps
//   1:1 with the JSON body below per the SDK skill).
//
// Required Pages env vars (Cloudflare dashboard → Settings → Environment):
//   ANTHROPIC_API_KEY      — Anthropic API key with Messages API access.
//   HOM_KV                 — (optional) KV namespace binding. Without it
//                            the function still works but enforces the
//                            7-free-prompt cap on the client only.
//   HOM_VECTORIZE          — (optional) Vectorize index binding for RAG.
//   VOYAGE_API_KEY         — (optional) Voyage AI key for embedding the
//                            participant's record before Vectorize query.
//   META_TEST_EVENT_CODE   — unrelated; for CAPI dispatcher only.
//
// Body shape (JSON):
//   {
//     instrument: "koora" | "first-hour",
//     mode: "auto" | "qa",
//     rec: <buildRecord output from the app — must include .email>,
//     prompt?: string,       // required when mode === "qa"
//     history?: Array<{role: "user"|"assistant", content: string}>
//   }
//
// Response (200):
//   {
//     ok: true,
//     text: "<assistant message>",
//     used: number,          // count of Q&A prompts used for this email
//     limit: 7,
//     cache_read_input_tokens: number,
//     cache_creation_input_tokens: number,
//     input_tokens: number,
//     output_tokens: number
//   }
//
// Errors (4xx/5xx):
//   { ok: false, error: "<reason>", detail?: "<more>" }

const FREE_PROMPT_LIMIT = 7;
const KV_PROMPT_TTL_DAYS = 365;
const KV_MEMORY_TTL_DAYS = 365;
const MEMORY_TAIL_BYTES = 4000;
const ANTHROPIC_MODEL = 'claude-opus-4-7';
const ANTHROPIC_VERSION = '2023-06-01';

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.ANTHROPIC_API_KEY) {
    return json({
      ok: false,
      error: 'AI not configured',
      detail: 'ANTHROPIC_API_KEY not set in Pages environment.'
    }, 503);
  }

  let body;
  try { body = await request.json(); } catch (e) {
    return json({ ok: false, error: 'invalid JSON' }, 400);
  }

  const instrument = body.instrument === 'first-hour' ? 'first-hour' : 'koora';
  const mode = body.mode === 'qa' ? 'qa' : 'auto';
  const rec = body.rec || {};
  const prompt = (body.prompt || '').toString().trim();
  const history = Array.isArray(body.history) ? body.history.slice(-10) : [];

  const email = (rec.email || rec.to_email || '').toString().trim().toLowerCase();
  if (!email) return json({ ok: false, error: 'rec.email required' }, 400);
  if (mode === 'qa' && !prompt) return json({ ok: false, error: 'prompt required for qa mode' }, 400);

  // Rate-limit (server-authoritative when HOM_KV is bound).
  let used = 0;
  if (env.HOM_KV) {
    try {
      const raw = await env.HOM_KV.get(promptKey(email));
      used = raw ? parseInt(raw, 10) || 0 : 0;
    } catch (e) { /* fall through; treat as unlimited rather than failing the call */ }
    if (mode === 'qa' && used >= FREE_PROMPT_LIMIT) {
      return json({
        ok: false,
        error: 'free prompt limit reached',
        used,
        limit: FREE_PROMPT_LIMIT
      }, 402);
    }
  }

  // Optional RAG (Vectorize + Voyage). Graceful degrade when not configured.
  let ragContext = '';
  if (env.HOM_VECTORIZE && env.VOYAGE_API_KEY) {
    try {
      ragContext = await retrieveRag({ rec, prompt, instrument, env });
    } catch (e) { /* no-op; system prompt notes the absence */ }
  }

  // Optional longitudinal memory (KV).
  let memoryContext = '';
  if (env.HOM_KV) {
    try {
      memoryContext = (await env.HOM_KV.get(memoryKey(email))) || '';
    } catch (e) { /* no-op */ }
  }

  const systemBlocks = buildSystemBlocks({ instrument, ragContext, memoryContext, mode });
  const messages = buildMessages({ mode, rec, prompt, history, instrument });

  let claude;
  try {
    claude = await callClaude({ apiKey: env.ANTHROPIC_API_KEY, systemBlocks, messages });
  } catch (e) {
    return json({
      ok: false,
      error: 'claude call failed',
      detail: (e && e.message) || String(e)
    }, 502);
  }

  const text = (claude.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();

  // Increment counter on Q&A (auto-synthesis is free, fires once per
  // completion regardless of the cap).
  if (mode === 'qa' && env.HOM_KV) {
    try {
      await env.HOM_KV.put(promptKey(email), String(used + 1), {
        expirationTtl: KV_PROMPT_TTL_DAYS * 86400
      });
      used = used + 1;
    } catch (e) { /* no-op */ }
  }

  // Append a brief summary to longitudinal memory. Kept under
  // MEMORY_TAIL_BYTES to bound KV growth + the cached system prefix.
  if (env.HOM_KV) {
    try {
      const stamp = new Date().toISOString().slice(0, 10);
      const summary = `[${stamp} · ${instrument} · ${mode}] ${(prompt || '(auto-synthesis)').slice(0, 220)} → ${text.slice(0, 220)}`;
      const next = (memoryContext + '\n' + summary).slice(-MEMORY_TAIL_BYTES);
      await env.HOM_KV.put(memoryKey(email), next, {
        expirationTtl: KV_MEMORY_TTL_DAYS * 86400
      });
    } catch (e) { /* no-op */ }
  }

  const usage = claude.usage || {};
  return json({
    ok: true,
    text,
    used,
    limit: FREE_PROMPT_LIMIT,
    stop_reason: claude.stop_reason || null,
    cache_read_input_tokens: usage.cache_read_input_tokens || 0,
    cache_creation_input_tokens: usage.cache_creation_input_tokens || 0,
    input_tokens: usage.input_tokens || 0,
    output_tokens: usage.output_tokens || 0
  });
}

// ────────────────────── prompt assembly ──────────────────────

function buildSystemBlocks({ instrument, ragContext, memoryContext, mode }) {
  // Layer 1-3 are STABLE per-instrument and per-mode and benefit from prompt
  // caching. Layer 4-5 (RAG + memory) are per-call and follow without a
  // cache_control marker so they never invalidate the cached prefix.
  //
  // Per Anthropic caching: a single `cache_control` on the last STABLE block
  // caches everything before it. So we put L1+L2+L3 in one block, mark it,
  // then append L4 (rag) and L5 (memory) as a single trailing block with no
  // marker. ~90% cost reduction on the stable prefix across calls.

  const stable = [
    LAYER_1_ROLE,
    LAYER_2_VOICE,
    layer3Instrument(instrument),
    layer6ModeRules(mode)
  ].join('\n\n');

  const dynamic = [
    layer4Rag(ragContext),
    layer5Memory(memoryContext)
  ].filter(Boolean).join('\n\n');

  const blocks = [
    { type: 'text', text: stable, cache_control: { type: 'ephemeral' } }
  ];
  if (dynamic) blocks.push({ type: 'text', text: dynamic });
  return blocks;
}

const LAYER_1_ROLE = `# Layer 1 · Role
You are Mogire AI — a pattern-synthesis layer trained on the framework of Dr Job Mogire MD FACC, founder of House of Mastery and architect of KOORA: The Finisher's Protocol and The First Hour audit. You are an AI synthesis, not Dr Mogire himself. You read the participant's responses through his framework and name what you see.`;

const LAYER_2_VOICE = `# Layer 2 · Voice
Clinical depth, behavioural design, spiritual gravity — never marketing copy. Direct. Not flattering. Not wounding. The doctrine is: "The pattern is the diagnosis, never the verdict." Short clauses. Imperatives are the signature. British English (criticising, normalised, honour, recognise, behaviour). You notice. You do not motivate. You do not perform. You do not flatter or catastrophise. The frame is observation.`;

function layer3Instrument(instrument) {
  if (instrument === 'first-hour') {
    return `# Layer 3 · Instrument context — The First Hour
The participant has just completed The First Hour: a free 54-item audit by Dr Mogire across nine chambers organised into three triads (Inner Ruins · Broken Vessels · Stolen Resources). Items use a 1–4 Likert scale plus a six-item agency-matrix binary check at the end. The framing the participant met was "You are about to see your life with new eyes" — the patterns running underneath their life, the ones they have not let themselves say out loud. The record carries: scores per chamber, the participant's primary (loudest) chamber, examen selections from the pre-audit tickbox grid, emo_resonance + emo_readiness (their two emotional commitments before the audit), unfinished_selected (UNFINISHED self-naming labels from the assessment), agency_matrix (red/green axes per faculty), and their own words from the pain/intent text fields.`;
  }
  return `# Layer 3 · Instrument context — KOORA UNFINISHED
The participant has just completed UNFINISHED: the 60-item diagnostic of KOORA: The Finisher's Protocol — a physician-designed 6-month protocol structured around six monthly covenants (Self · Body · Craft · People · Future · World) with ALCARRA as the daily protocol. Items use a 1–4 Likert scale. The framing they met was "You are about to meet your unspoken emotional load." The record carries: scores per reflex (Complaining · Criticising · Comparing · Competing), the participant's primary (loudest) reflex, ALCARRA fidelity, four needs (filled vs substituted), forces, fidelities, faculties, cov_pulse (is the active covenant's promise alive today), cov_entry_selected (which tickboxes from the covenant-entry list they marked), claim (will they return in 15 days), day_of_path, enrolled flag, and their own words from the pain/intent text fields.`;
}

function layer4Rag(ragContext) {
  if (!ragContext) {
    return `# Layer 4 · Body of work
The Vectorize index is not configured for this deployment. Speak from the framework knowledge in Layers 1–3. Do not invent specific writings, quotes, or biographical claims about Dr Mogire that are not in the layers above.`;
  }
  return `# Layer 4 · Body of work — relevant passages from Dr Mogire's writing
The following passages are retrieved from Dr Mogire's archive based on the participant's primary pattern and their own words. Cite them by reference when they ground a claim. Do not contradict them. Do not paraphrase them as if you wrote them.

${ragContext}`;
}

function layer5Memory(memoryContext) {
  if (!memoryContext) return '';
  return `# Layer 5 · This participant's prior sessions
This is not their first reading. Brief summaries of prior sessions (most recent last):

${memoryContext}

Use this to track movement over time. If the pattern is the same as last time, name that. If it has shifted, name how. Do not pretend you remember more than these summaries hold.`;
}

function layer6ModeRules(mode) {
  const modeBlock = mode === 'auto'
    ? `# Layer 6 · Mode — AUTO-SYNTHESIS
You will receive the participant's record. Synthesise it. 200–300 words, no lists, no bullet points, no clinical jargon outside the framework. Name the dominant pattern, the cost it is exacting, and the single first move that is structurally appropriate. End with one sentence that earns the right to be remembered. Do not greet. Do not introduce yourself. Begin in observation.`
    : `# Layer 6 · Mode — Q&A
The participant has a specific question. Answer it directly from their data and the framework. Do not generalise. Do not hedge. If their record cannot answer the question, name that plainly. 150–250 words. No lists.`;

  return `${modeBlock}

# Hard rules — non-negotiable
- You are an AI synthesis, NOT a clinical diagnosis. Never imply you are providing medical, psychiatric, or psychological treatment.
- If the participant describes a safety concern (self-harm, ongoing abuse, acute crisis): respond with care, direct them to local emergency services and to mail@mogire.com. Do not continue with framework synthesis until safety is named.
- Do not invent data. If the record does not support a claim, do not make it.
- Do not flatter. Do not catastrophise. The frame is observation.
- British English. Short clauses. Imperatives are the signature.`;
}

function buildMessages({ mode, rec, prompt, history, instrument }) {
  const recBlock = `Here is the participant's record from the just-completed ${instrument === 'first-hour' ? 'First Hour audit' : 'KOORA diagnostic'}:

\`\`\`json
${JSON.stringify(redactForPrompt(rec), null, 2)}
\`\`\``;

  if (mode === 'auto') {
    return [{ role: 'user', content: recBlock + '\n\nSynthesise.' }];
  }

  // Q&A: include record once at the start, then walk the history, then the
  // new prompt. The record stays in context so follow-up questions can reach
  // back into it without us re-injecting per turn.
  const msgs = [{ role: 'user', content: recBlock }];
  if (history && history.length) {
    msgs.push({ role: 'assistant', content: '(record received — ready for questions)' });
    for (const turn of history) {
      if (turn && (turn.role === 'user' || turn.role === 'assistant') && typeof turn.content === 'string') {
        msgs.push({ role: turn.role, content: turn.content });
      }
    }
  } else {
    msgs.push({ role: 'assistant', content: '(record received — ready for questions)' });
  }
  msgs.push({ role: 'user', content: prompt });
  return msgs;
}

// Strip raw email + names from what the model sees — the framework call does
// not need them, and removing them keeps the system from referring to the
// participant by name (which would feel impersonal and parasocial).
function redactForPrompt(rec) {
  const out = {};
  for (const k in rec) {
    if (k === 'email' || k === 'to_email' || k === 'cc_email' || k === 'name' || k === 'to_name') continue;
    out[k] = rec[k];
  }
  return out;
}

// ────────────────────── Anthropic call ──────────────────────

async function callClaude({ apiKey, systemBlocks, messages }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: systemBlocks,
      messages,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'high' }
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic ${res.status}: ${err.slice(0, 400)}`);
  }
  return await res.json();
}

// ────────────────────── RAG retrieval (optional) ──────────────────────

async function retrieveRag({ rec, prompt, instrument, env }) {
  // Build a short embedding query: the participant's primary
  // pattern + their own words + the current prompt. Voyage embeds it,
  // Vectorize returns top-K passages. The operator's "Phase 0" curation
  // populates the index with chunks of Dr Mogire's writings tagged with
  // chamber/covenant/topic metadata.
  const queryParts = [];
  if (instrument === 'first-hour') {
    if (rec.loud) queryParts.push(`primary chamber: ${rec.loud}`);
  } else {
    if (rec.primary_reflex) queryParts.push(`primary reflex: ${rec.primary_reflex}`);
  }
  if (rec.pain_text) queryParts.push(`thirty-day cost: ${rec.pain_text.slice(0, 400)}`);
  if (rec.pain_text_5y) queryParts.push(`five-year cost: ${rec.pain_text_5y.slice(0, 400)}`);
  if (rec.intent) queryParts.push(`first move: ${rec.intent.slice(0, 200)}`);
  if (prompt) queryParts.push(`question: ${prompt.slice(0, 400)}`);
  const queryText = queryParts.join('\n');
  if (!queryText) return '';

  const embRes = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${env.VOYAGE_API_KEY}`
    },
    body: JSON.stringify({
      input: [queryText],
      model: 'voyage-3',
      input_type: 'query'
    })
  });
  if (!embRes.ok) throw new Error('voyage embed failed: ' + embRes.status);
  const embData = await embRes.json();
  const vector = embData && embData.data && embData.data[0] && embData.data[0].embedding;
  if (!vector) throw new Error('voyage returned no vector');

  const result = await env.HOM_VECTORIZE.query(vector, {
    topK: 5,
    returnMetadata: 'all'
  });
  const matches = (result && result.matches) || [];
  if (!matches.length) return '';
  return matches
    .map((m, i) => {
      const md = m.metadata || {};
      const title = md.title || md.source || 'untitled';
      const text = md.text || md.content || '';
      return `[Passage ${i + 1}] ${title}\n${text}`;
    })
    .join('\n\n')
    .slice(0, 8000);
}

// ────────────────────── helpers ──────────────────────

function promptKey(email) { return 'mogire-ai:prompts:' + email; }
function memoryKey(email) { return 'mogire-ai:mem:' + email; }

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Browsers are the only callers; keep CORS open to the same origin
      // (Pages handles same-origin by default). Cache-Control kills any
      // intermediate cache attempts on the synthesis response.
      'Cache-Control': 'no-store'
    }
  });
}

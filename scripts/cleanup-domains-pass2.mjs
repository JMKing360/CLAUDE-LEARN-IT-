#!/usr/bin/env node
// Second-pass domain cleanup: visible text + data-dest attributes + a few
// llms.txt / llms-full.txt references the first pass missed because they
// were bare strings (not full URLs with https://).
//
// Bare-string rules — these match where `hom.mogire.com/<path>` appears
// without the protocol, typically inside <a> link text, data-dest attrs,
// llms.txt entries, etc.

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const REPO = '/home/user/CLAUDE-LEARN-IT-';
const SKIP_DIRS = new Set(['node_modules', '.git', 'data']);
const INCLUDE_EXT = new Set(['.html', '.js', '.mjs', '.json', '.md', '.txt']);

// Rules applied only inside contexts that look like visible text or
// attribute values — NOT in raw JavaScript identifier comparisons or
// comments. The matchers use boundary characters (>, =, ", ',  ) before
// the host string to avoid catching things like:
//   - `h==='hom.mogire.com'`       (JS comparison — DON'T match)
//   - `// hom.mogire.com…`          (comment — DON'T match)
//   - `<code>hom.mogire.com</code>` (intentional, in privacy.html — match
//                                     these cautiously; some are accurate)
//
// Strategy: only update bare `hom.mogire.com/PATH` where PATH would be
// a known assessment path. Leave bare hom.mogire.com (no path) alone.

const RULES = [
  // Specific known paths, with bare prefix
  [/(\W)hom\.mogire\.com\/first-hour-faq/g,  '$1firsthour.houseofmastery.co/first-hour-faq'],
  [/(\W)hom\.mogire\.com\/first-hour/g,      '$1firsthour.houseofmastery.co/first-hour'],
  [/(\W)hom\.mogire\.com\/koora-faq/g,       '$1kooraassess.houseofmastery.co/koora-faq'],
  [/(\W)hom\.mogire\.com\/koora/g,           '$1kooraassess.houseofmastery.co'],
  [/(\W)hom\.mogire\.com\/mastery-hour/g,    '$1kooraassess.houseofmastery.co/mastery-hour'],
  [/(\W)hom\.mogire\.com\/embed\.html/g,     '$1firsthour.houseofmastery.co/embed.html'],
  [/(\W)hom\.mogire\.com\/about/g,           '$1kooraassess.houseofmastery.co/about'],
  [/(\W)hom\.mogire\.com\/privacy\/console/g, '$1kooraassess.houseofmastery.co/privacy/console'],
  [/(\W)hom\.mogire\.com\/privacy/g,         '$1kooraassess.houseofmastery.co/privacy'],
  [/(\W)hom\.mogire\.com\/images\//g,        '$1kooraassess.houseofmastery.co/images/'],
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path, out);
    else {
      const ext = path.slice(path.lastIndexOf('.'));
      if (!INCLUDE_EXT.has(ext)) continue;
      // Don't rewrite the cleanup scripts themselves
      if (relative(REPO, path).startsWith('scripts/cleanup-domains')) continue;
      out.push(path);
    }
  }
  return out;
}

let totalReplacements = 0;
const report = [];

for (const file of walk(REPO)) {
  const content = readFileSync(file, 'utf8');
  if (!content.includes('hom.mogire.com')) continue;
  let out = content;
  let count = 0;
  for (const [pattern, replacement] of RULES) {
    const before = out;
    out = out.replace(pattern, replacement);
    if (out !== before) {
      const matches = before.match(pattern);
      if (matches) count += matches.length;
    }
  }
  if (count > 0 && out !== content) {
    writeFileSync(file, out);
    totalReplacements += count;
    report.push({ file: relative(REPO, file), count });
  }
}

console.log(`Pass 2: rewrote ${totalReplacements} bare-string references across ${report.length} files\n`);
report.sort((a, b) => b.count - a.count);
for (const r of report) console.log(`  ${r.count.toString().padStart(4)}  ${r.file}`);
console.log();

let remaining = 0;
const remainingByFile = {};
for (const file of walk(REPO)) {
  const content = readFileSync(file, 'utf8');
  const matches = content.match(/hom\.mogire\.com/g);
  if (matches) {
    remaining += matches.length;
    remainingByFile[relative(REPO, file)] = matches.length;
  }
}
if (remaining > 0) {
  console.log(`Remaining hom.mogire.com references (these should now be intentional — JS isProd checks, privacy property list, historical docs, etc.):`);
  for (const [f, c] of Object.entries(remainingByFile)) {
    console.log(`  ${c.toString().padStart(4)}  ${f}`);
  }
}

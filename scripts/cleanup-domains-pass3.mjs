#!/usr/bin/env node
// Third-pass: catch every remaining bare `hom.mogire.com` (without specific
// path) in the runtime + ops files, rewriting it to the canonical assessment
// surface `kooraassess.houseofmastery.co`. This is the aggressive sweep.
//
// After this runs, surgical reverts are needed by hand on:
//   - index.html / first-hour/index.html / privacy.html  (JS isProd checks
//     and the privacy property list — keep them mentioning hom.mogire.com
//     as a marketing-side prod surface)
//
// Excluded files entirely (historical record, do not rewrite):
//   - REVIEW-LOG-V2.md
//   - REVIEW-STRATEGY-V2.md
//   - REVIEW-STRATEGY.md

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const REPO = '/home/user/CLAUDE-LEARN-IT-';
const SKIP_DIRS = new Set(['node_modules', '.git', 'data']);
const INCLUDE_EXT = new Set(['.html', '.js', '.mjs', '.json', '.md', '.txt']);
const SKIP_FILES = new Set([
  'REVIEW-LOG-V2.md',
  'REVIEW-STRATEGY-V2.md',
  'REVIEW-STRATEGY.md',
  'REVIEW-LOG.md',
  'ROUND-LOG.md',
]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    if (SKIP_FILES.has(entry)) continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path, out);
    else {
      const ext = path.slice(path.lastIndexOf('.'));
      if (!INCLUDE_EXT.has(ext)) continue;
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
  // Match bare hom.mogire.com that is NOT followed by a specific path
  // we've already handled. Replace with kooraassess.houseofmastery.co.
  const out = content.replace(/hom\.mogire\.com/g, 'kooraassess.houseofmastery.co');
  const count = (content.match(/hom\.mogire\.com/g) || []).length;
  if (count > 0 && out !== content) {
    writeFileSync(file, out);
    totalReplacements += count;
    report.push({ file: relative(REPO, file), count });
  }
}

console.log(`Pass 3: rewrote ${totalReplacements} bare-host references across ${report.length} files\n`);
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
  console.log(`Files still mentioning hom.mogire.com (review-log family, skipped per policy):`);
  for (const [f, c] of Object.entries(remainingByFile)) {
    console.log(`  ${c.toString().padStart(4)}  ${f}`);
  }
} else {
  console.log('Zero remaining hom.mogire.com references in non-historical files.');
}

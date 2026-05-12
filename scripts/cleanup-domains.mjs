#!/usr/bin/env node
// Domain-cleanup script. Operator directive: hom.mogire.com is for GHL +
// email marketing only; assessments are tied to houseofmastery.co.
//
// Mapping (most specific first; first match wins per URL):
//   hom.mogire.com/first-hour-faq    → firsthour.houseofmastery.co/first-hour-faq
//   hom.mogire.com/first-hour…       → firsthour.houseofmastery.co/first-hour…
//   hom.mogire.com/embed.html        → firsthour.houseofmastery.co/embed.html
//   hom.mogire.com/koora-faq         → kooraassess.houseofmastery.co/koora-faq
//   hom.mogire.com/about             → kooraassess.houseofmastery.co/about
//   hom.mogire.com/privacy/console   → kooraassess.houseofmastery.co/privacy/console
//   hom.mogire.com/privacy           → kooraassess.houseofmastery.co/privacy
//   hom.mogire.com/api/…             → (unchanged in code; runtime fetches are
//                                       relative so they hit whatever host serves
//                                       the page. Docs/handovers update separately.)
//   hom.mogire.com/koora             → kooraassess.houseofmastery.co/   (was a 301 anyway)
//   hom.mogire.com/                  → kooraassess.houseofmastery.co/
//   hom.mogire.com                   → kooraassess.houseofmastery.co
//
// Files excluded from rewrite (preserve historical context):
//   - data/dossiers/**         (brand-corpus content)
//   - data/brand-strategy/**   (operator-authored canonical positioning docs)
//   - node_modules/**          (vendor)
//   - .git/**                  (history)
//   - This script itself
//
// Reports per-file change count. Run from repo root.

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const REPO = '/home/user/CLAUDE-LEARN-IT-';
const SKIP_DIRS = new Set(['node_modules', '.git', 'data']);
const SKIP_EXTENSIONS = new Set(['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.zip']);
const SCRIPT_PATH = 'scripts/cleanup-domains.mjs';
const INCLUDE_EXT = new Set(['.html', '.js', '.mjs', '.json', '.md', '.txt', '.toml', '.cjs']);

// Ordered: most specific paths first
const RULES = [
  // First Hour family
  [/https?:\/\/hom\.mogire\.com\/first-hour-faq/g, 'https://firsthour.houseofmastery.co/first-hour-faq'],
  [/https?:\/\/hom\.mogire\.com\/first-hour/g,     'https://firsthour.houseofmastery.co/first-hour'],
  [/https?:\/\/hom\.mogire\.com\/embed\.html/g,    'https://firsthour.houseofmastery.co/embed.html'],
  // KOORA family
  [/https?:\/\/hom\.mogire\.com\/koora-faq/g,      'https://kooraassess.houseofmastery.co/koora-faq'],
  [/https?:\/\/hom\.mogire\.com\/koora/g,          'https://kooraassess.houseofmastery.co/'],
  // Shared supporting pages — canonical at the primary assessment surface
  [/https?:\/\/hom\.mogire\.com\/about/g,          'https://kooraassess.houseofmastery.co/about'],
  [/https?:\/\/hom\.mogire\.com\/privacy\/console/g,'https://kooraassess.houseofmastery.co/privacy/console'],
  [/https?:\/\/hom\.mogire\.com\/privacy/g,        'https://kooraassess.houseofmastery.co/privacy'],
  // Assets served from the assessment surface
  [/https?:\/\/hom\.mogire\.com\/images\//g,       'https://kooraassess.houseofmastery.co/images/'],
  [/https?:\/\/hom\.mogire\.com\/mastery-hour/g,   'https://kooraassess.houseofmastery.co/mastery-hour'],
  [/https?:\/\/hom\.mogire\.com\/sitemap\.xml/g,   'https://kooraassess.houseofmastery.co/sitemap.xml'],
  // Bare root paths
  [/https?:\/\/hom\.mogire\.com\/?#/g,             'https://kooraassess.houseofmastery.co/#'], // hash links
  [/https?:\/\/hom\.mogire\.com\/(?![a-zA-Z])/g,   'https://kooraassess.houseofmastery.co/'], // trailing /
  [/https?:\/\/hom\.mogire\.com(?![a-zA-Z0-9/._-])/g, 'https://kooraassess.houseofmastery.co'], // bare
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path, out);
    else {
      const ext = path.slice(path.lastIndexOf('.'));
      if (SKIP_EXTENSIONS.has(ext)) continue;
      if (!INCLUDE_EXT.has(ext)) continue;
      if (relative(REPO, path) === SCRIPT_PATH) continue;
      out.push(path);
    }
  }
  return out;
}

function rewrite(text) {
  let out = text;
  let total = 0;
  for (const [pattern, replacement] of RULES) {
    const before = out;
    out = out.replace(pattern, replacement);
    if (out !== before) {
      const matches = before.match(pattern);
      if (matches) total += matches.length;
    }
  }
  return { out, count: total };
}

let totalFiles = 0;
let totalReplacements = 0;
const report = [];

for (const file of walk(REPO)) {
  const content = readFileSync(file, 'utf8');
  if (!content.includes('hom.mogire.com')) continue;
  const { out, count } = rewrite(content);
  if (count > 0) {
    writeFileSync(file, out);
    totalFiles++;
    totalReplacements += count;
    report.push({ file: relative(REPO, file), count });
  }
}

console.log(`Rewrote ${totalReplacements} references across ${totalFiles} files\n`);
report.sort((a, b) => b.count - a.count);
for (const r of report) console.log(`  ${r.count.toString().padStart(4)}  ${r.file}`);
console.log();

// Audit: any remaining hom.mogire.com references in expected files?
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
  console.log(`Remaining hom.mogire.com references (verify these are intentional):`);
  for (const [f, c] of Object.entries(remainingByFile)) {
    console.log(`  ${c.toString().padStart(4)}  ${f}`);
  }
} else {
  console.log('Zero remaining hom.mogire.com references in code/docs (PDFs excluded).');
}

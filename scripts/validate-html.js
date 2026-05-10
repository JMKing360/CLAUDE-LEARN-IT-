import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const files = ['index.html', 'first-hour/index.html', 'privacy.html', 'embed.html'];
const voidTags = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
  'meta', 'param', 'source', 'track', 'wbr'
]);

const stripIgnored = (html) => html
  .replace(/<!doctype[^>]*>/gi, '')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');

function validateTagBalance(file, html) {
  const stack = [];
  const cleaned = stripIgnored(html);
  const tagPattern = /<\/?([a-zA-Z][\w:-]*)(?:\s[^<>]*)?>/g;
  let match;

  while ((match = tagPattern.exec(cleaned))) {
    const raw = match[0];
    const tag = match[1].toLowerCase();
    if (voidTags.has(tag) || raw.endsWith('/>')) continue;

    if (raw.startsWith('</')) {
      const last = stack.pop();
      if (last !== tag) {
        throw new Error(`${file}: closing </${tag}> does not match <${last || 'none'}>`);
      }
    } else {
      stack.push(tag);
    }
  }

  if (stack.length) {
    throw new Error(`${file}: unclosed tag(s): ${stack.join(', ')}`);
  }
}

function validateInlineScripts(file, html) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hom-html-js-'));
  const scriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  let count = 0;

  while ((match = scriptPattern.exec(html))) {
    const attrs = match[1] || '';
    const body = match[2] || '';
    const typeMatch = attrs.match(/\btype\s*=\s*(["']?)([^"'\s>]+)\1/i);
    const type = typeMatch ? typeMatch[2].toLowerCase() : 'text/javascript';
    const isJavaScript = ['text/javascript', 'application/javascript', 'module'].includes(type);
    if (/\bsrc\s*=/i.test(attrs) || !body.trim() || !isJavaScript) continue;

    count += 1;
    const tmpFile = path.join(tmpDir, `${path.basename(file)}-${count}.js`);
    fs.writeFileSync(tmpFile, body, 'utf8');
    execFileSync(process.execPath, ['--check', tmpFile], { stdio: 'pipe' });
  }
}

for (const file of files) {
  if (!fs.existsSync(file)) {
    throw new Error(`${file}: expected HTML file is missing`);
  }
  const html = fs.readFileSync(file, 'utf8');
  validateTagBalance(file, html);
  validateInlineScripts(file, html);
  console.log(`${file}: valid`);
}

console.log('HTML validation passed');

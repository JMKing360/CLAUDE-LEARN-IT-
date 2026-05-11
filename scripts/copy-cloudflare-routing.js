import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const distDir = 'dist';
const routingFiles = ['_redirects', '_headers'];

if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

for (const file of routingFiles) {
  if (existsSync(file)) {
    copyFileSync(file, join(distDir, file));
    console.log(`Copied ${file} to ${distDir}/${file}`);
  }
}

import { spawn } from 'node:child_process';

const [, , command, ...args] = process.argv;
if (!command) {
  throw new Error('Usage: node scripts/run-with-preview.js <command> [...args]');
}

const host = '127.0.0.1';
const port = '4173';
const baseUrl = `http://${host}:${port}/`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForPreview() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl, { cache: 'no-store' });
      if (response.ok) return;
    } catch {
      // Preview server is still starting.
    }
    await wait(500);
  }
  throw new Error(`Vite preview did not become ready at ${baseUrl}`);
}

const preview = spawn('npx', ['vite', 'preview', '--host', host, '--port', port], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: process.platform === 'win32'
});

preview.stdout.on('data', (chunk) => process.stdout.write(chunk));
preview.stderr.on('data', (chunk) => process.stderr.write(chunk));

let commandExitCode = 1;
try {
  await waitForPreview();
  commandExitCode = await new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });
    child.on('close', (code) => resolve(code ?? 1));
  });
} finally {
  preview.kill('SIGTERM');
}

process.exit(commandExitCode);

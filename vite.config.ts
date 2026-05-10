import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        koora: resolve(__dirname, 'index.html'),
        firstHour: resolve(__dirname, 'first-hour/index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
      },
    },
  },
});

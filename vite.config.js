import path, { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url)) + '/src';

export default defineConfig(({ command, mode }) => ({
  // Does not pass auto-check
  base: mode === 'production' ? 'https://antmuraha.github.io/goit-advancedjs-hw-01/' : '/',
  define: {
    global: {},
  },
  root: __dirname,
  build: {
    outDir: resolve(__dirname, '../dist'),
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        '1-gallery': resolve(__dirname, '1-gallery.html'),
        '2-form': resolve(__dirname, '2-form.html'),
      },
    },
  },
}));

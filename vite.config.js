import path, { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url)) + '/src';

export default defineConfig(({ command, mode }) => ({
  // Does not pass auto-check
  base: mode === 'production' ? './' : '/',
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
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        entryFileNames: chunkInfo => {
          if (chunkInfo.name === 'commonHelpers') {
            return 'commonHelpers.js';
          }
          return '[name].js';
        },
        assetFileNames: assetInfo => {
          if (assetInfo.name && assetInfo.name.endsWith('.html')) {
            return '[name].[ext]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
}));

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import pluginAliases from './aliases.json';

// https://vite.dev/config/
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: pluginAliases,
    dedupe: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      '@loadable/component',
      'leemons-hooks',
      'chalk',
    ],
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  server: {
    port: 3000,
  },
});

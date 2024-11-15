import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import pluginAliases from './aliases.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: pluginAliases,
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
});

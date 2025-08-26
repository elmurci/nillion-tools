import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills({
      include: ['buffer', 'process', 'util', 'stream', 'events', 'string_decoder', 'inherits'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['buffer', 'process', 'stream-browserify', 'util', 'events']
  }
});

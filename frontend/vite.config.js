import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const sharedDir = path.resolve(__dirname, '../shared/src');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    fs: {
      allow: ['.', sharedDir],
    },
    historyApiFallback: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // These deprecation warnings show up when running the frontend.
        // We can't upgrade to the SASS module system because it's not compatible with Bootswatch,
        // so we just mute the warnings instead.
        silenceDeprecations: ['import', 'color-functions', 'global-builtin'],
      },
    },
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },
});

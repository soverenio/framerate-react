/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        'index': './src/lib/index.ts',
        'core': './src/lib/core/index.ts',
        'overlay': './src/lib/overlay/index.tsx',
      },
    },
    rollupOptions: {
      // FIXME: when making 'react/jsx-runtime' external, we get bug in consuming app.
      // external: ['react', 'react/jsx-runtime', 'react-dom'],
      external: ['react', 'react-dom'],
    },
  },

  plugins: [react(), dts({ rollupTypes: true })],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
  },
})

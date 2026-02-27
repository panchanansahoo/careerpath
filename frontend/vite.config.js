import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Force Vite restart for dependency optimization

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/kontests-api': {
        target: 'https://kontests.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kontests-api/, '/api/v1'),
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  }
});

import { defineConfig } from 'vite';

export default defineConfig({
  base: '/coffee-manager-101/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          chartjs: ['chart.js'],
        },
      },
    },
  },
  server: {
    port: 5173,
  },
});

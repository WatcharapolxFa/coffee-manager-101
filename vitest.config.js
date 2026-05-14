import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      include: ['js/**/*.js'],
      exclude: ['js/views/**', 'js/components/**', 'js/app.js'],
      reporter: ['text', 'json-summary'],
    },
  },
});

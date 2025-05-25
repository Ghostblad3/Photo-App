import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

// eslint-disable-next-line import/no-default-export
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./setup-vitest.ts'],
      watch: false,
    },
  })
);

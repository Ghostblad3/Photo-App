import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
// https://vitejs.dev/config/
const isProduction = process.env.NODE_ENV === 'production';

const profiling = isProduction && {
  'react-dom/client': 'react-dom/profiling',
};

export default defineConfig({
  plugins: [react()],
  esbuild: {
    minifyIdentifiers: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      ...profiling,
    },
  },
});
// vite.config.ts

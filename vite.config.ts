/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    base: env.VITE_BASE_URL,
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './vitest-setup.js',
    },
  };
});

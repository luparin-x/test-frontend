import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'https://thoughtless-carolyne-anveshax-00a36609.koyeb.app',
        changeOrigin: true,
      },
    },
  },
});
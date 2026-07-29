import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from the project directory
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://127.0.0.1:8001';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiBaseUrl.startsWith('http') ? apiBaseUrl : 'http://127.0.0.1:8001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});

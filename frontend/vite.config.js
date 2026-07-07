import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/public',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            // Suppress connection noise caused by React StrictMode double-render in dev
            if (err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED') return;
            console.error('[proxy error]', err.message);
          });
        },
      },
    },
  },
})

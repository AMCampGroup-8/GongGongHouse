import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({

  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://apis.data.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/auth-service': {
        target: 'http://localhost:8761',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth-service/, '/auth-service')
      },
      '/user-service': {
        target: 'http://localhost:8761',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/user-service/, '/user-service')
      }
    }
  }
});

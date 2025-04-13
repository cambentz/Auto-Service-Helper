import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  define: {
    // Use a relative API path instead of absolute URL
    API_ENDPOINT: JSON.stringify("/api")
  },
  server: {
    // Add proxy configuration
    proxy: {
      '/api': {
        target: 'https://gesture-garage-api.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
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
      //API_ENDPOINT: JSON.stringify("http://127.0.0.1:3000/api"),
      API_ENDPOINT: JSON.stringify("https://gesture-garage-api.onrender.com/api")
  }
})

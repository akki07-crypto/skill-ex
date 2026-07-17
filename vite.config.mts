import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [viteReact()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

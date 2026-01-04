import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',       // Accept connections from outside the container
    strictPort: true,
    watch: {
      usePolling: true,     // Force polling so Docker picks up file changes
    }
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/react-swc' // or vue, etc.

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       
    port: 5173,      
    watch: {
      usePolling: true 
    }
  }
})
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    cors: true, 
    origin: 'http://localhost:5173', 
  },
  build: {
    outDir: path.resolve(__dirname, '../backend/public/build'),
    emptyOutDir: true,
    manifest: true, 
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.jsx'), 
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // server: {
  //   // proxy: {
  //   //   '/api': {
  //   //     target: 'https://lytte-backend.onrender.com', // Your backend server
  //   //     changeOrigin: true,
  //   //     // rewrite: (path) => path.replace(/^\/api/, ''),
  //   //   },
  //   // },
  // },
});

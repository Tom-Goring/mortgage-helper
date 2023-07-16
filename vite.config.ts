import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { ViteRsw } from 'vite-plugin-rsw';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  plugins: [react(), ViteRsw()],
});

import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // We need this here to ensure changes to the .env file are picked up while running in dev mode
  optimizeDeps: { include: ['@statelyai/sky'] },
});

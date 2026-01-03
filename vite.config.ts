import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    // IMPORTANT: This base path must match your GitHub repository name for GitHub Pages to work.
    // Based on your screenshot, the repo is 'test-portfolio-website'.
    base: '/test-portfolio-website/',
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});
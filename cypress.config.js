import { defineConfig } from "cypress";
import react from '@vitejs/plugin-react';

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: {
        plugins: [react()]
      },
    }
  }
});

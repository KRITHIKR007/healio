import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        howItWorks: resolve(__dirname, 'how-it-works.html'),
        hydrafacial: resolve(__dirname, 'hydrafacial.html'),
        services: resolve(__dirname, 'services.html')
      }
    }
  }
});

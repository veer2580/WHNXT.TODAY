import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: false,
    host: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        journey: resolve(__dirname, 'journey.html'),
        journeyDir: resolve(__dirname, 'journey/index.html'),
        about: resolve(__dirname, 'about.html'),
        aboutDir: resolve(__dirname, 'about/index.html'),
        contact: resolve(__dirname, 'contact.html'),
        contactDir: resolve(__dirname, 'contact/index.html')
      }
    }
  }
});

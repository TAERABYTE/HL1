import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        v1: resolve(__dirname, 'src/doc/V1.html'),
        elements: resolve(__dirname, 'src/doc/elements.html'),
        components: resolve(__dirname, 'src/doc/components.html'),
        spacing: resolve(__dirname, 'src/doc/spacing.html'),
        layout: resolve(__dirname, 'src/doc/layout.html'),
        form: resolve(__dirname, 'src/doc/form.html'),
      },
    },
  },
});
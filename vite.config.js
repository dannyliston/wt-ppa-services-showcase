import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: '/wt-ppa-services-showcase/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});

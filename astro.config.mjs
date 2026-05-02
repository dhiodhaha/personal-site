import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  session: {
    driver: 'memory',
  },
  adapter: cloudflare({
    imageService: 'compile',
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});

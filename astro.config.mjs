import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, sessionDrivers } from 'astro/config';

export default defineConfig({
  session: {
    driver: sessionDrivers.memory(),
  },
  adapter: cloudflare({
    imageService: 'compile',
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});

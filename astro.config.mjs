import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField, sessionDrivers } from 'astro/config';

export default defineConfig({
  output: 'server',
  site: process.env.PUBLIC_SITE_URL || 'https://dhaf.in',
  env: {
    schema: {
      PREVIEW_SECRET: envField.string({ context: 'server', access: 'secret' }),
      SANITY_API_VERSION: envField.string({
        context: 'server',
        access: 'public',
        default: '2025-02-19',
      }),
      SANITY_READ_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      SANITY_STUDIO_DATASET: envField.string({
        context: 'server',
        access: 'public',
        default: 'production',
      }),
      SANITY_STUDIO_PROJECT_ID: envField.string({ context: 'server', access: 'public' }),
    },
  },
  integrations: [sitemap()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  session: {
    driver: sessionDrivers.memory(),
  },
  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: {
      enabled: true,
    },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});

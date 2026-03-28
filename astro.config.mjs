import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://new-arthur-photo-site.pages.dev',

  output: 'static',

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'da',
        locales: {
          da: 'da-DK',
          en: 'en-GB',
        },
      },
    }),
  ],

  i18n: {
    defaultLocale: 'da',
    locales: ['da', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-heading',
      styles: ['normal', 'italic'],
      weights: [300, 400, 500],
    },
    {
      provider: fontProviders.google(),
      name: 'DM Sans',
      cssVariable: '--font-body',
      styles: ['normal'],
      weights: [400, 500],
    },
    {
      provider: fontProviders.google(),
      name: 'DM Mono',
      cssVariable: '--font-mono',
      styles: ['normal'],
      weights: [400],
    },
  ],

  build: {
    assets: '_astro',
  },

  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    build: {
      assetsInlineLimit: 0,
    },
  },
});

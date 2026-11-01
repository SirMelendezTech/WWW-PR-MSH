// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import rehypeTableWrap from './plugins/rehype-table-wrap.mjs';
import rehypeTerrainProfile from './plugins/rehype-terrain-profile.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://meshtastic.prmsh.com',
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', es: 'es-PR' },
      },
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeTableWrap, rehypeTerrainProfile],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
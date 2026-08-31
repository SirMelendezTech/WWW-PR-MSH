// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import rehypeTableWrap from './plugins/rehype-table-wrap.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://prmsh.com',
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
    rehypePlugins: [rehypeTableWrap],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
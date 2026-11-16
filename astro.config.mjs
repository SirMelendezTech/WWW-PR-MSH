// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import rehypeTableWrap from './plugins/rehype-table-wrap.mjs';
import rehypeTerrainProfile from './plugins/rehype-terrain-profile.mjs';
import rehypeHopStepper from './plugins/rehype-hop-stepper.mjs';

// Spanish became the default (unprefixed) locale and English moved under /en/.
// GitHub Pages can't send real 301s, so Astro writes a static redirect page
// (meta refresh + canonical) at every old URL that would otherwise 404:
//   /es/*          -> the same path without /es  (old Spanish URLs)
//   /blog/<en-id>/ -> /en/blog/<en-id>/          (old English post URLs)
// Old English page URLs like /hardware/ now serve the Spanish page, which
// carries an hreflang link to /en/hardware/, so they need no redirect.
const PAGES = [
  'getting-started', 'hardware', 'settings', 'how-it-works', 'protocols',
  'pr-mesh', 'map', 'blog', 'community', 'links',
];
const blogDir = new URL('./src/content/blog/', import.meta.url);
const blogPosts = readdirSync(blogDir)
  .filter((f) => /\.mdx?$/.test(f))
  .map((f) => ({
    id: f.replace(/\.mdx?$/, ''),
    lang: /^lang:\s*es\s*$/m.test(readFileSync(new URL(f, blogDir), 'utf8')) ? 'es' : 'en',
  }));

/** @type {Record<string, string>} */
const legacyRedirects = { '/es': '/' };
for (const page of PAGES) legacyRedirects[`/es/${page}`] = `/${page}/`;
for (const { id, lang } of blogPosts) {
  if (lang === 'es') legacyRedirects[`/es/blog/${id}`] = `/blog/${id}/`;
  else legacyRedirects[`/blog/${id}`] = `/en/blog/${id}/`;
}

// https://astro.build/config
export default defineConfig({
  site: 'https://meshtastic.prmsh.com',
  redirects: legacyRedirects,
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-PR', en: 'en-US' },
      },
      // Redirect stubs are noindex pages; keep them out of the sitemap.
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '');
        return !(path in legacyRedirects);
      },
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeTableWrap, rehypeTerrainProfile, rehypeHopStepper],
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});

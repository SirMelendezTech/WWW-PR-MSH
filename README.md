# PRMSH — Puerto Rico Meshtastic Community

Community site for the Puerto Rico [Meshtastic](https://meshtastic.org) mesh — documentation, hardware and settings guidance, a blog, and a live node map for the island's network. Lives at [meshtastic.prmsh.com](https://meshtastic.prmsh.com).

Built with [Astro](https://astro.build): content collections for docs/blog, static output, a build-time fetch to [Malla PR](https://malla.prmsh.com/map) for live node positions. Fully bilingual — Spanish (default, at the root) and English (under `/en/`).

## Project structure

```text
/
├── public/                     static assets, favicon, robots.txt, llms.txt, _redirects
├── plugins/                    rehype plugins (table wrap, terrain profile, hop stepper)
├── scripts/                    terrain + OG image generators
├── src/
│   ├── components/
│   │   ├── pages/               per-page body components shared by the ES + EN routes
│   │   └── ...                  Header, Footer, SearchDialog, TerrainSignature, etc.
│   ├── layouts/                 BaseLayout, DocsLayout, BlogLayout
│   ├── content/
│   │   ├── docs/                English docs (Markdown)
│   │   │   └── es/              Spanish translations, collection id "es/<slug>"
│   │   └── blog/                blog posts, EN + ES (lang + translationKey frontmatter)
│   ├── lib/
│   │   ├── nodes.ts             node map data layer (fetches Malla PR at build time)
│   │   ├── i18n.ts              locale helpers (path localization, doc entry ids)
│   │   ├── ui-strings.ts        central EN/ES string dictionary for all UI copy
│   │   └── blog.ts              blog filtering, post URLs, translation pairing
│   ├── pages/
│   │   ├── en/                  English routes (mirror the top-level ES routes)
│   │   └── ...                  one route per file; blog/[...slug].astro renders posts
│   └── styles/                  tokens.css (design tokens) + global.css
└── astro.config.mjs
```

## Commands

| Command           | Action                              |
| :---------------- | :---------------------------------- |
| `npm install`     | Install dependencies                |
| `npm run dev`     | Local dev server at `localhost:4321` |
| `npm run build`   | Build production site to `./dist/`  |
| `npm run preview` | Preview the build locally           |

## Internationalization

Spanish is the default locale, served unprefixed (`/hardware/`); English is served under `/en/` (`/en/hardware/`). `astro.config.mjs` sets `i18n.routing.prefixDefaultLocale: false`.

- **UI copy** lives in `src/lib/ui-strings.ts` (`useStrings(locale)`). The English object is the source of truth; the Spanish object must match its shape. Strings used inside client `<script>` blocks are passed through `data-*` attributes.
- **Page bodies** are shared components in `src/components/pages/` that take a `lang` prop. `src/pages/x.astro` and `src/pages/en/x.astro` are thin wrappers around the same body.
- **Docs**: English at `src/content/docs/<slug>.md`, Spanish at `src/content/docs/es/<slug>.md`. A missing translation falls back to English with a "translation pending" banner. Cross-links between Spanish docs use the Spanish heading slug.
- **Blog**: posts carry `lang` and, for translated pairs, a shared `translationKey`. `getBlogPosts(lang)` filters by locale; the header language switch jumps between paired posts.
- **Legacy URLs** from before the Spanish-default switch (`/es/*`, old English blog posts) get static redirect stubs generated from `redirects` in `astro.config.mjs`, since GitHub Pages can't send real 301s.
- **hreflang** alternates are emitted by `BaseLayout`; `@astrojs/sitemap` is configured with the same locale map.
- **`/en/404`**: GitHub Pages serves the root (Spanish) `404.html` for every miss. `public/_redirects` routes `/en/*` misses to the English 404 on Netlify / Cloudflare Pages only.
- **Search** (`search-index.json`) carries both locales with a `lang` field; `SearchDialog` shows only the current page's language.

## Contributing

No company runs this — it's built by whoever shows up. See [CONTRIBUTING.md](./CONTRIBUTING.md) for ways to help, content frontmatter, and the PR checklist. Coding agents start at [AGENTS.md](./AGENTS.md).

## License

Dual-licensed, © PRMSH Community and contributors:

- **Code** — the `.astro` / `.ts` / `.css` files and site machinery — under the [MIT License](./LICENSE).
- **Content** — everything under `src/content/` (docs and blog posts, all languages) — under [CC BY-SA 4.0](./LICENSE-CONTENT): reuse and adapt freely with attribution, share derivatives under the same license.

Not affiliated with Meshtastic LLC. External data (Malla PR) and the Meshtastic name and logo keep their own terms.

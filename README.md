# Meshtastic Puerto Rico

Community site for the Puerto Rico [Meshtastic](https://meshtastic.org) mesh — documentation, hardware and settings guidance, a blog, and a live node map for the island's network. Lives at [prmsh.com](https://prmsh.com).

Built with [Astro](https://astro.build): content collections for docs/blog, static output, a build-time fetch to [Malla PR](https://malla-pr.sirhome.org/map) for live node positions. Fully bilingual — English and Spanish.

## Project structure

```text
/
├── public/                     static assets, favicon, robots.txt, llms.txt, _redirects
├── src/
│   ├── components/
│   │   ├── pages/               per-page body components shared by the EN + ES routes
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
│   │   ├── es/                  Spanish routes (mirror the top-level EN routes)
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

English is served unprefixed (`/hardware/`); Spanish is served under `/es/` (`/es/hardware/`). `astro.config.mjs` sets `i18n.routing.prefixDefaultLocale: false`.

- **UI copy** lives in `src/lib/ui-strings.ts` (`useStrings(locale)`). The English object is the source of truth; the Spanish object must match its shape. Strings used inside client `<script>` blocks are passed through `data-*` attributes.
- **Page bodies** are shared components in `src/components/pages/` that take a `lang` prop. `src/pages/x.astro` and `src/pages/es/x.astro` are thin wrappers around the same body.
- **Docs**: English at `src/content/docs/<slug>.md`, Spanish at `src/content/docs/es/<slug>.md`. A missing translation falls back to English with a "translation pending" banner. Cross-links between Spanish docs use the Spanish heading slug.
- **Blog**: posts carry `lang` and, for translated pairs, a shared `translationKey`. `getBlogPosts(lang)` filters by locale; the header language switch jumps between paired posts.
- **hreflang** alternates are emitted by `BaseLayout`; `@astrojs/sitemap` is configured with the same locale map.
- **`/es/404`** relies on `public/_redirects` (Netlify / Cloudflare Pages). On Vercel, add the equivalent rule to `vercel.json`.
- **Search** (`search-index.json`) carries both locales with a `lang` field; `SearchDialog` shows only the current page's language.

## Contributing

No company runs this — it's built by whoever shows up. Ways to help, roughly easiest to hardest:

- **Report a coverage gap or a stale fact.** Something on [Puerto Rico Mesh](https://prmsh.com/pr-mesh/) or [Recommended Hardware](https://prmsh.com/hardware/) wrong or out of date? Open an issue, or edit the relevant file in `src/content/docs/` and send a PR — it's plain Markdown.
- **Write a field report.** Range tests, a solar node build, an antenna comparison — add a Markdown file to `src/content/blog/` following the frontmatter shape of an existing post (`title`, `description`, `pubDate`, `author`, `category`, `tags`, `readingTime`, and `lang` for Spanish). See [Community → Field Testing](https://prmsh.com/community/#field-testing) for what makes a report useful.
- **Translate a page.** Add the Spanish doc under `src/content/docs/es/` with `lang: es`, or a Spanish blog post sharing the English post's `translationKey`. UI strings go in `src/lib/ui-strings.ts`.
- **Fix or extend a docs page.** Everything under [Documentation](https://prmsh.com/getting-started/) lives in `src/content/docs/*.md` — content is separate from layout, so you don't need to touch an `.astro` file to edit copy.
- **Improve the node map.** Live data comes from [Malla PR](https://malla-pr.sirhome.org/map) via `src/lib/nodes.ts`, fetched at build time (that API has no CORS headers, so it can't run in the browser). Fixes to the mapping logic or fallback behavior are welcome.
- **Ship a UI/design change.** Components live in `src/components/`, shared design tokens in `src/styles/tokens.css`. Keep dark and light mode both working, check mobile, and keep both languages rendering before opening a PR.

Before sending a PR: run `npm run build` locally and make sure it completes clean. Keep pull requests scoped — one fix or one feature, not a grab bag.

Not a coder? You can still help: run a node, document your setup, or point out something confusing by opening an issue. See [Community](https://prmsh.com/community/) for other ways in.

## License

Dual-licensed, © Meshtastic Puerto Rico Community and contributors:

- **Code** — the `.astro` / `.ts` / `.css` files and site machinery — under the [MIT License](./LICENSE).
- **Content** — everything under `src/content/` (docs and blog posts, all languages) — under [CC BY-SA 4.0](./LICENSE-CONTENT): reuse and adapt freely with attribution, share derivatives under the same license.

Not affiliated with Meshtastic LLC. External data (Malla PR) and the Meshtastic name and logo keep their own terms.

# Contributing to PRMSH

No company runs this site. It's built by whoever shows up. Issues and PRs are welcome in Spanish or English.

¿Prefieres español? Abre un issue o PR en español; te contestamos igual.

## Ways to help

Roughly easiest to hardest:

- **Report a coverage gap or a stale fact.** Something on [Puerto Rico Mesh](https://meshtastic.prmsh.com/pr-mesh/) or [Recommended Hardware](https://meshtastic.prmsh.com/hardware/) wrong or out of date? Open an issue, or edit the Markdown under `src/content/docs/` and send a PR.
- **Write a field report.** Range tests, a solar node build, an antenna comparison. Add a post to `src/content/blog/` (see [Blog posts](#blog-posts)). [Community → Field Testing](https://meshtastic.prmsh.com/community/#field-testing) covers what makes a report useful.
- **Translate a page.** Add the missing Spanish or English version of a doc or post (see [Translations](#translations)).
- **Fix or extend a docs page.** Content is separate from layout: editing copy in `src/content/docs/*.md` needs no `.astro` changes.
- **Improve the node map.** Live data comes from [Malla PR](https://malla.prmsh.com/map) via `src/lib/nodes.ts`, fetched at build time (the API has no CORS headers, so it can't run in the browser).
- **Ship a UI or design change.** Components live in `src/components/`, design tokens in `src/styles/tokens.css`.

Not a coder? Run a node, document your setup, or open an issue about something confusing. See [Community](https://meshtastic.prmsh.com/community/) for other ways in.

## Local setup

Requires Node 22.12 or newer.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # must finish clean before you open a PR
```

## Content

### Docs

Docs live in `src/content/docs/`: English at `<slug>.md`, Spanish at `es/<slug>.md`.

```yaml
---
title: Hardware Recomendado
description: One sentence for search results and link previews.
order: 2            # position in the docs sidebar
section: Documentación
lang: es            # omit for English
---
```

A missing translation falls back to English with a "translation pending" banner, so a page in one language is still a useful PR.

### Blog posts

Posts live in `src/content/blog/`. Name new files with a language suffix: `my-post-en.md`, `mi-post-es.md`.

```yaml
---
title: "Llaves duplicadas en la malla de Puerto Rico"
description: One or two sentences.
pubDate: 2026-08-11
author: YOURCALL          # callsign or handle
category: Field Reports   # News | Tutorials | Hardware | Field Reports | Node Builds | Community | Puerto Rico Mesh Updates
tags: [seguridad, monitor]
readingTime: 12 min
lang: es                  # omit for English
translationKey: duplicate-keys   # shared by the EN and ES versions of one post
---
```

### Translations

Spanish is the site's default language (served at `/`); English is under `/en/`.

- A translated doc goes at the mirrored path (`hardware.md` ↔ `es/hardware.md`).
- A translated post is a new file carrying the same `translationKey` as the original. The header language switch uses it to jump between the pair.
- UI text (buttons, labels, navigation) lives in `src/lib/ui-strings.ts`. Add every new key to both the `en` and `es` objects.
- Links between Spanish docs use the Spanish heading's slug, accents included (`#región-y-frecuencia`).

## Style

- The project's name is **PRMSH**. Use "Meshtastic" only to describe the technology, as in "PRMSH — Puerto Rico Meshtastic Community". The Meshtastic trademark rules don't allow "Meshtastic Puerto Rico" as a name.
- Keep the main point of a page visible. Use `<details>` dropdowns only for optional material such as long reference tables.
- Recommended Settings shows app menu paths for Android and iPhone, not CLI commands.
- UI changes must work in light and dark mode, on mobile, and in both languages.

## Pull requests

1. Branch from `main`. Merging to `main` deploys the live site, so changes land through PRs.
2. Keep each PR to one fix or one feature.
3. Write commit messages in [Conventional Commits](https://www.conventionalcommits.org/) form with a scope, such as `docs(hardware): add the T-Deck Pro` or `feat(map): …`.
4. Run `npm run build` and confirm it completes clean.
5. Fill in the PR template checklist.

## License

By contributing you agree that code (`.astro`, `.ts`, `.css`, scripts, plugins) is released under the [MIT License](./LICENSE), and content under `src/content/` under [CC BY-SA 4.0](./LICENSE-CONTENT).

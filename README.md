# Pablo Caballero — Portfolio

My portfolio and CV: a Next.js site, statically generated and deployed on Vercel. Every push to
`main` deploys to production; every other branch gets a preview deployment.

- **Home page** (`/`): about, experience, projects, education, skills, an interactive globe of the
  countries I've lived and worked in, photos, references and contact.
- **Project documentation** (`/projects/<slug>`): one page per project, with how it works, figures
  and results. Two are live web apps (sinophile, ESP32 Piano), with links to the deployed sites;
  two are data-analysis coursework that runs locally (molecular activity prediction, Milan CDR).

## Development

Requires Node.js 24 or later.

```bash
npm install
npm run dev          # http://localhost:3000, with hot reload
npm run build        # production build (every page prerendered)
npm start            # serve the production build
```

| Command             | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `npm run check`     | everything CI runs except the build: types, lint, formatting, tests |
| `npm run typecheck` | generates the route types (`next typegen`) and runs `tsc`           |
| `npm run lint`      | ESLint (Next.js, React hooks, accessibility, TypeScript rules)      |
| `npm run format`    | Prettier (`format:check` only checks)                               |
| `npm test`          | unit, content and component tests (Vitest + Testing Library, jsdom) |
| `npm run test:e2e`  | end-to-end tests (Playwright) against the production build          |

The end-to-end tests serve the last build with `next start`, so run `npm run build` first. They
use Playwright's Chromium (`npx playwright install chromium`); set `PW_CHANNEL=chrome` to use an
installed Chrome, or `PW_EXECUTABLE_PATH` to point at any Chromium binary.

## How it's built

```
src/
  app/                  routes (App Router)
    layout.tsx          fonts, metadata, theme script, header and footer
    page.tsx            the home page: its sections in order
    projects/[slug]/    a documentation page per project (generateStaticParams)
    globals.css         Tailwind CSS v4, the colour tokens (light/dark) and the few custom rules
    sitemap.ts robots.ts not-found.tsx icon.svg
  content/              ALL the copy, as typed data (no text lives in components)
    profile.ts          name, contact, headline figures, navigation
    experience.ts education.ts world.ts references.ts
    projects/           one file per project + the shared types and lookups
  components/
    layout/             header (scroll-spy nav, mobile menu, theme toggle) and footer
    home/               one component per home section, plus its interactive parts
    projects/           project card, cover visual, documentation blocks, table of contents, pager
    ui/                 icons, rich text, headings, tags, accessible tabs
  hooks/                useScrollSpy
  lib/                  pure logic: rich-text parser, theme, globe maths and renderer, helpers
tests/                  Vitest: lib/, content/ (data integrity) and components/
e2e/                    Playwright: the home page, the theme and every project page
public/                 photos, project images, the world map (TopoJSON) and the CV
```

A few decisions worth knowing:

- **Server components by default.** Every section renders on the server at build time; only the
  parts that react to the visitor are client components (theme toggle, menus, filters, tabs, the
  globe, the photo viewer, the copy button). The experience filter, for instance, only sets
  `data-filter` on a server-rendered list and CSS dims the rest.
- **Content is data.** Copy lives in `src/content` as typed objects, with a tiny inline markup
  (`**bold**`, `*em*`, `` `code` ``, `[label](url)`) parsed by `src/lib/rich-text.ts`. Tests check
  it: every image exists with its declared size, every country is on the world map, links are
  HTTPS, and only deployed projects link to a live site.
- **Theme without a flash.** Colours are CSS variables switched by the system preference or by
  `<html data-theme>`. An inline script in `<head>` applies a stored choice before the first paint
  (not `next/script`, which defers inline code to Next's runtime); the theme icons swap with CSS.
- **The globe** uses d3-geo and topojson, loaded only when its section mounts. It draws outside
  React (`src/lib/globe/globe-renderer.ts`) because it repaints ~180 paths every frame; its
  rotation maths is pure and unit-tested (`src/lib/globe/math.ts`). It pauses off-screen and
  respects `prefers-reduced-motion`.
- **Images** go through `next/image` (AVIF/WebP at the right width), with explicit sizes.

### Adding a project

1. Put its images in `public/img/projects/` (a 1200×750 WebP cover, and any figures).
2. Create `src/content/projects/<name>.ts` exporting a `Project` (see `types.ts`): set
   `deployment` to `{ kind: "live", url }` or `{ kind: "local", note }`, and write its
   documentation as `sections` of blocks (paragraphs, lists, steps, figures, code, tables,
   callouts).
3. Add it to the list in `src/content/projects/index.ts`, and a hue for it in `ProjectHue` and in
   `globals.css` (`--hue-<name>`, light and dark).

`npm test` then checks the new content, and the page appears at `/projects/<slug>`.

## Deployment

Vercel builds the site on every push (`vercel.json` pins the Next.js framework). Absolute URLs in
the metadata and sitemap use `SITE_URL` when set, otherwise Vercel's production domain. CI
(`.github/workflows/ci.yml`) runs the checks, the build and the end-to-end tests on every push and
pull request.

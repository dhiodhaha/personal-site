# Dhafin Personal Site

Personal operating base for Dhafin at `dhaf.in`.

## Stack

- Bun
- Astro
- TypeScript
- Tailwind CSS v4
- Cloudflare Pages
- Sanity CMS

## Commands

```sh
bun install
bun run dev
bun run build
bun run preview
bun run studio
bun run studio:deploy
```

## Environment

Copy `.env.example` to `.env` for local development.

`PUBLIC_SITE_URL` defaults to `https://dhaf.in` and is used for canonical URLs and metadata.

`ASTRO_TELEMETRY_DISABLED=1` keeps local and CI commands from writing telemetry preferences outside the project workspace.

`SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` wire the local and hosted Studio to the Sanity project. `SANITY_READ_TOKEN` is used only by authenticated draft preview routes; published build-time reads should use public dataset access where possible.

Full Sanity, Cloudflare, and Porkbun setup lives in [docs/SETUP.md](docs/SETUP.md).

## Sanity Studio

The Studio is configured in `sanity.config.ts` for the initial v1 document types:

- Work
- Post
- Category
- Profile

Run local Studio:

```sh
bun run studio
```

Open:

```txt
http://localhost:3333
```

Deploy hosted Studio:

```sh
bun run studio:deploy
```

Use `dhafin` as the Studio hostname so the hosted Studio is available at:

```txt
https://dhafin.sanity.studio
```

## Deployment

This project targets Cloudflare Pages.

Astro 5 uses static output by default; dynamic preview/API routes can be added later with the Cloudflare adapter without the removed `output: "hybrid"` flag.

Astro sessions are set to the in-memory driver for the scaffold so Cloudflare does not require a KV binding before the app actually uses session storage. Draft preview auth uses short-lived signed cookies.

Build command:

```sh
bun run build
```

Build output directory:

```sh
dist
```

## Redirects

Cloudflare Pages reads `public/_redirects` into the build output. Attach these custom domains to the same Pages project:

- `dhaf.in`
- `www.dhaf.in`
- `portfolio.dhaf.in`
- `midjourney.dhaf.in`
- `video.dhaf.in`

Redirect behavior:

- `www.dhaf.in/*` -> `https://dhaf.in/:splat`
- `portfolio.dhaf.in/*` -> `https://dhaf.in/work`
- `midjourney.dhaf.in/*` -> `https://dhaf.in/about`
- `video.dhaf.in/*` -> `https://dhaf.in/about`

`src/middleware.ts` mirrors the same host rules because this project also ships Pages Functions for preview/API routes, and Cloudflare Pages `_redirects` rules do not apply to requests served by Functions.

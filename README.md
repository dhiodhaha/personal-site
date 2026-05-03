# Dhafin Personal Site

Personal operating base for Dhafin at `dhaf.in`.

## Stack

- Bun
- Astro
- TypeScript
- Tailwind CSS v4
- Cloudflare Workers
- Sanity CMS

## Commands

```sh
bun install
bun run dev
bun run build
bun run preview
bun run cf:dev
bun run cf:deploy
bun run studio
bun run studio:deploy
```

## Runtime

Use Node `20.19` or newer for Astro and Sanity CLI commands.

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

This project targets Cloudflare Workers through Astro 6 and `@astrojs/cloudflare` v13.

Astro sessions are set to the in-memory driver for the scaffold so Cloudflare does not require a KV binding before the app actually uses session storage. Draft preview auth uses short-lived signed cookies.

Build command:

```sh
bun run build
```

Build output directory:

```sh
dist
```

Workers build settings:

- `Build command`: `bun run build`
- `Deploy command`: `npx wrangler deploy --config dist/server/wrangler.json`
- `Version command`: `npx wrangler versions upload --config dist/server/wrangler.json`

For local manual deployment after `bun run build`, use:

```sh
bun run cf:deploy
```

## Redirects

Attach these custom domains to the same Worker:

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

`src/middleware.ts` handles canonical and legacy host redirects at runtime.

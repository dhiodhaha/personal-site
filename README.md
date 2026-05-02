# Dhafin Personal Site

Personal operating base for Dhafin at `dhaf.in`.

## Stack

- Bun
- Astro
- TypeScript
- Tailwind CSS v4
- Cloudflare Pages
- Sanity, added in a later slice

## Commands

```sh
bun install
bun run dev
bun run build
bun run preview
```

## Environment

Copy `.env.example` to `.env` for local development.

`PUBLIC_SITE_URL` defaults to `https://dhaf.in` and is used for canonical URLs and metadata.

`ASTRO_TELEMETRY_DISABLED=1` keeps local and CI commands from writing telemetry preferences outside the project workspace.

Preview and Sanity tokens are listed now so Cloudflare environment variables have a stable place to land in later slices, but they are not used by the scaffold yet.

## Deployment

This project targets Cloudflare Pages.

Astro 5 uses static output by default; dynamic preview/API routes can be added later with the Cloudflare adapter without the removed `output: "hybrid"` flag.

Astro sessions are set to the in-memory driver for the scaffold so Cloudflare does not require a KV binding before the app actually uses session storage. Preview auth will use signed cookies in a later slice.

Build command:

```sh
bun run build
```

Build output directory:

```sh
dist
```

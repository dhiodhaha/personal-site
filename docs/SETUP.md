# Sanity and Cloudflare Setup

This checklist is for launching `dhaf.in` with Sanity-hosted Studio and Cloudflare Pages.

## Target Architecture

```txt
Registrar: Porkbun
DNS: Cloudflare
Public site: Cloudflare Pages
CMS data/API: Sanity Content Lake
CMS admin: Sanity-hosted Studio
```

Public URLs:

```txt
https://dhaf.in
https://dhafin.sanity.studio
```

## Readiness Check

Required repo files:

- `.env.example` exists and is safe to commit.
- `.gitignore` ignores `.env` and `.env.*`, but allows `.env.example`.
- `sanity.config.ts` loads the Sanity schema and serves Studio at the root path.
- `sanity.cli.ts` reads project and dataset from environment variables.
- `astro.config.mjs` uses the Cloudflare adapter.
- `wrangler.toml` points Cloudflare Pages output to `dist`.
- `public/_redirects` contains legacy domain redirects.
- `src/middleware.ts` mirrors redirect behavior for Pages Functions requests.

Human/dashboard setup still required:

- Create or confirm the Sanity project and dataset.
- Create a Sanity Viewer token for draft preview.
- Deploy Sanity Studio to Sanity hosting.
- Create the Cloudflare Pages project.
- Move Porkbun nameservers from Vercel to Cloudflare.
- Add Cloudflare Pages custom domains.
- Create the Cloudflare deploy hook and Sanity webhook.

## Local Environment

Create local env:

```sh
cp .env.example .env
```

Fill `.env`:

```txt
PUBLIC_SITE_URL=https://dhaf.in
ASTRO_TELEMETRY_DISABLED=1
BUN_VERSION=1.3.5

PREVIEW_SECRET=generated_secret
SANITY_READ_TOKEN=viewer_token_from_sanity

SANITY_STUDIO_PROJECT_ID=project_id_from_sanity_manage
SANITY_STUDIO_DATASET=production
SANITY_API_VERSION=2025-02-19
```

Generate `PREVIEW_SECRET`:

```sh
openssl rand -base64 48
```

Never commit `.env`.

## Sanity Setup

1. Go to `https://www.sanity.io/manage`.
2. Create or open the project for this site.
3. Confirm dataset `production` exists.
4. Copy the project ID into local `.env` as `SANITY_STUDIO_PROJECT_ID`.
5. Log in locally:

```sh
bunx sanity login
```

6. Run Studio locally:

```sh
bun run studio
```

Open:

```txt
http://localhost:3333
```

7. Deploy Studio to Sanity hosting:

```sh
bun run studio:deploy
```

Use this Studio hostname:

```txt
dhafin
```

Hosted Studio URL:

```txt
https://dhafin.sanity.studio
```

8. In Sanity Manage, configure CORS:

```txt
http://localhost:3333
http://localhost:4321
https://dhafin.sanity.studio
https://dhaf.in
https://*.pages.dev
```

Allow credentials for Studio origins.

9. Create a draft preview token:

```txt
API -> Tokens -> Add API token
Name: dhafin-personal-site-preview
Role: Viewer
```

Copy it into local `.env` and later into Cloudflare Pages as `SANITY_READ_TOKEN`.

## Cloudflare Pages Setup

Create the project:

```txt
Workers & Pages -> Create application -> Pages -> Connect to Git
```

Use:

```txt
Repository: dhiodhaha/personal-site
Production branch: main
Build command: bun run build
Build output directory: dist
```

Add production environment variables:

```txt
PUBLIC_SITE_URL=https://dhaf.in
ASTRO_TELEMETRY_DISABLED=1
BUN_VERSION=1.3.5

PREVIEW_SECRET=generated_secret
SANITY_READ_TOKEN=viewer_token_from_sanity

SANITY_STUDIO_PROJECT_ID=project_id_from_sanity_manage
SANITY_STUDIO_DATASET=production
SANITY_API_VERSION=2025-02-19
```

Deploy once and verify the `*.pages.dev` URL works before changing DNS.

## Porkbun To Cloudflare DNS

In Cloudflare:

```txt
Websites -> Add a domain -> dhaf.in
```

Cloudflare gives two nameservers. In Porkbun:

```txt
Domain Management -> dhaf.in -> Nameservers
```

Replace old Vercel nameservers:

```txt
ns1.vercel-dns.com
ns2.vercel-dns.com
```

With Cloudflare nameservers:

```txt
xxxx.ns.cloudflare.com
yyyy.ns.cloudflare.com
```

Verify:

```sh
dig NS dhaf.in +short
```

Expected: Cloudflare nameservers.

## Custom Domains

In Cloudflare Pages:

```txt
Custom domains -> Set up a domain
```

Add:

```txt
dhaf.in
www.dhaf.in
portfolio.dhaf.in
midjourney.dhaf.in
video.dhaf.in
```

Expected behavior:

```txt
dhaf.in -> public site
www.dhaf.in -> dhaf.in
portfolio.dhaf.in -> dhaf.in/work
midjourney.dhaf.in -> dhaf.in/about
video.dhaf.in -> dhaf.in/about
```

Verify:

```sh
curl -I https://dhaf.in
curl -I https://www.dhaf.in
curl -I https://portfolio.dhaf.in
curl -I https://midjourney.dhaf.in
curl -I https://video.dhaf.in
```

## Publish Rebuild Hook

In Cloudflare Pages:

```txt
Settings -> Builds -> Deploy hooks -> Add deploy hook
Name: sanity-production-publish
Branch: main
```

Copy the deploy hook URL and keep it private.

In Sanity Manage:

```txt
Project -> Webhooks -> Create webhook
```

Use:

```txt
Name: Cloudflare Pages production rebuild
URL: Cloudflare deploy hook URL
Method: POST
Dataset: production
Filter: _type in ["work", "post", "category", "profile"]
```

Do not enable draft or version triggers.

Final test:

```txt
Publish content in Sanity -> Cloudflare Pages deployment starts -> dhaf.in updates after successful build
```

## Secrets

Never commit:

- `.env`
- `PREVIEW_SECRET`
- `SANITY_READ_TOKEN`
- Cloudflare deploy hook URL

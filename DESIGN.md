# Dhafin Editorial Design System

Astro + Tailwind v4 design system for the Dhafin personal site.

## Direction

Minimal editorial portfolio with product-building proof first. The site should feel like a sharp creative product-builder profile: structured, readable, image-aware, and direct.

## Tokens

| Name | Value | Token | Role |
| --- | --- | --- | --- |
| Black Ink | `#2b2b2b` | `--color-black-ink` | Text, borders, headings |
| Pure White | `#ffffff` | `--color-pure-white` | Page background, panels |
| Frost Gray | `#f0efef` | `--color-frost-gray` | Subtle tags, quiet media tone |
| Medium Gray | `#676767` | `--color-medium-gray` | Secondary copy |
| Muted Taupe | `#faead9` | `--color-muted-taupe` | Warm section bands |
| Electric Purple | `#8147ff` | `--color-electric-purple` | Primary CTA and focus accent |
| Sunshine Yellow | `#ffd519` | `--color-sunshine-yellow` | Highlight media and selection |
| Deep Indigo | `#6219ff` | `--color-deep-indigo` | Links |

## Typography

| Role | Token | Size | Line height | Tracking |
| --- | --- | --- | --- | --- |
| Caption | `--text-caption` | `0.75rem` | `1.4` | `0.04em` |
| Body | `--text-body` | `1rem` | `1.55` | `0.005em` |
| Meta | `--text-meta` | `0.8125rem` | `1.45` | `0.08em` |
| Heading | `--text-heading` | `clamp(1.5625rem, 2.2vw, 2rem)` | `1.22` | `0.035em` |
| Display | `--text-display` | `clamp(2.35rem, 7vw, 5.75rem)` | `0.98` | `0.018em` |

Fallbacks:

- Bradford -> Georgia
- LabilVariable -> Open Sans / system sans
- Labil -> Open Sans / system sans

## Components

- `Button`: ghost, category, pill, highlight variants.
- `Tag`: filled or outline metadata chip.
- `ArticleCard`: transparent listing card with bordered editorial media block.
- `BaseLayout`: header, footer, page shell, canonical metadata.
- `editorial-hero`: two-column desktop hero, single-column mobile.
- `editorial-panel`: bordered support panel for proof/context.
- `rule-list`: divider-led two-column editorial rows.
- `token-swatch`: design QA swatch for `/style-preview`.

## Routes

- `/`
- `/work`
- `/writing`
- `/about`
- `/style-preview`

## Rules

- Product proof before chronology.
- One filled primary CTA per page.
- No shadows for elevation.
- No rounded cards; only pill CTA uses `75px` radius.
- Use Tailwind v4 `@theme` and `@utility` in `src/styles/global.css`.
- Keep Sanity schemas, query layer, and preview auth outside this design-system slice.

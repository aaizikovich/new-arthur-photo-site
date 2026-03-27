# Arthur Aizikovich — Photography Portfolio
# Claude Code Instructions

## Project
Portfolio + booking site for Arthur Aizikovich (AA Media), Copenhagen photographer.
Primary services: weddings, conferences, events, portraits, nightlife.
Domain: arthuraizikovich.com

**Status: Foundation is fully built and live at `new-arthur-photo-site.pages.dev`.
All sessions are feature/fix work — do NOT re-scaffold anything.**

---

## Tech stack

- **Framework:** Astro 6 (`output: 'static'` — no SSR adapter)
- **Hosting:** Cloudflare Pages (static files) — NOT Vercel, NOT CF Workers adapter
- **Image pipeline:** Standard `<img>` / `<Picture />` — no Cloudinary, no CF image binding
- **CMS:** Decap CMS (git-based, markdown files, no database)
- **CSS:** Custom properties only — no Tailwind
- **TypeScript:** preferred throughout
- **JS:** minimal — `client:visible` islands only where genuinely needed
- **Fonts:** Astro 6 built-in Fonts API — self-hosted at build time, NOT Google Fonts CDN
- **Video:** Vimeo embeds only, always with `dnt` parameter
- **Path alias:** `@/` maps to `src/` — use in all internal imports

---

## Commands
```bash
npm run dev      # local dev server (localhost:4321)
npm run build    # production build
npm run preview  # preview production build
```

---

## Folder structure

```
src/
  pages/
    da/                     # Danish — prefixDefaultLocale: true, so URLs are /da/*, /da/portfolio, etc.
      index.astro           # /da/
      om.astro              # /da/om
      kontakt.astro         # /da/kontakt
      priser.astro          # /da/priser
      portfolio/
        index.astro         # /da/portfolio
        [slug].astro        # /da/portfolio/[slug]
      blog/
        index.astro         # /da/blog
        [slug].astro        # /da/blog/[slug]
    en/                     # English — /en/* prefix
      index.astro           # /en/
      about.astro           # /en/about
      contact.astro         # /en/contact
      pricing.astro         # /en/pricing
      portfolio/
        index.astro         # /en/portfolio
        [slug].astro
      blog/
        index.astro         # /en/blog
        [slug].astro
  components/
    seo/
      SEO.astro
      LocalBusinessSchema.astro
      FAQSchema.astro
    gallery/
      Gallery.astro
      Lightbox.astro        # lazy-initialised via IntersectionObserver
    ui/
      Nav.astro             # includes dark mode toggle + hamburger mobile menu
      Footer.astro
      ContactForm.astro
  content/
    projects/               # one .md per project
    blog/                   # one .md per blog post
  content.config.ts         # Astro 6 content collection config (at src/ root)
  layouts/
    Base.astro              # dark mode anti-flash script is inline in <head>
    Project.astro
  styles/
    tokens.css
    transitions.css
    global.css
  utils/
    image.ts
    schema.ts
public/
  og/
  brand_assets/
  llms.txt
astro.config.mjs
_headers
_redirects              # canonical redirects file for Cloudflare Pages static output
wrangler.toml
```

---

## astro.config.mjs (current — keep in sync)

```js
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://arthuraizikovich.com',

  output: 'static',

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'da',
        locales: { da: 'da-DK', en: 'en-GB' },
      },
    }),
  ],

  i18n: {
    defaultLocale: 'da',
    locales: ['da', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  // fonts: top-level in Astro 6 (no longer under experimental)
  fonts: [
    { provider: fontProviders.google(), name: 'Fraunces', cssVariable: '--font-heading', styles: ['normal', 'italic'], weights: [300, 400, 500] },
    { provider: fontProviders.google(), name: 'DM Sans',  cssVariable: '--font-body',    styles: ['normal'], weights: [400, 500] },
    { provider: fontProviders.google(), name: 'DM Mono',  cssVariable: '--font-mono',    styles: ['normal'], weights: [400] },
  ],

  build: { assets: '_astro' },

  vite: {
    resolve: { alias: { '@': '/src' } },
    build: { assetsInlineLimit: 0 },
  },
});
```

---

## Design system — tokens.css (current)

```css
:root {
  /* Colors — all warm, no clinical whites or cool greys */
  --color-bg:      #F8F5F0;
  --color-text:    #1A1A1A;
  --color-accent:  #C8922A;  /* amber — CTAs, links, hover only. Never as bg fill */
  --color-muted:   #696560;
  --color-surface: #F0ECE6;
  --color-border:  #E2DDD8;
  --color-success: #3D6B4F;
  --color-error:   #9B3535;

  /* Typography */
  --font-heading: var(--font-fraunces, 'Fraunces'), Georgia, serif;
  --font-body:    var(--font-dm-sans, 'DM Sans'), sans-serif;
  --font-mono:    var(--font-dm-mono, 'DM Mono'), monospace;

  /* Spacing scale */
  --space-1: 0.25rem; --space-2: 0.5rem;  --space-3: 0.75rem;
  --space-4: 1rem;    --space-6: 1.5rem;  --space-8: 2rem;
  --space-12: 3rem;   --space-16: 4rem;   --space-24: 6rem;

  /* Layout */
  --max-width:     1280px;
  --content-width: 720px;
  --gutter:        clamp(1rem, 4vw, 2rem);

  /* Motion */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
}

[data-theme="dark"] {
  --color-bg:      #111010;
  --color-text:    #F0ECE6;
  --color-accent:  #D4A043;
  --color-muted:   #827C78;  /* lightened for 4.6:1 contrast on dark bg */
  --color-surface: #1C1B1A;
  --color-border:  #2C2A28;
  --color-success: #6BBF8A;
  --color-error:   #E07070;
}
```

---

## View transitions — transitions.css

```css
@view-transition { navigation: auto; }

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) { animation: none; }
}
```

**CRITICAL:** Do NOT use Astro's `<ClientRouter />` — it ships a JS router. CSS-native only.

---

## _headers

```
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## Gotchas

- **Trailing slashes on pathname**: `Astro.url.pathname` returns `/da/priser/` — always strip before comparing to nav hrefs:
  ```ts
  const norm = (p: string) => p.endsWith('/') && p.length > 1 ? p.slice(0, -1) : p;
  ```
- **Dark mode overlays**: Never use `color-mix(in srgb, var(--color-text) N%, transparent)` for backdrops. In dark mode `--color-text` is light (`#F0ECE6`), making the overlay near-white. Use fixed `rgb(10 10 10 / 0.92)`.
- **Tag CSS `::before`**: Blog/project tags use `CSS ::before { content: '#' }`. Do NOT add `#` in template literals — you'll get `##tag`.
- **DA internal links**: All Danish page links must include the `/da/` prefix (e.g. `/da/portfolio/${slug}`). Astro's i18n does NOT auto-prefix relative links.
- **Dark mode toggle**: Theme stored in `localStorage('theme')`, applied as `data-theme="dark"` on `<html>`. Anti-flash script is inline in `<head>` of `Base.astro`.
- **Page top spacing**: `global.css` adds `padding-block-start: var(--space-16)` to `#main`. Individual page headers must NOT add their own top padding — set `padding-block-start: 0` in page styles.

---

## LocalBusiness schema (LocalBusinessSchema.astro)

```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Photographer"],
  "name": "Arthur Aizikovich / AA Media",
  "url": "https://arthuraizikovich.com",
  "image": "https://arthuraizikovich.com/og/og-home.png",
  "address": { "@type": "PostalAddress", "addressLocality": "Copenhagen", "addressCountry": "DK" },
  "geo": { "@type": "GeoCoordinates", "latitude": 55.6761, "longitude": 12.5683 },
  "priceRange": "DKK 5500–6000+",
  "description": "Conference, wedding and event photographer in Copenhagen",
  "sameAs": [
    "https://www.instagram.com/arthuraizikovich",
    "https://www.linkedin.com/in/arthuraizikovich"
  ]
}
```

---

## Responsive breakpoints

```css
/* Mobile first — always */
/* Tablet  */ @media (min-width: 640px)  { }
/* Desktop */ @media (min-width: 1024px) { }
/* Wide    */ @media (min-width: 1280px) { }
```

---

## Anti-slop rules — NEVER violate

- No Inter, Robota, Arial, Space Grotesk as primary fonts
- No purple gradients
- No generic card layouts with rounded corners and drop shadows
- No cookie-cutter hero: centred text + button on a blurred photo
- No multiple competing animations
- No Cloudinary — standard Astro image pipeline
- No Vercel — Cloudflare Pages only
- No `<ClientRouter />` — CSS-native view transitions only
- Photos are the visual focus — layout supports, never competes
- Never hardcode content — always from content collections or props

---

## Image rules

- Always use Astro `<Picture />` with `width`, `height`, `decoding="async"`
- Add `fetchpriority="high"` to LCP candidates (above-the-fold hero images)
- Filenames: `copenhagen-[type]-photographer-[descriptor]-001.webp`
- Alt text: `"Conference photography at Bella Center Copenhagen by Arthur Aizikovich"`

---

## Environment variables (Cloudflare Workers)

Add via Cloudflare dashboard → Workers & Pages → your worker → Settings → Variables & Secrets.
Never commit these to git.

| Variable | Purpose |
|---|---|
| `TURNSTILE_SECRET_KEY` | Contact form bot protection |
| `CONTACT_EMAIL` | Destination address for form submissions |

For local dev, add to `.dev.vars` (gitignored):
```
TURNSTILE_SECRET_KEY=your_key_here
CONTACT_EMAIL=arthur@arthuraizikovich.com
```

---

## Session rules

1. Show plan for new features — wait for approval before coding
2. One component or page per session — commit before moving on
3. End every session: update CURRENT BUILD STATUS + commit + push
4. Mobile-first always
5. Check latest stable version of any library before using it

---

## CURRENT BUILD STATUS

- [x] Project scaffold (Astro 6 + Cloudflare Pages + GitHub)
- [x] astro.config.mjs (static output, i18n, fonts top-level)
- [x] Design tokens (light + dark mode) + global CSS
- [x] transitions.css (CSS-native, no ClientRouter)
- [x] Base.astro (dark mode anti-flash, SEO meta)
- [x] Nav (hamburger mobile menu, dark mode toggle, active state)
- [x] Footer (locale switcher, social links)
- [x] SEO.astro + LocalBusinessSchema + FAQSchema
- [x] Content collection config (Zod schemas, src/content.config.ts)
- [x] Home page — da + en (2-col hero with photo showcase grid)
- [x] Portfolio grid + Lightbox (Gallery.astro + Lightbox.astro, locale-aware)
- [x] Portfolio index pages — da + en
- [x] About / Om — da + en
- [x] Pricing / Priser — da + en (editorial rate-sheet layout)
- [x] Contact / Kontakt — da + en (ContactForm.astro)
- [x] Blog — DA index + 3 SEO articles (Bella Center, CPH wedding locations, event pricing guide)
- [x] OG image (public/og/og-home.png — 1200×630)
- [x] llms.txt
- [x] Sitemap + robots.txt
- [x] _headers + _redirects
- [x] wrangler.toml
- [x] Deployed and live at new-arthur-photo-site.pages.dev
- [x] A11y + theming audit pass (~18/20 impeccable score)
- [ ] EN blog content (currently empty — DA only)
- [ ] Real photography assets (placeholder tiles in hero showcase)
- [ ] Performance audit (Lighthouse 100)
- [ ] Danish local citations (Krak, Trustpilot.dk, 118)
- [ ] Google Business Profile optimised
- [ ] Launch on arthuraizikovich.com

---

## Pre-launch checks (run in order)

- [ ] `npm run build` exits clean — zero errors, zero warnings
- [ ] i18n routes resolve: `/da/` → Danish, `/en/` → English, `/da/portfolio` → 200, `/en/portfolio` → 200
- [ ] hreflang tags present and correct on every page (check page source)
- [ ] JSON-LD validates at https://validator.schema.org
- [ ] Sitemap includes both `da` and `en` URLs
- [ ] OG image renders correctly — test with https://opengraph.xyz
- [ ] LCP image has `fetchpriority="high"` and is NOT lazy-loaded
- [ ] Contact form submits successfully and email arrives
- [ ] Cloudflare Worker env vars set in dashboard (not just .dev.vars)
- [ ] `_headers` cache rules active — verify via CF Pages response headers
- [ ] All portfolio slugs resolve — no broken dynamic routes

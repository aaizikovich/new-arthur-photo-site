# Arthur Aizikovich — Photography Portfolio
# Claude Code Instructions

## Project
Portfolio + booking site for Arthur Aizikovich (AA Media), Copenhagen photographer.
Primary services: weddings, conferences, events, portraits, nightlife.
Domain: arthuraizikovich.com

---

## ⚡ FOUNDATION BUILD — READ THIS FIRST

Only stop if you hit a genuine blocker (missing credential, ambiguous architecture decision).
When done, print a summary of everything created and update CURRENT BUILD STATUS.

### Build order (execute all, in sequence):

1. Install Astro 6 + `@astrojs/cloudflare` adapter
2. Write `astro.config.mjs` — i18n + imageService + fonts config
3. `src/styles/tokens.css` — full design token system
4. `src/styles/transitions.css` — CSS-native view transitions (no JS)
5. `src/styles/global.css` — resets + base styles
6. `src/layouts/Base.astro` — font preload, meta, view transition import
7. `src/layouts/Project.astro` — project page layout
8. `src/components/ui/Nav.astro`
9. `src/components/ui/Footer.astro`
10. `src/components/seo/SEO.astro` — canonical, OG, hreflang, JSON-LD slot
11. `src/components/seo/LocalBusinessSchema.astro`
12. `src/components/seo/FAQSchema.astro`
13. `src/content.config.ts` — Zod schemas for content collections (Astro 6 location)
14. `src/pages/da/index.astro` — Danish home (stub, content from collection)
15. `src/pages/en/index.astro` — English home (stub, content from collection)
16. `src/pages/da/om.astro` — stub
17. `src/pages/en/about.astro` — stub
18. `src/pages/da/priser.astro` — stub
19. `src/pages/en/pricing.astro` — stub
20. `src/pages/da/kontakt.astro` — stub
21. `src/pages/en/contact.astro` — stub
22. `src/pages/da/portfolio/[slug].astro` — dynamic route stub
23. `src/pages/en/portfolio/[slug].astro` — dynamic route stub
24. `src/utils/image.ts` — srcset builder helper
25. `src/utils/schema.ts` — JSON-LD factory functions
26. `public/llms.txt` — AI-agent summary for GEO visibility
27. `_headers` — Cloudflare cache + security headers
28. `_redirects` — www → apex redirect
29. `wrangler.toml` — Cloudflare Worker stub for contact form
30. `git add . && git commit -m "feat: foundation build — Astro 6 + CF adapter + i18n + design system" && git push`

---

## Tech stack

- **Framework:** Astro 6 (static output by default)
- **Adapter:** `@astrojs/cloudflare` — Cloudflare Pages + Workers
- **Image pipeline:** `imageService: 'cloudflare-binding'` — no Cloudinary, no external SaaS
- **CMS:** Decap CMS (git-based, markdown files, no database)
- **CSS:** Custom properties only — no Tailwind
- **TypeScript:** preferred throughout
- **JS:** minimal — `client:visible` islands only where genuinely needed
- **Fonts:** Astro 6 built-in Fonts API — self-hosted at build time, NOT Google Fonts CDN
- **Video:** Vimeo embeds only, always with `dnt` parameter
- **Hosting:** Cloudflare Pages — NOT Vercel

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
    da/                     # Danish — default locale, no URL prefix
      index.astro           # /
      om.astro              # /om
      kontakt.astro         # /kontakt
      priser.astro          # /priser
      portfolio/
        index.astro         # /portfolio
        [slug].astro
    en/                     # English — /en/* prefix
      index.astro           # /en/
      about.astro           # /en/about
      contact.astro         # /en/contact
      pricing.astro         # /en/pricing
      portfolio/
        index.astro         # /en/portfolio
        [slug].astro
  components/
    seo/
      SEO.astro
      LocalBusinessSchema.astro
      FAQSchema.astro
    gallery/
      Gallery.astro
      Image.astro
      Lightbox.astro        # client:visible island
    ui/
      Nav.astro
      Footer.astro
      ContactForm.astro     # client:visible island
  content/
    projects/               # one .md per project
    blog/                   # one .md per blog post
  content.config.ts         # Astro 6 content collection config (at src/ root)
  layouts/
    Base.astro
    Project.astro
  styles/
    tokens.css
    transitions.css
    global.css
  utils/
    image.ts
    schema.ts
public/
  fonts/
  og/
  brand_assets/
  llms.txt
docs/
  CLAUDE.md
  DESIGN-BRIEF.md
  COPY.md
astro.config.mjs
_headers
_redirects
wrangler.toml
```

---

## astro.config.mjs (use exactly this)

```js
import { defineConfig, fontProviders } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://arthuraizikovich.com',

  adapter: cloudflare({
    imageService: 'cloudflare-binding',
  }),

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'da',
        locales: {
          da: 'da-DK',
          en: 'en-GB',
        },
      },
    }),
  ],

  i18n: {
    defaultLocale: 'da',
    locales: ['da', 'en'],
    routing: {
      prefixDefaultLocale: false,
      // redirectToDefaultLocale only valid when prefixDefaultLocale: true — omit it
    },
  },

  // fonts: top-level in Astro 6 (no longer under experimental)
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-heading',
      styles: ['normal', 'italic'],
      weights: [300, 400, 500],
    },
    {
      provider: fontProviders.google(),
      name: 'DM Sans',
      cssVariable: '--font-body',
      styles: ['normal'],
      weights: [400, 500],
    },
    {
      provider: fontProviders.google(),
      name: 'DM Mono',
      cssVariable: '--font-mono',
      styles: ['normal'],
      weights: [400],
    },
  ],

  build: {
    assets: '_astro',
  },

  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
```

---

## Design system — tokens.css (use exactly this)

```css
:root {
  /* Colors — all warm, no clinical whites or cool greys */
  --color-bg:      #F8F5F0;
  --color-text:    #1A1A1A;
  --color-accent:  #C8922A;  /* amber — CTAs, links, hover only. Never as bg fill */
  --color-muted:   #8A8480;
  --color-surface: #F0ECE6;
  --color-border:  #E2DDD8;

  /* Typography */
  --font-heading: var(--font-fraunces, 'Fraunces'), Georgia, serif;
  --font-body:    var(--font-dm-sans, 'DM Sans'), sans-serif;
  --font-mono:    var(--font-dm-mono, 'DM Mono'), monospace;

  /* Spacing scale */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  /* Layout */
  --max-width:     1280px;
  --content-width: 720px;
  --gutter:        clamp(1rem, 4vw, 2rem);

  /* Motion */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
}
```

---

## View transitions — transitions.css (use exactly this)

```css
@view-transition {
  navigation: auto;
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) { animation: none; }
}
```

**CRITICAL:** Do NOT use Astro's `<ClientRouter />` — it ships a JS router. CSS-native only.

---

## _headers (use exactly this)

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

## LocalBusiness schema (use in LocalBusinessSchema.astro)

```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Photographer"],
  "name": "Arthur Aizikovich / AA Media",
  "url": "https://arthuraizikovich.com",
  "image": "https://arthuraizikovich.com/og/og-home.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Copenhagen",
    "addressCountry": "DK"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 55.6761,
    "longitude": 12.5683
  },
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

- No Inter, Roboto, Arial, Space Grotesk as primary fonts
- No purple gradients
- No generic card layouts with rounded corners and drop shadows
- No cookie-cutter hero: centred text + button on a blurred photo
- No multiple competing animations
- No Cloudinary — use Cloudflare image binding
- No Vercel — use Cloudflare Pages
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
| `TURNSTILE_SECRET_KEY` | Contact form bot protection (get from Cloudflare Turnstile dashboard) |
| `CONTACT_EMAIL` | Destination address for form submissions |

For local dev, add to a `.dev.vars` file (already in `.gitignore`):
```
TURNSTILE_SECRET_KEY=your_key_here
CONTACT_EMAIL=arthur@arthuraizikovich.com
```

---

## Session rules (for feature work AFTER foundation)

1. Show plan for new features — wait for approval before coding
2. One component or page per session — commit before moving on
3. End every session: update CURRENT BUILD STATUS + commit + push
4. Mobile-first always
5. Check latest stable version of any library before using it

---

## CURRENT BUILD STATUS

Update at end of every session:

- [x] Project scaffold (Astro 6 + Cloudflare + GitHub)
- [x] astro.config.mjs (i18n + imageService + fonts — fonts top-level, not experimental)
- [x] Design tokens + global CSS
- [x] transitions.css
- [x] Base.astro (Fixed Font import from astro:assets)
- [x] Nav + Footer (Step 8/9)
- [x] SEO.astro + LocalBusinessSchema + FAQSchema
- [x] Content collection config (Zod schemas, src/content.config.ts — Astro 6 location)
- [x] Home page (da + en)
- [x] Portfolio grid + Lightbox island (Gallery.astro + Lightbox.astro)
- [x] Portfolio index pages (da + en — fixed 404 on nav links)
- [x] About / Om page (da + en, bio + 4 services + CTA)
- [x] Services / Priser page (da + en, 4 pricing cards + FAQ schema)
- [x] Contact / Kontakt page (da + en, ContactForm.astro + contact details)
- [x] Blog posts (3 DA venue SEO articles: Bella Center, CPH wedding locations, event pricing guide)
- [x] OG image (public/og/og-home.png — 1200×630, brand color #F8F5F0)
- [x] llms.txt
- [x] Sitemap + robots.txt (@astrojs/sitemap added to config)
- [x] _headers + _redirects
- [x] wrangler.toml
- [ ] EN blog content (WARNING: currently empty — DA only)
- [ ] Deploy to Cloudflare Pages staging — verify routing on real infra
- [ ] Performance audit (Lighthouse 100)
- [ ] Danish local citations (Krak, Trustpilot.dk, 118)
- [ ] Google Business Profile optimised
- [ ] Launch

---

## Pre-launch checks (run in order before deploying to production)

- [ ] `npm run build` exits clean — zero type errors, zero warnings
- [ ] i18n routes resolve: `/` → Danish, `/en/` → English, `/portfolio` → 200, `/en/portfolio` → 200
- [ ] hreflang tags present and correct on every page (check page source)
- [ ] JSON-LD validates at https://validator.schema.org
- [ ] Sitemap includes both `da` and `en` URLs
- [ ] OG image renders correctly — test with https://opengraph.xyz
- [ ] LCP image has `fetchpriority="high"` and is NOT lazy-loaded
- [ ] Contact form submits successfully and email arrives
- [ ] Cloudflare Worker env vars set in dashboard (not just .dev.vars)
- [ ] `_headers` cache rules active — verify via CF Pages response headers
- [ ] No hardcoded strings in components (grep for any DA/EN text outside collections)
- [ ] All portfolio slugs resolve — no broken dynamic routes

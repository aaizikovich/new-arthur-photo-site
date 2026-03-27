# Design Brief — Arthur Aizikovich Photography

## Philosophy

Warm editorial. Photos are the drama — the layout is restrained and serves them.
The site should make visitors stop and think: "wow, these are amazing."

One rule above all: if a design decision competes with the photography, it loses.

---

## Color system

```css
:root {
  --color-bg:      #F8F5F0;  /* warm off-white — main background */
  --color-text:    #1A1A1A;  /* near-black — main text */
  --color-accent:  #C8922A;  /* warm amber — CTAs, links, hover states */
  --color-muted:   #8A8480;  /* warm grey — captions, secondary text */
  --color-surface: #F0ECE6;  /* slightly darker — subtle surfaces */
  --color-border:  #E2DDD8;  /* soft borders */
}
```

All colors are intentionally warm — no clinical whites, no cool greys.
Amber accent (`#C8922A`) is used sparingly: CTAs, underlines, hover indicators only.
Never use it as a background fill.

**Easy to change:** everything lives in `tokens.css`. One hex value = entire site updates.

---

## Typography

**Heading:** Fraunces (variable, optical size) — editorial, distinctive, warm serif
**Body:** DM Sans — clean, readable, modern without being generic
**Captions/mono:** DM Mono — technical details, EXIF data, small labels

Load via Astro 6 Fonts API (self-hosted at build time — no Google Fonts CDN request).

```js
// astro.config.mjs font config reference
fonts: [
  { provider: 'google', name: 'Fraunces', styles: ['normal', 'italic'], weights: [300, 400, 500] },
  { provider: 'google', name: 'DM Sans',  styles: ['normal'],           weights: [400, 500] },
  { provider: 'google', name: 'DM Mono',  styles: ['normal'],           weights: [400] },
]
```

**Maximum 2 typefaces visible at any time.** DM Mono is for captions only — not a third display font.

**Banned (AI slop defaults):** Inter, Roboto, Arial, Space Grotesk, system-ui as primary font.

**Easy to change:** font name in one config line. Astro fetches + self-hosts the new one automatically.

---

## Logo

All files in `/public/brand_assets/`

| File | Use |
|---|---|
| `logo-primary.svg` | Nav, light backgrounds (most of site) |
| `logo-primary-black.svg` | Footer, dark sections |

No horizontal variant exists — always use the square/stacked version.

---

## Design rules

### Do
- Full-width or near-full-width images — let them dominate
- Vary image sizing — avoid boring uniform grids
- Generous whitespace — images need room to breathe
- Warm off-white backgrounds throughout
- Amber accent on CTAs, active states, links only
- One staggered fade-in on page load — subtle, not theatrical
- Mobile-first grid: 1 col → 2 col → 3 col
- Asymmetric layouts on featured work sections

### Don't
- Purple gradients (ever)
- Generic card layouts with rounded corners and drop shadows
- Cookie-cutter hero: centred text + button on a blurred photo
- More than one animation playing simultaneously
- More than 2 typefaces on screen at once
- Images in a uniform grid — vary sizing and rhythm
- Anything that pulls attention away from the photography

---

## Responsive breakpoints

```css
/* Mobile first — always */
/* Tablet  */ @media (min-width: 640px)  { }
/* Desktop */ @media (min-width: 1024px) { }
/* Wide    */ @media (min-width: 1280px) { }
```

---

## Page structure

### Home (`/` and `/en/`)
1. Hero — full-width image, minimal headline overlay
2. Featured work — 3–4 images, asymmetric grid
3. About snippet — 2 lines + face photo
4. Testimonials — 2 quotes, clean typography
5. Services snapshot — 3 categories with prices
6. CTA — "Book a shoot" / "Bestil en fotografering"

### Portfolio (`/portfolio/[slug]` and `/en/portfolio/[slug]`)
- Filterable grid: Conferences / Weddings / Events / Portraits / Nightlife
- Click → Lightbox (full-screen, keyboard nav, swipe on mobile)
- Images lazy-loaded via Cloudflare image binding
- `client:visible` island — JS only loads when grid enters viewport

### About / Om
- Large dominant photo — not a thumbnail
- Story text alongside
- Client names — simple text list, no logos

### Services / Priser
- One clean section per service
- Price visible and prominent
- FAQ at bottom (also generates FAQPage schema for SEO)

### Contact / Kontakt
- Simple form
- Response time visible
- No distractions

---

## Schema.org (homepage reference)

```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Photographer"],
  "name": "Arthur Aizikovich / AA Media",
  "url": "https://arthuraizikovich.com",
  "image": "https://arthuraizikovich.com/og-image.jpg",
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

## Image SEO

- **Filenames:** `copenhagen-[type]-photographer-[descriptor]-001.webp`
- **Alt text:** descriptive + location + name
  - Good: `"Conference photography at Bella Center Copenhagen by Arthur Aizikovich"`
  - Bad: `"photo1.jpg"` or `"conference"`
- **Delivery:** AVIF primary, WebP fallback via `<Picture />` component
- **LCP candidate:** always add `fetchpriority="high"` to above-the-fold hero image
- **P3 color:** Cloudflare image binding preserves wide-gamut color profiles

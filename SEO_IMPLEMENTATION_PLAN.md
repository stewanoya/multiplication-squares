# SEO Implementation Plan — Multiplication Squares

## Background

The site is an Angular SPA (standalone components, Angular 17+) deployed to Netlify via GitHub.
Netlify runs `npm run build`, which triggers the Angular application builder.

Angular SSR and prerendering are **already configured** in `angular.json`:
```json
"server": "src/main.server.ts",
"prerender": true,
"ssr": { "entry": "server.ts" }
```

However, prerendering is currently ineffective because:
1. `app.routes.ts` has no routes defined — the router is unused
2. `app.component.html` renders `<board/>` directly instead of `<router-outlet>`
3. The board component immediately opens a `MatDialog` on `ngOnInit`, which produces no indexable HTML content

**Key differentiator vs. competitors:** Every competing page (games4gains, themathhub, mathfinds) distributes printable PDF worksheets. This is the only browser-playable version — no printing, no prep, no download required. The current site copy does not communicate this at all.

**Target audience:** Teachers sourcing digital classroom activities for Grades 1–8.

**Top GSC queries to own:** `multiplication squares game online`, `interactive multiplication squares`, `multiplication squares game browser`, `digital multiplication squares classroom`

---

## Changes Overview

| # | Change | Files |
|---|--------|-------|
| 1 | Add routing — `/` landing page, `/play` game | `app.routes.ts`, `app.component.html`, `app.component.ts` |
| 2 | Create landing page component | `src/components/landing/` (new) |
| 3 | Update meta, OG, and canonical tags | `src/index.html` |
| 4 | Add JSON-LD structured data | `src/index.html` |
| 5 | Add `netlify.toml` with SPA redirect | `netlify.toml` (new) |
| 6 | Add `sitemap.xml` | `src/sitemap.xml` (new), `angular.json` |

---

## Step 1 — Routing

### `src/app/app.routes.ts`
Replace the empty routes array:

```ts
import { Routes } from '@angular/router';
import { LandingComponent } from '../components/landing/landing.component';
import { BoardComponent } from '../components/board/board.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'play', component: BoardComponent },
  { path: '**', redirectTo: '' }
];
```

### `src/app/app.component.html`
Replace the hardcoded `<board/>` with the router outlet:

```html
<router-outlet />
```

### `src/app/app.component.ts`
Remove `BoardComponent` from imports, add `RouterOutlet`:

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
```

---

## Step 2 — Landing Page Component

Create a new standalone component at `src/components/landing/`.

### Files to create
- `src/components/landing/landing.component.ts`
- `src/components/landing/landing.component.html`
- `src/components/landing/landing.component.scss`

### `landing.component.ts`
```ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  constructor(private _router: Router) {}

  play() {
    this._router.navigate(['/play']);
  }
}
```

### `landing.component.html` — content requirements

The page must be concise. A teacher clicking through from a search result should be able to read it in 10 seconds and hit Play. Structure:

1. **H1** — primary keyword target:
   > "Multiplication Squares — Free Online Math Game"

2. **Hero tagline** (1–2 sentences):
   > "The classic dots-and-boxes multiplication game, played directly in your browser. No printing, no prep, no download. Free for classrooms."

3. **OG/screenshot image** — a screenshot of the game board in play.
   - **Image not yet provided — ask user for it before implementing this section.**
   - Place it between the tagline and the teacher pitch.
   - Use an `<img>` tag with descriptive `alt`: `"Multiplication Squares game board showing a grid of numbers with colored squares captured by players"`

4. **Teacher pitch** (2–3 sentences):
   > "Set up in seconds. Up to 4 players. Students roll dice, multiply the numbers, and race to capture the most squares on the board. Great for Grades 1–8."

5. **How to Play section** — `<h2>How to Play</h2>` followed by the 7 steps already in `how-to-play.component.html`. Copy those steps directly into this component (do not import the dialog component — it closes itself and isn't suited for inline use).

6. **CTA button** — large, prominent:
   > "Play Now"  →  calls `play()` which navigates to `/play`

### `landing.component.scss`
- Max width ~800px, centered
- Hero section: large H1, generous vertical padding
- Image: full width within container, border-radius, subtle box-shadow
- How to Play: clean ordered list
- CTA button: oversized (`font-size: 1.5rem`, `padding: 0.75rem 2rem`)

---

## Step 3 — Meta, OG, and Canonical Tags

### `src/index.html`

Replace the existing `<title>` and `<meta>` tags with:

```html
<title>Multiplication Squares — Free Online Math Game</title>

<meta name="description" content="Play Multiplication Squares free in your browser — no printing, no prep. Roll dice, capture squares, practice times tables. Perfect for Grades 1–8 classrooms." />

<meta name="keywords" content="multiplication squares game online, interactive multiplication squares, multiplication squares game, multiplication game for kids, digital multiplication squares classroom, math game browser, free multiplication game" />

<link rel="canonical" href="https://m-squares.anoya.ca/" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://m-squares.anoya.ca/" />
<meta property="og:title" content="Multiplication Squares — Free Online Math Game" />
<meta property="og:description" content="Play Multiplication Squares free in your browser — no printing, no prep. Roll dice, capture squares, practice times tables. Perfect for Grades 1–8 classrooms." />
<meta property="og:image" content="https://m-squares.anoya.ca/assets/og-image.png" />
<!-- og:image requires the image file at src/assets/og-image.png — ask user to provide before deploying -->

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Multiplication Squares — Free Online Math Game" />
<meta name="twitter:description" content="Play Multiplication Squares free in your browser — no printing, no prep." />
<meta name="twitter:image" content="https://m-squares.anoya.ca/assets/og-image.png" />
```

OG image requirements:
- File: `src/assets/og-image.png`
- Recommended size: 1200×630px
- Content: screenshot of the game board mid-play, ideally with colored squares captured
- **Ask user to provide this image before wiring up the og:image tags.**

---

## Step 4 — JSON-LD Structured Data

Add inside `<head>` in `src/index.html`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Multiplication Squares",
  "url": "https://m-squares.anoya.ca/",
  "description": "A free browser-based multiplication game for classrooms. Players roll dice, multiply the numbers, and capture squares on the board. No printing or prep required.",
  "applicationCategory": "EducationalApplication",
  "educationalLevel": "Grade 1-8",
  "audience": {
    "@type": "EducationalAudience",
    "educationalRole": "teacher"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "operatingSystem": "Web Browser",
  "inLanguage": "en"
}
</script>
```

---

## Step 5 — Netlify Configuration

Create `netlify.toml` in the repo root. This is needed so direct navigation to `/play` (or any deep link) returns the Angular app rather than a 404.

```toml
[build]
  command = "npm run build"
  publish = "dist/math-squares/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Note: The prerendered `/` route will be served as a static HTML file by Netlify automatically. The catch-all redirect handles the SPA routes that are not prerendered.

---

## Step 6 — Sitemap

### `src/sitemap.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://m-squares.anoya.ca/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://m-squares.anoya.ca/play</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

### `angular.json` — add sitemap.xml to assets
In the `assets` array under `options`:
```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  "src/ads.txt",
  "src/sitemap.xml"
]
```

After deploying, submit `https://m-squares.anoya.ca/sitemap.xml` to Google Search Console.

---

## Implementation Order

1. **Step 5** (netlify.toml) — no code risk, unblocks testing deep links on Netlify
2. **Step 1** (routing) — structural change, everything downstream depends on this
3. **Step 2** (landing page) — implement without the OG image first; add a placeholder `<!-- TODO: og-image -->` comment
4. **Step 3** (meta/OG tags) — add everything except `og:image`; wire that up once user provides the image
5. **Step 4** (JSON-LD) — drop into index.html
6. **Step 6** (sitemap) — add file and update angular.json

**Blocked until user provides:** `src/assets/og-image.png` (1200×630px screenshot of the game board)

---

## Notes

- The `BoardComponent` currently calls `this._dialog.open(NewGameFormComponent)` in `ngOnInit`. When navigated to via `/play` this still works correctly — no changes needed to the game itself.
- `"prerender": true` in `angular.json` will prerender all routes defined in `app.routes.ts` at build time. Once the landing page route is added, Netlify's build will output a fully rendered `index.html` for `/` that Google can index.
- Do not prerender `/play` — the game is stateful and client-only. Angular's prerenderer will attempt to open a dialog server-side which will fail or produce empty output. Add a `data` property to that route to exclude it if needed: `{ path: 'play', component: BoardComponent, data: { prerender: false } }`.

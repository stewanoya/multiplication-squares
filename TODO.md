# Math Squares — Remaining Work

## Completed

- [x] Ad interstitial component (`src/components/ad-interstitial/`) — 5-second countdown, skips in dev mode
- [x] Variant model (`src/models/variant.model.ts`) — config system for all 4 game types
- [x] Generalized `BoardModel` — accepts `DifficultyLevel` instead of hardcoded multiplication logic
- [x] Routing — `/play/:variant` and `/print/:variant`
- [x] `BoardComponent` — reads variant from route, passes to form, uses `currentResult`; error popup shows equation not answer
- [x] `NewGameFormComponent` — difficulty picker from variant config; HowToPlay passes variant into dialog
- [x] `DiceComponent` — single vs dual spinner; number always shows in single-spinner mode; display transform for division/subtraction
- [x] `PrintableComponent` — variant + difficulty selectors, dynamic board generation
- [x] Landing page — game cards for all 4 active games + coming-soon placeholders; styled with per-game accent colors
- [x] Site rename: "Multiplication Squares" → "Math Squares" across index.html, nav, board, printable
- [x] Copy — all user-facing text through `/humanizer`: landing, game descriptions, about, FAQ, how-to-play
- [x] About + FAQ pages — updated to cover all 4 games
- [x] Subtraction mixed mode — board values include 0 (since `abs(d1-d2)` can produce 0)
- [x] HowToPlay dialog — generic variant-aware instructions, shows variant label in title
- [x] CanvasPopup — shows full equation string instead of raw die values
- [x] Sitemap — includes all `/play/:variant` and `/print/:variant` routes
- [x] `isPlayRoute` check — `startsWith('/play')` already covers all variant routes

---

## Still To Do

### 1. Ad Interstitial — Wire Up Real Ad
The component shows a placeholder. Steps when ready:
- Turn off AdSense Auto ads in the AdSense console (prevents ads appearing outside the interstitial)
- Create a single Display ad unit in AdSense
- Add the AdSense loader script to `index.html` (the `<script async src="...adsbygoogle.js">` tag only — no auto-ads snippet)
- Replace placeholder in `ad-interstitial.component.html` with `<ins class="adsbygoogle" ...>` for that unit
- Call `(window as any).adsbygoogle.push({})` in `ngAfterViewInit()` in the component
- `AD_DURATION` is hardcoded as `5` in `ad-interstitial.component.ts` — adjust if needed

---

## Deferred

### Phase 2 — Factors, Multiples, Prime & Composite *(deferred)*
Coming-soon cards remain on the landing page. Implement after Phase 1 is stable.

### Elapsed Time *(deferred)*
Structurally different — lookup table, clock times on board. Defer until Phase 2 is shipped.

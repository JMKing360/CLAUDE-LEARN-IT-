# House of Mastery — Review Strategy v2.0

**Purpose.** A comprehensive 40-dimension review framework for iterative quality passes on the assessment suite (`index.html` · KOORA UNFINISHED · 60 items, and `first-hour.html` · The First Hour · 42 items). Replaces v1.0 (`REVIEW-STRATEGY.md`) which was structured for the v3.5 backlog; v2.0 is structured for ongoing maturity rounds across visual, content, instrument-specific, and code-architecture concerns.

**Branch anchor.** `claude/build-mature-assessment-k6AT9` at v3.6.1. Every round commits independently with a `v3.7.N-review-N` style tag.

**Scoring.** Each dimension scored 1–5 per round:
- **1** absent or broken
- **2** present but uneven or partial
- **3** functional but unrefined
- **4** well-executed, minor polish remains
- **5** council-grade, ship-quality

Composite ≥4.5/5 across all 40 dimensions = ship target.

---

## Section A — Visual & Typographic Design (8 dimensions)

### 1. Typographic hierarchy and modular scale
Verify the size progression hero (38–58px) → r-h1 (32–46px) → cov-name (24–32px) → tr-h1 (28–42px) → lede (21–26px) → q-text (26–38px) → q-prompt (16–19px) → body-text (16–17.5px) → field-hint (12.5px) reads as a smooth modular curve with no abrupt 2× jumps. Audit cover letters, Meet Dr. Job, covenant-entry, KOORA-funnel, scoring-note, and Doctor's-note PDF page for outliers.

### 2. Italic emphasis discipline
Confirm `.hero em`, `.dash-hello em`, `.r-h1 em` use the gold-soft underscore-highlight (linear-gradient marker) and not `font-style: italic`. Audit cover letter, Meet Dr. Job bio, and First Hour KOORA-funnel for *italic* phrasing — italics should be rare, deliberate, and reserved for the doctrinal moves (e.g., "*That itself is data.*"), never decorative.

### 3. Font face deployment integrity
Verify `Source Serif 4` is the headline face on every typographic root (hero, dash-hello, lede, r-h1, tr-h1, ack-h1, cov-name, pain-q, cohort-h, q-text, q-prompt). Verify `Inter` is the body face (with `Plus Jakarta Sans` fallback). Sweep for any remaining `var(--serif)` or `var(--sans)` uses in critical roots — these should be explicit literals so font intent cannot be silently overridden.

### 4. Color token discipline
Audit for hardcoded hex values where a CSS custom property exists (`#0D1F3C` → `var(--navy)`, `#C9973A` → `var(--gold)`, `#1A1A1F` → `var(--ink)`, `#2D2D33` → `var(--body)`, `#52525A` → `var(--mid)`, `#75757D` → `var(--dim)`, `#FBFBFD` → `var(--surface)`, etc.). Inline `style` attributes are the most likely offenders. Dark-mode `@media` blocks should already be tokenised post-v3.5.11.

### 5. Border-radius vocabulary adoption
Verify the `--r-xs/--r-sm/--r-md/--r-lg/--r-pill` tokens (added in v3.5.11) are adopted on every card surface. No raw `border-radius: 2px/3px/14px` should remain on the major surfaces (cover-letter, meet-doctor, unfinished-block, emo-block, covenant-entry, reaffirm, koora-funnel, scoring-note). Image-edge contexts (portraits) may legitimately use raw `2px` for near-square edges — flag these as deliberate exceptions.

### 6. Whitespace and spacing rhythm
Audit margin/padding values for consistency with an 8-step base scale (8 / 16 / 24 / 32 / 48 / 64 / 96 / 128). Flag stray values like `margin: 22px` or `padding: 18px 28px` where they break the rhythm without justification. Pay particular attention to cover-letter, Meet Dr. Job grid gap, covenant-entry padding, and the welcome-screen breathing-room block.

### 7. Dark-mode coherence
Render-test every surface in `prefers-color-scheme: dark`. Verify cover-letter, Meet Dr. Job (portrait visibility against dark surface), unfinished-block, emo-block, covenant-entry, reaffirmation, koora-funnel, scoring-note, save-pill, and the result-page tables. Catch any remaining hardcoded `#fff` / `#000` / `#FFFFFF` that should read from tokens.

### 8. Shadow and elevation system
Audit the box-shadow values across `.cover-letter`, `.meet-doctor img`, `.koora-funnel`, `.opt`, `.opt:hover`, `.opt.sel`, `.save-pill`, `.feature-card`, `.cohort-cta`, `.fidelity-feature`. Should follow a coherent two- or three-tier elevation system rather than ad-hoc shadow values per element. Flag inconsistent spread radii, opacities, or colour casts (some shadows use `rgba(13,31,60,...)`, others use unspecified).

---

## Section B — Iconography (4 dimensions)

### 9. Icon sprite completeness and rendering
Verify all 16 icons in the inline SVG sprite render correctly at all three opacity tiers (ambient .06, featured .32, inline 1.0). Check the welcome-screen constellation positions are tuned so icons sit in negative space, not behind text. Confirm `currentColor` inherits properly from parent context.

### 10. Icon semantic placement
Audit that icons appear in their intended contexts: covenant-entry icon swaps per active covenant; reaffirmation icon swaps per covenant name; First Hour welcome constellation uses `chamber` icons (mind/body/word/time/money/people-alt); KOORA welcome uses `covenant` icons (self/body/craft/people/future/world). Check `iconMap` lookup correctness in `renderCovenantEntry` and `buildResults` reaffirmation block.

### 11. Icon accessibility attributes
Decorative icons must have `aria-hidden="true"` (constellation, ambient backgrounds, reaffirmation visual). Functional icons next to text labels should be `aria-hidden="true"` only when the adjacent text serves as the label; otherwise they need `<title>` or `aria-label`. Sweep for any `<svg class="icon">` without an accessibility decision.

### 12. Icon visual coherence
Audit the 16 icons render with comparable ink-to-air ratio at the same opacity. Catch any single icon (likely `icon-money` or `icon-craft` due to denser glyphs) that reads visibly heavier and pulls focus when paired with siblings. Stroke widths should all be `1.5`; verify none drift to `2` or `1`.

---

## Section C — Author Presence (4 dimensions)

### 13. Cover letter integrity
Voice, photo, credential, signature all in concert. Verify the cover letter on both files reads as Dr. Mogire's actual cadence (not assessment-speak), the portrait crops to face/upper-torso (`object-position: center 22%`), the credential line displays "MD, FACC · Cardiologist · Author · Speaker", and the italic signature ("Dr. Job Mogire") with the small caps sub-line (House of Mastery · KOORA · 2026 / House of Mastery · 2026) renders properly.

### 14. Meet Dr. Job section
Verify the three-paragraph bio reads at council quality on both files. Check portrait selection: KOORA uses `dr-job-desk.jpg` (warm seated), First Hour uses `dr-job-clinical.jpg` (clinical lab coat). The credential line, the founder claim, and the "next door is KOORA" CTA on First Hour all read naturally.

### 15. Author byline at result top
Verify the small (32×32) avatar + canonical credential line ("Diagnostic by Dr. Job Mogire, MD, FACC · Cardiologist · Author · Speaker" on KOORA; "Audit by..." on First Hour) sits at the top of every result page. The avatar uses the clinical portrait. The byline appears above the headline, after the eyebrow. `loading="lazy"` and `decoding="async"` are present.

### 16. Foot-credit and meta canonical phrasing
Sweep `foot-credit`, `<meta name="author">`, `<meta name="twitter:creator">`, JSON-LD `Person.name`, OG description, Twitter description, all email payload `archetype_desc` introductions. The canonical form is **Dr. Job Mogire, MD, FACC · Cardiologist · Author · Speaker**. Catch any remaining `MD, FACP, FACC` (legacy), `Cardiologist · Author · Speaker` without `MD, FACC` prefix, or `designed by Dr. Job Mogire` boilerplate.

---

## Section D — KOORA-specific (5 dimensions)

### 17. Six-tier covenant variant prose
Audit the Body, People, Future variants on each of the 60 KOORA items for voice consistency. Body should land somatically ("the body recognises..."); People should land relationally ("those near me see..."); Future should land identity-claiming ("I am the kind of person who..."). Catch any item where the new tiers feel templated or off-voice.

### 18. Covenant-entry section
Five gateway items + threshold sentence per covenant (Self / Body / Craft / People / Future / World). Verify the sentences read like Dr. Mogire's actual cadence. Check the gating: section renders only on Day 0, 45, 75, 105, 135, 165 (first visit to each covenant), and the icon swaps via `iconMap`. The threshold sentence should be observational, not exhortative.

### 19. Reaffirmation block messages
Twelve hand-authored per-day messages (Day 14, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180). Verify each reads as covenant-aware (mid-month vs end-of-covenant tone), names the participant, and italicises the doctrinal move ("*That itself is data.*"). Gating: shows when `participantDay > 0` or `returnIdx > 1`. Icon swaps via `raIconMap`.

### 20. Day cadence resolver end-to-end
Walk through `participantDay` propagation: `DAY_OPTIONS` → `dayPicker` populated → `participantDay` set on `startAssessment` → `retakeTier()` returns 1–6 → `variantIdx` resolves to 0–5 → `QUESTIONS[n].text[variantIdx]` lands the right tier. Test edge cases: legacy Day 15 records, Day 181+ alumni, Day 0 baseline. Verify `nextDayFor`, `activeCovenant`, `labelForDay` all agree.

### 21. KOORA inter-section transitions
Five between-section transitions (after Q16, Q23, Q31, Q39, Q49). Each should append the covenant-aware footnote ("You are inside the [covenant] covenant. *[promise]*") via the `.cov-transition` styling. Halfway personal moment at Q31 (after Section 3) names the participant. Day-framing line below adapts to the participant's day on the path.

---

## Section E — First Hour-specific (5 dimensions)

### 22. UNFINISHED selection block
Verbatim ten-letter taxonomy from the doctor's screenshot: U·Unkept Promises · N·Negotiating Constantly · F·Fragmented Identity · I·Inherited Patterns · N·Neglected Completion · I·Intelligence Weaponized · S·Self-Trust Bankrupt · H·Hidden Shame · E·Exhausted From Carrying · D·Deferred Action As Lifestyle. Subtitle "Ten patterns that mark an unfinished Self." Click-to-toggle, keyboard accessible (Enter/Space), `aria-checked`, persists per email in localStorage, surfaces in email payload + PDF "Your own words" section.

### 23. Two emotional commitment radios
**(1)** *"Does any of what you have read so far land somewhere honest in you?"* — Yes / Some of it. **(2)** *"Are you tired enough of beginning to actually find out where you stand?"* — Yes / Not yet. Verify radios fire system-1 (selection feels immediate, no second-guessing prompt). Choices persist in localStorage; surface as `emo_resonance` and `emo_readiness` in the GHL payload.

### 24. KOORA-funnel hooks
Lead-generation surfaces on First Hour. Verify presence at three or more touchpoints: result-page navy/gold KOORA-funnel block (with the six covenants enumerated, "Once a year. Twenty-four seats."), Meet Dr. Job CTA ("the next door is KOORA"), email payload "Next door" line, PDF page 4 reference. Language should be consistent — no contradictory pricing, dates, or seat counts.

### 25. 47% impact uplift methodology
Verify `estimateCost()` reflects the v3.5.x calibration: `unconsciousHoursWeekly` derived from Time + Mind + Body chambers (range 21–84 → 0–56 hr/wk), `promisesBroken` 6.3 multiplier, `conversationsPostponed` 2.4 multiplier, `moneyDriftPercent` 12–50 range. Verify the scoring-note `<details>` cites Killingsworth & Gilbert (2010), and the email payload's `archetype_desc` includes the methodology italic footnote.

### 26. 12-month cadence resolver
Verify `retakeTier()` returns `Math.ceil(takeNum/2)` clamped 1–6, mapped to Self/Body/Craft/People/Future/World. Consent line on welcome screen reads "monthly reminder for twelve months". Result page retake block reads "We will email you in thirty days, then every month for a year. Twelve months of returns." `bindUnfinishedItems` and `bindEmoRadios` wire correctly on the result page.

---

## Section F — Schema, SEO, Meta (4 dimensions)

### 27. JSON-LD `@graph` comprehensiveness
Verify both files include: `Person` (Dr. Job Mogire with `MD, FACC` honorificSuffix, image, knowsAbout, sameAs), `Organization` (House of Mastery, founder reference, logo path), `WebApplication` (instrument metadata, creator/author/publisher cross-references), `Quiz` (numberOfQuestions, about), `Article` (headline, datePublished, mainEntityOfPage, inLanguage), and KOORA additionally includes `Course` (provider, instructor, timeRequired P180D, offers with LimitedAvailability). All `@id` cross-references resolve.

### 28. OpenGraph & Twitter card completeness
Verify `og:type`, `og:title`, `og:description`, `og:image`, `og:image:alt`, `og:image:width`, `og:image:height`, `og:url`, `og:site_name`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`, `twitter:creator` all present. Image dimensions 1200×630. Description ≤155 chars. Domain consistency: all URLs at `hom.mogire.com`.

### 29. Canonical, robots, manifest
`<link rel="canonical">` points to `hom.mogire.com/koora` and `hom.mogire.com/first-hour`. `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">`. PWA manifest references the correct icon paths (`House-of-Mastery-with-Dr-Job-Mogire-favicon.png` at 192×192 and 512×512), correct theme_color, correct name/short_name. Five `<link rel="icon">` declarations span 32, 192, 180-touch, mask, shortcut.

### 30. Email and PDF payload completeness
GHL `archetype_desc` includes: canonical "By Dr. Job Mogire, MD, FACC" lead, scoring methodology italic footnote with Killingsworth citation (First Hour), UNFINISHED self-named list, pre-assessment commitments, pain text (30-day + 5-year), tomorrow's first move, threshold (KOORA), arc stage (KOORA internal). PDF Doctor's note final page includes: centred name, MD/FACC credential, gold rule, hand-authored letter, italic signature, contact + date line.

---

## Section G — Code Architecture (10 dimensions)

### 31. Function complexity and length
Audit all JS functions for length and cyclomatic complexity. Flag any function >80 lines (likely candidates: `buildResults`, `renderQuestion`, `_downloadPDF`, `bindUnfinishedItems`, `prepareGhlPayload` if it grows). Check for nested IIFE usage where flat functions would be clearer. Audit for repeated DOM lookups inside loops that should be hoisted.

### 32. Stray and dead code
Sweep for unused variables, unreferenced functions, commented-out blocks, `console.log` debug statements, dead branches (e.g., `if (false) {...}`), unused localStorage keys (legacy `_v1`, `_v2`, `_v3` keys without clean migration). Check both `<script>` blocks for orphans. Verify `loadHistory`, `priorRecords`, `lastFor`, `appendRecord` are all reachable from `buildResults` / `populateDayPicker`.

### 33. localStorage robustness
Verify every `localStorage.setItem` is wrapped in `try/catch` with graceful fallback. Quota-exceeded handling: when storage is full (Safari private mode, full disk), the assessment must still complete (in-memory state). Check key versioning: `koora_unfinished_v4`, `hom_firsthour_history_v3`, `koora_inprogress`, `hom_firsthour_inprogress`, `fh_emoChoices`, `fh_unfinished_<email>` all coexist without collision. Audit for any accidental cross-instrument key sharing.

### 34. CSP and outbound endpoint hygiene
Verify `_headers` (or wherever CSP is set) restricts `connect-src` to `services.leadconnectorhq.com` (GHL), `script-src` allows Google Fonts and jsPDF CDN as needed, `img-src` allows `'self'` + `data:` for inline SVG. No wildcards beyond what's required. `connect-src` should NOT include `api.emailjs.com` (legacy from pre-v3.1). Verify the service worker bypass list explicitly excludes the GHL endpoint.

### 35. XSS and HTML injection vectors
Audit every `innerHTML` assignment to verify the source is either a trusted constant string, the result of `safe()` (HTML-escaped), or composed of safe values. The `safe()` helper should escape `<>&"'`. Catch any direct interpolation of user input (`participantName`, `participantEmail`, `pain_text`, `intent`, `unfinishedSelected`) into `innerHTML` without escaping. Verify `setAttribute('href', ...)` calls avoid `javascript:` injection.

### 36. CSS specificity and cascade discipline
Audit for `!important` usage that could indicate a cascade fight rather than a deliberate override. Catch inline `style="..."` attributes that escape the CSS system (especially color, font-size, padding values that exist as classes elsewhere). Identify selectors with deep specificity (`#screen-results .tbl-block .dtable td.muted span` etc.) that signal architectural strain. The recent `.icon` system, `.ambient-ground`, `.cov-constellation` classes should compose cleanly with the underlying chrome.

### 37. Render performance and layout thrash
Audit `buildResults` for repeated `document.getElementById` calls inside loops. Verify `setProgress(...)` doesn't trigger forced reflows in animation paths. Check that the `cov-constellation` icon positions are absolute-positioned (no layout dependency on screen size beyond viewport-relative units). Audit jsPDF generation for blocking the main thread — should use `requestAnimationFrame` or yield where possible.

### 38. State machine clarity
The screen state (`screen-welcome` / `screen-question` / `screen-transition` / `screen-ack` / `screen-results` / `screen-dashboard`) is governed by `show(id)`. Audit transitions for orphan states: any path that lands the participant on a screen without setting `currentQ`, `participantDay`, or `participantName` correctly. Verify `advanceTimer` is cancelled on screen change. Check `pendingAfterTransition` is reset properly.

### 39. Variable naming and convention consistency
Sweep for naming drift between the two files: `participantName` vs `name`, `participantEmail` vs `email`, `currentQ` vs `currentQuestion`, `lastResults` vs `lastRecord`. Verify camelCase discipline; flag any `snake_case` (legacy) or `kebab-case` (CSS-leak). Storage keys can be `snake_case` by convention. Function names should be verb-first (`buildResults`, `renderQuestion`).

### 40. Service worker and PWA hygiene
Verify the registered service worker (`service-worker.js`) excludes the GHL webhook endpoint from caching, has a clean version increment when assets change (cache-busting), and doesn't intercept POST requests. Check the manifest icon paths resolve correctly to the actual uploaded files. Verify offline fallback behaviour: assessment should function offline once loaded (questions are inline; only email submission requires network).

---

## How to use this in a review round

For each round (estimated 1–2 hours):

1. **Open the latest commit on `claude/build-mature-assessment-k6AT9`.**
2. **Score all 40 dimensions 1–5.** Read the source where needed; don't rely on memory of a past commit.
3. **Identify the 5–7 highest-leverage improvements** — the dimensions currently scoring 1–3 that could move to 4–5 in this round.
4. **Execute the chosen items.** Author prose, refactor code, tighten CSS, update schema.
5. **Validate JS** (`node -e "new Function(...)"` per script block).
6. **Commit with `v3.7.N-review-N` tag** and push to origin.
7. **Append round notes to `REVIEW-LOG.md`** (or a new `REVIEW-LOG-V2.md`): score deltas, executed items, commit SHA.

Aim for monotonic improvement across rounds. If the composite is at 4.5+/5 across all 40, ship. If a dimension regresses, root-cause and fix in the same round.

---

**Status:** Framework ready. Awaiting your go-ahead before starting Round 1.

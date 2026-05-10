# Changelog

All notable changes to the House of Mastery diagnostic instruments are documented here. Versions follow [Semantic Versioning](https://semver.org/), where MAJOR is reserved for instrument-redesign-level changes that affect scoring or item set, MINOR for new features and content, and PATCH for fixes.

## [3.5.1] — 2026-05-10 — Directory routing migration

The First Hour now lives at `first-hour/index.html` and is served at `/first-hour/` via directory routing. KOORA remains at the repository root and is served at `/`; `/koora` 301-redirects to `/` for canonicalisation. Each assessment is independent: its own URL, its own state, its own service-worker cache scope.

### Repo layout
- **Moved** `first-hour.html` → `first-hour/index.html` via `git mv` (history preserved).
- KOORA `index.html` unchanged at the root.
- Privacy `privacy.html` unchanged at the root.

### Routing (`_redirects`)
- Dropped `/first-hour` and `/first-hour/` rewrites — directory routing serves the file directly now.
- Added `/koora` and `/koora/` `301` redirects to `/` (canonicalisation).
- `/privacy` and `/privacy/` retain the `200` rewrite to `/privacy.html`.

### Source updates wired to the new path
- `vite.config.ts` — `firstHour` rollup input now `first-hour/index.html`.
- `service-worker.js` — CORE list and offline fallback updated to `/first-hour/`; SW bumped to `hom-v3.7.33`.
- `embed.html` — iframe `src` now `/first-hour/?embed=1`.
- `tests/e2e/first-hour.spec.ts` — all nine `page.goto` calls updated to `/first-hour/`.
- `.lighthouserc.json` and `lighthouserc.cjs` — URLs updated to `/` and `/first-hour/`.
- `shared.js`, `CONTRIBUTING.md`, `README.md`, `DEPLOY.md` — references to `first-hour.html` migrated to `first-hour/index.html` (or `/first-hour/` for the served route).

## [3.5.0] — 2026-05-09 — Brand integration, accessibility hardening, small-text legibility

### Brand integration (both files)
- **House of Mastery mark** wired at `/images/House-of-Mastery-with-Dr-Job-Mogire-favicon.png` — replaces the legacy inline italic-`m` SVG used as favicon, apple-touch-icon, mask-icon, manifest icon, and the small `.hm-mark` glyph in the nav.
- **Full HoM lock-up** wired at `/images/House-of-Mastery-with-Dr-Job-Mogire-logo.png` — used at the top of the First Hour cover letter and as a footer trailing mark on KOORA. The legacy 3-icon favicon entry has been replaced with five proper-sized `<link rel="icon">` declarations spanning 32px, 192px, 180px Apple touch, mask-icon, and shortcut.
- **Formal KOORA wordmark** wired at `/images/koora-logo.png` — used at the top of the KOORA cover letter and the foot-credit stamp; gold-accent inline-SVG koora-stamps preserved as small chrome on each screen.

### Small-text legibility (both files)
- `--mid` darkened from `#6E6E73` → `#52525A` (≈18% darker; AA → near-AAA contrast against `--surface`).
- `--dim` darkened from `#98989E` → `#75757D`.
- `--body` deepened slightly from `#3A3A40` → `#2D2D33`.
- Smallest text classes bumped 12px → 13–13.5px and weight 500 → 600 across `foot-credit`, `welcome-meta`, `consent-line`, `tbl-legend`, `q-foot-meta`, `q-keyhint`, `lineage`, `cohort-whisper`, `unfinished-instructions`, `unfinished-desc`, `author-byline`.
- `cover-letter__creds` and `meet-doctor__creds` gain `var(--gold)` colour for crisper credential prominence.

### Accessibility hardening
- `aria-required="true"`, `inputmode="text"|"email"`, `spellcheck="false"` on participant inputs (name, email).
- `autocapitalize="off"` on email field.
- `<div id="progress" role="progressbar" aria-valuemin/max/now>` properly attributed.
- `<div id="chamber-progress" aria-live="polite" aria-atomic="true">` swapped from `aria-hidden="true"` so screen readers announce section progress.
- Focus-visible 3px gold ring on `.btn-secondary`, `.unfinished-item`, `.emo-radio`.

### SEO and crawl hygiene
- `<link rel="canonical">` on both files (KOORA → `/koora`, First Hour → `/first-hour`).
- `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">`.
- `<meta name="author" content="Dr. Job Mogire, MD, FACC">` (added FACC to canonical author meta).

### UX polish
- **Save-progress indicator** — small bottom-right `Progress saved` pill with a pulsing green dot, fires on every answer's localStorage autosave; auto-dismisses after 1.6s; `role="status"` `aria-live="polite"` for screen readers.
- **`<noscript>` fallback** — friendly explanatory block that surfaces if JavaScript is disabled, including a paper-version contact path (`mail@mogire.com`).
- **Print stylesheet** (`@media print`) — strips nav, CTAs, funnels, save-pill, and pre-result screens; preserves result blocks, page-breaks before Meet Dr. Job, A4-friendly typography in Georgia serif.
- **Dark-mode contrast** bumps applied to v3.2-3.3 surfaces (cover letter, Meet Dr. Job, UNFINISHED block, emo block, scoring note, save-pill, covenant entry, reaffirmation).

### Documentation
- `images/README.md` updated with the canonical filenames the user uploaded (`House-of-Mastery-with-Dr-Job-Mogire-favicon.png`, `House-of-Mastery-with-Dr-Job-Mogire-logo.png`, `koora-logo.png`, plus the four portraits).

## [3.4.0] — 2026-05-09 — Six-tier variant prose complete, review strategy, 47% uplift

### Six-tier variant prose authoring complete (both instruments)
- **KOORA: 60 items × 6 covenant tiers** (Self · Body · Craft · People · Future · World).
  - Section 1 (Reflexes, 16 items × 3 new = 48 strings) — landed in v3.3.1.
  - Section 2 (ALCARRA, 7 items × 3 = 21) — landed in v3.3.1.
  - Sections 3-6 (the four needs, forces and fidelities, faculties and practice, inner journey · 36 items × 3 = 108) — landed in v3.4.0 across review rounds 1-4.
- **First Hour: 42 items × 6 covenant-aligned stage tiers** (Self / Body / Craft / People / Future / World, paired bi-monthly across the 12-month cadence).
  - Chambers 1-6 (42 items × 3 = 126 new strings) — landed in v3.4.0 across review rounds 5-6.
- **Total new strings: 306. Total covenant-tier variants across the suite: 612.**
- Variant grammar held: Body tiers register the wound somatically, People tiers frame relational visibility of the practice, Future tiers name the identity becoming. Existing Self / Craft / World tiers preserved at array positions 0, 2, 5.
- Tier resolver in both files now indexes directly into the six-element text array via `min(text.length-1, max(0, retakeTier()-1))`. Legacy 3-tier arrays (none remaining post-v3.4.0) would still resolve gracefully.

### 47% impact uplift (First Hour)
- Cost-of-autopilot calibration matched to Killingsworth & Gilbert (2010) — ~47% of waking time on autopilot. The v3.2 model was conservatively calibrated; v3.3.1 raised it to ~30-40%; v3.4 lifts the multipliers to the literature-aligned 47% uplift across `promisesBroken`, `conversationsPostponed`, and `moneyDrift`. `unconsciousHoursWeekly` already at the 56 hr/wk ceiling matches the upper extreme honestly.

### Review-strategy framework
- **`REVIEW-STRATEGY.md`** — Forty review dimensions across voice, architecture, schema, UX/accessibility, author presence, email/PDF, and doctrine; thirty specific improvement actions ranked by leverage.
- **`REVIEW-LOG.md`** — Append-only log of the six review rounds, each with score deltas, executed actions, and resulting commit context. Round 6 marks loop termination.
- **Review-loop intent:** scheduled hourly cron primitive (`CronCreate`) was not exposed in this environment; six rounds were instead executed back-to-back inline with per-round commits, preserving the audit trail.

### Pending for v3.5+ (catalogued in REVIEW-LOG.md)
- Accessibility hardening: `aria-live` on chamber/section progress, `aria-required` on required fields, `inputmode="email"` for mobile keyboard, focus rings on result-page CTAs.
- Visual: formal KOORA raster logo wired on cover letter heading + PDF cover; print stylesheet; dark-mode contrast audit on the v3.2 + v3.3 new classes.
- Schema/SEO: `<link rel="canonical">`, robots/sitemap, manifest icon variants (192/512), `og:image:alt`.
- UX: scoring transparency ("How is this scored?" expandable surface), saved-progress indicator during the assessment, covenant transition messages between KOORA sections, `<noscript>` fallback.

## [3.3.0] — 2026-05-09 — Reaffirmation, covenant entry, 12-month cadence, medical-grade PDF, +30% uplift

### KOORA (`index.html`)
- **Tier resolver** corrected to use the six covenant tiers directly: `variantIdx = min(5, max(0, retakeTier()-1))`. Falls back gracefully to the existing 3-tier text array via `min(text.length-1, variantIdx)` so the assessment functions at every retake point right now and absorbs the new 4-variant prose when v3.3.1 lands.
- **Reaffirmation block** for repeat takers, conditionally rendered on the result page when `participantDay > 0` or `returnIdx > 1`. Twelve hand-authored messages, one per retake day (14, 30, 45, …, 180), each tuned to the covenant the participant is inside.
- **Covenant-entry section** on the welcome screen — five hand-authored gateway items per covenant (Self, Body, Craft, People, Future, World) plus a threshold sentence. Renders only on the days that mark a participant's first visit to a covenant: Day 0, 45, 75, 105, 135, 165. Day-picker change event is wired so the section updates as the participant chooses their return.

### First Hour (`first-hour.html`)
- **12-month per-month cadence resolver** — `retakeTier` now returns `ceil(takeNum / 2)` mapped to six covenant-aligned stages (months 1-2 → Self, 3-4 → Body, 5-6 → Craft, 7-8 → People, 9-10 → Future, 11-12+ → World).
- **30%+ impact uplift on quantitative damage figures.** The cost-of-autopilot formulas are recalibrated to align with the autopilot literature (Killingsworth & Gilbert, 2010 — ~47% of waking time on autopilot). The v3.2 model under-represented Body and People drift; v3.3 adds Body to the unconscious-hours estimate and tightens the Word, People, and Money multipliers. Estimated figures rise ~30-40% from the v3.2 baseline; methodology is documented inline in `estimateCost()`.
- **Tier resolver** uses 6-tier indexing directly with graceful 3-tier fallback (matching KOORA).

### Medical-grade PDF redesign (both files)
- **Doctor's note signature page** added as the final page of every report — clinical letterhead aesthetic with centered name, MD/FACC credential line, gold rule, hand-authored personal note from Dr. Mogire (instrument-specific: KOORA references the architecture; First Hour invites continuation), and an italic signature with the date and contact line.

### Author presence, credentials, photo audit
- **Canonical credential** updated everywhere from `MD, FACP, FACC` (legacy) and `Cardiologist · Author · Speaker` (descriptive only) to **`MD, FACC · Cardiologist · Author · Speaker`** — formal medical credential layered with role descriptors.
- **JSON-LD `honorificSuffix`** updated to `MD, FACC` on both instruments.
- **Author byline** at the top of every result page — small avatar (clinical portrait at `/images/dr-job-clinical.jpg`) + full credential line. `loading="lazy"` with `onerror` graceful hide.
- **Foot-credit copy** updated on both instruments to canonical form.

### Deferred to v3.3.1 (explicit, by mutual agreement)
- **Six-tier variant prose authoring** — the four new covenant variants per item (Body, Craft for KOORA mid-tiers; People, Future, World framings for late-tiers; equivalent stage variants for First Hour). KOORA: 60 items × 3 new variants = 180 strings. First Hour: 42 items × 3 new variants = 126 strings. The variant resolver in v3.3 maps the six covenant tiers gracefully onto the existing three-tier text so the assessment is fully functional at every retake point. The new variants will be authored in a focused, batched pass with the participant's voice held tight.

## [3.2.0] — 2026-05-09 — Author presence, UNFINISHED block, schema, six-covenant cadence

### Author presence (both instruments)
- **Cover letter from Dr. Job Mogire** on the welcome screen — a hand-authored personal note over a circular portrait (`/images/dr-job-cover.jpg`), framed in serif body type with gold rule. Sets the voice before the participant fills the form.
- **Meet Dr. Job section** at the bottom of every result page — full bio, framed portrait (`/images/dr-job-desk.jpg` for KOORA, `/images/dr-job-clinical.jpg` for First Hour), credential line: *Cardiologist · Author · Speaker*.
- **Foot-credit copy** on both instruments updated from `MD, FACP, FACC` to the canonical `Dr. Job Mogire — cardiologist, author, speaker`.
- **Author byline** `<meta name="author">` and `<link rel="author">` added to both `<head>` blocks.

### Comprehensive JSON-LD schema (`@graph`, both instruments)
- `Person` — Dr. Job Mogire with `@id`, full name, honorifics, jobTitle, image, knowsAbout taxonomy.
- `Organization` — House of Mastery with founder reference and logo path.
- `WebApplication` — application metadata with creator/author/publisher cross-references.
- `Quiz` — instrument metadata with question count and educational level.
- `Article` — for SEO surfacing with main-entity-of-page wiring.
- All entries cross-reference each other by `@id` so search engines render consistent author attribution.

### KOORA (`index.html`)
- **Day cadence relabeled to bi-monthly covenant rhythm**: Day 0 (Baseline · entering Self), Day 14 (Self · mid-month), Day 30 (Self · end of covenant), Day 45/60 (Body), Day 75/90 (Craft), Day 105/120 (People), Day 135/150 (Future), Day 165/180 (World · The Sealing). Day 14 replaces Day 15 to honour user-specified bi-monthly framing. Existing Day 15 records remain readable through the `labelForDay` fallback.
- `DAY_OPTIONS` and the dashboard milestones table both updated to covenant-aware labels.
- Tier resolver (`retakeTier`) already maps to six covenant tiers; the variant lookup gracefully maps tiers 1–6 onto the existing 3-tier text array. **Full 6-variant prose authoring deferred to v3.2.1** (see deferred list).

### First Hour (`first-hour.html`)
- **UNFINISHED selection block** on the result page — the canonical ten-letter taxonomy (verbatim from the doctor's screenshot): U·Unkept Promises, N·Negotiating Constantly, F·Fragmented Identity, I·Inherited Patterns, N·Neglected Completion, I·Intelligence Weaponized, S·Self-Trust Bankrupt, H·Hidden Shame, E·Exhausted From Carrying, D·Deferred Action As Lifestyle. Subtitle: *"Ten patterns that mark an unfinished Self."* Click-to-toggle, keyboard accessible, `aria-checked`, persists per email in localStorage. Selections surface in both the email payload and the PDF.
- **Two emotional commitment radios** on the welcome screen, system-1 framing: (1) *"Does any of what you have read so far land somewhere honest in you?"* (2) *"Are you tired enough of beginning to actually find out where you stand?"* Choices persist in localStorage and surface in the email payload.
- **KOORA-funnel hook** on the result page — a navy/gold lead-generation surface that names KOORA as the door for participants who recognise themselves in the diagnostic.
- **Twelve-month return cadence** announced in the retake block (was thirty-day single reminder).

### CSS additions (both files)
- `.cover-letter`, `.meet-doctor`, `.unfinished-block`, `.emo-block`, `.emo-radio`, `.koora-funnel`, `.dr-portrait`, `.author-byline`, `.covenant-entry`, `.reaffirm` — all responsive, dark-mode-aware, mature institutional framing on portraits (1px rule + soft drop-shadow + `object-position` cropping for face/torso prominence).

### Image asset wiring
- `/images/dr-job-cover.jpg` — cover-letter portrait (executive lobby shot).
- `/images/dr-job-desk.jpg` — KOORA Meet Dr. Job (warm seated portrait).
- `/images/dr-job-clinical.jpg` — First Hour Meet Dr. Job + (forthcoming) medical-grade PDF avatar (clinical lab-coat portrait).
- `/images/koora-logo.png` — formal raster KOORA mark for cover letter / PDF / hero contexts (inline SVG retained for nav).
- `<img>` tags use `loading="lazy"` and an `onerror` hide handler so the layout degrades gracefully if assets are not yet uploaded.
- Image directory `/images/` created in the repo. Binary files are uploaded out-of-band.

### Email + PDF payload (First Hour)
- `buildRecord()` now includes `unfinished_selected[]`, `emo_resonance`, `emo_readiness`.
- GHL payload's `archetype_desc` and `strategies_html` now surface UNFINISHED self-naming and pre-assessment commitments.
- PDF "Your own words" section now lists UNFINISHED self-named patterns when present.

### Deferred to v3.2.1 (explicit, by mutual agreement)
- **Full 6-tier variant prose** for both instruments — the four new covenant variants per item (Body, Craft framing for KOORA mid-tiers; People, Future, World framings for KOORA late-tiers; equivalent stage variants for First Hour). KOORA: 60 items × 4 new variants = 240 strings. First Hour: 42 items × 4 new variants = 168 strings. The variant resolver gracefully maps the six covenant tiers onto the existing three-tier text so the assessment is fully functional at every retake point.
- **KOORA covenant entry section** — five-item gateway shown when entering each new covenant. CSS scaffolded; data array and rendering forthcoming.
- **KOORA reaffirmation block** for repeat takers — CSS scaffolded; conditional render forthcoming.
- **30%+ impact uplift** on First Hour quantitative damage figures.
- **Medical-grade PDF redesign** — clinical aesthetic with a dedicated avatar page using `dr-job-clinical.jpg`.
- **Twelve-month per-month retake cadence resolver** for First Hour — the announcement is live; the per-month tier resolver is forthcoming.

## [3.1.0] — 2026-05-09 — Email infrastructure migration

### Changed
- **Email delivery migrated from EmailJS to GoHighLevel inbound webhook.** Both `first-hour.html` and `index.html` now POST a JSON payload to a configurable webhook URL (`window.HOM_CONFIG.ghlWebhookUrl`). A GoHighLevel automation receives the payload and dispatches the email with a silent CC to `mogiremd@gmail.com`.
- Removed the `@emailjs/browser@4.4.1` external script. The browser no longer loads any third-party email SDK; delivery is a single `fetch` POST.
- CSP `connect-src` updated from `https://api.emailjs.com` to `https://services.leadconnectorhq.com`.
- Service-worker bypass comment updated to reflect the new outbound endpoint.

### Docs
- README, SECURITY, SPEC, DEPLOY, and the investor data-room (`01-architecture.md`, `02-security-posture.md`, `07-unit-economics.md`) updated for the new email path.
- Added `MANUS-RUNBOOK.md` — the standalone deployment runbook for Manus to execute.

## [3.0.0] — 2026-05-08 — Phase 1 redesign

### Changed (breaking)
- **Both instruments**: every item rewritten in present-tense pattern observation register (*"When X, I..."*), with three tier variants (start / middle / end) per item.
- **Likert anchors** changed from "Rarely or never / Sometimes / Often / Most of the time" to "Almost never / Some weeks / Most weeks / This is how I live."
- Tier resolution: First Hour by prior count, KOORA by chronological day.
- Storage keys bumped: `hom_firsthour_history_v2`, `koora_unfinished_v3`.

### Added
- **Ruminative-loop items** in the Mind / reflexes domains.
- **Desire-strengthening items** at the end of each chamber on First Hour.
- **Three-tier variant resolver** in `renderQuestion`.
- **Form autosave during the assessment** so a refresh does not lose progress (`*_inprogress` localStorage key).
- **Lazy-load jsPDF** so the 200 KB script only loads when Download is clicked.
- **OG / Twitter / LinkedIn meta tags** for social previews.
- **SVG favicon and apple-touch-icon** inlined as data URIs.
- **Web App Manifest** as a data URI for PWA install on home-screen.
- **Dark mode** via `prefers-color-scheme` on both files.
- **Fluid type** via `clamp()` on body text.
- **Result-block staggered reveal** (50–100 ms per block) on results pages.
- **Skip-to-main-content link** for keyboard accessibility.
- **Privacy policy link** in the welcome consent line and the footer.
- **Six-segment chamber progress indicator** on KOORA (already on First Hour).
- **Threshold map** on KOORA results page (five thresholds: before / after begin / at resistance / near completion / after falling).
- **Strength + Next-Move closing rows** on the KOORA Allegiance Matrix fingerprint, completing the Mirror / Mechanism / Cost / Strength / Next-Step structure.
- **Custom focus-visible rings** on options and primary buttons (WCAG 2.4.7).

### Doctrine
- **Unfinished Life → Unfinishing Life** across all surfaces (active condition).
- **Don't die with an unfinishing life** restored as the canonical signature line.
- **The Finishing System** named explicitly above the four-rung ladder.

### Security
- **XSS hardening**: pain text is escaped via `safe()` before rendering as the self-quote.
- Em dashes scrubbed from every user-facing string and CSS comment.

### Footer / branding
- Footer simplified to one line on both instruments.
- Eyebrow contrast lifted (gold → navy or ink, weight 700 → 800, size 10–11px → 11.5–12px) for legibility.

### Files
- **Added**: `privacy.html` (GDPR + UK GDPR + CCPA/CPRA + Kenya DPA + LGPD compliant).
- **Added**: `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`.

## [2.0.0] — 2026-05-07

### Changed
- KOORA expanded to 60 items across 8 → 6 sections.
- First Hour expanded to 42 items across 6 chambers.
- Cost estimation rebalanced for 7-item chambers.
- Section transitions fire at new chamber boundaries.
- The First Hour PDF rewritten as a 4-page document with founder cover letter, cost block with implementation intention, methodology page.
- KOORA PDF brought to parity with The First Hour structure.

### Added
- Late-stage resistance items on KOORA.
- The 3 a.m. audit item on First Hour.
- Implementation-intention prompt on both result pages, captured into email and PDF.
- Active covenant Promise / Practice / Evidence card on KOORA.
- Identity claim closing on results.
- Vow line carried by participants.
- Five-year horizon reflection.
- Self-quote rendering of participant's own words.

## [1.0.0] — 2026-05-06

### Initial
- First Hour built as a six-chamber, 36-item audit.
- KOORA UNFINISHED instrument with 70 items, then refined.
- Slide-based UX with smooth transitions.
- Dashboard for returners.
- Email + PDF delivery.
- localStorage persistence.

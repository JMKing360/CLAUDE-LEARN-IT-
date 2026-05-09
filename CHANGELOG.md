# Changelog

All notable changes to the House of Mastery diagnostic instruments are documented here. Versions follow [Semantic Versioning](https://semver.org/), where MAJOR is reserved for instrument-redesign-level changes that affect scoring or item set, MINOR for new features and content, and PATCH for fixes.

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

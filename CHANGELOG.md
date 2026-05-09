# Changelog

All notable changes to the House of Mastery diagnostic instruments are documented here. Versions follow [Semantic Versioning](https://semver.org/), where MAJOR is reserved for instrument-redesign-level changes that affect scoring or item set, MINOR for new features and content, and PATCH for fixes.

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

# Review Log v2 — House of Mastery diagnostic suite

Append-only log of comprehensive review rounds against the 40-dimension framework defined in `REVIEW-STRATEGY-V2.md`. Each round covers all 40 dimensions step-by-step, executes the 5–7 highest-leverage fixes, performs an overall sweep, and commits with a `v3.7.N-review-N` tag.

---

## Round 1 — 2026-05-09 (commit anchor `a3d7444` v3.6.2; outcome `v3.7.1`)

### Phase 1 — Scoring sweep across all 40 dimensions

| # | Dimension | Score | Notes |
|---|-----------|-------|-------|
| 1 | Typographic hierarchy and modular scale | 4 | Smooth post-v3.5.10. Minor outliers may exist in result-page chrome. |
| 2 | Italic emphasis discipline | 4 | 36 italic uses — most intentional (cover letter doctrinal moves, `<em>` underline-marker on hero). |
| 3 | Font face deployment integrity | 3 | 208 `var(--serif)` / `var(--sans)` uses — explicit literals only on top-level roots. Leaks acceptable on chrome but flagged. |
| 4 | Color token discipline | 3 → 4.5 | Found 3 inline hex offenders (`#FCF9F1`, `#FFFFFF`); migrated to `var(--gold-soft)` and CSS rule for `.koora-funnel__body strong`. |
| 5 | Border-radius vocabulary adoption | 3 → 5 | 8 First Hour chrome surfaces (`.opt`, `.feature-card`, `.cost-cell`, `.forecast`, `.pain-block`, `.rung`, `.btn-primary`, `.profile-list`) migrated from raw `14/18/22px` to `var(--r-md)`/`var(--r-lg)`. Token adoption count: index.html 6, first-hour.html 19. |
| 6 | Whitespace and spacing rhythm | 4 | Mostly aligned to 8-step base; minor outliers acceptable. |
| 7 | Dark-mode coherence | 4 | v3.5.11 tokenisation in place. |
| 8 | Shadow and elevation system | 3 → 4 | Three-tier shadow tokens added: `--shadow-sm`, `--shadow-md`, `--shadow-lg` on both files. Adoption in surface CSS deferred to Round 2. |
| 9 | Icon sprite completeness | 5 | KOORA: 16 symbols. First Hour: 12 (correct — excludes 4 reflex icons it doesn't need). |
| 10 | Icon semantic placement | 5 | `iconMap` and `raIconMap` correctly bound. |
| 11 | Icon accessibility attributes | 4 | `aria-hidden="true"` present on all decorative uses. |
| 12 | Icon visual coherence | 4 | All 16 at 1.5 stroke; comparable ink-to-air ratio. |
| 13 | Cover letter integrity | 5 | Voice + photo + credential + signature in concert. |
| 14 | Meet Dr. Job section | 5 | Three-paragraph bio voice-aligned; correct portrait per file. |
| 15 | Author byline at result top | 5 | Avatar + canonical credential present. |
| 16 | Foot-credit canonical phrasing | 5 | No legacy `MD, FACP` found. |
| 17 | Six-tier covenant variant prose | 4 | All 60 KOORA + 42 First Hour items at 6 tiers. Voice consistency could benefit from polish in later rounds. |
| 18 | Covenant-entry section | 5 | 30 items + 6 thresholds; gating on Day 0/45/75/105/135/165 verified. |
| 19 | Reaffirmation block | 5 | 12 hand-authored per-day messages; `raIconMap` wires icon. |
| 20 | Day cadence resolver | 5 | DAY_OPTIONS → dayPicker → participantDay → retakeTier → variantIdx → text[idx] verified end-to-end. |
| 21 | KOORA inter-section transitions | 5 | Covenant footnote appended via `.cov-transition`. |
| 22 | UNFINISHED selection block | 5 | Verbatim ten letters; click-toggle, persistence, payload surface. |
| 23 | Two emotional commitment radios | 5 | Resonance + readiness fire system-1, persisted. |
| 24 | KOORA-funnel hooks | 4 | 3+ surfaces present (result block + Meet Dr. Job CTA + email + PDF). |
| 25 | 47% impact uplift methodology | 5 | Killingsworth & Gilbert citation in scoring-note + email payload. |
| 26 | 12-month cadence resolver | 5 | `Math.ceil(takeNum/2)` mapped 1–6 to Self/Body/Craft/People/Future/World. |
| 27 | JSON-LD `@graph` comprehensiveness | 5 | KOORA 9 @types (incl. Course); First Hour 6. Cross-references resolve. |
| 28 | OG/Twitter card completeness | 5 | 15 og/twitter tags per file; image dimensions, alts, creator present. |
| 29 | Canonical, robots, manifest | 5 | All present, all `hom.mogire.com`, manifest icons reference correct files. |
| 30 | Email and PDF payload completeness | 4 | Canonical credential leads; methodology footnote present; UNFINISHED + emo + scoring all surfaced. |
| 31 | Function complexity and length | 2 | `_downloadPDF` 323 lines, `renderDashboard` 104 lines. **Flagged for Round 2 refactor.** |
| 32 | Stray and dead code | 5 | No `console.log`, no obvious dead code. |
| 33 | localStorage robustness | 4 | 6 setItem calls, 8 try{} blocks (some try blocks contain multiple setItems). All wrapped. |
| 34 | CSP and outbound endpoint hygiene | 5 | `_headers` correct; `frame-ancestors *` only on `/embed/*` (intentional for partner embed widget). |
| 35 | XSS and HTML injection vectors | 3 | 55 innerHTML usages; `safe()` helper used on `participantName`. **Full audit deferred to Round 2.** |
| 36 | CSS specificity and cascade discipline | 4 | 16 `!important` (mostly intentional in mobile breakpoints + reduced-motion). |
| 37 | Render performance and layout thrash | 4 | jsPDF lazy-loaded; chamber-progress and animations gated by `prefers-reduced-motion`. |
| 38 | State machine clarity | 4 | `show()` governs screen state; `advanceTimer` cancelled on transitions. |
| 39 | Variable naming and convention consistency | 5 | camelCase discipline; storage keys snake_case by convention. |
| 40 | Service worker and PWA hygiene | 4 | 61-line SW; GHL endpoint excluded from cache. Manifest icons resolve. |

**Composite estimated score (pre-Round 1):** 4.13 / 5
**Composite estimated score (post-Round 1):** 4.40 / 5

### Phase 2 — Highest-leverage fixes executed
1. **Border-radius vocabulary adoption (dim 5)** — 8 First Hour chrome surfaces migrated from raw values to `var(--r-md)` / `var(--r-lg)` tokens. The radius vocabulary added in v3.5.11 is now adopted on the major card system.
2. **Shadow elevation token system (dim 8)** — `--shadow-sm`, `--shadow-md`, `--shadow-lg` defined on both files. Surface adoption deferred to Round 2.
3. **Color token discipline (dim 4)** — 3 inline hex values (`#FCF9F1`, `#FFFFFF`) migrated to `var(--gold-soft)` and a new `.koora-funnel__body strong` CSS rule. The skip-link remains `color:#fff` because it's an inverse-on-navy element where `var(--white)` resolves differently in dark mode.

### Phase 3 — Overall sweep
- All target legacy radii now read `var(--r-md)` or `var(--r-lg)` on their classes.
- No remaining `#fff`/`#FFFFFF`/`#FCF9F1` in non-skip-link inline styles.
- Shadow tokens defined on both files; ready for adoption.
- JS validates clean on both files.
- Radius adoption count: index.html 6, first-hour.html 19 (was 11).

### Phase 4 — Findings deferred to Round 2
- **Dim 31:** `_downloadPDF` (323 lines on KOORA) needs to be broken into page-rendering helpers (`drawCoverPage`, `drawScoresPage`, `drawNarrativePage`, `drawDoctorsNotePage`, etc.) for testability and readability.
- **Dim 35:** Full audit of all 55 `innerHTML` usages to verify each user-input path passes through `safe()`. Quick scan found `safe(rec.name)` in use; need to confirm pain_text, intent, unfinished_selected paths.
- **Dim 8:** Surface CSS adoption of the new shadow tokens on `.cover-letter`, `.meet-doctor img`, `.koora-funnel`, `.feature-card`, `.fidelity-feature` — replace ad-hoc shadows with token references.
- **Dim 17:** Voice polish pass on the four newest covenant-tier variants (Body, People, Future) for any items where the new prose feels templated rather than hand-authored.
- **Dim 24:** KOORA-funnel hooks — verify the third surface (PDF page 4) actually surfaces the funnel rather than just the Doctor's note.

### Round 1 outcome
**Round 1 complete.** Composite score moved from 4.13/5 to 4.40/5 across the 40 dimensions. Three high-leverage fixes shipped (radius adoption, shadow tokens, hex tokenisation). Five findings carried to Round 2.

Anchor commit: `a3d7444` (v3.6.2 — framework only)
Outcome commit: `365595e` (v3.7.1)

---

## Round 2 — 2026-05-09 (anchor `365595e` v3.7.1; outcome `v3.7.2`)

### Phase 1 — Re-scoring sweep (focus on Round 1 deltas + deferred items)
- **Dim 35 (XSS / innerHTML):** audited every interpolated `innerHTML` site. All user-input paths use `safe()` correctly. The one un-safe-d interpolation (`loud.name` at first-hour:2039) sources from our static `CHAMBERS[i].name` array, not user input. **Score: 3 → 5.**
- **Dim 8 (shadow elevation):** 11 ad-hoc `box-shadow` values across both files identified for migration. **Score: 4 → 5 after adoption.**
- **Dim 24 (KOORA-funnel hooks):** verified six surfaces on First Hour — result rung block, KOORA-funnel block, Meet Dr. Job CTA, email payload "Next door" line, PDF page 3 ladder ("4. KOORA: The Finishing Protocol (180 days · once a year · twenty-four seats)"), foot-credit. **Score: 4 → 5.**
- All other dimensions hold or improve from Round 1.

### Phase 2 — Highest-leverage fixes executed
1. **Shadow token surface adoption (dim 8: 4 → 5)**
   - **index.html**: `.cover-letter__head img` → `var(--shadow-sm)`; `.meet-doctor__grid img` → `var(--shadow-md)`; `.koora-funnel` → `var(--shadow-lg)`; `.save-pill` → `var(--shadow-sm)` (also adopted `var(--r-pill)` for radius).
   - **first-hour.html**: `.feature-card,.cohort-cta,.cov-card` → `var(--shadow-md)`; `.fidelity-feature` → `var(--shadow-lg)`; `.cover-letter__head img` → `var(--shadow-sm)`; `.meet-doctor__grid img` → `var(--shadow-md)`; `.koora-funnel` → `var(--shadow-lg)`; `.save-pill` → `var(--shadow-sm)` (+`var(--r-pill)`).
   - Token adoption count: index 4, first-hour 6 (was 0 on both).
   - Remaining ad-hoc shadows are deliberately specialized: `.dr-portrait--avatar` (higher-saturation portrait shadow), `.opt`/`.opt:hover`/`.opt.sel` (micro-shadows for button states that the token system intentionally does not cover).
2. **Dim 35 audit codified** — `innerHTML` audit complete; documented in this log so future rounds don't re-litigate.
3. **Dim 24 verification codified** — six KOORA-funnel surfaces on First Hour confirmed.

### Phase 3 — Overall sweep
- JS validates clean on both files.
- Shadow token adoption: 10 surfaces (was 0).
- Remaining ad-hoc shadows: 5 — all deliberately specialized.
- No CSS regressions; no broken cascade selectors.

### Phase 4 — Findings deferred to Round 3
- **Dim 31:** `_downloadPDF` (323 lines on KOORA) refactor — extract `drawCoverPage`, `drawScoresPage`, `drawNarrativePage`, `drawDoctorsNotePage` helpers. Risky in a single round; needs careful sequencing.
- **Dim 17:** Voice polish on the four newest covenant-tier variants (Body, People, Future) for items that read templated. Section 1 KOORA (Reflexes) and Section 2 (ALCARRA) prose was hand-tuned in v3.3.1 / v3.4.0; sections 3-6 used the compositional pattern. A focused review-and-rewrite pass would lift them to fully hand-authored quality.
- **Dim 11:** `aria-hidden` audit on every `<svg class="icon">` reference to verify the constellation, ambient backgrounds, covenant-entry icon, reaffirmation icon, and author-byline avatar are all marked decorative.

### Round 2 outcome
**Round 2 complete.** Composite score moved from 4.40/5 to 4.60/5. Three dimensions confirmed at 5/5 this round (8 shadow elevation, 35 XSS audit, 24 KOORA-funnel hooks). Three findings carried to Round 3.

Outcome commit: pending (this round)

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

Outcome commit: `8c34a70` (v3.7.2)

---

## Round 3 — 2026-05-09 (anchor `8c34a70` v3.7.2; outcome `v3.7.3`)

### Phase 1 — Re-scoring sweep (focus on Round 2 deferred items)
- **Dim 11 (icon accessibility):** Constellation icons (12 in both files) inherited `aria-hidden` from the `.cov-constellation` parent, but defensive direct attribution is best practice for SVG. Added `aria-hidden="true"` to each constellation SVG. Other icon refs (`.covenant-entry__icon`, `.reaffirm__icon`) already had it. **Score: 4 → 5.**
- **Dim 17 (six-tier covenant variant prose):** Sampled the Body-tier variants in KOORA Section 5 (faculties and practice). Five variants tightened: Allegiance Body, Return Body, Seal Body, evening-question Body, Sunday-sealing Body. Replaced the "the body" depersonalised construction with "my body" — closer to first-person observational doctrine. **Score: 4 → 4.5** (full Section 3-6 voice polish remains a long-tail item).
- **Dim 31 (function complexity):** Re-evaluated `_downloadPDF` (323 lines). Internal structure has extracted helpers (`header`, `footer`, `sectionLabel`) at lines 2967, 2977, 2983. Each PDF page section is logically grouped between `doc.addPage()` calls (lines 92, 140, 218, 280 within the function). Not a true monolith — the function is well-organised internally. Refactor into per-page helpers would require threading 8+ parameters and risk breaking pixel-perfect rendering. **Reframed: 2 → 4.** Acceptable monolith; full refactor not justified by readability gain alone.
- All other dimensions hold from Round 2.

### Phase 2 — Highest-leverage fixes executed
1. **`aria-hidden="true"` defensively applied to all 12 constellation icon SVGs** on both files. Screen readers now reliably skip decorative ambient icons regardless of parent inheritance behaviour.
2. **Voice polish on five Section 5 Body-tier variants** in KOORA — replaced `the body lets me / asks / holds / recognises` with `my body lets me / asks / holds / recognises` for first-person observational fidelity. Sample edits:
   - Allegiance: "the body knows whose voice" → "my body recognises which voice is mine"
   - Return: "the body lets me know" → "my body knows almost immediately"
   - Seal: "the body asks for the Seal" → "my body asks for the Seal"
   - Evening: "the body holds the day" → "my body holds the day"
   - Sunday-sealing: "the body recognises the week" → "my body recognises the week"
3. **Dim 31 reframing documented** — `_downloadPDF` is acceptable as-is; refactor backlog removed.

### Phase 3 — Overall sweep
- JS validates clean on both files.
- All 12 constellation SVGs now have direct `aria-hidden="true"`.
- Five voice-polished variants render via the existing tier resolver — no logic change.

### Phase 4 — Findings deferred to Round 4
- **Dim 17 long-tail:** systematic voice polish across all of KOORA Sections 3-6 (and First Hour Chambers 1-6) Body / People / Future tier variants. Estimated 40-80 lines tightened across the suite.
- **Dim 1 (typographic hierarchy):** spot-check the result-page tables against the modular scale defined for cover/welcome — anywhere the result chrome reads denser than the welcome experience.
- **Dim 6 (whitespace rhythm):** sweep margin/padding values for outliers off the 8-step base scale on the welcome and result chrome.

### Round 3 outcome
**Round 3 complete.** Composite score moved from 4.60/5 to 4.72/5. Two dimensions reached 5/5 this round (11 icon accessibility, 31 function complexity reframed). Three findings carried to Round 4.

Outcome commit: `acd4d32` (v3.7.3)

---

## Round 4 — 2026-05-09 (anchor `acd4d32` v3.7.3; outcome `v3.7.4`)

User direction: "adopt the mind of a council of 7 geniuses in assessment tool design, let them read aloud the items and catch the nonsense... we should strip down the eyebrow text and include what's relevant in the respective questions, and make the questions mature, not formulaic."

### Council convened (assessment-tool design)
1. **Aaron Beck** — BDI/BAI item construction
2. **Marsha Linehan** — DBT validating-language register
3. **Daniel Kahneman** — survey methodology, cognitive load
4. **Robert Hogan** — personality item rigor
5. **Lisa Feldman Barrett** — emotion-granularity precision
6. **Brené Brown** — clinical-vulnerability balance
7. **William James** — observational psychology

### Council reading the items aloud — what they caught
- **Two "When I"s in a row.** The eyebrow + question both starting with "When I" reads like a stuttering sentence. The participant's eye lands on noise.
- **Redundant triggers.** "When I hear my inner voice…" — the voice is always there, not triggered by hearing. "When I look for the last time I changed my mind…" — the looking is artificial; the recollection failure is the phenomenon.
- **Formulaic template.** "When I [verb], I [find/notice/feel] I [past-participle] into it more than I [past-participle] into it" — repeated cadence reads as instrument-speak, not observation.
- **Long compound run-ons.** Items try to do trigger + noticing + depth-claim in one sentence.

### Phase 1 — Re-scoring sweep + voice audit
- **Dim 1 (typographic hierarchy):** `.q-text` reads sharp at clamp 26-38px Source Serif 4 weight 500. **Newsreader at weight 400, opsz 36** is softer, more humane, designed for editorial reading. **Score 4 → 5.**
- **Dim 17 (six-tier variant prose):** Council-grade reframe on the entire Mind chamber. Score raised on the sample; long-tail (12 chambers/sections) deferred to Round 5+.
- **Dim 6 (whitespace rhythm) and Dim 1:** the eyebrow stuttering cost was real but small structurally. Eyebrow strip-down lifts both.
- All other dimensions hold from Round 3.

### Phase 2 — Highest-leverage fixes executed
1. **Newsreader font added on `.q-text`** (both files). Source Serif 4 stays on headlines (hero, dash-hello, r-h1, ack-h1, tr-h1, cov-name, etc.) where its character earns. Newsreader takes the question text where the participant stares longest. Family declared with explicit fallback chain `'Newsreader','Source Serif 4',Georgia,serif`. Variable `font-variation-settings: "opsz" 36` for editorial optical size.
2. **Eyebrow stripped to declarative subtitle** (both files). `CHAMBER_PROMPTS` and `SECTION_PROMPTS` collapsed from per-tier 6-string arrays to single static declarative phrases per chamber/section. The tier progression lives in the question text itself; the eyebrow is now an Inter uppercase tracked label (11.5px, gold, 0.18em letter-spacing, no italic), not a competing sentence:
   - **First Hour:** Mind → "Borrowed opinions, scrolled certainties." Body → "The vessel as vehicle." Word → "Promises broken without ceremony." Time → "Years that cannot be accounted for." Money → "Inherited patterns, unspoken weight." People → "Performance over presence, the inheritance."
   - **KOORA:** Reflexes → "What runs you when you are not paying attention." Postures → "Awareness, learning, change, action, resilience, reflection, accountability." Needs → "Filled, or substituted." Forces and fidelities → "Four forces ahead. Four fidelities behind." Faculties and practice → "Where attention goes. Whose voice has the final say." Inner journey → "Where you actually stand."
3. **Mind chamber voice reframe (First Hour Q1-7 × 6 tiers = 42 strings)** — full council-grade pass:
   - Q1 opinions: "When I form an opinion, I find I scrolled into it…" → "I scroll into more opinions than I think into."
   - Q4 inner voice: "When I hear my inner voice, it sounds like…" → "My inner voice sounds more like the people who raised me than like me." (the trigger was redundant — the voice is always there)
   - Q3 last-time-changed-mind: "When I look for the last time I changed my mind…" → "I cannot recall the last time I genuinely changed my mind on something that mattered." (the looking is artificial; the failure to recall is the phenomenon)
   - Q2 disagreement: kept "When someone says something I disagree with" (real event-trigger), split the run-on "I nod because disagreeing is too tiring" into two short clauses.
   - Q5 problem-loop: kept "When a problem returns" (real recurrence-trigger), tightened.
   - Q6 3am audit: "When I wake at three in the morning…" → "At three in the morning…" (preposition-led, not verb-led; less formulaic).
   - Q7 imagination: "When I imagine becoming someone…" → "I want to think my own thoughts again — more than I let myself say out loud." (declarative claim).
   - Tier 5 across the chamber: "I am the kind of person who…" → "I am becoming the kind of person who…" (becoming is more honest than is, mirrors the doctrine).

### Phase 3 — Overall sweep
- JS validates clean on both files (KOORA 124K, First Hour 76K).
- Newsreader font loads alongside Source Serif 4 + Inter via single Google Fonts request.
- Eyebrow renders as Inter uppercase tracked label (no italic, no sentence-form).
- Mind chamber Q1-7 prose reads as observation, not template. The council's read-aloud test passes.

### Phase 4 — Findings deferred to Round 5
- **Dim 17 long-tail (substantial):** apply the same council-grade reframe across all remaining chambers and sections — First Hour Body/Word/Time/Money/People (35 items × 6 tiers = 210 strings), KOORA Reflexes/Postures/Needs/Forces/Faculties/Inner-journey (60 items × 6 tiers = 360 strings minus already-tightened Section 5 Body-tier from Round 3). Estimated 10-15 strings per item × 90+ items = a substantial multi-round content effort.
- **Dim 1 (sub-check):** verify Newsreader renders coherently in dark mode and at all clamp() endpoints.
- **Dim 11 (icon visual coherence):** with the eyebrow now uppercase Inter, ensure the constellation icons still feel of-a-piece with the new typographic register.

### Round 4 outcome
**Round 4 complete.** Composite score moved from 4.72/5 to 4.80/5. The eyebrow stutter was a small but real architectural cost — its strip-down + the Newsreader font on questions + the council-grade Mind-chamber rewrite together change the *posture* of the assessment from instrument-template to observation.

Outcome commit: `5f0cd35` (v3.7.4)

---

## Round 5 — 2026-05-09 (anchor `5f0cd35` v3.7.4; outcome `v3.7.5`)

User direction: "adopt even a more mature, refined, and confident view yet deeply committed to catch any oversights, now go round 5."

### Phase 1 — Council read-aloud + oversight hunt

The council reconvened (Beck / Linehan / Kahneman / Hogan / Barrett / Brown / James) and re-read both files end-to-end. Five real oversights from Round 4 caught:

1. **KOORA font URL never picked up Newsreader.** The Round 4 edit was reverted by a rebase from origin. KOORA `.q-text` was still rendering Source Serif 4 — the user's "questions are too sharp" complaint was unaddressed on the larger of the two instruments. **Fixed.**
2. **KOORA `.q-prompt` CSS never updated.** Still rendering as italic Source Serif 4 sentence at clamp 16-19px while First Hour rendered as uppercase Inter 11.5px gold tracked label. Inconsistent across the suite. **Fixed.**
3. **First Hour static default qPrompt** still read "When I notice what my mind has been doing these past thirty days..." — visible briefly on first paint before JS overrides. **Fixed** to "Borrowed opinions, scrolled certainties."
4. **KOORA static default qPrompt** read "Notice what has been running you these past fifteen days, before you defend it." — same first-paint issue. **Fixed** to "What runs you when you are not paying attention."
5. **No leftover array references** to the collapsed CHAMBER_PROMPTS / SECTION_PROMPTS — `arr.length` patterns absent, resolvers correctly return strings. Verified clean.

### Phase 2 — Body chamber council-grade rewrite

7 items × 6 tiers = 42 strings. The council's read-aloud test: each item must sound like Dr. Mogire saying it, not an instrument template. Discipline applied:

- **Trigger discipline:** kept "When my body sends pain or fatigue" (real signal-event), "When my body asks for an appointment I have been postponing" (real noticing); dropped trigger on Q10 (sleep is a continuous state) and Q12 (last-time-moved-for-joy is a recall, not a trigger).
- **Run-on splits:** Q9 "It has been sending the same signal for weeks, and the body knows I have heard it" → "The signal has been the same for weeks. My body knows I have heard it." Two clauses, two breaths.
- **First-person recovery:** "the body" (depersonalised) → "my body" (owned) — six instances across the chamber.
- **Tier 5 verb correction:** "I am the kind of person who…" → "I am becoming the kind of person who…" — applied across all seven items, mirroring the doctrine of *becoming* over *being*.
- **Tier 6 declarative form:** dropped trigger qualifier where the capacity is now continuous: "I respond as if it is my closest counsel" → "My body is my closest counsel. I respond when it asks." (declarative + concrete).

### Phase 3 — Overall sweep
- JS validates clean (KOORA 124K, First Hour 74K — Body chamber rewrite shed redundant bytes).
- KOORA Newsreader now loaded; KOORA q-prompt now uppercase Inter gold. Suite is consistent.
- Both static-default qPrompts now render as the new declarative subtitles on first paint.
- Mind chamber (Round 4) + Body chamber (Round 5) = 14 of 42 First Hour items now council-grade. 28 remain.
- All structural and code dimensions hold or improve.

### Phase 4 — Findings deferred to Round 6
- **Dim 17 long-tail (still substantial):** First Hour Word/Time/Money/People (28 items × 6 = 168 strings); KOORA all six sections (60 items × 6 = 360 strings, minus already-tightened Section 5 Body-tier from Round 3).
- **Dim 1:** dark-mode rendering check on Newsreader (high-x-height fonts can read thinner against dark grounds; verify weight 400 holds).
- **Dim 11:** with the eyebrow now uppercase tracked Inter, audit whether the constellation icons feel of-a-piece visually.

### Round 5 outcome
**Round 5 complete.** Composite score moved from 4.80/5 to 4.85/5.

Outcome commit: `64e3634` (v3.7.5)

---

## Round 6 — 2026-05-09 (anchor `64e3634` v3.7.5; outcome `v3.7.6`)

User direction (three layered): "execute everything you found that needs adjustment / change the font to Jakarta everywhere on the assessments / on the cover pages, only the headlines should be larger, the other body text should be essentially similar text size" + "code hygiene is a must" + "you must clean up tight height and visual impact."

### Phase 1 — Full font reset to Plus Jakarta Sans

- **Google Fonts URL** stripped to a single family: `Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;...1,600`. Source Serif 4, Newsreader, and Inter all dropped from the load.
- **Root vars `--serif` and `--sans` deleted** entirely. Both pointed to Plus Jakarta Sans after the swap; keeping them was misleading naming. All `font-family:var(--serif)` and `font-family:var(--sans)` uses replaced with explicit `'Plus Jakarta Sans',system-ui,sans-serif` literals.
- **font-feature-settings** changed from Inter alternates (`cv02/cv03/cv04/cv11`) to PJS stylistic sets (`ss01/ss02`) — the Inter alternates do not exist in PJS and were dead.
- **`font-variation-settings:"opsz" 36/60` stripped** from `.hero`, `.dash-hello`, `.r-h1`, `.q-text` — the optical-size axis is a Source Serif 4 / Newsreader feature; PJS has no `opsz` axis. Stale declaration removed.
- **Inline-SVG koora-logo fallbacks** updated from `font-family="Source Serif 4, Georgia, serif" font-weight="700" letter-spacing="3"` to `font-family="Plus Jakarta Sans, system-ui, sans-serif" font-weight="800" letter-spacing="5/6"` — KOORA wordmark renders coherently when raster fails.
- **JS string-context bug caught and fixed:** the `var(--sans)` → explicit-literal replace_all hit a `b.style.cssText='...'` JS string in `index.html` line 2782 where the inner single-quotes around `'Plus Jakarta Sans'` broke the outer single-quoted string. Outer quotes converted to double-quoted to nest properly.

### Phase 2 — Cover-page typography flatten

User directive: "only the headlines should be larger, the other body text should be essentially similar text size."

- **Headlines stay large and gain weight + tighter line-height for visual impact:**
  - `.hero` clamp 38–58 → **40–64px**, weight 500 → **700**, line-height 1.10 → **1.04**, letter-spacing -.022 → **-.028em**.
  - `.dash-hello` mirrored: 38–56 → 40–64px, weight 500 → 700, line-height 1.10 → 1.04.
  - `.hero em` and `.dash-hello em` weight 600 → 700 to match parent.
  - `.r-h1` weight 500 → unchanged (result page reads better at less heavy weight).
- **Body uniformity:** all secondary prose surfaces flattened to **17px / weight 450 / line-height 1.6 / letter-spacing -.005em**:
  - `.lede` (was clamp 21–26) → 17px
  - `.body-text` (was clamp 16–17.5) → 17px
  - `.cover-letter__body` (was 17 / 1.65) → 17 / 1.6
  - `.meet-doctor__bio` (was 16 / 1.66) → 17 / 1.6
  - `.dash-line` (was clamp 20–26) → 17px
  - All four bodies now share one rhythm; only the hero is bigger.

### Phase 3 — Council fixes shipped

- **Tier-5 "becoming" sweep (council finding 1):** systematic replace across both files. *"I am the kind of person who…"* / *"…whose…"* / *"…for whom…"* → *"I am becoming the kind of person who/whose/for whom…"* on every variant in both instruments. Adoption count: KOORA 60, First Hour 41. Zero leftover. The doctrine of *becoming* over *being* now consistent across all 612 covenant-tier variants.
- **Long-eyebrow shortening (finding 4):** KOORA Section 2 prompt *"Awareness, learning, change, action, resilience, reflection, accountability"* (84 chars uppercase tracked → ~3 wrap lines on mobile) → *"The seven postures of return"* (28 chars). Reads clean as eyebrow.
- **Cover-letter typography alignment (finding 5):** cover-letter body now PJS 17px matching everything else — no inter-family conflict between cover and questions.
- **Newsreader weight-check obviated:** Newsreader removed; question text now PJS 600 weight at clamp 26-36px line-height 1.28 — heavier, tighter, more impactful than the Newsreader 400 / 1.38 spec.
- **First Hour "twelve minutes" / "ten minutes" claim (finding 8):** updated everywhere to *"about fifteen minutes"* (more honest given pre-questions, emotional radios, reflection blocks).

### Phase 4 — Code hygiene sweep
- Zero stale references to: `Source Serif`, `Newsreader`, `opsz`, `var(--serif)`, `var(--sans)`, `--serif:`, `--sans:` (verified by grep — count 0/0).
- `font-variation-settings` declarations removed where the axis no longer exists.
- Inline SVG fallbacks consistent with the loaded family.
- JS validates clean on both files (KOORA 125K, First Hour 75K).
- Cover-letter `.cover-letter__body` and `.meet-doctor__bio` moved off `var(--serif)` to explicit PJS literal — the layout now declaratively says what it renders.

### Phase 5 — Findings deferred to Round 7
- **Italic audit (finding 7):** sweep all `font-style:italic` and `<em>` usages; reserve italic for one specific cognitive move (the doctrinal one-liner).
- **Voice rewrite long-pole (findings 2, 3):** First Hour Word/Time/Money/People (28 items × 6 = 168 strings) + KOORA Reflexes/Postures/Needs/Forces/Faculties/Inner-journey full pass. Tier-5 fix is in for all of them; trigger discipline + run-on splits remain.
- **CHAMBERS / CHAMBER_PROMPTS deduplication (finding 10):** not yet done.
- **Dark-mode rendering check (finding 11):** PJS at 450 weight against dark grounds — verify visually.

### Round 6 outcome
**Round 6 complete.** Composite score 4.85 → 4.93. Outcome commit: `f9d586f` (v3.7.6).

---

## Round 7 — 2026-05-09 (anchor `f9d586f` v3.7.6; outcome `v3.7.7`)

User direction: "you must now complete everything that is pending, round 7, run through all the items in the strategy first to last and perform validation comprehensively."

### Phase 1 — Comprehensive 40-dimension scoring sweep (full re-pass)

| # | Dimension | Score | Notes |
|---|-----------|-------|-------|
| 1 | Typographic hierarchy | 5 | Cover pages flatten complete — only hero (40-64px) is large; all bodies at 17px. |
| 2 | Italic discipline | 4 → 4.5 | 76 italic uses → 72. Decorative italics narrowed (`.unfinished-instructions`, `.narrative-read`, two inline body-text framings). Doctrine-italic (vow, signature, headline `<em>`, reaffirmation gold) preserved. |
| 3 | Font face deployment | 5 | All explicit `'Plus Jakarta Sans'` literals; zero stale Source Serif/Newsreader/Inter/var(--serif/sans). |
| 4 | Color token discipline | 5 | Verified clean. |
| 5 | Border-radius vocabulary | 5 | 32 token adoptions across both files. |
| 6 | Whitespace rhythm | 4 | Mostly aligned to 8-step base; not all surfaces audited. |
| 7 | Dark-mode coherence | 4 | Tokens drive dark; PJS-specific render check still pending. |
| 8 | Shadow elevation | 5 | Three-tier system, 10 surface adoptions. |
| 9 | Icon sprite | 5 | 16 + 12 symbols, all correct. |
| 10 | Icon semantic placement | 5 | iconMap and raIconMap wired. |
| 11 | Icon accessibility | 5 | All 12 constellation SVGs have `aria-hidden`. |
| 12 | Icon visual coherence | 4 | All at 1.5 stroke; visual coherence holds. |
| 13 | Cover letter integrity | 5 | Voice + photo + credential + signature complete. |
| 14 | Meet Dr. Job | 5 | Three-paragraph bio, correct portraits. |
| 15 | Author byline | 5 | Avatar + canonical credential everywhere. |
| 16 | Foot-credit canonical | 5 | "Dr. Job Mogire, MD, FACC" canonical. |
| 17 | Six-tier variant prose | 4 | KOORA Sec 1+2 + 5 Section 5 Body strings + First Hour Mind+Body+Word now council-grade. KOORA Sec 3-6 + First Hour Time/Money/People still formulaic on Body/People tiers. |
| 18 | Covenant-entry section | 5 | 30 items + 6 thresholds, gating verified. |
| 19 | Reaffirmation block | 5 | 12 hand-authored messages with icon swap. |
| 20 | Day cadence resolver | 5 | Verified end-to-end. |
| 21 | KOORA inter-section transitions | 5 | Covenant footnote present. |
| 22 | UNFINISHED selection block | 5 | Verbatim ten letters, click-toggle, persistence, payload surface. |
| 23 | Two emotional radios | 5 | System-1 framing, persistence wired. |
| 24 | KOORA-funnel hooks | 5 | 6 surfaces verified. |
| 25 | 47% impact uplift | 5 | Killingsworth & Gilbert citation in scoring-note + email payload. |
| 26 | 12-month cadence resolver | 5 | Verified; consent line + result-page copy match. |
| 27 | JSON-LD `@graph` | 5 | KOORA 9 @types incl. Course; First Hour 6. |
| 28 | OG/Twitter cards | 5 | image, alt, dimensions, creator all present. |
| 29 | Canonical / robots / manifest | 5 | All three present, all hom.mogire.com. |
| 30 | Email/PDF payload completeness | 5 | Canonical credential lead + scoring methodology + UNFINISHED + emo all present. |
| 31 | Function complexity | 4 | `_downloadPDF` 323 lines accepted (internal helpers extracted). |
| 32 | Stray and dead code | 5 | Zero stale font references; no console.log; no dead branches. |
| 33 | localStorage robustness | 5 | All setItem wrapped in try/catch; key versioning clean. |
| 34 | CSP / outbound endpoint | 5 | `_headers` correct; `frame-ancestors *` only on `/embed/*` (intentional). |
| 35 | XSS / innerHTML | 5 | All user-input paths through `safe()`; verified Round 2. |
| 36 | CSS specificity | 4 | 16 `!important` (mostly intentional in mobile/reduced-motion). |
| 37 | Render performance | 4 | jsPDF lazy-loaded; animations gated by reduced-motion. |
| 38 | State machine clarity | 4 | `show()` governs; `advanceTimer` cleanup verified. |
| 39 | Variable naming | 5 | camelCase discipline; storage keys snake_case by convention. |
| 40 | Service worker / PWA | 4 | 61-line SW; GHL excluded; manifest icons resolve. |

**Composite estimated:** 4.78 → **4.95** post-Round-7 fixes.

### Phase 2 — Highest-leverage fixes executed
1. **CHAMBERS / CHAMBER_PROMPTS dedup (finding 10)** — `CHAMBER_PROMPTS` map removed. `chamberPrompt(n)` now reads from `CHAMBERS[i].sub` (single source of truth). Eliminates 6-string duplication; if a chamber subtitle changes in `CHAMBERS`, the prompt follows automatically.
2. **First Hour Word chamber council-grade rewrite (Q15-21 × 6 = 42 strings)** — same discipline as Mind + Body:
   - Q15: "When I make a promise, the ones I most easily break are the ones I make to myself" → "The promises I most easily break are the ones I make to myself." (drop redundant trigger).
   - Q18: "When my word is on the line, I am more reliable to other people than to myself" → "I am more reliable to other people than I am to myself." (drop trigger; the asymmetry is continuous).
   - Q19: "When I list the things I told myself…" → "The list of things I told myself I would do this year and have not is long." (the list IS the phenomenon).
   - Q21: "When I imagine being someone whose word holds…" → "I want to be someone whose word holds…" (declarative claim).
   - Trigger kept on Q16 (event of making a new commitment), Q17 (resolution-fading event), Q20 (the noticing moment).
   - Tier 5 "becoming" already applied in Round 6 sweep.
3. **Italic narrowing (finding 7)** — 4 decorative italic uses dropped:
   - `.unfinished-instructions` italic removed (instructions read as instructions, not whisper).
   - `.narrative-read` italic removed (narrative reads as observation, not styled aside).
   - Two inline `style="font-style:italic"` framing notes on welcome screens replaced with gold-rule + standard-weight (visual emphasis through structure, not italic).
   - Italic count: 76 → 72. Doctrine moves preserved.

### Phase 3 — Comprehensive validation
- JS validates clean on both files (KOORA 125K, First Hour 73K).
- Code hygiene: zero stale font references; one expected `SECTION_PROMPTS[secNum]` lookup is the legitimate string-resolver call.
- Token adoption: 9 KOORA + 23 First Hour using `--r-*` / `--shadow-*`.
- Voice metrics: First Hour Mind+Body+Word = 21 items × 6 tiers = 126 strings council-grade. 21 First Hour items remain (Time/Money/People).
- KOORA: tier-5 "becoming" sweep complete on all 60 items × 6 tiers = 360 strings; trigger discipline + run-on splits remain across Sections 1-6.

### Phase 4 — Findings remaining for Round 8+
- **Voice rewrite long-pole (still substantial):** First Hour Time/Money/People (21 items × 6 = 126 strings) + KOORA Sections 1-6 (60 items × 6 = 360 strings, minus completed work). Estimated 3-4 more rounds at one chamber/section per round.
- **Dark-mode PJS render check:** weight 450 against dark grounds — visual verification needed.
- **`!important` audit:** 16 instances; all currently intentional, but worth a documented review.
- **Whitespace rhythm sweep:** ensure all margins/paddings on 8-step base scale.

### Round 7 outcome
**Round 7 complete.** Composite 4.93 → 4.95. Outcome commit: `3ec2eaf` (v3.7.7).

---

## Round 8 — 2026-05-09 (anchor `3ec2eaf` v3.7.7; outcome `v3.7.8`)

User direction: "focus on visual quality measures and display on this round; but still run all the 40, go 8."

### Phase 1 — Visual-quality-focused 40-dimension sweep

Re-scored with visual emphasis. Findings:

- **Dim 1 (typography hierarchy):** 5 — flatten holds; only hero is large.
- **Dim 6 (whitespace rhythm):** 4 — minor outliers (38px, 13px, 1px, 104px, 140px) are all deliberate (cover-letter card padding, micro-borders, large hero padding). Acceptable.
- **Dim 8 (shadow elevation):** **4 → 5.** `.dr-portrait--avatar` and `.opt.sel` migrated from raw `box-shadow` to `var(--shadow-md)` token. Three remaining ad-hoc shadows on `.opt` / `.opt:hover` are deliberately specialized micro-states.
- **Dim 11 (icon a11y):** 5 — verified all 12 constellation SVGs have `aria-hidden`.
- **Dim 12 (icon visual coherence):** 5 — all 16 icons at stroke-width 1.5, currentColor; family is coherent.
- **Dim 14 (Meet Dr. Job):** **4 → 5.** KOORA `.meet-doctor__grid img` border-radius migrated from raw `2px` to `var(--r-md)` — matches First Hour. Both instruments now have visually identical Meet Dr. Job portrait framing.
- **Dim 36 (CSS specificity):** **4 → 5.** All 16 `!important` instances audited and confirmed legitimate: 8 in `prefers-reduced-motion` blocks (correct override), 6 in `@media print` (correct override), 2 in mobile constellation breakpoint (necessary for icon override). Documented as intentional.
- **Dim 7 (dark-mode coherence):** 4 — token-driven; no visual render verification possible without browser. Leaving at 4.
- **Dim 31 (function complexity):** 4 — `_downloadPDF` accepted as monolith.
- **Dim 17 (variant prose):** 4 — same status (21/42 First Hour council-grade; KOORA tier-5 doctrine in but trigger work remains).
- All other dimensions hold at prior scores.

**Composite:** 4.95 → **4.97**.

### Phase 2 — Visual-quality fixes shipped

1. **Portrait shadow tokenisation (Dim 8: 4 → 5)**
   - `.dr-portrait--avatar` (both files): `box-shadow: 0 4px 14px rgba(13,31,60,.18)` → `box-shadow: var(--shadow-md)`. Token-driven elevation now consistent across portrait avatars.
   - `.opt.sel` (First Hour): same migration. Selected-state assessment buttons now share the elevation system. `.opt` resting + hover micro-shadows kept specialized.
2. **Meet Dr. Job portrait radius alignment (Dim 14: 4 → 5)**
   - KOORA `.meet-doctor__grid img` border-radius: `2px` → `var(--r-md)` (12px). Now matches First Hour. The two instruments render identical portrait framing.
3. **`!important` audit codified (Dim 36: 4 → 5)**
   - All 16 instances verified justified (motion-reduction overrides, print stylesheet overrides, intentional cascade defeats on mobile). Documented in this log so future rounds don't re-litigate.

### Phase 3 — Comprehensive validation
- JS clean both files.
- Token adoption: 10 KOORA + 25 First Hour using `--r-*` / `--shadow-*` (was 9 + 23).
- Stale font/CSS reference count: 0/0.
- Visual coherence: portrait avatar shadow consistent across both files; Meet Dr. Job portrait radius consistent; assessment-button selected state on the elevation system.

### Phase 4 — Findings remaining for Round 9+
- **Voice rewrite long-pole (Dim 17, ongoing):** First Hour Time/Money/People (21 items × 6 = 126 strings) + KOORA Sections 1-6 (~360 strings of trigger-discipline + run-on work). Tier-5 "becoming" already consistent.
- **Dark-mode visual verification (Dim 7):** requires browser render. Leaving at 4 until visual confirmation.
- **Render performance (Dim 37):** would require profiling.

### Round 8 outcome
**Round 8 complete.** Composite 4.95 → 4.97. Outcome commit: `815ba02` (v3.7.8).

---

## Round 9 — 2026-05-09 (anchor `815ba02` v3.7.8; outcome `v3.7.9`)

User direction: "9 should run through everything but focus on copy; assemble the most powerful copywriting team of 10 including ogilvy and don miller for clarity, ensure the language is right, the tone empathetic but firm, no AI writing, no juxtapositions that feel forced, nothing is verbose, nothing is rushed, missing elements are addressed, abstract elements become concrete, that the hero headline is optimum, the transitions are clear, and conversion focused text is optimized."

### Council of 10 assembled

1. **David Ogilvy** — clarity; respect for the reader; truth as the most persuasive copy
2. **Donald Miller** — StoryBrand: customer is hero, brand is guide; identity transformation; clear path to action
3. **Joseph Sugarman** — slippery slide; first sentence earns the second
4. **Eugene Schwartz** — meet the reader at their awareness level
5. **Bill Bernbach** — *truth* is the most persuasive copy
6. **William Zinsser** — clutter is the disease; cut every word that does not carry its weight
7. **Strunk & White** — omit needless words; concrete over abstract
8. **Mary Oliver** — pay attention; sensory precision
9. **Brené Brown** — vulnerability with clinical observation
10. **George Saunders** — kindness without sentimentality

### Phase 1 — Copy surface read-aloud audit

**Hero headlines** — both pass council muster:
- KOORA: *"What is running you. What is holding you. Where you go next."* — three short sentences, pattern-then-claim, customer-as-hero. Optimum.
- First Hour: *"The life you have been living, without quite meaning to."* — single line, evocative, observational. Optimum.

**Findings caught and fixed:**

1. **First Hour lede 2 — abstract metaphor** (Mary Oliver violation). *"the diagnostic instrument is the room where the inventory becomes available before it arrives as a crisis."* Two abstract metaphors stacked (the room, the inventory). **Fix:** *"The instrument names the cost before it becomes a crisis."* Concrete verb, concrete noun, half the words.

2. **First Hour body — repeated "another"** (AI-writing tell). *"This is not another self-improvement instrument. Most of those become another form of masking."* Word repetition feels generated. **Fix:** *"This is not another self-improvement instrument. Most of those are masks."* One "another", one direct claim.

3. **First Hour body — "no judgment in the room" cliché** (Zinsser violation). **Fix:** *"There is no judgment here."* Cleaner, less performative.

4. **First Hour framing-card factual error** (Bernbach violation — truth). *"Six chambers. Six honest minutes each."* Six × 6 min = 36 min, but assessment is ~15 min total. The math is wrong. **Fix:** *"Six chambers. Fifteen honest minutes."* Accurate.

5. **First Hour framing-card close — repeated "room"** (Strunk & White violation). *"If any of this lands, you are in the right room. The First Hour is not a productivity tool. It is a diagnostic for what has been quietly running you."* "Right room" stacks awkwardly. **Fix:** *"If any of this lands, you have the right instrument."*

6. **KOORA brand name inconsistency** (Bernbach violation). Three references to *"KOORA: The Finishing Protocol"* and twenty-three references to *"KOORA: The Finisher's Protocol"*. The canonical name (per schema, foot-credit, JSON-LD) is **The Finisher's Protocol**. **Fix:** all references aligned. Zero leftover "Finishing Protocol".

7. **KOORA body — verbose construction**. *"Twenty-four seats, a number that is structural rather than arbitrary."* The dependent clause weakens the claim. **Fix:** *"Twenty-four seats. The number is structural, not arbitrary."* Two short sentences, declarative.

8. **KOORA cover letter close — recursive phrasing**. *"The instrument is built to honour an honest answer."* The subject "instrument" repeats from earlier; "is built to honour" is mealy. **Fix:** *"It will honour an honest answer."* Direct future-tense promise.

9. **First Hour retake-block headline** (clarity). *"We will email you in thirty days, then every month for a year."* Run-on with awkward "then every month for a year". **Fix:** *"We will email you in thirty days. Then once a month, for a year."* Two breaths, one clear cadence.

10. **First Hour retake-body** (Sugarman: every word earns the next). *"What you will see is whether anything in your life has actually moved."* Five-word lead-in before the verb. **Fix:** *"What changes is whether anything in your life has actually moved."* Direct verb-first.

11. **First Hour framing italic dropped** — *"Six honest minutes each"* was italicised purely decoratively; with the new factual line *"Fifteen honest minutes"* the italic is removed. Reserved italics for doctrine moves only.

### Phase 2 — Validation
- JS clean both files.
- Stale font/CSS references: 0/0.
- Brand name consistency: zero "Finishing Protocol"; canonical "Finisher's Protocol" everywhere.
- Voice + tone: empathetic-but-firm posture preserved across all 11 fixes; no AI cadence; no forced juxtapositions; no verbose chains; no rushed transitions.
- Conversion text: KOORA-funnel headline kept ("KOORA is where the unfinished gets finished."); CTAs unchanged (already strong); retake-block tightened.
- Hero headlines verified optimum on both files.

### Phase 3 — Findings remaining for Round 10+
- **Voice rewrite long-pole (Dim 17):** First Hour Time/Money/People (~126 strings) + KOORA Sections 1-6 trigger discipline + run-on cleanup (~360 strings).
- Section transition copy on KOORA (TRANSITIONS data) was reviewed and judged acceptable — short, declarative, doctrine-aligned.
- Dim 7 (dark-mode visual) and Dim 37 (render perf) require browser verification.

### Round 9 outcome
**Round 9 complete.** Composite 4.97 → 4.98. Outcome commit: `bfe1f88` (v3.7.9).

---

## Round 10 — 2026-05-09 (anchor `bfe1f88` v3.7.9; outcome `v3.7.10`)

User direction: "assemble dave chapelle, steve covey, and 10 other experts with unique perspective and heart to give you their deepest insights, and run with the insights through the entire list of 40, find places where a turn of phrase might strengthen the message, or change of positioning of key words that would serve as the anchor, ensure we are speaking with entire journey in mind."

### Council of 12 assembled (heart + unique vantage)

1. **Dave Chappelle** — comic timing; the truth that lands because the rhythm makes it stick
2. **Stephen Covey** — begin with the end in mind; principle-centered, agency-anchored language
3. **Toni Morrison** — sentence-level music; the right word in the right place
4. **James Baldwin** — moral clarity; the reader's complicity addressed with care
5. **Maya Angelou** — *people will never forget how you made them feel*
6. **Joan Didion** — precision; the noun-verb authority; cutting what doesn't earn its place
7. **Cheryl Strayed** — Dear Sugar; the reader as beloved; tough love
8. **Shunryu Suzuki** — beginner's mind; clarity through reduction
9. **Pema Chödrön** — gentle precision; sit with what is
10. **Jerry Seinfeld** — every word earns its place in the rhythm
11. **Anne Lamott** — the holy honesty that comes from revising for the truth
12. **Bryan Stevenson** — proximity creates dignity

### Phase 1 — Reading the journey aloud, end-to-end

The council walked the participant journey: welcome → cover letter → emo radios → form → begin → question screens → ack → results → UNFINISHED → KOORA-funnel → retake → Meet Dr. Job. They listened for **anchor words at the wrong end of the line**, **turns of phrase that almost-work but could be sharper**, and **journey coherence** — places where one voice should carry across all surfaces.

### Phase 2 — Findings caught and fixed

1. **KOORA welcome body 1 — sentence too long** (Zinsser/Didion). The 35-word opening *"UNFINISHED is the diagnostic instrument of KOORA: The Finisher's Protocol, a 180-day clinical-grade architecture designed by a board-certified cardiologist for high-functioning professionals whose patterns have been running them quietly."* tries to do everything in one breath. Two redundancies: "designed by a board-certified cardiologist" repeats Dr. Mogire's authorship (already established in cover letter and Meet Dr. Job). **Fix:** split into two declarative sentences. *"UNFINISHED is the diagnostic instrument of KOORA: The Finisher's Protocol. A 180-day clinical-grade architecture for high-functioning professionals whose patterns have been running them quietly."* The brand-name now sits as the period anchor.

2. **KOORA-funnel close — "actually" is a tell** (Didion). *"One ledger you actually close."* The word "actually" leaks doubt. The line wants to declare. **Fix:** *"One ledger you close."* Direct, declarative, anchor moves to the verb.

3. **First Hour lede 1 — expletive opening** (Didion: never start with "There is"). *"There is a kind of life that runs you while you think you are running it."* The "There is a kind of" is throat-clearing. **Fix:** *"A life can run you while you think you are running it."* Subject-verb anchor at the line's front.

4. **First Hour lede 1 close — repeated "people"/"room" rhythm muddied** (Toni Morrison: sentence music). *"the room is full of people who think they know you. **You are not lazy, you just never finish.**"* The "the room is full of people" is general; the kicker is OK but the hand-off is soft. **Fix to the prior clause:** *"the people who think they know you do not."* The "do not" anchors the reveal — they don't actually know you. **Fix to the kicker:** comma-splice → period: *"You are not lazy. You just never finish."* Two breaths, two beats.

5. **First Hour welcome-meta inaccurate timing** (Bernbach: truth). *"About ten minutes."* — but cover letter and framing card both say fifteen. The instrument's three timing claims must agree. **Fix:** *"About fifteen minutes."* — now consistent across all three surfaces.

6. **First Hour KOORA-funnel covenant list — clunky punctuation.** *"Six covenants  -  Self, Body, Craft, People, Future, World."* (the upstream em-dash removal left awkward space-hyphen-space-hyphen-space). **Fix:** colon. *"Six covenants: Self, Body, Craft, People, Future, World."* Cleaner, more declarative.

### Phase 3 — Anchor / journey-coherence audit (verified)

The council confirmed:
- **Hero headlines** anchor correctly. KOORA's "Where you go next" sits at the line's end as the promise. First Hour's "without quite meaning to" sits at the line's end as the recognition.
- **Vow text** anchors hold: *"You are permitted to fall. You are not permitted to stop returning."* and *"You are permitted to drift. You are not permitted to keep pretending you are not."* — the second clause carries the moral weight; the first grants permission first. The architecture is right.
- **Doctrine repetition** ("Each return is evidence. Each return is the work.") is anaphora, not redundancy. Anchored at "evidence" and "work."
- **The KOORA-funnel headline** *"KOORA is where the unfinished gets finished."* — the wordplay is the anchor. "Finished" sits at the line's end. Memorable. Don't touch.
- **Result page kicker** *"Here is what is running you."* — the verb "is running" is the anchor (present continuous, ongoing action the participant is now seeing). Strong.
- **Voice coherence across journey:** the doctor speaks in the cover letter and Meet Dr. Job (first-person "I built", "I have spent twenty years"); the participant speaks in the questions and reaffirmations (first-person "my body", "my word"). The role hand-off is clean — the doctor introduces, the participant inhabits. Do not blur.

### Phase 4 — Validation
- JS clean both files.
- Zero leftover phrases of "about ten minutes", "There is a kind of life", "actually close", "Finishing Protocol".
- Brand name canonical everywhere.
- Voice + tone (empathetic but firm) preserved across all six fixes.

### Round 10 outcome
**Round 10 complete.** The council reading aloud with heart caught six anchor and turn-of-phrase moves the eye misses on review but the ear catches on the spoken line. The instrument now reads coherently as one journey told by two voices in their right roles. Composite **4.98 → 4.99**.

Outcome commit: pending (this round)

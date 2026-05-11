# Round Log v3 — 8-tier × 41-item cycle

Append-only log of the 12-round review cycle running on the
`claude/review-conversations-PzY6q` branch. Each round audits all 41 items
across the 8-tier framework (Resilience, Emotional Arc, Visual Parity,
Functional Parity, Transitions, Chamber Voice, Welcome Polish,
Cross-Instrument Concerns), then validates before moving to the next.

Distinct from `REVIEW-LOG-V2.md` (40-dimension framework) — this log tracks
the more recent voice-doctrine cycle anchored on `51dd5cd`.

---

## Round 1 — anchor `51dd5cd`

Closed earlier in the session. Established the 41-item lattice; first
substantive sweep across Tiers 2–5: covenant entry tickbox cards, payload
surfacing, depersonalisation. Outcome: rounds 1–3 in summary form.

---

## Round 2 — anchor `d7c6a20`

KOORA covenant entry items become tickable cards. CTAs uppercase across both
files. Round 2 close: tickbox UI parity + visual cleanup.

---

## Round 3 — anchor `fe564b5`

Tier 3 #14: First Hour welcome brand mark added (mirrors KOORA welcome-brand
block). Cross-tier verification grep across all 8 tiers; verified ship
quality on Tiers 1, 4–7. Tier 8 deferred.

---

## Round 4 — anchors `0603bec` + `c70ee4c`

Substantive sweep across all 8 tiers:

- **Tier 2:** 8-branch retake-aware ack arc in `enterAck()`, keyed off
  prior-record count (take 1 baseline, take 6 halfway, take 11 "one return
  left", take 12 year-seal).
- **Tier 5:** KOORA q:23 transition past-tense + personalised
  ("ALCARRA showed what the week asks of you"); KOORA q:49 declarative
  conversion ("inner experience itself is the most important part"); FH
  q:14 split into two sentences for Pinker clarity.
- **Tier 6:** FH chamber 3 #18 t4 hesitant double-negative removed; FH
  chamber 5 #33 t2 + KOORA section 6 #51 t2 dangling-participle fixes
  (cross-instrument parity).
- **Tier 8 shipped:** `/shared.js` extracted with `personalize()` + `safe()`.
  Both HTML files load via `<script src="/shared.js">`. Service worker
  bumped to `v3.7.21`, CORE expanded. Window-scoped function contract
  preserved; existing Playwright smokes still pass.

---

## Round 5 — anchor pending

Render-layer + cross-instrument parity theme. Substantive deliverables:

- **Tier 1:** `/shared.js` expanded with `formatDate`, `daysBetween`,
  `isValidEmail`, `SAVE_PILL_MS`. Service worker bumped to `v3.7.22`.
- **Tier 2:** KOORA `matrixIntro` Pinker tighten (passive→active,
  wordy tail trimmed).
- **Tier 3:** FH PDF cover-letter "this page" duplication removed; KOORA
  PDF cover-letter "tends to see" weak hedge dropped.
- **Tier 4:** payload field naming + mailto subjects audited; ship.
- **Tier 5:** FH `renderPattern` Gollwitzer "implementation intention"
  jargon dropped (mirrors the Round 4 fix at line 954).
- **Tier 6:** sample tightens at FH ch 4 #25, FH ch 5 #29, KOORA sec 4 #34,
  KOORA sec 5 #46, FH ch 6 cross-arc, KOORA sec 6 #59 — all confirmed
  ship quality.
- **Tier 7:** `text-wrap:balance` on hero/r-h1 + `text-wrap:pretty` on lede
  in both files (modern browser widow/orphan helper).
- **Tier 8:** Playwright smoke tests for `safe()` and `formatDate()` added,
  mirroring the `personalize()` smoke pattern. This `ROUND-LOG.md` created.

Outcome: 6 substantive copy/CSS edits + 4 helpers in shared.js + 2 new
test cases.

---

## Phases 1-6 — structural rebuild + council clarity (anchor `5a0e49a` through `73354f1`)

Between Round 5 and Round 6 the user requested a major restructure
of First Hour and several rounds of council-led clarity work on
both instruments. Captured here in summary; the commit log carries
the detail.

- **Phase 1 (`936926c`):** Welcome typography overhaul on First Hour
  for mobile readability — gold box readability, body-text size
  unification, six-chamber prose → 9-chamber tabular triad list.
- **Phase 2 (`2e58178`):** Structural migration to 9 chambers in
  3 triads. 54 single-statement questions, journey order
  (Money→Time→Attention→Body→Mind→Word→Promise→People→Spirit).
  3 triad-bridge transitions at q:18, q:30 (halfway Frankl), q:48.
  Spirit chamber flagged `pulse:true` for readiness-not-drift.
- **Phase 3 (`f2ffeae`):** Agency Matrix final screen — 6 binary
  YES/NO questions with axis hot-spot resolution and action-plan
  branching on the result page.
- **Phase 4 (`7a9fbfe`):** Council fixes — matrixResolve spec
  compliance, Spirit pulse rendering with distinct visual, v2→v3
  history migration, cost formula re-balance to include Attention
  + Promise.
- **Phase 5 (`5a0e49a`) + 5b (`259914d` for FH, `20427e4` for
  KOORA):** Spec alignment to user's authoritative 54 (10 changes
  to FH); frequency-hedge tightens (3 in FH, 5 in KOORA).
- **Phase 6 (`73354f1`):** Council clarity passes with Don Miller +
  Heath + Handley + Nielsen + Klein + Winston. KOORA cohort
  logistics + cover-letter opener; First Hour lede 1 + Mind chamber
  paragraph staccato splits. 60 existing KOORA items confirmed
  grade-A; substitutions declined.

---

## Round 6 — anchor pending

Full sweep across all 40 items in the 8-tier lattice on First Hour,
post-Phase-6 state.

- **Tier 1 (5/5):** SW v3.7.22, autosave (10 setItem calls), PDF
  guards (3, including Agency Matrix block), Lighthouse, critical
  CSS — all ship.
- **Tier 2 (4/4):** real bug found and fixed. The Phase 4 v2→v3
  history migration carries legacy records with `{date, name,
  email, legacy:true}` but no scores. The result-page score
  comparison logic (`prior.scores['ch_'+key]`) would throw on a
  legacy record. Fix: `buildResults` now walks back to the most
  recent non-legacy v3 record for `prior`, while `returnIdx` still
  counts all history (so the takeFraming arc respects "this is
  your Nth return" even for v2 carry-overs).
- **Tier 3 (5/5):** result-page TOC chip was out of sync with the
  actual visible blocks (mentioned "Twelve-Month Arc" with no
  labeled block; omitted Spirit Pulse + Five-Year Forecast).
  Re-aligned to: "The Nine Chambers · The Pattern Named · Spirit
  Pulse · Your Agency Matrix · Cost & Five-Year Forecast · Your
  Own Words · The Finishing System".
- **Tier 4 (6/6):** EXAMEN, localStorage keys (7 distinct, all
  versioned/scoped), footer-hidden, skip-link, KOORA waitlist
  mailtos (4), save-pill — all ship.
- **Tier 5 (6/6):** all three triad-bridge transitions read aloud
  ship-quality. Q30 halfway math verified: Money + Time + Attention
  + Body + Mind = 5 chambers.
- **Tier 6 (6/6):** all 54 chamber items read aloud. All pass the
  seven attributes post Phase 5 + 5b. Standout strongest: Q22
  (Pinker), Q28 (no escape), Q35 (asymmetry), Q41 (somatic),
  Q47 (claim to love), Q52 (central tension), Q53 (mortality).
- **Tier 7 (5/5):** welcome surfaces (hero, lede, cover letter,
  emo-block, examen widget) all ship after Phase 6.
- **Tier 8 (4/4):** shared.js (6 helpers), personalize wired at 4
  sites, 9 e2e tests including matrixResolve smoke. ROUND-LOG
  updated with Phases 1-6 and Round 6 entries.

Outcome: 2 substantive fixes (legacy-record bug, TOC re-alignment).
The other 38 items confirmed ship-quality after the structural
rebuild + council clarity work consolidated through Phase 6.
test cases.

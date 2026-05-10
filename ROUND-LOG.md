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

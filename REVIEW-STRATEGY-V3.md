# Review Strategy v3.0 — House of Mastery diagnostic suite

A 35-item review framework for ongoing world-class quality passes
on KOORA UNFINISHED (`index.html`, 60 items) and The First Hour
(`first-hour.html`, 54 chamber items + 6 agency items). Replaces
v2.0's 40-dimension framework and the 8-tier 41-item lattice used
through Round 8.

**The strategy applies to both instruments simultaneously.** Each
review round walks all 35 items on First Hour first, then KOORA,
landing fixes in cross-instrument parity where the same issue
surfaces on both. The goal is two assessments that read at
world-class voice, structure, and conversion across every surface.

The 35 items group into seven categories of five items each.

---

## A. Code & Performance (5 items)

| ID | Item | Pass criteria |
|----|------|---------------|
| A1 | Service worker version + cache strategy | VERSION bumped on every HTML change. CORE list includes all critical assets. Network-first for HTML, cache-first for assets. Per-asset graceful failure on install. |
| A2 | Critical CSS inlined / async loading | Single inline `<style>` block carries critical render-path styles. No external CSS blocking first paint. |
| A3 | JavaScript size + lazy loading | jsPDF lazy-loaded via `ensureJsPdf()` Promise singleton. No blocking 3rd-party scripts. Inline scripts ES5-clean. |
| A4 | localStorage persistence integrity | Versioned keys (`hom_firsthour_history_v3`, `koora_inprogress`, etc.). Try/catch on every read/write. Migration helper for version bumps. Legacy records flagged and guarded. |
| A5 | Console errors / dead code | Zero `console.log/error/warn` in production paths. No unreachable branches. No orphan CSS classes. |

## B. User Interaction & Experience (5 items)

| ID | Item | Pass criteria |
|----|------|---------------|
| B1 | Input handling | Likert keyboard (A/B/C/D + 1/2/3/4) + touch + auto-advance. Agency YES/NO binary keyboard-accessible. Text inputs autocomplete/inputmode/spellcheck correct. |
| B2 | Autosave + save-pill feedback | Every state change triggers persist + visual pill (1.6s). Resume across reload via `loadInProgress()`. |
| B3 | Skip-link + keyboard focus order | Skip-link first focusable. Tab order welcome → name → email → CTA. Decorative chips out of tab order. |
| B4 | Back button / recovery | `q-back` available after Q1; doesn't lose answers. Transition exit returns to next question. |
| B5 | Loading / error / empty states | jsPDF-unavailable alert. Email-webhook unavailable alert. Empty-name gate via focus. Validation error inline. |

## C. Visual Appearance & Response (5 items)

| ID | Item | Pass criteria |
|----|------|---------------|
| C1 | Color tokens disciplined | All color literals via `var(--token)`. No inline hex except in svg-icons or scoring legends. `color-scheme` respected. |
| C2 | Spacing rhythm | 8px-grid base (4/8/12/14/18/22/26/32). Token-based padding/margin via `--r-md`, `--r-lg`. |
| C3 | Animation / transitions | Smooth (cubic-bezier(.4,0,.2,1)). All animations respect `prefers-reduced-motion: reduce`. Block reveals, save-pill, button hover. |
| C4 | Mobile rendering ≥320px | Welcome / question / transition / agency / result all readable on smallest viewport. Touch targets ≥44px (per HIG). |
| C5 | Print stylesheet + PDF rendering | `@media print` hides chrome, shows result blocks. PDF pages render cover letter + audit profile + cost + forecast + own words + KOORA closing. |

## D. Text Hierarchy & Linguistic Precision (5 items)

| ID | Item | Pass criteria |
|----|------|---------------|
| D1 | Heading scale | h1 (hero/result) > h2 (block headers) > h3 (subheaders) > .eyebrow / .r-block-label. Visual hierarchy matches semantic. |
| D2 | Body text size unified | All body text 17px (or `.body-text` / `.lede` base). No orphan inline `font-size` overrides. |
| D3 | Italic / bold discipline | `<em>` for diagnostic emphasis (gold-underline on `.r-h1 em`). `<strong>`/`<b>` for emphasis without diagnostic weight. |
| D4 | Voice doctrine | No frequency hedges (`often`, `sometimes`, `usually`). No therapyspeak. No jargon (`driver is not in place` style). First-person interior verbs throughout. |
| D5 | Dedup / redundancy removal | No repeated claims across paragraphs. No clichés (`step into`, `show up for` — unless contextually specific). Pinker tightness on every sentence. |

## E. Question Psychology & Persuasion (5 items)

| ID | Item | Pass criteria |
|----|------|---------------|
| E1 | Seven-attribute compliance per question | Each item: first-person interior + concrete specificity + body-felt anchor (where appropriate) + low cognitive load (≤25 words, single proposition) + no escape route + universal register + chamber purity. |
| E2 | Cialdini: low-shame entry | First item per chamber lowest barrier. Recognition before diagnosis. Honesty as the only useful answer. |
| E3 | StoryBrand: customer is hero | "You" subject in copy. Dr Job is the guide (cover letter + byline + signature). Plan is the chambers / 180-day path. CTA explicit. |
| E4 | Frankl: mortality / meaning salience | "You will die" reframe earns its place. Legacy / inheritance / age anchors present. No morbidity, no flattery. |
| E5 | Hypnotic / rhythmic elements | Anaphora where it earns ("My word is my own. My choices are my own. My actions match what I say."). Embedded suggestion ("Notice it. Then keep walking."). Body cues throughout transitions. |

## F. Cover Pages & Authorial Presence (5 items)

| ID | Item | Pass criteria |
|----|------|---------------|
| F1 | Cover page precision | Welcome carries hero, lede, doctor credential, gold box, triad list. No marketing logistics intruding. Mobile-first scan. |
| F2 | Author image present | Dr Job photo (clinical headshot) on welcome cover letter + result author byline + PDF cover. Alt text + onerror fallback on every img. |
| F3 | Signature consistency | "Rooting for you. Job" — first-name only — same font as preceding cover-letter body. PDF signature matches. No mid-cycle slip to "Dr Job Mogire" inside the cover-letter sig line. |
| F4 | Brand mark / trademark line | KOORA logo + House of Mastery logo on respective welcomes. Trademark line consistent: `©House of Mastery with Dr Job Mogire™ · {Instrument}™ · The Unfinished Life™ · Don't Die With An Unfinished Life™ · www.mogire.com`. |
| F5 | Cover-letter prose | 3-4 short paragraphs, Don Miller-clean. Three-beat staccato closes ("Be specific. Be honest. It will honour an honest answer."). No long compound sentences. |

## G. Results & Conversion (5 items)

| ID | Item | Pass criteria |
|----|------|---------------|
| G1 | Result-page block ordering matches TOC chip | Every visible block named in TOC; TOC entries appear in render order. No orphan TOC entries. |
| G2 | Result narrative reads clear & scannable | Chamber paragraphs ≤95 words. Pattern-named uses concrete verbs. Agency Matrix explicit RGB axis labels. Cost cells use one-line concrete metaphors. |
| G3 | Diagnostic clarity | Loudest chamber named. Spirit pulse rendered distinctly (drift vs pulse legend). Agency RGB pills visible. Action plan keyed to red axes. |
| G4 | CTAs disciplined | Primary CTAs in CAPS with `.05em` letter-spacing. Gold accent on primary, navy on secondary. CTA copy is verb-led. |
| G5 | KOORA-funnel + community ladder | KOORA waitlist mailto + cohort CTA + Pamoja Hour + Mastery Hour visible on result page. Ladder rungs Pinker-clean. |

---

## How a round runs

1. **Read aloud both instruments end-to-end** through the seven-attribute lens + the council's master perspectives (Pinker, Frankl, van der Kolk, Heath, Handley, Norman, Kahneman, Don Miller, Cialdini, Pennebaker, Vaillant).
2. **Walk all 35 items on First Hour first**, then KOORA. For each item: status (ship / fix-now / defer), specific finding if any, fix applied or fix planned.
3. **Land fixes** in commit form. Bump SW VERSION on any HTML change.
4. **Update ROUND-LOG.md** with the round's findings.
5. **Validate** — counts, structure, linting if available, e2e if available.

The strategy is fixed. Each round produces concrete fixes plus
documentation; over time both instruments converge to world-class
across all 35 dimensions.

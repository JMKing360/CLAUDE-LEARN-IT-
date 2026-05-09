# House of Mastery — Progressive Review Strategy

**Purpose.** A self-directed review framework for iterating on UNFINISHED (KOORA) and The First Hour. Six hourly review rounds, each scored against forty dimensions, each followed by autonomous execution of improvements drawn from a thirty-action playbook.

**Scope.** Both files: `index.html` (KOORA · UNFINISHED) and `first-hour.html` (The First Hour). Plus `CHANGELOG.md`, `MANUS-RUNBOOK.md`, `README.md`, schema, PDF generation, image assets, and the `/images/` directory.

**Session anchor.** Branch `claude/build-mature-assessment-k6AT9`. Each review-round commit is tagged `v3.4.N-review-N` and pushed.

---

## 40 Review Dimensions

Each dimension is scored 1-5 (1 = absent or broken; 5 = council-grade). The composite score across all 40 should rise monotonically across the six rounds.

### Voice and prose (1–8)
1. **Voice consistency.** Present-tense observational register (*"When X, I..."*) holds across all 60 KOORA + 42 First Hour items.
2. **Council voice.** Doctrine alignment with Brown / Clear / Frankl / Cialdini / Kahneman / Greene / Perel / Ogilvy / Jung / Vignelli / Tufte / Norman.
3. **Six-tier variant completeness.** All 60 KOORA + 42 First Hour items have six hand-authored covenant tiers (Self · Body · Craft · People · Future · World).
4. **Variant tier voice match.** Each tier reads like a deliberate covenant framing, not a templated transformation.
5. **Em-dash and curly-quote hygiene.** No straight quotes or hyphens where typographic punctuation belongs.
6. **Cohort copy.** Cohort references (dates, seats, "twenty-four", "once a year") are consistent across both instruments.
7. **Author byline phrasing.** Canonical *Dr. Job Mogire, MD, FACC · Cardiologist · Author · Speaker* used everywhere.
8. **No "designed by" boilerplate left over.** Every credential line reflects the v3.3 canonical phrasing.

### Architecture and resolvers (9–14)
9. **Tier resolver correctness.** `retakeTier` returns 1–6 across all retake days/months; `variantIdx = min(text.length-1, max(0, rt-1))` clamps gracefully.
10. **Day cadence integrity.** KOORA `DAY_OPTIONS` and `milestones` array agree; legacy Day 15 records still display.
11. **Covenant boundary logic.** `activeCovenant(day)` agrees with `COVENANT_ENTRY` gating (Day 0, 45, 75, 105, 135, 165).
12. **Storage key versioning.** Storage keys (`koora_unfinished_v4`, `hom_firsthour_history_v3`, in-progress drafts) collision-free.
13. **In-progress autosave round-trip.** Refresh during assessment restores the same currentQ + answers + emoChoices + unfinishedSelected.
14. **`prefers-reduced-motion` honoured.** No animations breach the media query.

### Schema, SEO, meta (15–18)
15. **JSON-LD comprehensive.** Person · Organization · WebApplication · Quiz · Article all cross-referenced by `@id`. No missing fields.
16. **Domain hygiene.** All schema URLs use `hom.mogire.com` deployment domain consistently.
17. **OG/Twitter tags.** Description ≤155 chars; image URL absolute; `twitter:creator` present.
18. **`<meta name="description">`.** Reflects MD, FACC credential, descriptive role, instrument purpose.

### UX and accessibility (19–25)
19. **Keyboard navigation.** A/B/C/D, Enter, Backspace, Arrow Left work on every question.
20. **Focus-visible ring.** 3px gold focus indicator on every interactive element.
21. **ARIA labels and roles.** UNFINISHED items have `role="checkbox"`, `aria-checked`; emo radios are proper radio groups.
22. **Color contrast.** Body text against surface meets WCAG AAA (7:1).
23. **Mobile breakpoints.** Layout holds at 320px, 560px, 680px.
24. **Touch targets.** Interactive elements ≥44×44px on mobile.
25. **`prefers-color-scheme: dark` parity.** Both instruments render coherently in dark mode without contrast regressions.

### Author presence and visual (26–30)
26. **Photo wiring.** All four uploaded portraits appear in their intended contexts (cover letter, Meet Dr. Job, author byline, PDF).
27. **Photo crop fidelity.** `object-position` values favour face/torso prominence appropriately for each context.
28. **Cover letter prose.** Hand-authored, voice-aligned, no boilerplate.
29. **Meet Dr. Job bio.** Three-paragraph structure with credentials, vocation, and instrument context.
30. **Author byline on result.** Small avatar + canonical credential at the top of every result page.

### Email and PDF (31–35)
31. **GHL payload completeness.** Includes all relevant fields: scores, UNFINISHED selections, emo commitments, narrative paragraphs, contact, retake link.
32. **PDF page count and ordering.** KOORA: 5 pages including Doctor's note. First Hour: 4 pages.
33. **PDF Doctor's note signature.** Italic signature line, contact, date.
34. **PDF UNFINISHED self-naming.** Surfaces in First Hour PDF "Your own words" section.
35. **EMAIL_OK gate.** Only enables email button when GHL webhook URL is configured.

### Doctrine and content (36–40)
36. **UNFINISHED ten-letter taxonomy verbatim.** No paraphrasing of the canonical letters.
37. **KOORA-vs-non-KOORA funnel.** Lead-gen surfaces appear on First Hour for non-enrolled participants.
38. **Reaffirmation per-day messages.** Twelve hand-authored, covenant-aware.
39. **Covenant entry items.** Five hand-authored items per covenant + threshold sentence; subjectively "land" for the participant.
40. **First Hour 12-month cadence announcement.** Communicated clearly on result page and in email payload.

---

## 30 Specific Improvement Actions

Drawn against the dimensions above. Each round, pick the five to seven highest-leverage actions still pending; execute them; commit; push.

### Content authoring (variant prose)
1. **Author KOORA Section 3 (the four needs · 8 items × 3 = 24 strings).**
2. **Author KOORA Section 4 (forces and fidelities · 8 items × 3 = 24 strings).**
3. **Author KOORA Section 5 (faculties and practice · 10 items × 3 = 30 strings).**
4. **Author KOORA Section 6 (inner journey · 11 items × 3 = 33 strings).**
5. **Author First Hour Chamber 1 (Mind · 7 items × 3 = 21 strings).**
6. **Author First Hour Chamber 2 (Body · 7 items × 3 = 21 strings).**
7. **Author First Hour Chamber 3 (Word · 7 items × 3 = 21 strings).**
8. **Author First Hour Chamber 4 (Time · 7 items × 3 = 21 strings).**
9. **Author First Hour Chamber 5 (Money · 7 items × 3 = 21 strings).**
10. **Author First Hour Chamber 6 (People · 7 items × 3 = 21 strings).**

### Accessibility hardening
11. **Add `aria-live="polite"` to the chamber/section progress announcements** so screen readers register section changes.
12. **Add `aria-required="true"` to required input fields** (name, email).
13. **Add `inputmode="email"` to the email field** for better mobile keyboard.
14. **Add visible focus rings to result-page interactive elements** (Download PDF, Email me my report buttons).
15. **Audit color contrast** of `--mid` and `--dim` against `--surface`; lighten as needed for AAA compliance.

### Visual / branding
16. **Wire formal KOORA raster logo** (`/images/koora-logo.png`) on cover letter heading + PDF cover (currently uses inline SVG).
17. **Add OpenGraph alt-text overlay** to social card images for accessibility.
18. **Add print stylesheet** so a participant can print their result page legibly without the navigation chrome.
19. **Audit dark-mode contrast** on the new `.cover-letter`, `.meet-doctor`, `.unfinished-block`, `.koora-funnel` classes.
20. **Add manifest icon variants** at 192px and 512px (currently only inline SVG).

### Schema, SEO, meta
21. **Validate JSON-LD via schema.org Structured Data Testing Tool** principles inline (manual review for required fields).
22. **Tighten `<meta name="description">`** to ≤155 chars on both files for optimal search snippets.
23. **Add `og:image:alt`** descriptions to OpenGraph for social-feed accessibility.
24. **Add `<link rel="canonical">`** to both files pointing at the canonical hom.mogire.com URLs.
25. **Add `<meta name="robots" content="index, follow">`** for crawl clarity.

### UX and content polish
26. **Add a "saved progress" indicator** visible during the assessment (small mid-grey "Progress saved" pill that pulses on autosave).
27. **Add a covenant transition message** between sections during the KOORA assessment that notes which covenant the participant is in.
28. **Add scoring transparency** — a small expandable "How is this scored?" section at the top of the result page that documents the methodology and the 47% calibration source.
29. **Tighten cover-letter padding on mobile** (currently 26px; reduce to 22px under 380px viewport for breathing room).
30. **Add a `<noscript>` fallback** explaining the assessment requires JavaScript and offering a contact email for a paper version.

---

## Loop Operating Procedure

For each of the six review rounds:

1. **Read the latest state** of both `index.html`, `first-hour.html`, `CHANGELOG.md`.
2. **Score each of the forty dimensions 1–5.** Write the snapshot into `REVIEW-LOG.md` (append-only).
3. **Pick the five-to-seven highest-leverage improvements** still pending from the thirty-action list.
4. **Execute them.** Author prose, edit code, update CSS, refine schema.
5. **Validate JS** with `node -e` syntax check.
6. **Commit** with `v3.4.N-review-N` tag in the message and push to `claude/build-mature-assessment-k6AT9`.
7. **Append** the round's score-deltas and chosen actions to `REVIEW-LOG.md`.

After six rounds: Final score audit. If composite score ≥ 4.5/5 across all forty dimensions, ship as v3.5.0. Otherwise, continue with focused commits.

# UNFINISHED · The Mature Assessment — Build Spec

**Status:** Design complete. Ready to build.
**Target file:** `index.html` (single-file, no build step, no backend).
**Branch:** `claude/build-mature-assessment-k6AT9`
**Last updated:** 2026-05-06

---

## 1. What this is

A deep diagnostic taken by enrolled KOORA participants every 15 days across the 180-day program. Replaces the entry-level 4C Reflex Screen with a richer, longer-form mature assessment that maps the **full** KOORA architecture and shows **movement over time**.

- Length: **70 questions, 8 sections, ~22 minutes**
- Cadence: Day 0 (baseline), 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, then Alumni (Day 181+)
- Visual language: inherits from `4CKOORASCREEN.html` (slide-based UX, smooth transitions, navy/gold/cream palette, Source Serif 4 + Plus Jakarta Sans)
- Storage: `localStorage` only (no backend). Past assessments power the dashboard's journey timeline and the deltas on the results page.
- Delivery: in-browser results + email send (EmailJS) + PDF download (jsPDF) + 1080×1080 PNG share image.

---

## 2. Design principles (the unified genius mind)

| Principle | Source | How it shows up |
|---|---|---|
| One obvious next action | Norman, Cooper | Every screen has exactly one primary button |
| High data-ink ratio, sparkline journey | Tufte | Dashboard timeline; deltas as small multiples |
| Two type families, ruthless hierarchy | Vignelli, Rams, Ive | Source Serif 4 (headlines) + Plus Jakarta Sans (UI). Nothing else. |
| Observation, never verdict | Brown | "The pattern is the diagnosis, never the verdict." Stems are observational, not judgmental. |
| Identity language | Clear | "Where you are now," not "Your score." Re-takes framed as evidence of self-trust returning. |
| Anchor on growth, not deficit | Kahneman, Bandura | First thing returners see: what moved. |
| Slow questions, fast UI | Ive, Victor | Stems land carefully; transitions are 400-450ms. |
| Shame-resistant framing | Brown | "You are permitted to fall. You are not permitted to stop returning." Loud reflexes are pattern data, not moral failure. |

---

## 3. Hard constraints (from the user)

1. **No facilitator names visible** except Dr. Job Mogire (founder/architect, footer credit).
2. **RETURN arc is internal** — facilitator language only. Stage markers are asked (they produce useful diagnostic), but stage names (Rupture, Exposure, Tension, Unfolding, Rooting, New Normal) are **never displayed to the participant**. Stage detection ships in the email payload to `mail@mogire.com` for facilitator use.
3. **All inquiries** route to `mail@mogire.com` and the cohort WhatsApp community.
4. **WhatsApp group:** `https://chat.whatsapp.com/CGpEGJ5MuCRAAw3A6Akmp2`
5. **No marketing CTA / no `mogire.com/koora` redirect** — this is a tool for enrolled participants, not a funnel.
6. **Fonts:** Plus Jakarta Sans (body/UI) + Source Serif 4 (headlines). Google-hosted.
7. **Lean code:** single file, no frameworks, no unnecessary loops, escape participant input via `textContent`, pin script versions, `crossorigin="anonymous"`.
8. **Naming:** **UNFINISHED** is the headline — drops "Emotional Sovereignty Screen." The brand name is the diagnosis.

---

## 4. Architecture map (KOORA, distilled)

| Layer | Element | What this assessment measures |
|---|---|---|
| 1 — Foundation | ALCARRA (7 weekly postures) | not asked directly; lives in cadence |
| 2 — Spine | The Four Faculties: **Think, Feel, Choose, Do** | Section 2 (8 q's) |
| 3 — Daily anchor | The Daily Reset (5 prompts) | Section 7 (1 q for Reset performance) |
| 4 — Weekly quartets | 4Cs · 4 Hungers · 4 Forces (DODI) · 4 Fidelities | Sections 1, 3, 4 (4 Forces folded into prescriptive UNSTUCK output) |
| 5 — Monthly covenants | Self · Body · Craft · People · Future · World | mapped to Day milestones in selector |
| Diagnostic | UNFINISHED (10 patterns) | Section 5 (10 q's) |
| Asset | FOUNDATION (10 pillars) | Section 6 (10 q's) |
| Process | UNSTUCK (7 steps) | Surfaced as **YOUR UNSTUCK PATH** on results page (not asked) |
| Practice | Seal · Reset · Evening master Q · 24-Hour Return · Friday Cohort · Sunday Sealing | Section 7 (6 q's) |
| Internal | RETURN arc stages | Section 8 markers (8 q's, 2 inventory + 6 stage) — stage labels facilitator-only |

---

## 5. The 70 questions (source of truth)

All questions use the same 4-point Likert: `Rarely or never (1)` · `Sometimes (2)` · `Often (3)` · `Most of the time (4)`.

Stem: "**In the past 15 days...**" (or "since your last assessment" if returning early).

Questions marked `reverse: true` are scored such that **high = good** (positive items: Faculties, Fidelities, FOUNDATION, Practice, Inventory progress). All others are scored such that **high = pattern is loud** (4Cs, hunger substitutes, UNFINISHED, stage markers).

### Section 1 — The 4Cs (16) — `key: complaining|criticizing|comparing|competing`

**Complaining**
1. I named what was wrong faster than I named what I would do about it.
2. I described the same problem more than once without changing my approach.
3. I felt the relief of venting, but the situation stayed the same.
4. I forfeited agency — I treated the circumstances as the reason.

**Criticizing**
5. The voice in my head was harsher than I would ever be with someone I love.
6. I rehearsed mistakes longer than I extracted lessons from them.
7. I noticed my flaws faster than I noticed what was working.
8. I forfeited authority — the harshest voice inside me carried the final say.

**Comparing**
9. I measured my pace against someone else's pace.
10. I felt smaller after looking at someone's life than before I looked.
11. I downgraded my own progress when I saw someone else's.
12. I forfeited ground — I lost track of what I actually want.

**Competing**
13. I tracked who is ahead of me in my field.
14. My sense of worth moved with whether I was winning.
15. I did things mainly to be seen doing them.
16. I forfeited direction — I oriented around approval, not what is mine to build.

### Section 2 — The Four Faculties (8) — `reverse: true`

**Think · Interpretation**
17. I asked of my thoughts: "Is this true?" before acting on them.
18. I noticed when interpretation slipped into invention.

**Feel · Ownership**
19. I owned my feelings rather than blamed them on others.
20. I let myself feel what was actually present, without managing or numbing.

**Choose · Agency**
21. The choices I made were mine — not a script inherited from someone else.
22. When I caught myself running an inherited pattern, I refused it.

**Do · Embodiment**
23. The actions I took matched the words I had spoken.
24. I closed the gap between what I said and what I did within the day.

### Section 3 — The Four Hungers (8) — alternating

**Aliveness**
25. *(filled, reverse:true)* I felt genuinely alive — present, in my body, awake to what is here.
26. *(substituted)* I reached for intensity (stimulation, urgency, drama) as a substitute for presence.

**Connection**
27. *(filled, reverse:true)* I felt deeply rooted in real relationships, not curated ones.
28. *(substituted)* I reached for reach (followers, network, broader audience) as a substitute for roots.

**Meaning**
29. *(filled, reverse:true)* I sensed depth in what I was doing — that it carries weight beyond performance.
30. *(substituted)* I reached for breadth (more topics, more options, more directions) as a substitute for depth.

**Fulfillment**
31. *(filled, reverse:true)* I felt enough — the quiet sense that I have what I need.
32. *(substituted)* I reached for more (more income, more recognition, more achievement) as a substitute for enough.

### Section 4 — The Four Fidelities (4) — `reverse: true`

33. **Mind · Interpretation:** I thought what was mine to think — not the inherited script.
34. **Heart · Ownership:** I felt what was mine to feel — not what I was trained to perform.
35. **Will · Agency:** I chose what was mine to choose — not what was easier or expected.
36. **Hand · Embodiment:** I did what was mine to do — and the doing matched the saying.

### Section 5 — The UNFINISHED Inventory (10) — `key: unfinished_<letter>`

37. **U — Unkept Promises:** My word to myself lost credibility — promises I made, broken without ceremony.
38. **N — Negotiating Constantly:** I bargained with myself — "just today," "tomorrow," "after this one thing."
39. **F — Fragmented Identity:** I felt like a committee of half-formed selves rather than one clear person.
40. **I — Inherited Patterns:** I ran a pattern I did not invent — watched, absorbed, not yet refused.
41. **N — Neglected Completion:** I stopped at ninety percent. The last ten — where the value lives — went unmade.
42. **I — Intelligence Weaponized:** My mind built excellent excuses, dressed up as analysis.
43. **S — Self-Trust Bankrupt:** My account with myself was overdrawn. I did not believe my own word.
44. **H — Hidden Shame:** I performed public confidence over private shame. The mask was heavy.
45. **E — Exhausted From Carrying:** I was tired — not from work, but from dragging what I never finished.
46. **D — Deferred Action As Lifestyle:** "Later" was my operating system. The day arrived. I postponed it again.

### Section 6 — The FOUNDATION Pillars (10) — `reverse: true`, `key: foundation_<letter>`

47. **F — Focus & Goal Setting:** I held a focus this period — one clear thing I was working toward, named in writing.
48. **O — Openness to Growth:** I welcomed feedback that contradicted my current view, and let it change something.
49. **U — Unwavering Resilience:** When I fell, I returned within hours, not days — and the return itself was the strength.
50. **N — Nurturing Relationships:** I tended to one or more relationships with attention they could feel.
51. **D — Deep Self-Awareness:** I noticed my patterns as they arose — not after the damage, but during the moment.
52. **A — Action & Accountability:** I moved before I felt ready, and I told a witness what I would do and what I did.
53. **T — Trust & Integrity:** My word held this period — what I said and what I did were the same thing.
54. **I — Intrinsic Motivation:** I did things because they were mine to do, not for approval, score, or audience.
55. **O — Optimistic Outlook:** I saw what could still be built, not only what had not yet been built.
56. **N — Never-ending Learning:** I extracted the lesson before I let go of the experience — even when it hurt.

### Section 7 — Practice Integrity (6) — `reverse: true`

57. **The Seal:** Performed at sunrise — hand on heart, one breath, before phone, coffee, message.
58. **The Daily Reset:** Five prompts, five words or fewer, after the Seal.
59. **The Evening Master Question:** Where did I keep fidelity? Where did I break it? Where do I return tomorrow?
60. **The 24-Hour Return:** When I missed a Movement, I ran the protocol — Name, Refuse, Seal, Reset, Send.
61. **The Friday Cohort:** I showed up and spoke truth aloud.
62. **The Sunday Sealing:** Enduring Clause, week review, "this week is finished."

### Section 8 — The Inner Journey (8)

**Inventory** (2, `reverse: true`)
63. Of my Day 0 ten unfinished commitments, I have moved one or more to a clean, witnessed close — Completed, Released, Delegated, Submitted, Repaired, Decided, or Sealed.
64. I am clear on the smallest honest finish for at least three of my unfinished items right now.

**Inner experience markers** (6, normal scoring; **stage labels NEVER shown to participant**)
65. *(arc_rupture)* I feel disoriented, fragile — the ground feels like it is moving under me, and I am still here.
66. *(arc_exposure)* I am confronting the gap between who I claim to be and who my actions show me to be — and it stings.
67. *(arc_tension)* I have great days followed by crashes back into old patterns. I feel pulled in two directions.
68. *(arc_unfolding)* I am catching myself responding from a self I have not been before, and it feels surprisingly easy.
69. *(arc_rooting)* I feel calm confidence — when I see another person stuck in a pattern I used to run, I want to help them through it.
70. *(arc_newnormal)* The new way is now my default. Going back to the old way would take more effort than continuing.

---

## 6. Scoring rules

```
For each question:
  raw = answer (1..4)
  display_score = reverse ? raw : raw    // we keep raw scores; reverse flag affects level labels only

Per domain:
  sum = Σ raw answers in domain
  max = 4 × question_count
  pct = sum / max

Level bands (for negative items: 4Cs, hunger substitutes, UNFINISHED, arc markers):
  pct ≤ 0.44   → Quiet
  0.44 < pct ≤ 0.69 → Active
  pct ≥ 0.70   → Loud

Level bands (for positive items: Faculties, Hungers filled, Fidelities, FOUNDATION, Practice, Inventory):
  pct ≤ 0.44   → Beginning
  0.44 < pct ≤ 0.69 → Practicing
  pct ≥ 0.70   → Embodied

Practice Fidelity Rate (the headline metric for returners):
  fidelity_rate = (sum of practice answers) / (4 × 6) × 100   // 0-100%

RETURN arc stage detection (internal only):
  active_stage = argmax(arc_rupture, arc_exposure, arc_tension, arc_unfolding, arc_rooting, arc_newnormal)
  arc_alignment = compare active_stage to chronological day map:
    Day 0-21 → Rupture
    Day 22-60 → Exposure
    Day 61-100 → Tension
    Day 101-150 → Unfolding
    Day 151-170 → Rooting
    Day 171+ → New Normal
  alignment = 'with' | 'ahead' | 'behind'
```

---

## 7. UNSTUCK prescription (results page)

Generated server-side-style from results, surfaced to participant. The 7 steps adapt to which C is loudest, which faculty broke, which UNFINISHED letters are highest, which FOUNDATION pillar is weakest.

```
YOUR UNSTUCK PATH — the next 15 days

U — Uncover the obstacle
   The loudest reflex this period is [Comparing]. The faculty it forfeits is [Choose · Agency].
   The UNFINISHED letter most active: [I — Inherited Patterns].

N — Narrow your focus
   One C. One faculty. One UNFINISHED letter. Nothing else moves until these do.

S — Strategize solutions
   [Three strategies pulled from REFLEX_DATA[loudest_C].strategies]

T — Take action — start
   Pick strategy #1. Do the smallest version of it tomorrow before noon.
   Tell one witness what you will do and report back when it is done.

U — Unwind and run the tape
   When the reflex fires, name it. Run the tape back: what triggered it, what came in
   underneath, what you reached for. The pattern is the diagnosis, never the verdict.

C — Calibrate, celebrate
   At sunset, mark the day. Did you hold? Did you fall? Did you return?
   The covenant is not perfection. The covenant is return.

K — Keep going
   15 more days. Then return here. Movement is data. Stillness is data. Both tell the truth.
```

The strongest FOUNDATION pillar is named as the asset to lean on; the weakest is named as the next pillar to grow.

---

## 8. Day selector (intro slide)

Dropdown, pre-selects the next-due day based on history:

```
Day 0 — Baseline
Day 15
Day 30 — End of Self Covenant
Day 45
Day 60 — End of Body Covenant
Day 75
Day 90 — Ninety-Day Milestone (End of Craft)
Day 105
Day 120 — End of People Covenant
Day 135
Day 150 — End of Future Covenant
Day 165
Day 180 — The Sealing
Alumni (Day 181+)
```

---

## 9. Dashboard (returners)

Shown when localStorage history exists for this name. First slide replaces the welcome.

```
Welcome back, [Name].

YOUR PATH SO FAR

  ●———●———●—— ○ ─ ─ ─ ○ ─ ─ ─ ○
  D0  D15 D30   D45    D60    D75
                 ▲ Today

  Last assessment: Day 30 — taken 16 days ago
  Loudest reflex: Comparing (Active, ↓2 from Day 15)
  Strongest pillar: Trust & Integrity (Embodied, ↑3 from Day 0)
  Practice fidelity: 73% (↑12 from Day 15)

WHAT MOVED

  4Cs            Comparing  ↓ 2     Competing  ↓ 1
  FOUNDATION    Trust       ↑ 3     Resilience ↑ 2
  Practice      Seal        ↑ 1     24-Hr Ret. ↑ 2

  [ Take your Day 45 Assessment → ]

  [ View past results ]   [ Reset history ]
```

Tufte sparkline at top: dots filled for completed days, hollow for upcoming, current day marked with `▲ Today`.

---

## 10. Results page structure

Order is deliberate: orient first, evidence second, prescription third, action fourth.

1. **Headline** — "What is running you, [Name]." or for returners: "[Name], here is what moved."
2. **Pattern Profile** — score table for 4Cs (with deltas if returner)
3. **The Four Faculties** — spine score (Think/Feel/Choose/Do)
4. **The Four Hungers** — filled vs substituted, side by side per hunger
5. **The Four Fidelities** — single-line Mind/Heart/Will/Hand
6. **UNFINISHED Inventory** — 10-letter heat strip (color-coded loud/active/quiet per letter)
7. **FOUNDATION Pillars** — 10-letter heat strip (color-coded embodied/practicing/beginning)
8. **Practice Integrity** — Fidelity Rate as headline number, 6 practice items as small multiples
9. **Finish Inventory health** — 2 inventory items
10. **Movement** (returners only) — what moved vs previous, what moved vs Day 0
11. **YOUR UNSTUCK PATH** — the 7-step prescription (described in §7)
12. **Email/PDF/Image** delivery block
13. **Footer** — Dr. Job Mogire MD FACC · Founder · House of Mastery · mail@mogire.com · cohort WhatsApp

**Never shown:** RETURN arc stage names, stage detection, alignment with chronological day. These ship in the email payload only.

---

## 11. Storage schema (localStorage)

Key: `koora_unfinished_history`
Value: JSON array of records:

```js
{
  date: '2026-05-06T05:14:23.000Z',
  day: 15,                       // 0,15,30,...,180,181
  name: 'Job',
  answers: { 1: 3, 2: 4, ..., 70: 2 },
  scores: {
    complaining: 12, criticizing: 8, comparing: 14, competing: 9,
    faculty_think: 6, faculty_feel: 5, faculty_choose: 7, faculty_do: 6,
    hunger_aliveness_filled: 3, hunger_aliveness_subst: 2,
    // ...
    foundation_F: 3, foundation_O: 4, ...,
    practice_total: 17,
    fidelity_rate: 71,
    inventory_moved: 3, inventory_clear: 4,
    arc_rupture: 1, arc_exposure: 2, arc_tension: 3, arc_unfolding: 2, arc_rooting: 1, arc_newnormal: 1
  },
  primary_reflex: 'comparing',
  primary_level: 'active',
  active_stage: 'tension',       // facilitator-internal; do not surface
}
```

Comparison:
- Most recent prior with case-insensitive name match → "delta vs previous"
- Earliest record (day === 0) → "delta vs baseline"

---

## 12. Email payload (EmailJS template `template_3j2uhtd`)

Same EmailJS service ID `service_76loif8` and public key `FEEOw8NA0cwBM4Vum` as the original screen. Update template variables:

```
to_name, to_email
cc_email = mail@mogire.com
day_label, day_number
primary_reflex, primary_level
unstuck_path_html (the 7-step prescription rendered)
score_table_html (all 8 sections)
foundation_top, foundation_bottom
unfinished_top, unfinished_bottom
practice_fidelity
movement_summary (deltas, returners only)
arc_stage_internal           // facilitator-only field; rendered in email but not in UI
arc_alignment_internal       // 'with' | 'ahead' | 'behind'
```

CC `mail@mogire.com` so the facilitator receives a copy of every assessment, including the internal arc data.

---

## 13. Required external scripts (pinned, with crossorigin)

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4.4.1/dist/email.min.js" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" crossorigin="anonymous"></script>
```

Defensive: both load behind `try/catch`; if either fails, the relevant button shows a graceful message and the rest of the assessment still works.

---

## 14. Build checklist

- [ ] Skeleton HTML with `<head>` (fonts, scripts, viewport meta)
- [ ] CSS tokens + slide UX (inherit from `4CKOORASCREEN.html`)
- [ ] Dashboard slide (returners only)
- [ ] Welcome slide (first-time)
- [ ] Day selector dropdown
- [ ] 70 question slides (one per question)
- [ ] Section transition slides (8 total) — brief intro to each section
- [ ] Results slide with 13-block structure (§10)
- [ ] UNSTUCK prescription generator (§7)
- [ ] Storage helpers (load/save/list/delete history)
- [ ] Comparison engine (delta vs previous, delta vs baseline)
- [ ] RETURN arc detector (internal-only)
- [ ] Email send with full payload (§12)
- [ ] PDF generation (clean, no arc labels, A4 portrait)
- [ ] 1080×1080 share image (canvas)
- [ ] Footer with Dr. Job Mogire credit
- [ ] mail@mogire.com mailto links throughout
- [ ] WhatsApp group link in footer / contact block
- [ ] All participant input escaped via `textContent`
- [ ] Beforeunload guard during questions, lifted on results

---

## 15. Resources

- **Source materials:** `/root/.claude/uploads/7d88ec8b-96d0-4dee-a0eb-4eca65bfec37/` and `/root/.claude/uploads/429b83a9-0f42-4bea-af37-977d635e6496/`
- **Latest screen UX reference:** `4CKOORASCREEN.html` inside `cac11919-4CKOORASCREEN_assessment.zip`
- **Master Architecture:** `KOORA_Master_Architecture_v3.docx` — authoritative source of truth for all framework language
- **Teacher's Manual (RETURN arc):** `The_Psychology_of_Transformation_Teachers_Manual.md` — facilitator-only

---

*The covenant is not perfection. The covenant is return.*
*— Dr. Job Mogire, KOORA Master Architecture v3*

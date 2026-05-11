# House of Mastery — Iconography System

**Version:** 1.0 (shipped in `v3.6.0` of the assessment suite)
**Author:** Designed for Dr. Job Mogire, MD, FACC · House of Mastery
**Purpose:** Quiet visual support for the doctrine — icons that fade faintly into the page rather than competing with the prose.

---

## Design system at a glance

| Property | Value |
|---|---|
| ViewBox | `0 0 24 24` |
| Stroke | `currentColor` (inherits from surrounding text colour) |
| Stroke width | `1.5` |
| Stroke linecap | `round` |
| Stroke linejoin | `round` |
| Fill | `none` |
| Native size | 24×24 (rendered at any size via `width`/`height`) |
| Default render | 48×48 (set in the standalone files for easy preview) |
| Family weight | Line / outline only — no filled glyphs |
| Brand colours | Navy `#0D1F3C` · Gold `#C9973A` · the icons accept any `color` value via `currentColor` |

**Three opacity tiers** (defined in CSS, applied via class):

| Tier | Class | Opacity | Use |
|---|---|---|---|
| Ambient | `.icon--ambient` | `0.06` | Large background marks behind hero text. Disappear faintly. |
| Featured | `.icon--featured` | `0.32` | Medium decorative marks on cards (covenant entry section, etc.). |
| Inline | `.icon--inline` | `1.00` | Functional placement inside text or next to a label. |

The opacity tier and the colour are decoupled — any tier can be used in navy, gold, or `currentColor`.

---

## The 16 icons

### Six covenants — KOORA: The Finisher's Protocol

The 180-day path of KOORA moves through six covenants in order. Each covenant is a 30-day frame within which the participant practises one specific fidelity.

| File | Concept | Glyph | Used in |
|---|---|---|---|
| `icon-self.svg` | **Self.** Self looking at self. The first covenant: bringing your word back to your own ear. | Concentric circles — a small inner circle inside a larger outer circle. The eye of awareness watching its own centre. | Welcome screen constellation · Day 0–30 covenant entry · Day 14/30 reaffirmation |
| `icon-body.svg` | **Body.** The vessel that carries you. The second covenant: stopping the override. | A heart in pure outline. | Welcome screen constellation · Day 31–60 covenant entry · Day 45/60 reaffirmation |
| `icon-craft.svg` | **Craft.** Honouring the work entrusted to you. The third covenant: serving the work, not making the work serve you. | A chisel or sculptor's tool, angled across the field as if mid-stroke. | Welcome screen constellation · Day 61–90 covenant entry · Day 75/90 reaffirmation |
| `icon-people.svg` | **People.** Becoming different at home before being different anywhere else. The fourth covenant. | Two figures, one slightly behind the other — head and shoulders silhouettes — with a shared baseline. The relational covenant. | Welcome screen constellation · Day 91–120 covenant entry · Day 105/120 reaffirmation |
| `icon-future.svg` | **Future.** Stopping the betrayal of the person you are becoming. The fifth covenant: acting on behalf of your seventy-year-old self. | A horizon line with a sun rising and a vertical arrow pointing up. | Welcome screen constellation · Day 121–150 covenant entry · Day 135/150 reaffirmation |
| `icon-world.svg` | **World.** Giving back from the life you have rebuilt. The sixth and final covenant. | A globe with one equator and two longitudinal arcs. | Welcome screen constellation · Day 151–180 covenant entry · Day 165/180 reaffirmation |

### Six chambers — The First Hour

The First Hour is the entry-level diagnostic. Forty-two items across six chambers — six rooms of the unconscious life.

| File | Concept | Glyph | Used in |
|---|---|---|---|
| `icon-mind.svg` | **The Mind that Stopped Thinking.** Borrowed opinions, scrolled certainties. | An open notebook with horizontal rule lines — the page that has been read into rather than thought into. | First Hour welcome constellation · Chamber 1 result label |
| `icon-body.svg` | **The Body that Got Forgotten.** The vessel as vehicle. | (Same heart icon as the Body covenant — same concept across both instruments.) | First Hour welcome constellation · Chamber 2 result label |
| `icon-word.svg` | **The Word that Lost Weight.** Promises broken without ceremony. | Three horizontal lines, the bottom line scripted as a signature — the oath set down. | First Hour welcome constellation · Chamber 3 result label |
| `icon-time.svg` | **The Time that Disappeared.** Years that cannot be accounted for. | An hourglass — two triangles meeting at the waist, top and bottom rails sealed. | First Hour welcome constellation · Chamber 4 result label |
| `icon-money.svg` | **The Money that Owns You.** Inherited patterns, unspoken weight. | A coin face inscribed with an "S" curve — abstracted dollar glyph rendered in pure line. | First Hour welcome constellation · Chamber 5 result label |
| `icon-people-alt.svg` | **The People you are Performing With.** Performance over presence. | A landscape — a mountain ridge with two peaks and a baseline floor — read as two figures held within a shared frame. The relational chamber rendered as terrain rather than silhouette. | First Hour welcome constellation · Chamber 6 result label |

### Four reflexes — KOORA assessment, Section 1

The four reflexes are the patterns that run a person when they are not paying attention. The first sixteen items of the KOORA UNFINISHED diagnostic measure them.

| File | Concept | Glyph | Used in |
|---|---|---|---|
| `icon-complaining.svg` | **Complaining.** Naming what is wrong faster than what to do about it. | A speech bubble with two horizontal lines inside (the unspoken script) and a tail descending. | Available for KOORA result-page reflex labels |
| `icon-criticizing.svg` | **Criticizing.** Letting the harshest inner voice have the final say. | A circle with a vertical stroke and a dot below — the warning glyph, drawn so it reads as caution rather than reprimand. | Available for KOORA result-page reflex labels |
| `icon-comparing.svg` | **Comparing.** Losing your own ground when you see someone else's. | Two parallel verticals with horizontal arms reaching across — two columns measuring against each other. | Available for KOORA result-page reflex labels |
| `icon-competing.svg` | **Competing.** Tracking the scoreboard instead of the work. | A flag on a pole — the flag billowing into a forked tail, the pole holding the upright. | Available for KOORA result-page reflex labels |

### Ornament

| File | Concept | Use |
|---|---|---|
| `icon-spark.svg` | A radiating eight-point star — used as a small ornamental mark on threshold transitions or section separators when present. | Optional, decorative |

---

## Usage

### Inline SVG (preferred)

Drop the file's contents directly into the HTML. The `currentColor` stroke will inherit from the surrounding text colour, so the same icon can render navy on a light surface and gold on a dark surface without modification.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="1.5"
     stroke-linecap="round" stroke-linejoin="round"
     width="24" height="24" aria-hidden="true">
  <circle cx="12" cy="12" r="3"/>
  <circle cx="12" cy="12" r="9"/>
</svg>
```

### `<img>` tag (with onerror fallback)

```html
<img src="/icons/icon-self.svg" alt="" width="24" height="24"
     onerror="this.style.display='none'">
```

Note: stroke colour can't be controlled from outside the SVG when used as `<img>`. The standalone files default to `currentColor` which renders as black inside an `<img>` — for colour control, use inline SVG or load the file via `fetch` and inject it.

### Sprite (for many icons)

Combine all 16 into a single SVG file with `<symbol>` blocks at the top of `<body>`, then reference each by ID:

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <symbol id="icon-self" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <circle cx="12" cy="12" r="9"/>
    </symbol>
    <!-- … -->
  </defs>
</svg>

<!-- Use anywhere -->
<svg class="icon"><use href="#icon-self"/></svg>
```

This is what the v3.6.0 build uses — see `index.html` and `first-hour/index.html` in the repo.

---

## Design principles

1. **Quiet support, not decoration.** An icon earns its pixels by aiding recognition, not by performing brand. Most uses sit at low opacity (0.06–0.32). The icon should *help the reader find a section without competing with the words inside it*.
2. **One stroke weight, one line.** Every icon is drawn at `stroke-width: 1.5` with no fills. This keeps the family coherent across all sizes and contexts.
3. **`currentColor` discipline.** The icon's colour is determined by its surroundings. Never hard-code navy or gold inside the SVG paths. The instrument's two brand colours (navy `#0D1F3C`, gold `#C9973A`) are applied via the parent element's `color` property.
4. **Concept, not metaphor.** Each icon represents a doctrine concept directly — Self is concentric circles (the eye of self-awareness), Future is a horizon (what you are walking toward), Body is a heart (the vessel that asks). No decorative metaphors that need explanation.
5. **Even visual weight.** All sixteen icons render with roughly equivalent ink-to-air ratio, so a constellation of six can be placed at the same opacity and read as a balanced field rather than a hierarchy.

---

## File listing

```
icons/
├── README.md                 (this file)
├── manifest.json             (machine-readable index)
├── preview.html              (visual catalogue — open in a browser)
├── icon-self.svg             (covenant 1)
├── icon-body.svg             (covenant 2 / chamber 2)
├── icon-craft.svg            (covenant 3)
├── icon-people.svg           (covenant 4)
├── icon-future.svg           (covenant 5)
├── icon-world.svg            (covenant 6)
├── icon-mind.svg             (chamber 1)
├── icon-word.svg             (chamber 3)
├── icon-time.svg             (chamber 4)
├── icon-money.svg            (chamber 5)
├── icon-people-alt.svg       (chamber 6 — distinct from covenant People)
├── icon-complaining.svg      (reflex 1)
├── icon-criticizing.svg      (reflex 2)
├── icon-comparing.svg        (reflex 3)
├── icon-competing.svg        (reflex 4)
└── icon-spark.svg            (ornament)
```

---

## License and attribution

Icons authored for House of Mastery by the Claude Code session that built v3.2.0–v3.6.0 of the diagnostic suite. They are part of the House of Mastery codebase and may be modified, extended, or redrawn by anyone working on the instrument family. If a designer or another LLM is producing the next iteration of these icons, please respect the design principles above — particularly the `currentColor` discipline and the *quiet support* posture. The icons should never become a layer that competes with the prose.

If you redraw, increment the version (`1.x`) in this README and note which icons changed.

# House of Mastery — Diagnostic Instruments

This repository holds the source for the diagnostic instruments of **House of Mastery**, the body of work of **Dr. Job Mogire, MD, FACP, FACC**.

| File | Instrument | Audience | Cadence |
|---|---|---|---|
| `first-hour.html` | The First Hour | General professional, top of funnel | Every 30 days, six retakes |
| `index.html` | UNFINISHED, the diagnostic of KOORA: The Finishing Protocol | Enrolled cohort | Every 15 days, thirteen returns |
| `privacy.html` | Privacy policy (GDPR + CCPA + Kenya DPA + LGPD) | All | Static |
| `SPEC.md` | Build specification | Internal | Static |
| `reference/4CKOORASCREEN.html` | UX baseline reference | Internal | Static |

The instruments are single-file static HTML, runnable from any host that serves files.

## What this assessment is

A clinical-grade diagnostic instrument for what is now called **The Unfinishing Life**: the active daily erosion of the word given to oneself. The First Hour is the entry instrument. KOORA is the deeper protocol.

The promised direction is **The Finishing Life**, delivered through **The Finishing System**: The First Hour, the Pamoja Hour, the Mastery Hour, KOORA: The Finishing Protocol, and the live sessions and summit that follow.

## Doctrine vocabulary (locked)

| Term | Meaning |
|---|---|
| The Unfinishing Life | The active, daily condition. Not "unfinished" (passive), but "unfinishing" (in motion). |
| The Finishing Life | The destination: a life where the word given holds. |
| The Finishing System | The full ecosystem of instruments, gatherings, and protocols. |
| The Finishing Protocol | The 180-day architecture, branded as KOORA. |
| The Finisher | The identity claimed by the participant. |
| Don't die with an unfinishing life | The signature line. |

## Architecture overview

Each instrument is a single self-contained HTML file with inline CSS and JavaScript. The only external dependencies are:

- **Google Fonts** (Source Serif 4 + Plus Jakarta Sans) loaded over HTTPS
- **EmailJS browser SDK** (pinned `@4.4.1`) for sending the report
- **jsPDF** (pinned `2.5.1`) loaded **on demand** when the participant clicks Download Report

State persists in `localStorage` with namespace keys:

| Key | What it stores |
|---|---|
| `hom_firsthour_history_v2` | Completed First Hour assessments (history) |
| `hom_firsthour_inprogress` | In-progress First Hour answers (autosave, cleared on completion) |
| `koora_unfinished_v3` | Completed KOORA assessments (history) |
| `koora_inprogress` | In-progress KOORA answers (autosave, cleared on completion) |

## Question architecture

Each item has **three tier variants** keyed to the participant's place on the path:

- **Tier 0** (start): names the wound. *"When I see someone ahead of me, I shrink."*
- **Tier 1** (middle): names the noticing. *"When I see someone ahead, I notice the shrink before it lands."*
- **Tier 2** (end): names the new capacity. *"When I see someone ahead, I can stay on my own ground."*

Tier resolution:

| Instrument | Tier 0 | Tier 1 | Tier 2 |
|---|---|---|---|
| First Hour | Returns 1–2 (months 1–2) | Returns 3–4 (months 3–4) | Returns 5+ (months 5+) |
| KOORA | Day 0–30 | Day 31–90 | Day 91+ |

Likert anchors: **Almost never · Some weeks · Most weeks · This is how I live.**

## Scoring

Subscale scores are unweighted sums normalised to percentage of maximum. Three-band classification:

- **Negative items** (the four reflexes, UNFINISHED): ≤44% Quiet, 45–69% Active, ≥70% Loud
- **Positive items** (faculties, fidelities, postures, practice): ≤44% Beginning, 45–69% Practicing, ≥70% Embodied

Cost estimation uses the participant's own answers and is rough but defensible. The methodology page in each PDF documents the construct base, item composition, scale, scoring rules, and convergent reference to the self-regulation literature.

## Email delivery

Reports send via EmailJS:

- Service: `service_76loif8`
- Template: `template_3j2uhtd`
- Public key: `FEEOw8NA0cwBM4Vum`
- Silent CC: `mogiremd@gmail.com` (not surfaced to the participant)
- Public contact: `mail@mogire.com`

## Privacy & compliance

Full policy in `privacy.html`. Compliant with GDPR (EU + UK), CCPA + CPRA, Kenya DPA 2019, LGPD (Brazil). Linked from the welcome consent line and the footer of each instrument. **A privacy-counsel pass is required before public launch**, including completing the postal address and EU representative fields.

## Deployment

Cloudflare Pages production setup:

1. **Branch**: `main` (merge `claude/build-mature-assessment-k6AT9` first)
2. **Build command**: empty
3. **Output directory**: empty (serves from repository root)
4. **Custom domains**:
   - `firsthour.houseofmastery.co` → root index of First Hour build (or rename `first-hour.html` to `index.html` in a Pages routing rule)
   - `kooraassess.houseofmastery.co` → root index of KOORA build
   - `houseofmastery.co/privacy` → `privacy.html`

For retake email links, use URL parameters:

```
https://firsthour.houseofmastery.co/?name=Job&email=jobsm2005@gmail.com
```

The page reads URL params and prefills the form.

## Development

The instruments are vanilla HTML / CSS / JavaScript. No build step. To work on them:

```bash
git clone <repo>
cd CLAUDE-LEARN-IT-
git checkout claude/build-mature-assessment-k6AT9
# Open the file in any browser
open first-hour.html
```

To validate the JS embedded in either file:

```bash
awk '/^<script>$/{flag=1;next}/^<\/script>$/{flag=0}flag' first-hour.html > /tmp/check.js
node --check /tmp/check.js
```

## Documentation

| File | Purpose |
|---|---|
| `README.md` | This file |
| `SPEC.md` | Original build specification |
| `CHANGELOG.md` | Versioned history of changes |
| `CONTRIBUTING.md` | Conventions for contributing |
| `SECURITY.md` | Security policy and reporting |
| `LICENSE` | Copyright and use terms |

## Credits

**Architect**: Dr. Job Mogire, MD, FACP, FACC.
**Entity**: House of Mastery.
**Public contact**: [mail@mogire.com](mailto:mail@mogire.com)
**Site**: [houseofmastery.co](https://www.houseofmastery.co)

---

*Don't die with an unfinishing life.*

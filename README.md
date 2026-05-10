# House of Mastery — Diagnostic Instruments

This repository holds the source for the diagnostic instruments of **House of Mastery**, the body of work of **Dr. Job Mogire, MD, FACP, FACC**.

Each instrument is independent — its own URL, its own state, its own service-worker cache scope.

| Path on disk | Served at | Instrument | Audience | Cadence |
|---|---|---|---|---|
| `index.html` | `/` (also `/koora` 301 → `/`) | UNFINISHED, the diagnostic of KOORA: The Finishing Protocol | Enrolled cohort | Every 15 days, thirteen returns |
| `first-hour/index.html` | `/first-hour/` | The First Hour | General professional, top of funnel | Every 30 days, six retakes |
| `privacy.html` | `/privacy` (rewrite) | Privacy policy (GDPR + CCPA + Kenya DPA + LGPD) | All | Static |
| `SPEC.md` | n/a | Build specification | Internal | Static |
| `reference/4CKOORASCREEN.html` | n/a | UX baseline reference | Internal | Static |

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
- **GoHighLevel inbound webhook** for delivering the report by email (no client-side SDK; the instrument POSTs JSON to the webhook URL)
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

Reports send via a **GoHighLevel inbound webhook**. The instrument constructs a JSON payload client-side and POSTs it to the configured webhook URL. A GoHighLevel automation receives the payload, formats the email, and dispatches it to the participant with a silent CC to the cohort archive.

- Webhook URL: configured per-environment via `window.HOM_CONFIG.ghlWebhookUrl`
- Silent CC archive: `mogiremd@gmail.com` (set inside the GHL automation, not surfaced to the participant)
- Public contact: `mail@mogire.com`

Payload variables sent: `to_name`, `to_email`, `cc_email`, `intent`, `primary_reflex`, `primary_level`, `archetype_desc`, `traffic_summary`, `strategies_html`, `pain_text`, `pain_text_5y`, `threshold`, `summit_url`. Map these into a GoHighLevel email template inside the receiving automation.

## Privacy & compliance

Full policy in `privacy.html`. Compliant with GDPR (EU + UK), CCPA + CPRA, Kenya DPA 2019, LGPD (Brazil). Linked from the welcome consent line and the footer of each instrument. **A privacy-counsel pass is required before public launch**, including completing the postal address and EU representative fields.

## Deployment

Cloudflare Pages production setup:

1. **Branch**: `main` (merge feature branch first)
2. **Build command**: `npx vite build` (produces `dist/`); or empty if serving the repository root statically.
3. **Output directory**: `dist/` if using vite, else repository root.
4. **Routing** (declared in `_redirects`):
   - `/` → `index.html` (KOORA, the homepage)
   - `/first-hour/` → `first-hour/index.html` (directory route, no rewrite needed)
   - `/koora` and `/koora/` → `301` to `/`
   - `/privacy` and `/privacy/` → `200` rewrite to `/privacy.html`

For retake email links, use URL parameters:

```
https://hom.mogire.com/first-hour/?name=Job&email=jobsm2005@gmail.com
```

The page reads URL params and prefills the form.

## Development

The instruments are vanilla HTML / CSS / JavaScript. No build step. To work on them:

```bash
git clone <repo>
cd CLAUDE-LEARN-IT-
git checkout claude/build-mature-assessment-k6AT9
# Open either file in any browser
open first-hour/index.html
open index.html
```

To validate the JS embedded in either file:

```bash
awk '/^<script>$/{flag=1;next}/^<\/script>$/{flag=0}flag' first-hour/index.html > /tmp/check.js
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
**Site**: [hom.mogire.com](https://hom.mogire.com)

---

*Don't die with an unfinishing life.*

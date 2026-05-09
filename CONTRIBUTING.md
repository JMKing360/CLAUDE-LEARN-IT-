# Contributing to the House of Mastery instruments

This document captures the conventions for working in this repository.

## Voice and copy rules

These are non-negotiable.

| Rule | Why |
|---|---|
| **No em dashes** in user-facing text or CSS comments | They read as AI / synthetic register |
| **No motivational language** | "Hustle", "level up", "transform", "unlock", "crush it" — none of these belong |
| **No staccato fragmentation** beyond what serves the meaning | "Mind. Body. Word." style stacks should be flowing prose where possible |
| **No forced juxtaposition** like *"Not X. X."* | Use *"X, not Y"* or rewrite to flow |
| **No coddling** | Direct, warm, clinically precise. Brené Brown register, not motivational coach |
| **Doctrine vocabulary held** | The Unfinishing Life, The Finishing Life, The Finishing System, The Finishing Protocol, The Finisher |
| **East African register** where appropriate | Pamoja, ENGAKO used only where they do work English cannot |
| **No facilitator names** other than Dr. Mogire | Other members of the team are not surfaced to participants |
| **Mail to mogiremd@gmail.com is silent** | Never surfaced to the participant in any UI copy |

## Item architecture

Every assessment item must:

1. Be written in **present-tense pattern observation** (*"When X, I..."*)
2. Carry **three tier variants** as an array of three strings:
   - Tier 0 (start): names the wound
   - Tier 1 (middle): names the noticing
   - Tier 2 (end): names the new capacity
3. Map to **one and only one construct**
4. Score on the **four-point Likert** with the locked anchors
5. Avoid double-barreled phrasing
6. Avoid moral accusation

## Chamber arc

Each chamber's seven (First Hour) or sixteen (KOORA reflexes) items follow:

1. Items 1–4: **observation** items naming specific behaviour patterns
2. Items 5–6: **recognition** items naming the inner mechanism
3. Last item: **desire-strengthening** item naming the wanted future

## Code style

- No frameworks. Vanilla HTML, CSS, JavaScript.
- ES5-compatible JavaScript (no `let`, no arrow functions in production code paths) for maximum browser compatibility.
- Inline CSS / JS in single-file builds. The build pipeline (Phase 4) will eventually bundle.
- 2-space indentation in HTML, 4-space in JS within `<script>` blocks.
- Use `textContent` for any user-supplied input. Use `safe()` to escape before innerHTML if HTML composition is required.

## Commit conventions

Commit messages follow a structured format:

```
<scope>: <short summary>

<longer body explaining what changed and why>
```

Example scopes: `Round X`, `Phase X`, `KOORA`, `First Hour`, `Doctrine`, `Privacy`, `UX`, `Security`.

## Validation before commit

Before pushing any change to JavaScript, run:

```bash
awk '/^<script>$/{flag=1;next}/^<\/script>$/{flag=0}flag' first-hour.html > /tmp/check.js
node --check /tmp/check.js

awk '/^<script>$/{flag=1;next}/^<\/script>$/{flag=0}flag' index.html > /tmp/check.js
node --check /tmp/check.js
```

Both must report no syntax error.

For copy changes, run a final em-dash sweep:

```bash
grep -nP '[\x{2014}]' first-hour.html index.html
```

Should return nothing.

## Branch strategy

- `main` is the production branch
- `claude/build-mature-assessment-k6AT9` is the active development branch
- Feature branches off `claude/build-mature-assessment-k6AT9` for individual changes
- Squash-merge into the development branch
- Merge development branch into `main` for production deploys

## Testing the live build

Before announcing any deploy:

1. Walk both instruments end to end on a real phone (iOS Safari and Android Chrome at minimum)
2. Walk both instruments end to end with a screen reader (VoiceOver on iOS, TalkBack on Android)
3. Walk both instruments end to end with keyboard only
4. Take the assessment, send the email, download the PDF, walk the dashboard
5. On the second device with a different name and email, repeat
6. Refresh mid-assessment to confirm autosave works
7. Use the URL params (`?name=X&email=Y`) to verify retake prefill

## Reporting issues

For privacy or security issues, see `SECURITY.md`. For everything else, write to [mail@mogire.com](mailto:mail@mogire.com).

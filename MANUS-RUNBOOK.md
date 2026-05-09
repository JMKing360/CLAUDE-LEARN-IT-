# MANUS RUNBOOK — House of Mastery Diagnostic Instruments

**Repository:** `JMKing360/CLAUDE-LEARN-IT-`
**Branch to ship:** `claude/build-mature-assessment-k6AT9` → merge to `main`
**Custodian:** Dr. Job Mogire (`mail@mogire.com`)
**Cohort archive:** `mogiremd@gmail.com`
**Public site:** `houseofmastery.co`
**Production URLs (target):**
- The First Hour → `https://firsthour.houseofmastery.co`
- KOORA Assess → `https://kooraassess.houseofmastery.co`
- Privacy → `https://www.houseofmastery.co/privacy`

This runbook is the single, end-to-end instruction set for taking the two House of Mastery diagnostic instruments from this branch to a live, observable, secure, investor-grade deployment. It is written so that Manus (or any qualified operator) can execute it without further context. Phases 0 → 3 are mandatory before announcing the public URLs. Phases 4 → 12 can run in parallel after Phase 3.

---

## Table of contents

1. Phase 0 — Cloudflare Pages first deploy
2. Phase 1 — GoHighLevel email wiring
3. Phase 2 — Observability (Sentry + Plausible)
4. Phase 3 — Privacy-policy completion
5. Phase 4 — TypeScript + Vite build pipeline
6. Phase 5 — Testing pyramid
7. Phase 6 — Security hardening
8. Phase 7 — Performance budget
9. Phase 8 — Accessibility audit
10. Phase 9 — Multi-platform builds (PWA + embed)
11. Phase 10 — Production observability layer
12. Phase 11 — Feature flags & A/B testing
13. Phase 12 — Investor data room
14. Quick reference & contacts
15. Post-launch verification matrix

---

## Phase 0 — Cloudflare Pages first deploy

**Outcome:** the instruments are live at custom subdomains, with security headers, OG previews, manifest, and service worker functioning.

### What is already in the repo
- `_headers` — security headers and CSP
- `manifest.json` — PWA manifest
- `service-worker.js` — offline support
- `embed.html` — iframe widget for partner sites
- `.well-known/security.txt` — security disclosure path
- `privacy.html` — privacy policy (postal address still pending in Phase 3)
- `first-hour.html`, `index.html` — the two instruments

### Steps

1. **Merge the branch into main**
   - Open a pull request from `claude/build-mature-assessment-k6AT9` → `main`
   - Squash and merge.
2. **Connect Cloudflare Pages to the repo**
   - dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git
   - Pick `JMKing360/CLAUDE-LEARN-IT-`
   - Production branch: `main`
   - Build command: leave empty
   - Output directory: leave empty (root)
   - Click Deploy.
3. **Add custom domains**
   - Project → Custom domains → add `firsthour.houseofmastery.co`
   - Add `kooraassess.houseofmastery.co`
   - Add `www.houseofmastery.co` (or use the existing root domain if already on Cloudflare)
   - DNS records will be auto-created if `houseofmastery.co` is on Cloudflare; otherwise add the CNAMEs at the registrar.
4. **Add Cloudflare Pages Configuration Rules** so the right file serves at each subdomain
   - `firsthour.houseofmastery.co/` → rewrite to `/first-hour.html`
   - `firsthour.houseofmastery.co/*` → pass-through (so `/embed/`, `/privacy`, `/icons/*`, `/_headers` etc. still work)
   - `kooraassess.houseofmastery.co/` → rewrite to `/index.html`
   - `kooraassess.houseofmastery.co/*` → pass-through
   - `www.houseofmastery.co/privacy` → rewrite to `/privacy.html`
5. **Verify security headers** at `https://securityheaders.com`. Target A or A+. If anything below A, check that `_headers` was deployed (View Source, then Network → Response Headers).
6. **Walk both instruments end to end on a real phone** (iOS Safari + Android Chrome) before announcing.

### Verification checklist
- [ ] `https://firsthour.houseofmastery.co` loads and shows the welcome hero
- [ ] `https://kooraassess.houseofmastery.co` loads and shows the gating question
- [ ] `https://www.houseofmastery.co/privacy` loads the privacy policy
- [ ] `https://www.houseofmastery.co/.well-known/security.txt` returns 200
- [ ] `securityheaders.com` shows A or A+ for both subdomains
- [ ] Service worker registers (DevTools → Application → Service Workers)
- [ ] Manifest is recognised (DevTools → Application → Manifest)
- [ ] OG preview renders correctly when pasted into WhatsApp / iMessage / Twitter / LinkedIn

---

## Phase 1 — GoHighLevel email wiring *(mandatory; do this within 24 hours of Phase 0)*

**Outcome:** participants receive their reports by email; cohort archive populates silently; no third-party email SDK is loaded in the browser.

### Background

We migrated email delivery from EmailJS to GoHighLevel. The browser no longer loads `@emailjs/browser`. Instead, on submission the instrument constructs a JSON payload and POSTs it to a single inbound-webhook URL. A GoHighLevel automation consumes the payload, formats the email with the variables below, and dispatches it. The cohort archive BCC is set inside the GHL automation (not surfaced to the participant).

### Steps

1. **Create the inbound webhook in GoHighLevel**
   - GHL → Automation → Workflows → New Workflow
   - Trigger: **Inbound Webhook**
   - Save the workflow. GHL generates a URL like:
     `https://services.leadconnectorhq.com/hooks/<LOCATION_ID>/<WEBHOOK_ID>`
   - Copy the URL.
2. **Wire the URL into both instruments**
   - In `first-hour.html` and `index.html`, add this `<script>` block in the `<head>` (before `</head>`):
     ```html
     <script>
       window.HOM_CONFIG = Object.assign(window.HOM_CONFIG || {}, {
         ghlWebhookUrl: 'https://services.leadconnectorhq.com/hooks/REPLACE/REPLACE'
       });
     </script>
     ```
   - Alternative: replace the literal default in the JS. Search each file for `GHL_WEBHOOK_URL` and replace `REPLACE_WITH_YOUR_LOCATION_ID/REPLACE_WITH_YOUR_WEBHOOK_ID` with the real values.
3. **Build the GoHighLevel automation that consumes the webhook**
   - In the workflow, after the Inbound Webhook trigger, add a **Send Email** action.
   - Recipient: `{{inboundWebhookData.to_email}}`
   - **BCC:** `mogiremd@gmail.com` (silent cohort archive)
   - **Reply-to:** `mail@mogire.com`
   - **Subject (First Hour):** `Your First Hour result · {{inboundWebhookData.primary_reflex}}`
   - **Subject (KOORA):** `Your KOORA result · Day {{inboundWebhookData.day_number}}`
     - Tip: you can branch in GHL by an additional payload field (e.g., add `instrument: 'first_hour' | 'koora'` to the payload) and route to two different email actions. Or use one workflow per webhook URL — one for First Hour, one for KOORA — which is the simpler operationally.
   - **Body** — use a GHL email template that maps the payload variables below.
4. **Map these payload variables in the email template**

   First Hour payload variables:
   - `to_name`, `to_email`, `cc_email`
   - `intent` (the participant's stated intent)
   - `primary_reflex` (e.g., `Comparison`)
   - `primary_level` (e.g., `Loud`)
   - `archetype_desc`
   - `traffic_summary`
   - `strategies_html` (the formatted strategy block, safe to render as HTML)
   - `pain_text`, `pain_text_5y` (the participant's own words)
   - `threshold` (which threshold they identified with)
   - `summit_url` (link back to retake or to the next step)

   KOORA payload variables (additional):
   - `day_number`, `day_label`
   - `score_table_html` (all section scores)
   - `unstuck_path_html`
   - `foundation_top`, `foundation_bottom`
   - `unfinished_top`, `unfinished_bottom`
   - `practice_fidelity`
   - `movement_summary` (deltas, returners only)
   - `arc_stage_internal`, `arc_alignment_internal` (facilitator-only fields, render in email but not in UI)

5. **Send a test result through each instrument**
   - Open `firsthour.houseofmastery.co`, complete a test pass with your own email, click Send Results.
   - Verify the participant inbox receives the email within 60 seconds.
   - Verify `mogiremd@gmail.com` receives the silent BCC.
   - Repeat for `kooraassess.houseofmastery.co`.
6. **Set up Gmail filters on `mogiremd@gmail.com`**
   - Filter `from:(automation@yourGHLsendingdomain) subject:("Your First Hour result")` → label `cohort/first-hour` → archive
   - Filter `from:(automation@yourGHLsendingdomain) subject:("Your KOORA result")` → label `cohort/koora` → archive
7. **Verify CSP allows the webhook**
   - The repo's `_headers` already sets `connect-src 'self' https://services.leadconnectorhq.com`. Open DevTools → Console while sending a test, and confirm there is **no CSP violation** logged.
   - If you see a violation, check that `_headers` was deployed and refresh.

### Verification checklist
- [ ] Test result from First Hour delivered to participant inbox
- [ ] Test result from KOORA delivered to participant inbox
- [ ] Both BCC'd silently to `mogiremd@gmail.com`
- [ ] No CSP violation in browser console
- [ ] Email shows correct rendering of `strategies_html` and (for KOORA) `score_table_html`
- [ ] Spam-folder check on a fresh inbox; if landing in spam, configure SPF/DKIM/DMARC for the GHL sending domain

---

## Phase 3 — Privacy-policy completion *(mandatory before public announcement)*

**Outcome:** the privacy policy is legally publishable.

### Steps

1. **Add the postal address** to `privacy.html`. There are two clearly marked placeholders inside the file (search for `[POSTAL ADDRESS PLACEHOLDER]`).
2. **Decide on EU representative** if you process EU residents at meaningful scale (GDPR Article 27). If not initially required, document why in a short internal memo so this is auditable later.
3. **Privacy-counsel pass.** A 30-minute review by qualified counsel is sufficient for most. Capture sign-off in writing.
4. **Link the privacy policy** from any other surface that handles personal data:
   - The welcome consent line of each instrument (already linked)
   - The footer of each instrument (already linked)
   - The public houseofmastery.co site
   - Any sales pages, sign-up forms, or partner placements

---

## Phase 2 — Observability (Sentry + Plausible) *(do this in week 1)*

**Outcome:** errors, performance, and conversion are visible.

### What is already in the repo
- `observability.js` — Sentry + Plausible integration

### Steps

1. **Create a Sentry project** at sentry.io
   - Platform: Browser JavaScript
   - Copy the DSN.
2. **Create a Plausible site** at plausible.io for `houseofmastery.co`
3. **Set `window.HOM_CONFIG` before observability.js loads**, in the `<head>` of `first-hour.html` and `index.html`. Combine with the GHL config from Phase 1:
   ```html
   <script>
     window.HOM_CONFIG = Object.assign(window.HOM_CONFIG || {}, {
       ghlWebhookUrl: 'https://services.leadconnectorhq.com/hooks/REPLACE/REPLACE',
       sentryDsn: 'YOUR_SENTRY_DSN_HERE',
       plausibleDomain: 'houseofmastery.co',
       release: 'hom@3.1.0',
       environment: 'production'
     });
   </script>
   <script src="/observability.js" defer></script>
   ```
4. Push, redeploy, verify events appear in Sentry and Plausible.

### Verification
- [ ] Trigger a deliberate error and see it in Sentry within 60 seconds
- [ ] Page-view shows up in Plausible
- [ ] Custom events fire as expected: `assessment_began`, `chamber_completed`, `result_viewed`, `email_sent_clicked`, `pdf_downloaded`

---

## Phase 4 — Build pipeline (TypeScript + Vite) *(week 2-3)*

**Outcome:** the same single-file HTML output is produced by a typed, linted, tested build.

### What is already in the repo
- `package.json` — npm project root with required devDependencies listed
- `.eslintrc.json`, `.prettierrc.json` — code style locked
- `playwright.config.ts` — e2e config

### Steps

1. **`npm install`** at the repo root.
2. Decide on the migration approach:
   - Either start fresh with a Vite scaffold under `src/`, or
   - Progressively extract the inline JS / CSS from each HTML file.
3. Configure `vite.config.ts` with the `viteSingleFile` plugin so the production output remains one HTML file per instrument.
4. Move scoring functions to `src/scoring.ts` and add unit tests under `tests/unit/`.
5. Move `CHAMBER_PROMPTS`, `SECTION_PROMPTS`, `QUESTIONS`, `ARCHETYPES`, `STRATEGIES`, etc. into typed data modules under `src/data/`.
6. Establish a `dist/` build output that Cloudflare Pages picks up. Update Pages → Build settings: Build command `npm run build`, Output directory `dist`.

### Verification
- [ ] `npm run build` produces working HTML in `dist/`
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] `npm test` passes
- [ ] The deployed `dist/first-hour.html` and `dist/index.html` match the previous behaviour byte-for-byte where possible (visual regression diff)

---

## Phase 5 — Testing pyramid *(week 2-4)*

**Outcome:** every change runs through automated quality gates before it ships.

### What is already in the repo
- `.github/workflows/ci.yml` — CI pipeline
- `.lighthouserc.json` — Lighthouse-CI config
- `tests/e2e/first-hour.spec.ts` — first Playwright spec

### Steps

1. **Enable GitHub Actions** on the repo (Settings → Actions → Allow all actions).
2. Add **branch protection** on `main` requiring CI to pass:
   - Settings → Branches → Add rule → Branch name pattern `main`
   - Require status checks to pass before merging
   - Require pull request reviews before merging (at least 1)
3. Write Vitest unit tests for `scoring.ts`, `tier-resolver`, `cost-estimation`.
4. Add Playwright specs for KOORA (mirror the First Hour spec).
5. Add axe-core tests via `@axe-core/cli`.
6. Wire Lighthouse-CI to publish results on each PR and on `main`.
7. Set Stryker mutation testing on the scoring module; target ≥75%.

---

## Phase 6 — Security hardening *(week 3-4)*

**Outcome:** A+ on securityheaders.com, zero high-severity CVEs, SBOM published.

### What is already in the repo
- `_headers` — CSP, HSTS, X-Frame-Options, Permissions-Policy
- `.well-known/security.txt` — disclosure path
- `SECURITY.md` — security policy

### Steps

1. **Enable Dependabot** (Settings → Security → Dependabot alerts).
2. **Run Snyk** on the repo (free for open source) for deeper dependency scanning.
3. **Add SRI hash on the one CDN script (jsPDF)**:
   - Compute via `openssl dgst -sha384 -binary jspdf.umd.min.js | openssl base64 -A`
   - Add `integrity="sha384-..."` and `crossorigin="anonymous"` to the script tag.
4. **Tighten CSP** to remove `'unsafe-inline'` once Phase 4 produces bundled JS / CSS with hashes or nonces.
5. **Run OWASP ZAP baseline scan** before each major release.
6. **Generate SBOM** with `npm run sbom` (CycloneDX format). Publish under `/.well-known/sbom.json` if you want it externally referenceable.
7. **Annual external pen-test** once revenue justifies it.

### Note on the GoHighLevel webhook URL
The webhook URL is *not* a secret — it's an unauthenticated endpoint by design. Do not commit it as if it were a credential, but also do not treat it as private. Anyone who finds the URL can POST to it; rate-limiting and validation happen inside the GHL automation. If you need authentication later, switch to a Cloudflare Worker that proxies to GHL after verifying a signed token from the browser.

---

## Phase 7 — Performance budget *(week 4)*

**Targets:**
- Lighthouse Performance ≥ 90
- LCP < 2.0 s
- INP < 200 ms
- CLS < 0.05
- Bundle size on first paint ≤ 80 KB gzip

### Steps
1. Run Lighthouse-CI in the GitHub Actions pipeline; block PRs that regress more than 5 points.
2. Inline critical CSS in `<head>`; defer the rest.
3. Lazy-load jsPDF only when Download is clicked (already done; verify still in place after Phase 4).
4. Preload `Source Serif 4` and `Plus Jakarta Sans` woff2 with `<link rel="preload" as="font" crossorigin>`.
5. Profile on mid-range Android (e.g., Pixel 4a) and iPhone SE.

---

## Phase 8 — Accessibility audit *(week 4-5)*

**Target:** WCAG 2.2 AA conformance.

### Steps
1. Run axe-core in CI (Phase 5).
2. Manual screen-reader pass (VoiceOver on iOS, TalkBack on Android, NVDA on Windows).
3. Keyboard-only navigation pass — every action reachable, focus-visible ring on every interactive element.
4. Contrast check — minimum 4.5:1 for body text, 3:1 for large text, 3:1 for UI components.
5. External accessibility partner audit before announcing the PWA in app stores or to institutional partners.

---

## Phase 9 — Multi-platform builds (PWA + embed) *(week 4-6)*

**Outcome:** the instrument runs anywhere a partner needs it.

### What is already in the repo
- `embed.html` — iframe widget for partner placement
- `manifest.json` — PWA manifest
- `service-worker.js` — offline support

### Steps

1. **Wire service-worker registration** into both instruments by adding to `<head>`:
   ```html
   <script>if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js');</script>
   ```
2. **Generate proper PNG icons** at 192×192 and 512×512 from the SVG mark; place in `/icons/`.
3. **Document the iframe embed** for partner integrators:
   ```html
   <iframe src="https://firsthour.houseofmastery.co/embed/" width="100%" height="900" allow="clipboard-write" style="border:0"></iframe>
   ```
4. **Set up the `/embed/*` route** in Cloudflare Pages so the looser CSP applies (already in `_headers`).
5. **Optional**: server-renderable build via Vite SSR for SEO.

---

## Phase 10 — Production observability layer *(week 5-6)*

Phase 2 wires Sentry + Plausible. Layer on top:

1. **Datadog RUM** for production Core Web Vitals if you need finer-grained perf insight.
2. **Custom event taxonomy** consistent with the funnel:
   - `welcome_shown`
   - `assessment_began`
   - `chamber_completed` (with chamber number)
   - `ack_reached`
   - `result_viewed`
   - `email_sent_clicked`
   - `pdf_downloaded`
   - `ladder_rung_clicked` (with rung name)
3. **Conversion-funnel dashboard** reviewed weekly for the first 90 days.

---

## Phase 11 — Feature flags & A/B testing *(week 6-8)*

### What is already in the repo
- `feature-flags.js` — URL-param + remote-config resolver

### Steps

1. **Decide on hosting strategy for `feature-flags.json`**:
   - Simplest: a static file in the repo, updated by PR
   - Better: Cloudflare KV via a small Worker
   - Best: LaunchDarkly / Statsig
2. **Wire flag reads into the instruments**:
   ```html
   <script src="/feature-flags.js"></script>
   <script>
     window.addEventListener('hom-flags-ready', () => {
       if (flag('experiment.welcomeHero') === 'minimal') document.body.classList.add('hero-minimal');
     });
   </script>
   ```
3. **Run the first A/B**: try `experiment.welcomeHero` with two variants.

---

## Phase 12 — Investor data room *(continuous)*

### What is already in the repo
- `INVESTOR-DATA-ROOM/` folder with eight artifacts:
  - `01-architecture.md`
  - `02-security-posture.md`
  - `03-accessibility-statement.md`
  - `04-methodology.md`
  - `05-changelog.md` *(linked to repo CHANGELOG)*
  - `06-roadmap.md`
  - `07-unit-economics.md` *(skeleton)*
  - `08-quality-scores.md` *(skeleton)*

### Steps

1. **Fill in `07-unit-economics.md`** with cohort cost, conversion funnel template, LTV worksheet once Cohort 1 numbers are available.
2. **Fill in `08-quality-scores.md`** once CI is producing Lighthouse scores, axe results, mutation scores.
3. **Maintain quarterly.**

---

## Quick reference & contacts

| Task | Where it happens |
|---|---|
| Code change | This repository |
| Deploy | Cloudflare Pages auto-deploys on push to `main` |
| Privacy questions | `mail@mogire.com` |
| Security reports | `mail@mogire.com` with subject "Security report" |
| Cohort archive | `mogiremd@gmail.com` (silent BCC, set inside the GHL automation) |
| Email infrastructure | GoHighLevel inbound webhook → Send Email action |
| Public site | `houseofmastery.co` |
| First Hour | `firsthour.houseofmastery.co` |
| KOORA | `kooraassess.houseofmastery.co` |
| Privacy | `houseofmastery.co/privacy` |
| Security disclosure | `houseofmastery.co/.well-known/security.txt` |

---

## Post-launch verification matrix

Run this after Phase 0 + 1 + 3 are complete, before announcing publicly.

| Check | Pass criterion | How to verify |
|---|---|---|
| First Hour loads | 200 OK, hero visible | Open `firsthour.houseofmastery.co` in incognito |
| KOORA loads | 200 OK, gating question visible | Open `kooraassess.houseofmastery.co` in incognito |
| Privacy loads | 200 OK, policy renders | Open `www.houseofmastery.co/privacy` |
| Security headers | A or A+ | `securityheaders.com` for both subdomains |
| HTTPS only | No mixed content | DevTools → Console |
| OG preview | Image + title + description | Paste link into WhatsApp / iMessage / Twitter |
| Service worker | Registered | DevTools → Application → Service Workers |
| Manifest | Recognised | DevTools → Application → Manifest |
| First Hour test send | Email in inbox + BCC archive | Run a real test pass |
| KOORA test send | Email in inbox + BCC archive | Run a real test pass |
| CSP clean | No violations | DevTools → Console during a test send |
| Mobile UX | No layout breaks on iPhone SE / Pixel 4a | Real device walkthrough |
| Accessibility quick-pass | Tab order makes sense, focus-visible rings show | Keyboard-only test |
| Privacy postal address | No `[POSTAL ADDRESS PLACEHOLDER]` strings remain | `grep` the deployed `/privacy.html` |

If every row passes, the instruments are ready for public announcement. If any row fails, **do not announce** until it passes.

---

## Appendix A — Configuration cheatsheet

Single `<script>` block to drop into the `<head>` of both `first-hour.html` and `index.html` (after Phase 1 + Phase 2):

```html
<script>
  window.HOM_CONFIG = Object.assign(window.HOM_CONFIG || {}, {
    ghlWebhookUrl: 'https://services.leadconnectorhq.com/hooks/LOCATION_ID/WEBHOOK_ID',
    sentryDsn: 'https://...@o....ingest.sentry.io/...',
    plausibleDomain: 'houseofmastery.co',
    release: 'hom@3.1.0',
    environment: 'production'
  });
</script>
```

Place this **before** `<script src="/observability.js" defer></script>` and before the inline assessment scripts.

---

## Appendix B — File map

| File | Purpose |
|---|---|
| `first-hour.html` | The First Hour instrument (42 items, 6 chambers) |
| `index.html` | KOORA · The Finishing Protocol (60 items, 6 sections) |
| `privacy.html` | Privacy policy (GDPR + CCPA + Kenya DPA + LGPD) |
| `embed.html` | Iframe widget for partner placement |
| `_headers` | Cloudflare Pages security headers + CSP |
| `manifest.json` | PWA manifest |
| `service-worker.js` | Offline support |
| `observability.js` | Sentry + Plausible drop-in |
| `feature-flags.js` | URL-param + remote-config flag resolver |
| `.well-known/security.txt` | Disclosure path |
| `package.json` | npm project root with devDependencies |
| `.eslintrc.json`, `.prettierrc.json` | Code style |
| `.github/workflows/ci.yml` | CI pipeline |
| `.lighthouserc.json` | Lighthouse-CI config |
| `playwright.config.ts` | E2E config |
| `tests/e2e/first-hour.spec.ts` | First Playwright spec |
| `DEPLOY.md` | Operator runbook (long form, with rationale) |
| `MANUS-RUNBOOK.md` | This file (handover-ready, prescriptive) |
| `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `LICENSE` | Repo docs |
| `INVESTOR-DATA-ROOM/` | Architecture, security, accessibility, methodology, roadmap, unit economics, quality scores |
| `SPEC.md` | The KOORA mature-assessment build spec |
| `reference/` | Original screen-of-record HTML for reference |

---

## Appendix C — What changed in v3.1.0 (relative to v3.0.0)

- Email path moved off EmailJS onto a GoHighLevel inbound webhook.
- Browser no longer loads `@emailjs/browser`. Saves ~30 KB and removes one external script from CSP.
- `_headers` `connect-src` updated to `https://services.leadconnectorhq.com`.
- Both instruments now POST a JSON payload via `sendToGhl(payload)` on Send Results.
- Documentation updated across README, SECURITY, SPEC, DEPLOY, investor data room, CHANGELOG.

---

**End of runbook. Execute in order. Stop and check with the custodian if any verification step fails.**

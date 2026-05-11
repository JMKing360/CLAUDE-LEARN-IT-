# Deployment & Phase Runbook

A complete sequence of actions to take the House of Mastery instruments from this branch to live, observable, secure, investor-grade software. Each phase below names what is **already scaffolded** in the repository and what **you need to do externally**.

The order matters. Phases 0 → 3 must complete before announcing the public URLs. Phases 4 → 12 can run in parallel after that.

> ## ⚠ Critical pre-launch check — `window.HOM_CONFIG`
>
> Both assessment apps read three values off `window.HOM_CONFIG` at parse time. If any is missing in production, the corresponding subsystem silently no-ops:
>
> | Key | What breaks if missing |
> |---|---|
> | `ghlWebhookUrl` | **The entire email pipeline.** Participants never get their report; the archive Gmail CC never fires. |
> | `sentryDsn` | All error tracking + Sentry breadcrumbs + the GHL-config warning capture. |
> | `plausibleDomain` | All privacy-first funnel analytics. |
>
> The repo emits a visible red banner on localhost / `*.pages.dev` / `127.0.0.1` when `ghlWebhookUrl` is missing (set `localStorage.HOM_OPS_BANNER='1'` in any environment to force the check). It also calls `HOM_SENTRY_WARN(...)` — but Sentry will only deliver that warning if `sentryDsn` is also configured. **Verify all three are injected via Cloudflare Pages environment variables before announcing the public URL.**

---

## Phase 0 — Cloudflare Pages first deploy *(do this today)*

**Outcome:** the instruments are live at custom subdomains.

### What is already scaffolded
- `_headers` — security headers and CSP
- `manifest.json` — PWA manifest
- `service-worker.js` — offline support
- `embed.html` — iframe widget for partner sites
- `.well-known/security.txt` — security disclosure path

### What you need to do
1. **Merge the branch into main** (in GitHub UI):
   - Open `claude/build-mature-assessment-k6AT9`
   - Compare and pull request → squash and merge to `main`
2. **Connect Cloudflare Pages to the repo**:
   - dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git
   - Pick `JMKing360/CLAUDE-LEARN-IT-`, production branch `main`
   - Build command: `npx vite build` (or empty if serving the repository root statically)
   - Output directory: `dist/` (or empty if serving the repository root)
   - Deploy
3. **Add custom domains**:
   - Project → Custom domains → ensure `hom.mogire.com` is attached to the HOM Pages project
   - DNS will be auto-created if `hom.mogire.com` is on Cloudflare
4. **Routing is declared in `_redirects`** at the project root. The current contract:
   - `/` serves `index.html` (KOORA, the homepage)
   - `/first-hour/` serves `first-hour/index.html` via directory routing — no rewrite needed
   - `/koora` and `/koora/` 301-redirect to `/` (canonicalisation only)
   - `/privacy` and `/privacy/` rewrite to `/privacy.html`
5. **Verify security headers** at `securityheaders.com`. Target A or A+.
6. **Walk both instruments end to end on a real phone** before announcing.

### Verification checklist
- [ ] `https://hom.mogire.com/` loads KOORA
- [ ] `https://hom.mogire.com/first-hour/` loads The First Hour
- [ ] `https://hom.mogire.com/koora` 301-redirects to `https://hom.mogire.com/`
- [ ] `https://hom.mogire.com/privacy` loads the privacy policy
- [ ] `securityheaders.com` shows A or A+ for both subdomains
- [ ] Service worker registers (DevTools → Application → Service Workers)
- [ ] Manifest is recognised (DevTools → Application → Manifest)
- [ ] OG preview renders correctly when pasted into WhatsApp / iMessage / Twitter

---

## Phase 1 — Email send wiring via GoHighLevel *(do this within 24 hours of phase 0)*

**Outcome:** participants receive their reports; cohort archive populates.

### What you need to do
1. **Create the inbound webhook in GoHighLevel**
   - GHL → Automation → Workflows → New Workflow → Trigger: **Inbound Webhook**
   - Save the workflow once to generate the URL. It looks like `https://services.leadconnectorhq.com/hooks/<LOCATION_ID>/<WEBHOOK_ID>`
   - Copy the URL.
2. **Set the URL in production** by adding a `<script>` block in the `<head>` of `first-hour/index.html` and `index.html`:
   ```html
   <script>window.HOM_CONFIG = Object.assign(window.HOM_CONFIG||{}, { ghlWebhookUrl: 'https://services.leadconnectorhq.com/hooks/.../...' });</script>
   ```
   (Or replace the literal default in the JS — search for `GHL_WEBHOOK_URL` in each file.)
3. **Build the GHL automation** that consumes the webhook payload:
   - Add a **"Send Email"** action after the trigger
   - Set the recipient to `{{inboundWebhookData.to_email}}`
   - BCC `mogiremd@gmail.com` (silent cohort archive)
   - Subject: `Your First Hour result · {{inboundWebhookData.primary_reflex}}` (or KOORA equivalent)
   - Map these payload variables into the email template body:
     - `to_name`, `to_email`, `cc_email`
     - `intent`, `primary_reflex`, `primary_level`
     - `archetype_desc`, `traffic_summary`, `strategies_html`
     - `pain_text`, `pain_text_5y`, `threshold`, `summit_url`
4. **Send a test result** through each instrument and verify both the participant inbox and `mogiremd@gmail.com`.
5. **Set up a Gmail filter** on `mogiremd@gmail.com` to label and archive the cohort reports automatically.
6. **Update CSP if needed.** The current `_headers` allows `connect-src` to `https://services.leadconnectorhq.com`. Verify the browser console shows no CSP violation when the test result is sent.

---

## Phase 2 — Add observability *(do this in week 1)*

**Outcome:** errors, performance, and conversion are visible.

### What is already scaffolded
- `observability.js` — Sentry + Plausible integration

### What you need to do
1. **Create a Sentry project** at sentry.io
   - Platform: Browser JavaScript
   - Get the DSN
2. **Create a Plausible site** at plausible.io for `hom.mogire.com`
3. **Set window.HOM_CONFIG before observability.js loads**, in each instrument:
   - Add a small `<script>` block in the `<head>` of `first-hour/index.html`, `index.html`:
     ```html
     <script>window.HOM_CONFIG = { sentryDsn: 'YOUR_DSN_HERE', plausibleDomain: 'hom.mogire.com', release: 'hom@3.0.0', environment: 'production' };</script>
     <script src="/observability.js" defer></script>
     ```
4. Push, redeploy, verify events in Sentry and Plausible

### Verification
- [ ] Trigger a deliberate error and see it in Sentry within 60 seconds
- [ ] Page-view shows up in Plausible
- [ ] Custom events (`assessment_began`, `email_sent_clicked`) fire as expected

---

## Phase 3 — Privacy compliance *(do this in week 1)*

**Outcome:** legally publishable.

### What you need to do
1. **Add postal address** to `privacy.html` (two placeholders marked clearly inside the file)
2. **Decide on EU representative** if you process EU residents at meaningful scale (GDPR Article 27)
3. **Privacy-counsel pass** before announcing publicly. A 30-minute review by qualified counsel is sufficient for most.
4. Link the privacy policy from any other surface that handles personal data (sales pages, sign-up forms, etc.)

---

## Phase 4 — Build pipeline *(week 2-3)*

**Outcome:** a TypeScript + Vite project producing the same single-file HTML output.

### What is already scaffolded
- `package.json` — npm project root with all the required devDependencies listed
- `.eslintrc.json`, `.prettierrc.json` — code style locked
- `playwright.config.ts` — e2e config

### What you need to do
1. **`npm install`** locally
2. Decide on the migration approach: either start from scratch with Vite scaffolding the `src/` folder, or progressively extract the inline JS / CSS from the HTML files
3. Configure `vite.config.ts` with `viteSingleFile` plugin so the production output is still one HTML file per instrument
4. Move scoring functions to `src/scoring.ts` and write unit tests
5. Move `CHAMBER_PROMPTS`, `SECTION_PROMPTS`, `QUESTIONS`, etc. to typed data modules
6. Establish a `dist/` build output that Cloudflare Pages picks up

### Verification
- [ ] `npm run build` produces working HTML in `dist/`
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] `npm test` passes

---

## Phase 5 — Testing pyramid *(week 2-4)*

**Outcome:** every change runs through automated quality gates before it ships.

### What is already scaffolded
- `.github/workflows/ci.yml` — CI pipeline
- `.lighthouserc.json` — Lighthouse-CI config
- `tests/e2e/first-hour.spec.ts` — first Playwright spec

### What you need to do
1. **Enable GitHub Actions** on the repo (Settings → Actions → Allow all actions)
2. Add **branch protection** on `main` requiring CI to pass
3. Write Vitest unit tests for `scoring.ts`, `tier-resolver`, `cost-estimation`
4. Add Playwright specs for KOORA (mirror the First Hour spec)
5. Add axe-core tests via `@axe-core/cli`
6. Wire Lighthouse-CI to publish results

---

## Phase 6 — Security hardening *(week 3-4)*

**Outcome:** A+ on securityheaders.com, zero high CVEs, SBOM published.

### What is already scaffolded
- `_headers` — CSP, HSTS, X-Frame-Options, Permissions-Policy
- `.well-known/security.txt` — disclosure path
- `SECURITY.md` — security policy

### What you need to do
1. **Enable Dependabot** (Settings → Security → Dependabot alerts)
2. **Run Snyk** on the repo (free for open source) for deeper dependency scanning
3. **Add SRI hashes** on the two CDN scripts:
   - Compute via `openssl dgst -sha384 -binary jspdf.min.js | openssl base64 -A`
   - Add `integrity="sha384-..."` to the `<script>` tags
4. **Tighten CSP** to remove `'unsafe-inline'` once you migrate to bundled JS / CSS in Phase 4
5. **Run OWASP ZAP baseline scan** before each major release
6. **Generate SBOM** with `npm run sbom` (CycloneDX format)
7. **Annual external pen-test** once revenue justifies it

---

## Phase 9 — Multi-platform builds *(week 4-6)*

**Outcome:** the instrument runs anywhere a partner needs it.

### What is already scaffolded
- `embed.html` — iframe widget for partner placement
- `manifest.json` — PWA manifest
- `service-worker.js` — offline support

### What you need to do
1. **Wire service worker registration** into both instruments by adding to `<head>`:
   ```html
   <script>if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js');</script>
   ```
2. **Generate proper PNG icons** at 192×192 and 512×512 from the SVG mark; place in `/icons/`
3. **Document the iframe embed** for partner integrators:
   ```html
   <iframe src="https://hom.mogire.com/embed.html" width="100%" height="900" allow="clipboard-write" style="border:0"></iframe>
   ```
4. **The `/embed.html` route** has CORP `cross-origin` set in `_headers` so partner framing works. The CSP `frame-ancestors` allow-list also covers `https://houseofmastery.co`.
5. **Optional**: server-renderable build via Vite SSR for SEO

---

## Phase 10 — Production observability *(week 5-6)*

Already covered above in **Phase 2**. Once Sentry and Plausible are live, layer:

1. **Datadog RUM** for production Core Web Vitals if you need finer-grained perf insight
2. **Custom event taxonomy** consistent with the funnel:
   - `welcome_shown`
   - `assessment_began`
   - `chamber_completed` (with chamber number)
   - `ack_reached`
   - `result_viewed`
   - `email_sent_clicked`
   - `pdf_downloaded`
   - `ladder_rung_clicked` (with rung name)
3. **Conversion-funnel dashboard** reviewed weekly for the first 90 days

---

## Phase 11 — Feature flags & A/B testing *(week 6-8)*

### What is already scaffolded
- `feature-flags.js` — URL-param + remote-config resolver

### What you need to do
1. **Decide on a hosting strategy for `feature-flags.json`**:
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
3. **Run your first A/B**: try `experiment.welcomeHero` with two variants

---

## Phase 12 — Investor data room *(continuous)*

### What is already scaffolded
- `INVESTOR-DATA-ROOM/` folder with eight artifacts:
  - `01-architecture.md`
  - `02-security-posture.md`
  - `03-accessibility-statement.md`
  - `04-methodology.md`
  - `05-changelog.md` *(linked to repo CHANGELOG)*
  - `06-roadmap.md`
  - `07-unit-economics.md` *(skeleton)*
  - `08-quality-scores.md` *(skeleton)*

### What you need to do
1. **Fill in `07-unit-economics.md`** with cohort cost, conversion funnel template, LTV worksheet
2. **Fill in `08-quality-scores.md`** once CI is producing Lighthouse scores, axe results, mutation scores
3. **Maintain it quarterly**

---

## Quick reference

| Task | Where it happens |
|---|---|
| Code change | This repository |
| Deploy | Cloudflare Pages auto-deploys on push to `main` |
| Privacy questions | `mail@mogire.com` |
| Security reports | `mail@mogire.com` with subject "Security report" |
| Cohort archive | `mogiremd@gmail.com` (silent CC) |
| Public site | `hom.mogire.com` |
| First Hour | `hom.mogire.com/first-hour/` |
| KOORA | `hom.mogire.com/` (`/koora` 301 → `/`) |
| Privacy | `hom.mogire.com/privacy` |
| Security disclosure | `hom.mogire.com/.well-known/security.txt` |

# Roadmap

## Now (shipped)

- The First Hour, 42 items, 3-tier present-tense variants
- KOORA: The Finishing Protocol, 60 items, 3-tier variants
- Privacy policy, GDPR + CCPA + Kenya DPA + LGPD compliant
- Phase 1 voice and copy redesign complete
- Phase 2 product fundamentals (OG meta, favicon, manifest, lazy-load, autosave, dark mode, fluid type, staggered reveal, skip link)
- Repository documentation: README, CHANGELOG, CONTRIBUTING, SECURITY, LICENSE
- Investor data-room scaffold

## 30 days

- Cloudflare Pages deploy of both instruments at `firsthour.houseofmastery.co` and `kooraassess.houseofmastery.co`
- Privacy policy live at `houseofmastery.co/privacy`
- Sentry + Plausible integration on production (drop-in `observability.js`)
- Real-device walk-through on iOS and Android with one external tester
- First cohort intake measurement
- A/B test on welcome hero copy, two variants (`flag.experiment.welcomeHero`)

## 60 days

- TypeScript + Vite migration with single-file HTML still as one of the build outputs (Phase 4)
- CI pipeline live: lint, type-check, syntax, em-dash sweep, Lighthouse-CI (Phase 5)
- Playwright end-to-end suite on three browsers and two mobile profiles
- axe-core in CI
- Full WCAG 2.2 AA audit by external accessibility partner
- Embeddable widget (`/embed`) shipped for partner placement

## 90 days

- 50 paid First Hour conversions tracked through to KOORA waitlist
- Pamoja Hour and Mastery Hour scheduling integrated into result-page CTAs with calendar links
- Internal-consistency analysis on first 100 completed assessments (target Cronbach α ≥ 0.70)
- Subresource Integrity hashes on all CDN scripts (Phase 6)
- OWASP ZAP baseline scan clean
- SBOM generated and published (CycloneDX format)

## 180 days

- KOORA Cohort 2 enrolment closed (24 seats)
- Test–retest reliability analysis on Cohort 1 movement
- Server-renderable build for SEO and richer social previews
- Headless build for batch scoring (potential for institutional partner use)
- Localization scaffolding (Swahili, French) with first translation cohort
- Investor due-diligence package complete and signed off

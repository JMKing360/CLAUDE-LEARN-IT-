# Quality Scores — Skeleton

Fill in once CI is producing measurements. Currently scaffolded but not yet running.

## Targets

| Metric | Target | Current |
|---|---|---|
| Lighthouse Performance | ≥ 90 | TBM (target before measure) |
| Lighthouse Accessibility | ≥ 95 | TBM |
| Lighthouse Best Practices | ≥ 95 | TBM |
| Lighthouse SEO | ≥ 90 | TBM |
| LCP | < 2.0 s | TBM |
| INP | < 200 ms | TBM |
| CLS | < 0.05 | TBM |
| Bundle size on first paint | ≤ 80 KB gzip | TBM |
| Test coverage on scoring | ≥ 90% | 0% (tests scaffolded, not yet authored) |
| Mutation score | ≥ 75% | 0% |
| `securityheaders.com` rating | A or A+ | TBM |
| OWASP ZAP baseline | clean | not run |
| WCAG 2.2 conformance | AA | partial (full audit pending) |
| High/critical CVEs | 0 | 0 (no npm dependencies installed yet) |

## Method

These metrics will populate automatically once:

1. The CI pipeline (Phase 5) runs against PRs and main
2. Lighthouse-CI publishes scores on each deploy
3. axe-core runs in CI
4. Stryker mutation testing runs against the scoring tests
5. Snyk / Dependabot reports clean

## Update cadence

Updated weekly during active development; monthly thereafter.

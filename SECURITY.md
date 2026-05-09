# Security policy

## Reporting a vulnerability

If you believe you have found a security vulnerability in any of the House of Mastery diagnostic instruments, please write to:

**[mail@mogire.com](mailto:mail@mogire.com)** with subject line **"Security report"**.

We will acknowledge within 72 hours and respond with a timeline within seven days.

Please do not disclose the issue publicly until we have had a reasonable opportunity to investigate and remediate.

## Scope

In scope:

- The HTML files served from `hom.mogire.com/first-hour`, `hom.mogire.com/kooraassess`, and any subdomain serving the instruments
- Any associated build scripts in this repository
- Email-delivery integration with the GoHighLevel inbound webhook
- PDF generation with jsPDF
- localStorage usage and data handling

Out of scope:

- Issues in third-party services (GoHighLevel, Google Fonts, jsPDF, Cloudflare Pages) that are not under our direct control. Please report those upstream.
- Issues that require physical access to a victim's device

## Current security posture

| Control | Status |
|---|---|
| HTTPS only | Enforced via Cloudflare Pages |
| Content Security Policy | To be added in Phase 6 |
| Subresource Integrity (SRI) on CDN scripts | To be added in Phase 6 |
| Strict-Transport-Security header | To be added |
| User input escaping (XSS) | Live: `safe()` wraps all innerHTML composition of user-supplied text |
| localStorage namespacing | Live: `hom_firsthour_*` and `koora_*` prefixes |
| External-script allowlist | One only: jsPDF `2.5.1` (lazy-loaded on demand). Email is delivered via a `fetch` POST to a GoHighLevel inbound webhook — no third-party SDK is loaded in the browser. |
| Secret management | The GHL inbound-webhook URL is a non-secret endpoint by design (it accepts unauthenticated POSTs from the browser). No private keys are exposed. |
| Dependency CVE scanning | To be added in Phase 6 |
| OWASP ZAP baseline scan | To be run before each major release |
| SBOM | To be generated in Phase 6 |

## Disclosure policy

We follow coordinated disclosure. Once a vulnerability has been confirmed and remediated:

1. We deploy the fix
2. We notify affected users if there is evidence of exploitation
3. We publish a brief disclosure note in the changelog
4. We credit the reporter, with permission

## What this product does and does not do

- **Does** store user-entered name, email, assessment answers, and reflection text in the browser's `localStorage` on their own device.
- **Does** send a copy of the report by email through a GoHighLevel automation when the user clicks Send Results, with a silent CC to the cohort archive.
- **Does** allow URL-parameter prefilling for retake links (`?name=X&email=Y`).
- **Does not** store user data on a server we control. There is no backend application database.
- **Does not** track users across the web. There are no third-party trackers in production.
- **Does not** sell, share, or otherwise transfer personal information for advertising or marketing purposes.

## Cryptographic posture

The instruments do not handle secrets. Email delivery happens over TLS via the GoHighLevel inbound-webhook endpoint. Local storage is unencrypted by design (the data is on the participant's own device). When server-side persistence is added (future phase), encryption at rest will be required of any provider we adopt.

## Update cadence

Security patches ship as soon as a fix is verified. Other releases follow the cadence in `CHANGELOG.md`.

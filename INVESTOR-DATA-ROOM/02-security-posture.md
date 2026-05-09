# Security Posture

## Summary

The House of Mastery diagnostic instruments are static, client-only HTML applications. The attack surface is correspondingly small: there is no application backend, no user accounts, no sessions, and no centralized PII store. Risks therefore concentrate in three areas: cross-site scripting in the participant's own browser, third-party script integrity, and the email-delivery path.

## Controls

| Control | Implementation |
|---|---|
| HTTPS only | Enforced by Cloudflare Pages |
| HSTS | Set in `_headers` with `max-age=63072000; includeSubDomains; preload` |
| Content Security Policy | Set in `_headers`, restricts scripts to self + two named CDN origins, blocks framing except from `houseofmastery.co` |
| Subresource Integrity | To be added in Phase 6 build |
| User input escaping (XSS) | All user-supplied text passes through `safe()` before any innerHTML composition |
| Lazy-load of jsPDF | Reduces initial-load attack surface and improves Core Web Vitals |
| localStorage only | No server-side PII store; all participant data lives on the participant's own device |
| Silent CC archive | Reports BCC'd to `mogiremd@gmail.com` over EmailJS TLS |
| Em-dash sweep | Automated CI check ensures no synthetic-looking copy ships |
| Em-dash + voice rules | Documented in `CONTRIBUTING.md` |
| Disclosure path | `SECURITY.md` and `.well-known/security.txt` published |

## Threat model summary (STRIDE)

| Threat | Mitigation |
|---|---|
| Spoofing | Custom domain on Cloudflare, HSTS preload, no inbound auth surface |
| Tampering | CSP + SRI (Phase 6), CDN integrity, signed deploys |
| Repudiation | Cloudflare logs (30-day), EmailJS message log retained per their policy |
| Information disclosure | No backend store, localStorage-only, opt-in email |
| Denial of service | Cloudflare in front; static files; no application logic to exhaust |
| Elevation of privilege | No accounts, no privileged paths |

## Open items

- CSP currently uses `'unsafe-inline'` for inline scripts and styles. Phase 4 build pipeline will move to nonces.
- SRI hashes on the two CDN scripts (EmailJS, jsPDF) will be added in Phase 6.
- OWASP ZAP baseline scan to be run before each major release.
- Pen-test post-revenue.

## Disclosure

`SECURITY.md` defines the reporting path. `.well-known/security.txt` is published. We acknowledge reports within 72 hours.

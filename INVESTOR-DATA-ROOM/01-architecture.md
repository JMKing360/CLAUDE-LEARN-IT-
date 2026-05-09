# Architecture

## High-level

Each instrument is a single self-contained HTML file with inline CSS and JavaScript. No backend application is required for the participant journey. Reports are delivered through a **GoHighLevel inbound webhook** that receives a JSON payload from the browser and triggers an automation that emails the participant and a silent cohort archive.

```
                ┌─────────────────────────┐
                │ Participant browser     │
                │  - HTML / CSS / JS       │
                │  - localStorage history  │
                │  - Service worker        │
                └────────┬────────────────┘
                         │
                ┌────────┴────────────────┐
                │ Cloudflare Pages (CDN)  │
                │  - Static hosting        │
                │  - _headers (security)   │
                └────────┬────────────────┘
                         │ POST application/json
                ┌────────┴────────────────┐
                │ GoHighLevel webhook     │
                │  - Inbound endpoint      │
                │  - Automation workflow   │
                │  - Email to participant  │
                │  - CC mogiremd@gmail.com │
                └─────────────────────────┘
```

## State and data flow

| Where | What |
|---|---|
| Browser localStorage | Completed assessments, in-progress answers, participant name, email, intent text, threshold selection |
| GoHighLevel | Receives a JSON payload per submission. The automation formats and dispatches the email. GHL retains contact and message records per their account-level retention policy. |
| `mogiremd@gmail.com` inbox | Silent CC archive of every emailed report |
| `mail@mogire.com` inbox | Public correspondence from participants |
| Cloudflare logs | Standard request logs, 30-day retention |

There is no backend application database operated by us. There is no centralized user record on our own servers. The instrument is, by design, privacy-respecting and resilient by minimalism.

## Dependencies

| Dependency | Purpose | Pin | Risk class |
|---|---|---|---|
| Google Fonts | Source Serif 4, Plus Jakarta Sans | latest | Low (typography only) |
| GoHighLevel inbound webhook | Email delivery (server-side automation) | n/a (HTTPS endpoint) | Medium (email path) |
| jsPDF | Report PDF generation | `2.5.1` | Low (lazy-loaded, client-only) |

The browser does **not** load any GoHighLevel SDK. Email delivery is a single `fetch` POST to the inbound-webhook URL. This keeps the external-script allowlist to one item (jsPDF) and lets CSP stay tight.

## Build status

The instruments currently ship as hand-edited HTML files. Phase 4 will introduce a TypeScript + Vite build pipeline producing the same single-file HTML output plus an embeddable widget, a PWA build, and a server-renderable HTML build.

## Scaling envelope

The architecture scales horizontally on the CDN side without engineering changes. Constraints: GoHighLevel plan limits on inbound-webhook automation runs and outbound email volume, which are pay-as-you-grow at the account level.

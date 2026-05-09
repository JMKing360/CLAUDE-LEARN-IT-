# Architecture

## High-level

Each instrument is a single self-contained HTML file with inline CSS and JavaScript. No backend application is required for the participant journey. Reports are delivered through EmailJS, a transactional email service operating under contract.

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
                         │
                ┌────────┴────────────────┐
                │ EmailJS (transactional) │
                │  - Sends report          │
                │  - CC mogiremd@gmail.com │
                └─────────────────────────┘
```

## State and data flow

| Where | What |
|---|---|
| Browser localStorage | Completed assessments, in-progress answers, participant name, email, intent text, threshold selection |
| EmailJS | Transient — message constructed client-side, sent through their API, then forgotten |
| `mogiremd@gmail.com` inbox | Silent CC archive of every emailed report |
| `mail@mogire.com` inbox | Public correspondence from participants |
| Cloudflare logs | Standard request logs, 30-day retention |

There is no backend application database. There is no centralized user record server-side. The instrument is, by design, privacy-respecting and resilient by minimalism.

## Dependencies

| Dependency | Purpose | Pin | Risk class |
|---|---|---|---|
| Google Fonts | Source Serif 4, Plus Jakarta Sans | latest | Low (typography only) |
| EmailJS browser SDK | Email delivery | `@4.4.1` | Medium (email path) |
| jsPDF | Report PDF generation | `2.5.1` | Low (lazy-loaded, client-only) |

## Build status

The instruments currently ship as hand-edited HTML files. Phase 4 will introduce a TypeScript + Vite build pipeline producing the same single-file HTML output plus an embeddable widget, a PWA build, and a server-renderable HTML build.

## Scaling envelope

The architecture scales horizontally on the CDN side without engineering changes. Constraints: EmailJS quota for transactional sends, which is pay-as-you-grow.

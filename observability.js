// Observability scaffold for House of Mastery instruments.
// Drop-in: add <script src="/observability.js" defer></script> after the inline body script.
// Configure by setting window.HOM_CONFIG before the script loads.

(function () {
  'use strict';
  var cfg = window.HOM_CONFIG || {};

  // ---------- Sentry (error tracking) ----------
  if (cfg.sentryDsn) {
    var s = document.createElement('script');
    s.src = 'https://browser.sentry-cdn.com/7.119.0/bundle.tracing.min.js';
    s.crossOrigin = 'anonymous';
    s.onload = function () {
      if (typeof Sentry === 'undefined') return;
      Sentry.init({
        dsn: cfg.sentryDsn,
        release: cfg.release || 'hom@3.0.0',
        environment: cfg.environment || 'production',
        tracesSampleRate: 0.1,
        ignoreErrors: ['ResizeObserver loop limit exceeded']
      });
    };
    document.head.appendChild(s);
  }

  // ---------- Plausible (privacy-first analytics) ----------
  if (cfg.plausibleDomain) {
    var p = document.createElement('script');
    p.defer = true;
    p.dataset.domain = cfg.plausibleDomain;
    p.src = 'https://plausible.io/js/script.outbound-links.js';
    document.head.appendChild(p);
    window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
  }

  // ---------- Custom event taxonomy ----------
  // HOM_TRACK is the single funnel entry point. Each call relays to:
  //  • Plausible (privacy-first analytics — props on every event)
  //  • Sentry breadcrumb (debugging context for any subsequent error)
  //  • Meta Pixel (ads measurement + audience-building)
  //
  // For Meta, two internal names map to standard Pixel events (which Meta uses
  // for optimization and lookalikes); everything else fires as `trackCustom`.
  // Standard events are enriched with `content_name` / `content_category` /
  // `content_ids` / `value` / `currency` so Meta's optimizer has real signal.
  //
  // Each fire carries an `eventID` so a future server-side Conversions API
  // dispatcher can deduplicate against the browser-side Pixel events.
  //
  // The relay is gated on window.HOM_PIXEL_DISABLED, set by the per-page
  // pre-Pixel guard for: GPC users, embedded iframes, EEA/UK visitors.
  var META_STANDARD = {
    email_gate_confirmed: 'Lead',
    assessment_completed: 'CompleteRegistration'
  };
  // Synthetic value placeholders for value-based optimization. Calibrate
  // against real LTV once Meta has volume (~50/week per event).
  var META_VALUE = {
    Lead: 5,
    CompleteRegistration: 25
  };
  function detectInstrument(p) {
    if (p && p.instrument) return p.instrument;
    return (location.pathname.indexOf('/first-hour') === 0) ? 'first-hour' : 'koora';
  }
  function instrumentContent(instr) {
    return instr === 'first-hour'
      ? { name: 'The First Hour Assessment', id: 'first_hour_v1' }
      : { name: 'KOORA UNFINISHED Assessment', id: 'koora_unfinished_v1' };
  }
  function newEventID() {
    try { if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    return Date.now() + '-' + Math.random().toString(36).slice(2);
  }
  function track(name, props) {
    var payload = props || {};
    if (window.plausible) window.plausible(name, { props: payload });
    if (window.Sentry && Sentry.addBreadcrumb) Sentry.addBreadcrumb({ category: 'hom', message: name, data: payload });
    if (window.fbq && !window.HOM_PIXEL_DISABLED) {
      try {
        var eventID = newEventID();
        var standard = META_STANDARD[name];
        if (standard) {
          var instr = detectInstrument(payload);
          var content = instrumentContent(instr);
          // Build Meta-shaped payload. Keep the original props (instrument, q, etc.)
          // alongside the Meta-expected fields.
          var enriched = {
            content_name: content.name,
            content_category: 'Assessment',
            content_ids: [content.id],
            content_type: 'assessment',
            value: META_VALUE[standard] || 0,
            currency: 'USD'
          };
          for (var k in payload) if (Object.prototype.hasOwnProperty.call(payload, k)) enriched[k] = payload[k];
          fbq('track', standard, enriched, { eventID: eventID });
        } else {
          // Custom events — `trackCustom` is the right channel; using `track`
          // here would risk collision with Meta's reserved standard event names.
          fbq('trackCustom', name, payload, { eventID: eventID });
        }
      } catch (e) { /* swallow — never let analytics break the app */ }
    }
  }
  window.HOM_TRACK = track;
})();

// Observability scaffold for House of Mastery instruments.
// Drop-in: add <script src="/observability.js" defer></script> after the inline body script.
// Configure by setting window.HOM_CONFIG before the script loads.

(function () {
  'use strict';
  var cfg = window.HOM_CONFIG || {};

  // ---------- Sentry (error tracking) ----------
  if (!cfg.sentryDsn) {
    // No DSN configured: replace the queue stub with a no-op so HOM_SENTRY_WARN
    // calls don't grow HOM_SENTRY_QUEUE unboundedly across the session.
    window.HOM_SENTRY_QUEUE = null;
    window.HOM_SENTRY_WARN = function () {};
  }
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
      // Drain any captureMessage calls queued by inline scripts before
      // Sentry was loaded. Inline scripts call window.HOM_SENTRY_WARN(msg, tags)
      // which writes to HOM_SENTRY_QUEUE; here we replay them as warning-level
      // messages now that Sentry is initialised.
      var sq = window.HOM_SENTRY_QUEUE;
      window.HOM_SENTRY_QUEUE = null;
      if (sq && sq.length) {
        for (var __si = 0; __si < sq.length; __si++) {
          try { Sentry.captureMessage(sq[__si][0], { level: 'warning', tags: sq[__si][1] || {} }); } catch (e) {}
        }
      }
      // Replace the stub with a direct passthrough so future inline calls
      // hit the real Sentry SDK.
      window.HOM_SENTRY_WARN = function (msg, tags) {
        try { Sentry.captureMessage(msg, { level: 'warning', tags: tags || {} }); } catch (e) {}
      };
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
  // against real LTV once Meta has volume (~50/week per event). HOM_CONFIG
  // overrides ship without a code change once calibration data exists.
  var META_VALUE = {
    Lead: (cfg && typeof cfg.metaValueLead === 'number') ? cfg.metaValueLead : 5,
    CompleteRegistration: (cfg && typeof cfg.metaValueCompleteRegistration === 'number') ? cfg.metaValueCompleteRegistration : 25
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
  // Per-event-name record of the last eventID we fired. Used by GHL → CAPI
  // to dedup browser-side Pixel events against server-side CAPI events.
  // Persisted in localStorage (not sessionStorage) so a genuine returner
  // arriving in a new tab/session retains a stable eventID for the dedup
  // window. TTL purge >30 days so the store does not grow unbounded.
  var EVENT_ID_TTL_MS = 30 * 24 * 60 * 60 * 1000;
  var lastEventIDs = {};
  try {
    var __cached = localStorage.getItem('HOM_LAST_EVENT_IDS');
    if (__cached) {
      var parsed = JSON.parse(__cached);
      var now = Date.now();
      // Stored shape: {name: {id, ts}} - prune anything older than TTL.
      for (var k in parsed) {
        if (parsed[k] && parsed[k].ts && (now - parsed[k].ts) < EVENT_ID_TTL_MS) {
          lastEventIDs[k] = parsed[k];
        }
      }
    }
  } catch (e) {}
  function persistEventIDs() {
    try { localStorage.setItem('HOM_LAST_EVENT_IDS', JSON.stringify(lastEventIDs)); } catch (e) {}
  }

  function track(name, props) {
    var payload = props || {};
    if (window.plausible) window.plausible(name, { props: payload });
    if (window.Sentry && Sentry.addBreadcrumb) Sentry.addBreadcrumb({ category: 'hom', message: name, data: payload });
    if (window.fbq && !window.HOM_PIXEL_DISABLED) {
      try {
        var eventID = newEventID();
        // Key by instrument+name so a user who takes both KOORA and First Hour
        // in the same browser does not have one app's eventID overwrite the
        // other's (the CAPI dedup forwarded to GHL would mismatch otherwise).
        var __instr = (payload && payload.instrument) ? payload.instrument : '';
        var __storeKey = __instr ? (__instr + ':' + name) : name;
        lastEventIDs[__storeKey] = { id: eventID, ts: Date.now() };
        persistEventIDs();
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

  // Advanced Matching helper. Meta hashes em/fn/ln/etc. client-side via the
  // SDK. Calling fbq('init', PIXEL, userData) after we have the email/name
  // from the gate seeds Advanced Matching for all subsequent events,
  // restoring EMQ uplift that autoConfig:false would otherwise lose. Safe to
  // call repeatedly; Meta debounces internally.
  window.HOM_PIXEL_ADVANCED_MATCH = function (userData) {
    if (window.HOM_PIXEL_DISABLED) return;
    if (!window.fbq || !userData) return;
    try {
      // Read Pixel ID from HOM_CONFIG so per-environment overrides work
      // without a code change. Falls back to the literal that ships in the
      // inline init in index.html / first-hour/index.html.
      var pid = (cfg && cfg.metaPixelId) || '748998691952331';
      fbq('init', pid, userData, { autoConfig: false });
    } catch (e) {}
  };

  // CAPI-dedup helper. Returns the last eventID fired for the named event,
  // so the GHL webhook payload can forward it as meta_event_id_<name> and the
  // server-side CAPI dispatcher can dedup against the browser-side fire.
  // Pass the instrument so cross-app fires don't collide; falls back to the
  // plain-name key for legacy callers.
  window.HOM_LAST_EVENT_ID = function (name, instrument) {
    var key = instrument ? (instrument + ':' + name) : name;
    var rec = lastEventIDs[key] || lastEventIDs[name];
    return rec ? (rec.id || rec) : null;
  };
  // Drain any calls queued before this deferred script executed. The HTML
  // head defines a stub HOM_TRACK that pushes to HOM_TRACK_QUEUE so cold-load
  // events (welcome_shown etc.) are not lost while we wait for the deferred
  // observability bundle to land.
  var queued = window.HOM_TRACK_QUEUE;
  window.HOM_TRACK = track;
  window.HOM_TRACK_QUEUE = null;
  if (queued && queued.length) {
    for (var i = 0; i < queued.length; i++) {
      try { track(queued[i][0], queued[i][1]); } catch (e) {}
    }
  }
})();

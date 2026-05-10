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
  // Wrap the instruments' core moments so we get a consistent funnel.
  function track(name, props) {
    if (window.plausible) window.plausible(name, { props: props || {} });
    if (window.Sentry && Sentry.addBreadcrumb) Sentry.addBreadcrumb({ category: 'hom', message: name, data: props || {} });
  }
  window.HOM_TRACK = track;

  // Auto-instrument key events if the instrument exposes them
  var observe = function () {
    // Welcome shown
    if (document.getElementById('screen-welcome')) track('welcome_shown');
    // Begin button click — supports both the legacy startAssessment() inline handler
    // and the new gated welcomeBeginClick() flow.
    var beginBtns = document.querySelectorAll(
      'button[onclick*="startAssessment"],button[onclick*="welcomeBeginClick"],#welcomeBeginBtn'
    );
    beginBtns.forEach(function (b) { b.addEventListener('click', function () { track('begin_clicked'); }); });
    // Email gate confirm — fires when the participant clears the post-START email step
    var emailGateBtns = document.querySelectorAll('button[onclick*="confirmEmailAndStart"]');
    emailGateBtns.forEach(function (b) { b.addEventListener('click', function () { track('email_gate_confirmed'); }); });
    // Send email button on the result page
    var sendBtn = document.getElementById('sendBtn');
    if (sendBtn) sendBtn.addEventListener('click', function () { track('email_sent_clicked'); });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observe);
  } else {
    observe();
  }
})();

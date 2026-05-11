// Canonical event taxonomy registry for House of Mastery instruments.
// Single source of truth: which events the apps fire, their Meta-standard
// mapping, their dedup strategy, their property schema, and per-instrument
// applicability. Any HOM_TRACK call that does not match an entry here is a
// taxonomy violation.
//
// Loaded BEFORE observability.js. observability.js consults this registry
// to enrich Meta payloads and (optionally) to refuse unknown event names in
// development.

(function () {
  'use strict';
  var TAXONOMY = {
    // ── Top-of-funnel ───────────────────────────────────────────────────────
    welcome_shown: {
      meta_standard: null,
      plausible: true,
      sentry_breadcrumb: true,
      dedup: { scope: 'session', key: 'hom_welcome_shown_{instrument}' },
      instruments: ['koora', 'first-hour'],
      props: ['instrument']
    },
    dashboard_shown: {
      meta_standard: null,
      plausible: true,
      sentry_breadcrumb: true,
      dedup: { scope: 'session', key: 'hom_dashboard_shown_{instrument}' },
      instruments: ['koora'],
      props: ['instrument']
    },
    // ── Gate / Lead ─────────────────────────────────────────────────────────
    begin_clicked: {
      meta_standard: null,
      plausible: true,
      sentry_breadcrumb: true,
      dedup: { scope: 'none' },
      instruments: ['koora', 'first-hour'],
      props: ['instrument']
    },
    email_gate_shown: {
      meta_standard: null,
      plausible: true,
      sentry_breadcrumb: true,
      dedup: { scope: 'none' },
      instruments: ['koora', 'first-hour'],
      props: ['instrument']
    },
    email_gate_confirmed: {
      meta_standard: 'Lead',
      meta_value: 5,
      plausible: true,
      sentry_breadcrumb: true,
      dedup: { scope: 'persistent', key: 'hom_lead_fired_{instrument}', subkey: '{email}' },
      instruments: ['koora', 'first-hour'],
      props: ['instrument']
    },
    // ── Mid-funnel (asymmetric) ─────────────────────────────────────────────
    first_question_answered: {
      meta_standard: null,
      plausible: true,
      sentry_breadcrumb: false,
      dedup: { scope: 'session', key: '_milestoneFired' },
      instruments: ['koora', 'first-hour'],
      props: ['instrument']
    },
    quarter_complete: {
      meta_standard: null,
      plausible: true,
      sentry_breadcrumb: false,
      dedup: { scope: 'session', key: '_milestoneFired' },
      instruments: ['koora', 'first-hour'],
      props: ['instrument']
    },
    half_complete: {
      meta_standard: null,
      plausible: true,
      sentry_breadcrumb: false,
      dedup: { scope: 'session', key: '_milestoneFired' },
      instruments: ['koora', 'first-hour'],
      props: ['instrument']
    },
    three_quarters_complete: {
      meta_standard: null,
      plausible: true,
      sentry_breadcrumb: false,
      dedup: { scope: 'session', key: '_milestoneFired' },
      instruments: ['koora', 'first-hour'],
      props: ['instrument']
    },
    transition_shown: {
      meta_standard: null,
      plausible: true,
      sentry_breadcrumb: false,
      dedup: { scope: 'none' },
      instruments: ['koora', 'first-hour'],
      props: ['instrument', 'after_q', 'entering_section']
    },
    agency_completed: {
      meta_standard: null,
      plausible: true,
      sentry_breadcrumb: true,
      dedup: { scope: 'session' },
      instruments: ['first-hour'],
      props: ['instrument']
    },
    // ── Completion ──────────────────────────────────────────────────────────
    results_shown: {
      meta_standard: null,
      plausible: true,
      sentry_breadcrumb: true,
      dedup: { scope: 'none' },
      instruments: ['koora', 'first-hour'],
      props: ['instrument']
    },
    assessment_completed: {
      meta_standard: 'CompleteRegistration',
      meta_value: 25,
      plausible: true,
      sentry_breadcrumb: true,
      dedup: { scope: 'persistent', key: 'hom_complete_fired_{instrument}_{date}' },
      instruments: ['koora', 'first-hour'],
      props: ['instrument']
    },
    email_sent_clicked: {
      meta_standard: null,
      plausible: true,
      sentry_breadcrumb: true,
      dedup: { scope: 'none' },
      instruments: ['koora', 'first-hour'],
      props: ['instrument', 'mode']
    },
    // ── Outbound rungs (First Hour results) ─────────────────────────────────
    rung_clicked: {
      meta_standard: null,
      plausible: true,
      sentry_breadcrumb: true,
      dedup: { scope: 'none' },
      instruments: ['first-hour'],
      props: ['instrument', 'rung', 'dest']
    }
  };

  window.HOM_EVENT_TAXONOMY = TAXONOMY;
})();

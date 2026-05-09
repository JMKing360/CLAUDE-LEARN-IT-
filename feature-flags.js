// Feature-flags scaffold for House of Mastery instruments.
// Two-tier resolver: URL param (highest priority for testing) → remote config → default.
// Drop-in: add <script src="/feature-flags.js"></script> in <head>.

(function () {
  'use strict';

  // Defaults shipped with the build. Override remotely or by URL param.
  var DEFAULTS = {
    'experiment.welcomeHero': 'standard', // values: standard | minimal | bold
    'experiment.questionAnimation': 'on',  // on | off
    'feature.threshHoldMap': 'on',        // on | off
    'feature.implementationIntent': 'on', // on | off
    'feature.darkMode': 'auto'            // auto | force-on | force-off
  };

  var REMOTE_URL = '/feature-flags.json'; // optional — host overrides here
  var TIMEOUT_MS = 1500;

  function readUrlParams() {
    var out = {};
    try {
      var p = new URLSearchParams(window.location.search);
      p.forEach(function (v, k) {
        if (k.indexOf('flag.') === 0) out[k.slice(5)] = v;
      });
    } catch (e) {}
    return out;
  }

  function fetchRemote() {
    return new Promise(function (resolve) {
      var done = false;
      var t = setTimeout(function () { if (!done) { done = true; resolve({}); } }, TIMEOUT_MS);
      fetch(REMOTE_URL, { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : {}; })
        .then(function (j) { if (!done) { done = true; clearTimeout(t); resolve(j || {}); } })
        .catch(function () { if (!done) { done = true; clearTimeout(t); resolve({}); } });
    });
  }

  fetchRemote().then(function (remote) {
    var url = readUrlParams();
    var resolved = Object.assign({}, DEFAULTS, remote, url);
    window.HOM_FLAGS = resolved;
    window.dispatchEvent(new CustomEvent('hom-flags-ready', { detail: resolved }));
  });

  // Synchronous accessor with default fallback
  window.flag = function (name, fallback) {
    var v = (window.HOM_FLAGS || DEFAULTS)[name];
    return typeof v === 'undefined' ? (fallback === undefined ? null : fallback) : v;
  };
})();

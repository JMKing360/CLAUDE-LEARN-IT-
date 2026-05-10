// Cloudflare Pages Function — runs on every request to the site.
//
// Purpose: gate the Meta Pixel for visitors where firing it without explicit
// consent is regulatorily indefensible:
//   • EEA + UK + Switzerland (ePrivacy Directive: prior cookie consent)
//   • Any visitor sending the Sec-GPC: 1 header (Global Privacy Control)
//
// Mechanism:
//   1. Inject `<script>window.HOM_GEO_BLOCK_PIXEL=true</script>` at the top of
//      <head>. The pre-Pixel guard in each HTML head reads this and short-
//      circuits the Pixel snippet. fbq is never created; no fbevents.js loads.
//   2. Remove the <noscript data-pixel> 1×1 image so non-JS visitors in those
//      regions also don't fire a beacon.
//
// This is policy-only suppression at the edge — no UI, no banner, no opt-in
// flow. EEA visitors simply don't get tracked.

const EEA_UK_CH = new Set([
  // EU 27
  'AT','BE','BG','CY','CZ','DE','DK','EE','ES','FI','FR','GR','HR','HU',
  'IE','IT','LT','LU','LV','MT','NL','PL','PT','RO','SE','SI','SK',
  // EEA non-EU
  'IS','LI','NO',
  // UK + Switzerland (treated identically for marketing-cookie consent)
  'GB','CH'
]);

export async function onRequest(context) {
  const response = await context.next();

  const country = (context.request.cf && context.request.cf.country)
    || context.request.headers.get('CF-IPCountry')
    || '';
  const gpc = context.request.headers.get('Sec-GPC') === '1';
  const block = gpc || EEA_UK_CH.has(country);
  if (!block) return response;

  const ct = response.headers.get('Content-Type') || '';
  if (!ct.includes('text/html')) return response;

  const rewriter = new HTMLRewriter()
    .on('head', {
      element(el) {
        el.prepend(
          '<script>window.HOM_GEO_BLOCK_PIXEL=true;</script>',
          { html: true }
        );
      }
    })
    .on('noscript[data-pixel]', {
      element(el) { el.remove(); }
    });

  return rewriter.transform(response);
}

// Cloudflare Pages Function: Meta Conversions API (CAPI) dispatcher.
//
// Path: POST /api/capi
// Trigger: GHL outbound webhook (or any server-side caller) POSTs the same
//          record shape we already build in buildEmailPayload, with the
//          meta_event_id_lead / meta_event_id_completed / meta_event_id_view_content
//          fields populated. We translate those into Meta CAPI event_id values
//          so server-side and browser-side fires dedup as a single conversion.
//
// Why: Browser-side Pixel events lose ~30-40% of conversions to iOS Safari ITP,
// uBlock/AdBlock, GPC strippers, and tracking-protection cookies. CAPI fills
// the gap. Without server-side, the meta_event_id_* fields we forward from
// the apps are dead weight.
//
// Configuration (Cloudflare Pages env vars; production secrets):
//   META_PIXEL_ID         - the Pixel ID (matches HOM_CONFIG.metaPixelId)
//   META_CAPI_TOKEN       - long-lived access token from Meta Events Manager
//   META_TEST_EVENT_CODE  - optional, for the Meta Test Events tab during QA
//   CAPI_SHARED_SECRET    - bearer token GHL sends in Authorization header
//                           so this endpoint is not open-internet-callable.
//
// Security:
//   - Authorization: Bearer <CAPI_SHARED_SECRET> required.
//   - Origin/Referrer NOT trusted (server-to-server).
//   - PII (em, fn, ln, ph) is SHA-256 hashed before transmission per Meta spec.
//   - Hashes use lowercase + trim.
//
// Returns: 200 {ok:true, sent:N} on success; 4xx on bad input / auth.
//
// Smoke test once deployed:
//   curl -X POST https://kooraassess.houseofmastery.co/api/capi \
//     -H "Authorization: Bearer $CAPI_SHARED_SECRET" \
//     -H "Content-Type: application/json" \
//     -d '{"to_email":"test@example.com","to_name":"Test","meta_event_id_completed":"abc-123",...}'

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'method not allowed', allow: 'POST' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Allow': 'POST' }
    });
  }

  // Auth: shared secret (bearer). Operator sets CAPI_SHARED_SECRET in
  // Cloudflare Pages settings; GHL sends it as Authorization header.
  const expected = env.CAPI_SHARED_SECRET;
  const auth = request.headers.get('authorization') || '';
  const provided = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!expected || provided !== expected) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }

  // Required env.
  const PIXEL_ID = env.META_PIXEL_ID;
  const TOKEN = env.META_CAPI_TOKEN;
  if (!PIXEL_ID || !TOKEN) {
    return json({ ok: false, error: 'missing META_PIXEL_ID or META_CAPI_TOKEN' }, 500);
  }

  let payload;
  try { payload = await request.json(); } catch (e) {
    return json({ ok: false, error: 'invalid JSON' }, 400);
  }

  const email = (payload.to_email || payload.email || '').trim().toLowerCase();
  const name = (payload.to_name || payload.name || '').trim().toLowerCase();
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '';
  const ua = request.headers.get('user-agent') || '';
  const eventSourceUrl = payload.event_source_url || `https://${request.headers.get('host') || 'kooraassess.houseofmastery.co'}/`;

  // Build CAPI events array. We mirror the three browser-side events the
  // apps fire: ViewContent, Lead, CompleteRegistration. Skip any whose
  // event_id wasn't forwarded (means the browser-side fire didn't happen,
  // so a server-side fire would not dedup against anything).
  const ts = Math.floor(Date.now() / 1000);
  const userData = {
    em: email ? [await sha256(email)] : undefined,
    fn: name ? [await sha256(name)] : undefined,
    client_ip_address: ip || undefined,
    client_user_agent: ua || undefined,
    fbp: payload._fbp || undefined,
    fbc: payload._fbc || undefined
  };

  const events = [];
  if (payload.meta_event_id_view_content) {
    events.push({
      event_name: 'ViewContent',
      event_time: ts,
      event_id: payload.meta_event_id_view_content,
      event_source_url: eventSourceUrl,
      action_source: 'website',
      user_data: userData,
      custom_data: {
        content_name: payload.instrument === 'koora' ? 'KOORA UNFINISHED' : 'The First Hour',
        content_category: 'Assessment',
        content_ids: [payload.instrument === 'koora' ? 'koora-unfinished' : 'first-hour'],
        content_type: 'assessment'
      }
    });
  }
  if (payload.meta_event_id_lead) {
    events.push({
      event_name: 'Lead',
      event_time: ts,
      event_id: payload.meta_event_id_lead,
      event_source_url: eventSourceUrl,
      action_source: 'website',
      user_data: userData,
      custom_data: {
        value: 5,
        currency: 'USD',
        content_name: payload.instrument === 'koora' ? 'KOORA UNFINISHED' : 'The First Hour',
        content_category: 'Assessment'
      }
    });
  }
  if (payload.meta_event_id_completed) {
    events.push({
      event_name: 'CompleteRegistration',
      event_time: ts,
      event_id: payload.meta_event_id_completed,
      event_source_url: eventSourceUrl,
      action_source: 'website',
      user_data: userData,
      custom_data: {
        value: 25,
        currency: 'USD',
        content_name: payload.instrument === 'koora' ? 'KOORA UNFINISHED' : 'The First Hour',
        content_category: 'Assessment'
      }
    });
  }

  if (!events.length) {
    return json({ ok: true, sent: 0, note: 'no event_ids in payload — nothing to dispatch' });
  }

  const url = `https://graph.facebook.com/v19.0/${encodeURIComponent(PIXEL_ID)}/events`;
  const body = {
    data: events,
    access_token: TOKEN
  };
  if (env.META_TEST_EVENT_CODE) body.test_event_code = env.META_TEST_EVENT_CODE;

  let metaRes;
  try {
    metaRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (e) {
    return json({ ok: false, error: 'meta fetch failed: ' + (e && e.message) }, 502);
  }

  let metaJson;
  try { metaJson = await metaRes.json(); } catch (e) { metaJson = { parseError: true }; }

  return json({
    ok: metaRes.ok,
    sent: events.length,
    status: metaRes.status,
    meta: metaJson
  }, metaRes.ok ? 200 : 502);
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

async function sha256(str) {
  // Meta CAPI requires lowercase, trim, then SHA-256 hex.
  const buf = new TextEncoder().encode(String(str).trim().toLowerCase());
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

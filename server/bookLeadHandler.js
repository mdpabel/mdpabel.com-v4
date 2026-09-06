const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

const clean = (value, maximumLength) =>
  typeof value === 'string' ? value.trim().slice(0, maximumLength) : '';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedLeadTypes = new Set(['case-study', 'checkout']);
const attributionKeys = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'fbclid',
];

export async function handleBookLead(request, env) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed.' }, 405);
  }

  const origin = request.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) {
        return json({ ok: false, error: 'Cross-site submissions are not allowed.' }, 403);
      }
    } catch {
      return json({ ok: false, error: 'Invalid request origin.' }, 400);
    }
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 4096) {
    return json({ ok: false, error: 'Request is too large.' }, 413);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid form submission.' }, 400);
  }

  if (clean(payload?.website, 100)) {
    return json({ ok: true });
  }

  const email = clean(payload?.email, 254).toLowerCase();
  const leadType = clean(payload?.leadType, 32);
  const landingPage = clean(payload?.landingPage, 500);
  const marketingConsent = payload?.marketingConsent === true;

  if (!emailPattern.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  }
  if (!allowedLeadTypes.has(leadType)) {
    return json({ ok: false, error: 'Invalid lead type.' }, 400);
  }
  if (!marketingConsent) {
    return json({ ok: false, error: 'Please confirm the email update permission.' }, 400);
  }
  if (!env?.DB?.prepare) {
    return json({ ok: false, error: 'Email storage is temporarily unavailable.' }, 503);
  }

  const attribution = {};
  attributionKeys.forEach((key) => {
    const value = clean(payload?.attribution?.[key], key === 'fbclid' ? 500 : 200);
    if (value) attribution[key] = value;
  });

  const emailKeyBytes = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(email),
  );
  const emailKey = Array.from(new Uint8Array(emailKeyBytes), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
  const now = new Date().toISOString();
  const caseStudyRequested = leadType === 'case-study' ? 1 : 0;
  const checkoutStarted = leadType === 'checkout' ? 1 : 0;

  try {
    await env.DB.prepare(
      `INSERT INTO book_leads (
        email, email_key, first_seen_at, last_seen_at, source,
        marketing_consent, case_study_requested, checkout_started,
        landing_page, attribution_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(email_key) DO UPDATE SET
        email = excluded.email,
        last_seen_at = excluded.last_seen_at,
        source = excluded.source,
        marketing_consent = MAX(book_leads.marketing_consent, excluded.marketing_consent),
        case_study_requested = MAX(book_leads.case_study_requested, excluded.case_study_requested),
        checkout_started = MAX(book_leads.checkout_started, excluded.checkout_started),
        landing_page = excluded.landing_page,
        attribution_json = excluded.attribution_json`,
    )
      .bind(
        email,
        emailKey,
        now,
        now,
        'meta-book-75-experiment',
        1,
        caseStudyRequested,
        checkoutStarted,
        landingPage,
        JSON.stringify(attribution),
      )
      .run();
  } catch (error) {
    console.error('Unable to store book lead', error);
    return json({ ok: false, error: 'Your email could not be saved. Please try again.' }, 500);
  }

  return json({ ok: true });
}

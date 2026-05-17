import { getDatabase } from '@netlify/database';
import { createHmac, timingSafeEqual } from 'node:crypto';

const MAX_FIELD_LEN = 500;

function sanitize(val) {
  if (typeof val !== 'string') return null;
  return val.slice(0, MAX_FIELD_LEN);
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Read raw body so we can verify the signature before parsing
  let rawBody;
  try {
    rawBody = await req.text();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  // Verify Netlify webhook signature when WEBHOOK_SECRET env var is set.
  // Set the secret in Netlify → Site settings → Environment variables.
  // Netlify signs the body with HMAC-SHA256 and sends it in X-Webhook-Signature.
  const secret = process.env.WEBHOOK_SECRET;
  if (secret) {
    const sig = req.headers.get('x-webhook-signature') ?? '';
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    const sigBuf = Buffer.from(sig.length === expected.length ? sig : expected);
    const expBuf = Buffer.from(expected);
    if (!timingSafeEqual(sigBuf, expBuf) || sig.length !== expected.length) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  // Only handle submissions from the enquiry form on this site
  if (payload.form_name !== 'enquiry' || payload.site_name !== 'hnz-school') {
    return new Response('Ignored', { status: 200 });
  }

  const d = payload.data ?? {};
  const { sql } = getDatabase();

  try {
    await sql`
      INSERT INTO enquiries (parent_name, phone, email, child_name, grade, message)
      VALUES (
        ${sanitize(d['parent-name'])},
        ${sanitize(d['phone'])},
        ${sanitize(d['email'])},
        ${sanitize(d['child-name'])},
        ${sanitize(d['grade'])},
        ${sanitize(d['message'])}
      )
    `;
  } catch (err) {
    console.error('DB insert failed:', err);
    return new Response('Internal Server Error', { status: 500 });
  }

  return new Response('OK', { status: 200 });
};

export const config = { path: '/api/save-enquiry' };

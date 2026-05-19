import { getDatabase } from '@netlify/database';
import { timingSafeEqual } from 'node:crypto';

const MAX_FIELD_LEN = 500;

function sanitize(val) {
  if (typeof val !== 'string') return null;
  return val.slice(0, MAX_FIELD_LEN);
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Netlify URL notification hooks don't support HMAC signing, so we authenticate
  // via a shared secret token in the query string — only Netlify (which stores the
  // webhook URL) knows it. Checked with timingSafeEqual to prevent timing attacks.
  const expectedToken = process.env.WEBHOOK_SECRET;
  if (!expectedToken) {
    console.error('WEBHOOK_SECRET env var is not set — refusing all requests');
    return new Response('Internal Server Error', { status: 500 });
  }
  const token = new URL(req.url).searchParams.get('token') ?? '';
  const tokBuf = Buffer.from(token.length === expectedToken.length ? token : expectedToken);
  const expBuf = Buffer.from(expectedToken);
  if (!timingSafeEqual(tokBuf, expBuf) || token.length !== expectedToken.length) {
    return new Response('Unauthorized', { status: 401 });
  }

  let rawBody;
  try {
    rawBody = await req.text();
  } catch {
    return new Response('Bad request', { status: 400 });
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

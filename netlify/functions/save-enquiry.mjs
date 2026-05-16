import { getDatabase } from '@netlify/database';

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  // Only handle submissions from the enquiry form on this site
  if (payload.form_name !== 'enquiry' || payload.site_id !== '8e06ad54-5353-4fa8-9d09-e80826ac0fe2') {
    return new Response('Ignored', { status: 200 });
  }

  const d = payload.data ?? {};
  const { sql } = getDatabase();

  await sql`
    INSERT INTO enquiries (parent_name, phone, email, child_name, grade, message)
    VALUES (
      ${d['parent-name'] ?? null},
      ${d['phone']       ?? null},
      ${d['email']       ?? null},
      ${d['child-name']  ?? null},
      ${d['grade']       ?? null},
      ${d['message']     ?? null}
    )
  `;

  return new Response('OK', { status: 200 });
};

export const config = { path: '/api/save-enquiry' };

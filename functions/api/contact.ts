export const onRequestPost: PagesFunction = async ({ request }) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://new-arthur-photo-site.pages.dev',
  };

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), {
      status: 400,
      headers,
    });
  }

  const { name, email, message } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Missing required fields' }),
      { status: 422, headers },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Invalid email address' }),
      { status: 422, headers },
    );
  }

  // TODO: wire up email delivery (Mailchannels / Resend / SendGrid)
  console.log('Contact form submission:', { name, email, message });

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
};

// Reject non-POST methods
export const onRequest: PagesFunction = async ({ request, next }) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return next();
};

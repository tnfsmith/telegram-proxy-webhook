addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(request.url);
  const pathname = url.pathname;

  //Use for webhook of n8n node
  const webhookMap = {
    '/webhook-bot1': 'https://n8n.aivnd.com/webhook/<id>/webhook',
    '/webhook-bot2': 'https://n8n.aivnd.com/webhook/<id>/webhook'
  };

  const targetWebhook = webhookMap[pathname];

  if (!targetWebhook) {
    return new Response('Webhook not mapped for this path', { status: 404 });
  }

  try {
    const rawBody = await request.text(); // đọc body thô để log
    console.log(`>> Incoming request to ${pathname}:`);
    console.log(rawBody);

    // Tạo lại request với body mới
    const newRequest = new Request(targetWebhook, {
      method: 'POST',
      headers: request.headers,
      body: rawBody
    });

    const response = await fetch(newRequest);

    // Forward response từ n8n về lại Telegram
    const responseBody = await response.text();
    return new Response(responseBody, {
      status: response.status,
      headers: response.headers
    });
  } catch (error) {
    console.error(">> Forwarding error:", error);
    return new Response('Error forwarding webhook: ' + error.message, { status: 500 });
  }
}
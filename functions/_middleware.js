export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  const removedThreatPage =
    path === '/threats-sitemap.xml' || path.startsWith('/wordpress-threats/');

  if (removedThreatPage) {
    return new Response('410 Gone', {
      status: 410,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    });
  }

  return context.next();
}

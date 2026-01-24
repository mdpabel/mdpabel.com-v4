import { getCollection } from 'astro:content';

const SITE_URL = 'https://www.mdpabel.com';

export async function GET() {
  // 1. Fetch your Threat DB
  const threats = await getCollection('wordpress-threats');

  // 2. Sort by newest report date
  const sortedThreats = threats.sort(
    (a, b) =>
      new Date(b.data.reportDate).valueOf() -
      new Date(a.data.reportDate).valueOf(),
  );

  // 3. Helper to generate XML entry
  const createUrlEntry = (slug: string, date: string) => {
    return `
    <url>
      <loc>${SITE_URL}/wordpress-threats/${slug}</loc>
      <lastmod>${new Date(date).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`;
  };

  // 4. Build the XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
      <loc>${SITE_URL}/wordpress-threats</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
  </url>

  ${sortedThreats.map((threat) => createUrlEntry(threat.slug, threat.data.reportDate)).join('')}
</urlset>`;

  return new Response(sitemap.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

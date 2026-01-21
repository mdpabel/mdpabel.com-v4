import { wordpress } from '../lib/wordpress';

// Update to your production URL
const SITE_URL = 'https://www.mdpabel.com';

export async function GET() {
  // 1. Define Static Pages
  const staticPages = [
    { url: '', priority: 1.0 },
    { url: 'about', priority: 0.8 },
    { url: 'wordpress-malware-removal', priority: 0.9 },
    { url: 'blacklist-removal', priority: 0.9 },
    { url: 'blog', priority: 0.8 },
    { url: 'case-studies', priority: 0.8 },
    { url: 'guides', priority: 0.8 },
    { url: 'hire-me', priority: 0.9 },
    { url: 'faq', priority: 0.6 },
  ];

  // 2. Optimized Fetching
  // We use '_fields' to fetch ONLY what we need.
  // This reduces the payload from ~200KB per post to ~0.5KB.
  const fields = ['slug', 'modified', 'date'];

  const [posts, caseStudies, guides] = await Promise.all([
    wordpress.getAllPosts({ postType: 'posts', _fields: fields }),
    wordpress.getAllPosts({ postType: 'case-study', _fields: fields }),
    wordpress.getAllPosts({ postType: 'guide', _fields: fields }),
    wordpress.getAllPosts({ postType: 'malware-log', _fields: fields }),
  ]);

  // 3. Helper to create XML entries
  const createUrlEntry = (
    path: string,
    modifiedDate?: string,
    publishDate?: string,
    priority = 0.7,
  ) => {
    // Prefer modified date, fallback to publish date, fallback to now
    const dateStr = modifiedDate || publishDate;
    const dateObj = dateStr ? new Date(dateStr) : new Date();

    // Fix "1970" issue
    const lastMod =
      isNaN(dateObj.getTime()) || dateObj.getFullYear() === 1970
        ? new Date().toISOString()
        : dateObj.toISOString();

    return `
    <url>
      <loc>${SITE_URL}/${path.replace(/^\//, '')}</loc>
      <lastmod>${lastMod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${priority.toFixed(1)}</priority>
    </url>`;
  };

  // 4. Build XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map((p) => createUrlEntry(p.url, undefined, undefined, p.priority)).join('')}

  ${posts.map((post) => createUrlEntry(`blog/${post.slug}`, post.modified, post.date)).join('')}

  ${caseStudies.map((post) => createUrlEntry(`case-studies/${post.slug}`, post.modified, post.date)).join('')}

  ${guides.map((post) => createUrlEntry(`guides/${post.slug}`, post.modified, post.date)).join('')}
</urlset>`;

  return new Response(sitemap.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

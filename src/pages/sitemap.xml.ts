import { wordpress } from '../lib/wordpress';

const SITE_URL = 'https://www.mdpabel.com';

export async function GET() {
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

  const fields = ['slug', 'modified', 'date'];

  // 1. Fixed the destructuring to include logs
  const [posts, caseStudies, guides, logs] = await Promise.all([
    wordpress.getAllPosts({ postType: 'posts', _fields: fields }),
    wordpress.getAllPosts({ postType: 'case-study', _fields: fields }),
    wordpress.getAllPosts({ postType: 'guide', _fields: fields }),
    wordpress.getAllPosts({ postType: 'malware-log', _fields: fields }),
  ]);

  const createUrlEntry = (
    path: string,
    modifiedDate?: string,
    publishDate?: string,
    priority = 0.7,
  ) => {
    const dateStr = modifiedDate || publishDate;
    const dateObj = dateStr ? new Date(dateStr) : new Date();

    const lastMod =
      isNaN(dateObj.getTime()) || dateObj.getFullYear() === 1970
        ? new Date().toISOString().split('T')[0] // Just the date part YYYY-MM-DD
        : dateObj.toISOString().split('T')[0];

    // 2. FORCE TRAILING SLASH: This stops the Semrush "Redirect" error
    const cleanPath = path.replace(/^\/|\/$/g, '');
    const finalUrl =
      cleanPath === '' ? `${SITE_URL}/` : `${SITE_URL}/${cleanPath}/`;

    return `
    <url>
      <loc>${finalUrl}</loc>
      <lastmod>${lastMod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${priority.toFixed(1)}</priority>
    </url>`;
  };

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map((p) => createUrlEntry(p.url, undefined, undefined, p.priority)).join('')}

  ${posts.map((post) => createUrlEntry(`blog/${post.slug}`, post.modified, post.date)).join('')}

  ${caseStudies.map((post) => createUrlEntry(`case-studies/${post.slug}`, post.modified, post.date)).join('')}

  ${guides.map((post) => createUrlEntry(`guides/${post.slug}`, post.modified, post.date)).join('')}
  
  ${/* 3. Added the missing malware logs mapping */ ''}
  ${logs.map((post) => createUrlEntry(`malware-log/${post.slug}`, post.modified, post.date)).join('')}
</urlset>`;

  return new Response(sitemap.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

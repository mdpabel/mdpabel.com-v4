import fs from 'fs/promises';
import path from 'path';
import TurndownService from 'turndown';
import axios from 'axios';

// --- CONFIGURATION ---
const WP_API_URL = 'https://cms.mdpabel.com/wp-json/wp/v2';
const LIVE_URL = 'https://mdpabel.com';
const CMS_URL = 'https://cms.mdpabel.com';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');
const MANIFEST_FILE = path.join(process.cwd(), '.sync-lock.json');

const ENDPOINTS = [
  { endpoint: 'posts', collection: 'blog' },
  { endpoint: 'case-study', collection: 'case-studies' },
  { endpoint: 'malware-log', collection: 'malware-log' },
  { endpoint: 'guide', collection: 'guides' },
];

const browserHeaders = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Referer: 'https://cms.mdpabel.com/',
};

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});
turndownService.keep(['pre', 'code']);

interface SyncManifest {
  [id: number]: string;
}

// --- ROBUST DOWNLOAD HELPER ---
async function downloadImage(remoteUrl: string): Promise<string> {
  if (!remoteUrl || !remoteUrl.startsWith('http')) return remoteUrl;

  try {
    const urlObj = new URL(remoteUrl);
    const pathParts = urlObj.pathname.split('/');
    const fileName = pathParts.pop() || 'image.jpg';

    // 1. Determine Folder Structure (YYYY/MM)
    let subDir = 'others';
    const yearIndex = pathParts.findIndex((p) => /^\d{4}$/.test(p));
    if (yearIndex !== -1 && pathParts[yearIndex + 1]) {
      subDir = `${pathParts[yearIndex]}/${pathParts[yearIndex + 1]}`;
    }

    const localDir = path.join(PUBLIC_UPLOADS_DIR, subDir);
    const finalPath = path.join(localDir, fileName);
    const tempPath = `${finalPath}.tmp`; // Atomic write target
    const publicUrl = `/uploads/${subDir}/${fileName}`;

    await fs.mkdir(localDir, { recursive: true });

    // 2. Skip if already exists and is valid
    try {
      const stats = await fs.stat(finalPath);
      if (stats.size > 0) return publicUrl;
    } catch {
      /* File doesn't exist, continue */
    }

    // 3. Download to Buffer (More stable than stream for images)
    //    Timeout set to 10s to prevent hanging
    const response = await axios.get(remoteUrl, {
      responseType: 'arraybuffer',
      headers: browserHeaders,
      timeout: 10000,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('Empty response data');
    }

    // 4. Write to TEMP file first
    await fs.writeFile(tempPath, response.data);

    // 5. Rename TEMP to FINAL (Atomic operation)
    await fs.rename(tempPath, finalPath);

    return publicUrl;
  } catch (error: any) {
    // ⚠️ FALLBACK: If download fails, return the REMOTE URL.
    // This ensures your site still loads the image (hotlinked) instead of breaking.
    const status = error.response?.status || 'Unknown';
    console.warn(
      `   ⚠️ Download failed (${status}): ${remoteUrl} --> Keeping remote link.`,
    );
    return remoteUrl;
  }
}

// --- CONTENT PROCESSOR ---
async function processContent(content: string): Promise<string> {
  if (!content) return '';

  // Double-escaped backslash to catch whitespace
  const escapedCmsUrl = CMS_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const imgRegex = new RegExp(
    `${escapedCmsUrl}/wp-content/uploads/([^"\\s')]+)`,
    'g',
  );

  const matches = [...content.matchAll(imgRegex)];
  let processedContent = content;

  // Unique images only
  const uniqueUrls = [...new Set(matches.map((m) => m[0]))];

  for (const remoteUrl of uniqueUrls) {
    const localUrl = await downloadImage(remoteUrl);
    // Global string replacement
    processedContent = processedContent.replaceAll(remoteUrl, localUrl);
  }

  // Replace remaining text links
  const linkRegex = new RegExp(CMS_URL, 'g');
  processedContent = processedContent.replace(linkRegex, LIVE_URL);

  return processedContent;
}

// --- MAIN LOOP ---
async function main() {
  console.log('🚀 Starting Robust Content Sync...');

  let manifest: SyncManifest = {};
  try {
    const data = await fs.readFile(MANIFEST_FILE, 'utf-8');
    manifest = JSON.parse(data);
  } catch (e) {}

  for (const config of ENDPOINTS) {
    console.log(`\n📡 Syncing [${config.endpoint}]...`);
    const outDir = path.join(CONTENT_DIR, config.collection);
    await fs.mkdir(outDir, { recursive: true });

    let page = 1;
    let fetching = true;

    while (fetching) {
      try {
        const res = await axios.get(`${WP_API_URL}/${config.endpoint}`, {
          params: { per_page: 50, page: page, _embed: true }, // Changed back to 50 for full sync
          headers: browserHeaders,
        });

        const posts = res.data;
        if (posts.length === 0) {
          fetching = false;
          break;
        }

        for (const post of posts) {
          // Check manifest
          if (manifest[post.id] === post.modified_gmt) {
            process.stdout.write('.');
            continue;
          }

          console.log(`\n   ⬇️  Processing: ${post.slug}`);

          let heroImage = '';
          if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
            heroImage = await downloadImage(
              post._embedded['wp:featuredmedia'][0].source_url,
            );
          }

          const cleanHtml = await processContent(post.content.rendered);
          const markdownBody = turndownService.turndown(cleanHtml);

          let yoastJsonRaw = JSON.stringify(post.yoast_head_json || {});
          yoastJsonRaw = await processContent(yoastJsonRaw);

          let yoastHead = post.yoast_head || '';
          yoastHead = await processContent(yoastHead);

          const fileContent = `---
title: "${post.title.rendered.replace(/"/g, '\\"')}"
slug: ${post.slug}
pubDate: ${post.date_gmt}
updatedDate: ${post.modified_gmt}
id: ${post.id}
heroImage: "${heroImage}"
featured_media: "${heroImage}"
yoastHead: ${JSON.stringify(yoastHead)}
yoastJson: ${yoastJsonRaw}
---

${markdownBody}
`;

          await fs.writeFile(path.join(outDir, `${post.slug}.md`), fileContent);
          manifest[post.id] = post.modified_gmt;
        }
        page++;
      } catch (e: any) {
        if (e.response && e.response.status === 400) {
          fetching = false;
        } else {
          console.error(`\n❌ Error fetching ${config.endpoint}:`, e.message);
          fetching = false;
        }
      }
    }
  }

  await fs.writeFile(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
  console.log(`\n\n✨ Sync Complete!`);
}

main();

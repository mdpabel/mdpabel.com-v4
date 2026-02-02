// scripts/fetch-one-by-one.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// --- CONFIGURATION ---
const API_URL = 'https://cms.mdpabel.com/wp-json/wp/v2';
const CACHE_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/content/_cache',
);

// --- ARGS ---
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.replace(/^--/, '').split('=');
  acc[key] = value;
  return acc;
}, {});

const POST_TYPE = args.type || 'posts';
const FORCE_UPDATE = args.force === 'true';

// --- SETUP DIRS ---
const typeDir = path.join(CACHE_DIR, POST_TYPE);
if (!fs.existsSync(typeDir)) fs.mkdirSync(typeDir, { recursive: true });

// --- 📒 THE LEDGER ---
const LEDGER_FILE = path.join(typeDir, 'ledger.json');
let ledger = {};

if (fs.existsSync(LEDGER_FILE)) {
  try {
    ledger = JSON.parse(fs.readFileSync(LEDGER_FILE, 'utf-8'));
  } catch (e) {
    console.warn('⚠️ Ledger corrupted, starting fresh.');
  }
}

function saveLedger() {
  fs.writeFileSync(LEDGER_FILE, JSON.stringify(ledger, null, 2));
}

function processPost(raw) {
  return {
    id: raw.id,
    slug: raw.slug,
    date: raw.date,
    modified: raw.modified_gmt,
    title: raw.title?.rendered || '',
    content: raw.content?.rendered || '',
    excerpt: raw.excerpt?.rendered || '',
    link: raw.link,
    yoastHead: raw.yoast_head || '',
    featuredImage: raw._embedded?.['wp:featuredmedia']?.[0]
      ? {
          url: raw._embedded['wp:featuredmedia'][0].source_url,
          alt: raw._embedded['wp:featuredmedia'][0].alt_text || '',
        }
      : undefined,
    categories:
      raw._embedded?.['wp:term']?.[0]?.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
      })) || [],
    acf: raw.acf || {},
  };
}

/**
 * 1. GET THE MASTER LIST
 * Fetches ALL IDs and Dates from WP. This is fast because we request minimal fields.
 */
async function getMasterList() {
  console.log(`📡 Fetching Master List for '${POST_TYPE}'...`);
  let allPosts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const url = `${API_URL}/${POST_TYPE}?per_page=100&page=${page}&_fields=id,modified_gmt,slug`;
      const res = await fetch(url);

      if (!res.ok) {
        hasMore = false;
        break;
      }
      const data = await res.json();

      if (data.length === 0) {
        hasMore = false;
        break;
      }

      allPosts = [...allPosts, ...data];
      process.stdout.write('.'); // Progress dot
      page++;
    } catch (e) {
      console.error(`\n❌ Failed to fetch Master List page ${page}`);
      hasMore = false;
    }
  }
  console.log(`\n✅ Found ${allPosts.length} total posts on server.`);
  return allPosts;
}

/**
 * 2. DOWNLOAD SINGLE POST
 * Robust fetch with retries for a specific ID
 */
async function downloadPost(id, slug) {
  const url = `${API_URL}/${POST_TYPE}/${id}?_embed=true`;
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const raw = await res.json();
      const clean = processPost(raw);

      // Save Content
      fs.writeFileSync(
        path.join(typeDir, `${id}.json`),
        JSON.stringify(clean, null, 2),
      );

      return true; // Success
    } catch (e) {
      attempts++;
      if (attempts === maxAttempts) return false; // Failed after retries
      await new Promise((r) => setTimeout(r, 1000 * attempts)); // Exponential backoff
    }
  }
}

// --- MAIN LOOP ---
(async () => {
  // Step 1: Get the "Map" of the territory
  const masterList = await getMasterList();

  // Step 2: identify work to be done
  const workQueue = masterList.filter((remote) => {
    if (FORCE_UPDATE) return true;

    const entry = ledger[remote.id];

    // Download if:
    // 1. Not in ledger
    // 2. Ledger says "failed"
    // 3. Remote date is newer than ledger date
    if (!entry) return true;
    if (entry.status === 'failed') return true;
    if (entry.modified !== remote.modified_gmt) return true;

    // Also check if file actually exists on disk (integrity check)
    if (!fs.existsSync(path.join(typeDir, `${remote.id}.json`))) return true;

    return false;
  });

  if (workQueue.length === 0) {
    console.log('🎉 Everything is up to date!');
    return;
  }

  console.log(`📋 Queue: ${workQueue.length} items to download.`);

  // Step 3: Process Queue One by One
  let processed = 0;
  let successCount = 0;
  let failCount = 0;

  for (const item of workQueue) {
    processed++;
    const progress = `[${processed}/${workQueue.length}]`;

    process.stdout.write(
      `${progress} Downloading ID ${item.id} (${item.slug})... `,
    );

    const success = await downloadPost(item.id, item.slug);

    if (success) {
      console.log('✅');
      // Update Ledger IMMEDIATELY
      ledger[item.id] = {
        modified: item.modified_gmt,
        status: 'success',
        slug: item.slug,
        lastChecked: new Date().toISOString(),
      };
      successCount++;
    } else {
      console.log('❌ FAILED');
      ledger[item.id] = {
        modified: item.modified_gmt,
        status: 'failed', // Mark as failed so next run picks it up
        slug: item.slug,
        lastChecked: new Date().toISOString(),
      };
      failCount++;
    }

    // Save ledger after every single item (Maximum safety)
    saveLedger();

    // Sleep to prevent server anger
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n🏁 Done! Success: ${successCount}, Failed: ${failCount}`);
})();

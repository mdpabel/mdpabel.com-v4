// scripts/fetch-one-by-one.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks'; // Added for timing

// --- CONFIGURATION ---
const API_URL = 'https://cms.mdpabel.com/wp-json/wp/v2';
const CACHE_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/content/_cache',
);

// ⚡ OPTIMIZATION: Zero delay by default (Go as fast as possible)
const SAFETY_DELAY = 50;

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

async function getMasterList() {
  const start = performance.now();
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
  const duration = ((performance.now() - start) / 1000).toFixed(2);
  console.log(`\n✅ Found ${allPosts.length} posts in ${duration}s.`);
  return allPosts;
}

/**
 * DOWNLOAD WORKER (Optimized)
 * Returns object with status and timing stats
 */
async function downloadPost(id, slug) {
  const url = `${API_URL}/${POST_TYPE}/${id}?_embed=true`;
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    const start = performance.now();
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const raw = await res.json();
      const clean = processPost(raw);

      fs.writeFileSync(
        path.join(typeDir, `${id}.json`),
        JSON.stringify(clean, null, 2),
      );

      return { success: true, duration: performance.now() - start };
    } catch (e) {
      attempts++;
      if (attempts === maxAttempts) {
        return {
          success: false,
          duration: performance.now() - start,
          error: e.message,
        };
      }
      // Backoff only on error
      await new Promise((r) => setTimeout(r, 1000 * attempts));
    }
  }
}

// --- MAIN LOOP ---
(async () => {
  const masterList = await getMasterList();

  const workQueue = masterList.filter((remote) => {
    if (FORCE_UPDATE) return true;
    const entry = ledger[remote.id];

    if (!entry) return true;
    if (entry.status === 'failed') return true;
    if (entry.modified !== remote.modified_gmt) return true;
    if (!fs.existsSync(path.join(typeDir, `${remote.id}.json`))) return true;

    return false;
  });

  if (workQueue.length === 0) {
    console.log('🎉 Everything is up to date!');
    return;
  }

  console.log(`📋 Queue: ${workQueue.length} items to download.`);

  let processed = 0;
  let successCount = 0;
  let failCount = 0;
  let totalDuration = 0;

  for (const item of workQueue) {
    processed++;
    const progress = `[${processed}/${workQueue.length}]`;

    // Visual Log
    process.stdout.write(`${progress} ID ${item.id}... `);

    const result = await downloadPost(item.id, item.slug);

    totalDuration += result.duration;
    const timeLog = `${result.duration.toFixed(0)}ms`;

    // Warn if slow (> 2 seconds)
    const speedIcon = result.duration > 2000 ? '⚠️' : '⚡';

    if (result.success) {
      console.log(`✅ ${speedIcon} ${timeLog}`);
      ledger[item.id] = {
        modified: item.modified_gmt,
        status: 'success',
        slug: item.slug,
        lastChecked: new Date().toISOString(),
      };
      successCount++;
    } else {
      console.log(`❌ FAILED (${result.error})`);
      ledger[item.id] = {
        modified: item.modified_gmt,
        status: 'failed',
        slug: item.slug,
        lastChecked: new Date().toISOString(),
      };
      failCount++;
    }

    saveLedger();

    // OPTIMIZATION: Only minimal sleep to let CPU/Disk breathe.
    if (SAFETY_DELAY > 0) await new Promise((r) => setTimeout(r, SAFETY_DELAY));
  }

  const avgTime = (totalDuration / processed).toFixed(0);
  console.log(`\n🏁 Done! Success: ${successCount}, Failed: ${failCount}`);
  console.log(`📊 Average Request Time: ${avgTime}ms`);
})();

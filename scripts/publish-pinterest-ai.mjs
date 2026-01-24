import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// --- CONFIGURATION ---
const CONTENT_DIR = 'src/content/wordpress-threats';
const LOG_FILE = 'scripts/pinterest-log.json';
const SITE_URL = 'https://www.mdpabel.com';

// Credentials
const PINTEREST_TOKEN = process.env.PINTEREST_ACCESS_TOKEN;
const PINTEREST_BOARD_ID = process.env.PINTEREST_BOARD_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Validation
if (!PINTEREST_TOKEN || !PINTEREST_BOARD_ID || !OPENAI_API_KEY) {
  console.error(
    '❌ Missing .env credentials (PINTEREST_ACCESS_TOKEN, PINTEREST_BOARD_ID, or OPENAI_API_KEY)',
  );
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// 1. Load Log
let postedLog = [];
if (fs.existsSync(LOG_FILE)) {
  postedLog = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
} else {
  fs.writeFileSync(LOG_FILE, JSON.stringify([]));
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- AI GENERATOR (The Brain) ---
async function generatePinContent(post, imageUrl, imageIndex) {
  const isCover = imageIndex === 0;

  // Custom Prompt based on image type
  const rolePrompt = isCover
    ? 'You are a Pinterest SEO Expert. Write a high-alert, click-worthy Title and Description for a WordPress Security Warning.'
    : 'You are a Forensic Analyst. Write a technical but engaging Title and Description for a malware code evidence screenshot.';

  const userPrompt = `
    Analyze this malware report and the provided image.
    
    REPORT CONTEXT:
    - Malware Name: ${post.title}
    - Severity: ${post.severity}
    - Impact: ${post.impact}
    - Type: ${post.threatType}
    
    TASK:
    1. Write a Pinterest Title (Max 100 chars). Use emoji. Focus on "${isCover ? 'Urgency/Alert' : 'Proof/Code'}".
    2. Write a Pinterest Description (Max 500 chars). Include keywords: "WordPress Malware Removal", "Security", "Hacked Site".
    
    Return JSON format: { "title": "...", "description": "..." }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cheap & Fast Vision Model
      messages: [
        { role: 'system', content: rolePrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: userPrompt },
            { type: 'image_url', image_url: { url: imageUrl } }, // AI looks at the image here
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 300,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('   ⚠️ AI Generation Failed:', error.message);
    // Fallback if AI fails
    return {
      title: `⚠️ Alert: ${post.title}`,
      description: `Detected ${post.title} on WordPress. Severity: ${post.severity}. Check your site now.`,
    };
  }
}

// --- PUBLISHER ---
async function publishPin(post, imagePath, index) {
  const uniqueId = `${post.slug}_img${index}`;

  if (postedLog.includes(uniqueId)) return false; // Skip duplicates

  const imageUrl = `${SITE_URL}${imagePath}`;
  const postUrl = `${SITE_URL}/wordpress-threats/${post.slug}`;

  console.log(`   🤖 AI Generating content for Img ${index + 1}...`);
  const aiContent = await generatePinContent(post, imageUrl, index);

  const payload = {
    link: postUrl,
    title: aiContent.title,
    description: aiContent.description,
    board_id: PINTEREST_BOARD_ID,
    media_source: {
      source_type: 'image_url',
      url: imageUrl,
    },
  };

  try {
    const response = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINTEREST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`   ❌ Pinterest API Error:`, await response.text());
      return false;
    }

    const data = await response.json();
    console.log(`   ✅ Pinned: "${aiContent.title}"`);

    postedLog.push(uniqueId);
    fs.writeFileSync(LOG_FILE, JSON.stringify(postedLog, null, 2));

    return true;
  } catch (error) {
    console.error(`   ❌ Network Error: ${error.message}`);
    return false;
  }
}

// --- MAIN LOOP ---
(async () => {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
  console.log(`📌 AI Publisher Started. Scanning ${files.length} reports...`);

  for (const file of files) {
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const { data } = matter(content);

    if (!data.screenshots || data.screenshots.length === 0) continue;

    console.log(`\n📂 Processing: ${data.title}`);

    for (let i = 0; i < data.screenshots.length; i++) {
      const imagePath = data.screenshots[i];
      const didPublish = await publishPin(data, imagePath, i);

      // Delay 30s between pins to be safe (Pinterest is strict on spam)
      if (didPublish) {
        console.log('   ⏳ Waiting 30s to respect rate limits...');
        await delay(30000);
      }
    }
  }

  console.log(`\n✨ All jobs complete.`);
})();

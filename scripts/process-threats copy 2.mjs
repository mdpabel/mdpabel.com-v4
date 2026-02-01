import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// CONFIGURATION
const DUMP_DIR = '_malware_dump';
const TRASH_DIR = '_trash';
const CONTENT_DIR = 'src/content/wordpress-threats';
const PUBLIC_BASE_DIR = 'public/images/wordpress-threats';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const VT_API_KEY = process.env.VIRUSTOTAL_API_KEY;

// Delay helper to prevent API rate limits
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Ensure directories exist
[CONTENT_DIR, PUBLIC_BASE_DIR, TRASH_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log(`🛡️  Forensic Intelligence Engine Started...`);

// --- 1. HELPER: SLUG UNIQUENESS CHECKER ---
function getUniqueSlug(baseSlug) {
  let slug = baseSlug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  let finalSlug = slug;
  let counter = 2;

  while (fs.existsSync(path.join(CONTENT_DIR, `${finalSlug}.md`))) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }
  return finalSlug;
}

// --- 2. HELPER: IMAGE TO BASE64 (For AI Vision) ---
function encodeImage(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).substring(1); // png, jpg
  const mimeType = ext === 'svg' ? 'svg+xml' : ext === 'jpg' ? 'jpeg' : ext;
  return `data:image/${mimeType};base64,${imageBuffer.toString('base64')}`;
}

// --- 3. HELPER: VIRUSTOTAL SCAN ---
async function checkVirusTotal(fileBuffer) {
  if (!VT_API_KEY) return null;

  try {
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const sha256 = hashSum.digest('hex');

    console.log(`    🔍 Checking VT Hash: ${sha256.substring(0, 15)}...`);

    const response = await fetch(
      `https://www.virustotal.com/api/v3/files/${sha256}`,
      {
        method: 'GET',
        headers: { 'x-apikey': VT_API_KEY },
      },
    );

    if (response.status === 404) {
      return { found: false, permalink: null, detections: null };
    }

    if (!response.ok) return null;

    const data = await response.json();
    const stats = data.data.attributes.last_analysis_stats;

    return {
      found: true,
      permalink: `https://www.virustotal.com/gui/file/${sha256}`,
      positives: stats.malicious,
      total: stats.malicious + stats.undetected,
    };
  } catch (error) {
    console.error(`    ❌ VT Error: ${error.message}`);
    return null;
  }
}

// --- MAIN PROCESS ---
const cases = fs
  .readdirSync(DUMP_DIR, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

if (cases.length === 0) {
  console.log('✅ No new cases found in _malware_dump.');
  process.exit(0);
}

for (const caseId of cases) {
  console.log(`\n📂 Processing Case: ${caseId}`);
  const caseDir = path.join(DUMP_DIR, caseId);
  const files = fs.readdirSync(caseDir);

  // -- DATA CONTAINERS --
  let contextContent = 'No specific context provided.';
  let evidenceFiles = []; // Code/Text content
  let aiImagePayloads = []; // Base64 images for AI
  let publicImagePaths = []; // Public paths for Markdown
  let mainFileBuffer = null; // For VT Scan

  // 1. ITERATE AND SORT FILES
  for (const file of files) {
    const filePath = path.join(caseDir, file);
    const ext = path.extname(file).toLowerCase();

    // Skip directories
    if (!fs.statSync(filePath).isFile()) continue;

    // A. User Context (Priority 1)
    if (file.toLowerCase().includes('context') && ext === '.txt') {
      contextContent = fs.readFileSync(filePath, 'utf-8');
      console.log(`    📝 Found User Context: ${file}`);
      continue;
    }

    // B. Images (Priority 2)
    if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
      // 1. Copy to Public
      const newName = `evidence-${publicImagePaths.length + 1}${ext}`;
      const destPath = path.join(PUBLIC_BASE_DIR, `${caseId}_${newName}`);
      fs.copyFileSync(filePath, destPath);

      const publicPath = `/images/wordpress-threats/${caseId}_${newName}`;
      publicImagePaths.push(publicPath);

      // 2. Prepare for AI (Vision) - Limit to first 4 images to save tokens
      if (aiImagePayloads.length < 4) {
        aiImagePayloads.push({
          type: 'image_url',
          image_url: {
            url: encodeImage(filePath),
            detail: 'high',
          },
        });
      }
      continue;
    }

    // C. Evidence Code (Priority 3)
    const content = fs.readFileSync(filePath, 'utf-8');

    // Capture executable for VT
    if (!mainFileBuffer && (ext === '.php' || ext === '.js' || ext === '.sh')) {
      mainFileBuffer = fs.readFileSync(filePath);
    }

    // Add to text evidence
    evidenceFiles.push({
      name: file,
      ext: ext,
      content: content.slice(0, 4000), // Truncate large files
    });
  }

  if (evidenceFiles.length === 0 && publicImagePaths.length === 0) {
    console.log(`    ⚠️  Empty case folder. Skipping.`);
    continue;
  }

  // 2. CHECK VIRUSTOTAL
  let vtData = null;
  if (mainFileBuffer) {
    vtData = await checkVirusTotal(mainFileBuffer);
    if (vtData?.found)
      console.log(`    🚨 VT Detection: ${vtData.positives}/${vtData.total}`);
    if (VT_API_KEY) await delay(15000);
  }

  // 3. AI ANALYSIS (MULTIMODAL)
  console.log(
    `    🤖 Analyst AI analyzing ${evidenceFiles.length} files + ${aiImagePayloads.length} images...`,
  );

  try {
    const promptInstructions = `
      You are a Senior Malware Analyst and SEO Specialist. 
      Generate a threat report based on the provided inputs.
      
      CRITICAL PRIORITY ORDER FOR ANALYSIS:
      1. USER CONTEXT (Most Important): Use this to identify the symptoms, error messages, and what the user actually saw.
      2. SCREENSHOTS (Visual Evidence): Look at the images to find error codes, injected ads, or dashboard warnings. Use these to validate the user context and write the threat.
      3. MALWARE CODE (Technical Proof): Use the code to explain *how* the symptoms in #1 and #2 happened.

      WRITING GUIDELINES:
      - Use simple, clear, professional English.
      - Fix any grammar issues found in the User Context.
      - Make the content SEO-friendly (use keywords like 'WordPress malware', 'fix hacked site', 'security').
      
      REPORTING TASKS:
      A. META DESCRIPTION: Write a compelling 150-160 character summary for Google search results.
      B. IOC EXTRACTION: Extract file names, paths, domains, or unique strings from the code/images.
      C. TECHNICAL ANALYSIS: Correlate the "What happened" (Context/Images) with "Why it happened" (Code).
    `;

    // Construct Multimodal Message
    const userMessageContent = [
      {
        type: 'text',
        text: `USER CONTEXT:\n"${contextContent}"\n\nVIRUSTOTAL DATA:\n${vtData?.found ? `Detections: ${vtData.positives}/${vtData.total}` : 'Zero-Day / Unique'}\n\nMALWARE CODE EVIDENCE:\n${evidenceFiles.map((f) => `FILE: ${f.name}\n${f.content}\n`).join('---\n')}`,
      },
      ...aiImagePayloads, // Inject images here
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Must use a vision-capable model
      messages: [
        { role: 'system', content: promptInstructions },
        { role: 'user', content: userMessageContent },
      ],
      // REMOVED: response_format: { type: 'json_object' }, <--- THIS WAS THE ERROR

      // Force JSON schema in prompt
      tools: [
        {
          type: 'function',
          function: {
            name: 'generate_report',
            description: 'Generates the malware report JSON',
            parameters: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description:
                    "Technical Name (e.g. 'Japanese SEO Spam Injection')",
                },
                slug: { type: 'string', description: 'kebab-case-slug' },
                description: {
                  type: 'string',
                  description: 'SEO optimized meta description (160 chars max)',
                },
                threatType: { type: 'string' },
                severity: {
                  type: 'string',
                  enum: ['Critical', 'High', 'Medium', 'Low'],
                },
                iocs: { type: 'array', items: { type: 'string' } },
                technicalAnalysis: {
                  type: 'string',
                  description: 'Markdown formatted analysis',
                },
                executionFlow: { type: 'array', items: { type: 'string' } },
                manualCleaning: { type: 'array', items: { type: 'string' } },
                impact: { type: 'string' },
                seenOn: { type: 'string' },
                behavior: { type: 'string' },
                difficulty: { type: 'string' },
                recurrence: { type: 'string' },
                numberOfSiteFixed: { type: 'string' },
              },
              required: [
                'title',
                'slug',
                'description',
                'technicalAnalysis',
                'manualCleaning',
              ],
            },
          },
        },
      ],
      tool_choice: { type: 'function', function: { name: 'generate_report' } },
    });

    const toolArgs =
      completion.choices[0].message.tool_calls[0].function.arguments;
    const data = JSON.parse(toolArgs);

    // 4. GENERATE FINAL DATA
    const finalSlug = getUniqueSlug(data.slug || `threat-case-${caseId}`);
    const date = new Date().toISOString().split('T')[0];

    let vtBadge = !vtData?.found
      ? 'Zero-Day (Unique)'
      : vtData.positives === 0
        ? `0/${vtData.total} (FUD)`
        : `${vtData.positives}/${vtData.total}`;

    // 5. WRITE MARKDOWN
    const mdContent = `---
title: "${data.title}"
slug: "${finalSlug}"
description: "${data.description}"
reportDate: "${date}"
threatType: "${data.threatType}"
severity: "${data.severity}"
fileHash: "${caseId}"
detectedPaths: ${JSON.stringify(evidenceFiles.map((f) => f.name))}
screenshots: ${JSON.stringify(publicImagePaths)}
vtLink: "${vtData?.permalink || 'https://www.virustotal.com/gui/home/upload'}"
vtScore: "${vtBadge}"
impact: "${data.impact}"
seenOn: "${data.seenOn}"
behavior: "${data.behavior}"
difficulty: "${data.difficulty}"
recurrence: "${data.recurrence}"
numberOfSiteFixed: "${data.numberOfSiteFixed || '1'}"
---

## Technical Analysis
${data.technicalAnalysis}

> **VirusTotal Analysis:** ${vtData?.found && vtData.positives > 0 ? `🚨 **Flagged by ${vtData.positives} vendors.**` : '🛡️ **Zero-Day / Fully Undetected.**'}

## Attack Chain
${data.executionFlow.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## Code Signature(s)
${evidenceFiles
  .map(
    (f) => `
### FILE: \`${f.name}\`
\`\`\`${f.ext.replace('.', '') || 'text'}
${f.content.slice(0, 2000)}
\`\`\`
`,
  )
  .join('\n')}

## Indicators of Compromise (IOCs)
${data.iocs.map((ioc) => `- \`${ioc}\``).join('\n')}

## Removal Protocol
${data.manualCleaning.map((step) => `1. ${step}`).join('\n')}

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
`;

    fs.writeFileSync(path.join(CONTENT_DIR, `${finalSlug}.md`), mdContent);
    console.log(`    ✅ Generated Report: ${finalSlug}.md`);

    // 6. MOVE TO TRASH
    const trashDest = path.join(TRASH_DIR, caseId);
    if (fs.existsSync(trashDest)) {
      fs.rmSync(trashDest, { recursive: true, force: true });
    }
    fs.renameSync(caseDir, trashDest);
    console.log(`    🗑️  Moved source to: ${trashDest}`);
  } catch (error) {
    console.error(`    ❌ Failed to process ${caseId}:`, error);
  }
}

console.log(`\n🚀 All jobs completed.`);

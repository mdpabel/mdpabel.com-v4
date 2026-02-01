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

// Delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Ensure directories exist
[CONTENT_DIR, PUBLIC_BASE_DIR, TRASH_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log(`🛡️  Forensic Intelligence Engine Started...`);

// --- 1. HELPER: SLUG UNIQUENESS ---
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

// --- 2. HELPER: IMAGE ENCODER ---
function encodeImage(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).substring(1);
  const mimeType = ext === 'svg' ? 'svg+xml' : ext === 'jpg' ? 'jpeg' : ext;
  return `data:image/${mimeType};base64,${imageBuffer.toString('base64')}`;
}

// --- 3. HELPER: CLEAN DEFANG IOCs ---
function defangIOC(text) {
  if (!text) return text;
  // Simple, readable defanging:
  // 1. http -> hxxp
  // 2. . -> [.]
  return text.replace(/https?:\/\//gi, 'hxxp://').replace(/\./g, '[.]');
}

// --- 4. HELPER: VIRUSTOTAL SCAN ---
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

    if (response.status === 404)
      return { found: false, permalink: null, hash: sha256 };
    if (!response.ok) return { found: false, permalink: null, hash: sha256 };

    const data = await response.json();
    const stats = data.data.attributes.last_analysis_stats;
    return {
      found: true,
      permalink: `https://www.virustotal.com/gui/file/${sha256}`,
      positives: stats.malicious,
      total: stats.malicious + stats.undetected,
      hash: sha256,
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

  let contextContent = 'No specific context provided.';
  let evidenceFiles = [];
  let aiImagePayloads = [];
  let publicImagePaths = [];
  let mainFileBuffer = null;
  let calculatedHash = 'N/A'; // Will store the real SHA256

  // 1. ITERATE FILES
  for (const file of files) {
    const filePath = path.join(caseDir, file);
    const ext = path.extname(file).toLowerCase();
    if (!fs.statSync(filePath).isFile()) continue;

    // A. User Context
    if (file.toLowerCase().includes('context') && ext === '.txt') {
      contextContent = fs.readFileSync(filePath, 'utf-8');
      console.log(`    📝 Found User Context: ${file}`);
      continue;
    }

    // B. Images
    if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
      const newName = `evidence-${publicImagePaths.length + 1}${ext}`;
      const destPath = path.join(PUBLIC_BASE_DIR, `${caseId}_${newName}`);
      fs.copyFileSync(filePath, destPath);

      publicImagePaths.push(`/images/wordpress-threats/${caseId}_${newName}`);

      if (aiImagePayloads.length < 4) {
        aiImagePayloads.push({
          type: 'image_url',
          image_url: { url: encodeImage(filePath), detail: 'high' },
        });
      }
      continue;
    }

    // C. Evidence Code
    const content = fs.readFileSync(filePath, 'utf-8');

    // Capture file for Hash/VT (Prioritize PHP/JS)
    if (!mainFileBuffer && (ext === '.php' || ext === '.js' || ext === '.sh')) {
      mainFileBuffer = fs.readFileSync(filePath);
    }
    // Fallback: if no code file found yet, use this one for hash
    if (!mainFileBuffer) {
      mainFileBuffer = fs.readFileSync(filePath);
    }

    evidenceFiles.push({ name: file, ext: ext, content: content });
  }

  if (evidenceFiles.length === 0 && publicImagePaths.length === 0) {
    console.log(`    ⚠️  Empty case folder. Skipping.`);
    continue;
  }

  // 2. HASH & VIRUSTOTAL
  let vtData = null;
  if (mainFileBuffer) {
    // Calc hash locally first
    const hashSum = crypto.createHash('sha256');
    hashSum.update(mainFileBuffer);
    calculatedHash = hashSum.digest('hex');

    vtData = await checkVirusTotal(mainFileBuffer);
    if (VT_API_KEY) await delay(15000);
  }

  // 3. AI ANALYSIS
  console.log(
    `    🤖 Analyst AI analyzing ${evidenceFiles.length} files + ${aiImagePayloads.length} images...`,
  );

  // LOGIC: If file is small (< 150 lines), we force dump. If large, we ask for snippet.
  const isLargeCase = evidenceFiles.some(
    (f) => f.content.split('\n').length > 150,
  );

  try {
    const promptInstructions = `
      You are MD Pabel, a Senior Malware Analyst.
      Write a threat report in the FIRST PERSON ("I found", "We detected").
      
      CRITICAL:
      1. Use USER CONTEXT for the story.
      2. Use SCREENSHOTS to confirm errors/symptoms.
      3. Use CODE to explain the "How".
      
      CODE HANDLING:
      ${
        isLargeCase
          ? 'These are large files. Extract the MOST CRITICAL malicious logic blocks (at least 20-50 lines). Do NOT show just one line. Show the full loop/function context.'
          : "These are small files. You can ignore the 'maliciousSnippets' tool and I will just dump the full code manually."
      }

      OUTPUT:
      - maliciousSnippets: ONLY use this if files are HUGE. Otherwise return empty array.
      - iocs: Return CLEAN URLs (e.g. http://bad.com). I will defang them myself.
    `;

    const userMessageContent = [
      {
        type: 'text',
        text: `CONTEXT:\n"${contextContent}"\n\nCODE EVIDENCE:\n${evidenceFiles.map((f) => `FILE: ${f.name}\n${f.content.slice(0, 10000)}\n`).join('---\n')}`,
      },
      ...aiImagePayloads,
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: promptInstructions },
        { role: 'user', content: userMessageContent },
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'generate_report',
            description: 'Generates the malware report JSON',
            parameters: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                slug: { type: 'string' },
                metaDescription: { type: 'string' },
                threatType: { type: 'string' },
                severity: {
                  type: 'string',
                  enum: ['Critical', 'High', 'Medium', 'Low'],
                },
                iocs: { type: 'array', items: { type: 'string' } },
                technicalAnalysis: {
                  type: 'string',
                  description: 'Markdown analysis',
                },
                executionFlow: { type: 'array', items: { type: 'string' } },
                manualCleaning: { type: 'array', items: { type: 'string' } },
                maliciousSnippets: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      filename: { type: 'string' },
                      snippet: { type: 'string' },
                      explanation: { type: 'string' },
                    },
                  },
                },
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
                'metaDescription',
                'technicalAnalysis',
                'manualCleaning',
                'iocs',
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

    const finalSlug = getUniqueSlug(data.slug || `threat-case-${caseId}`);
    const date = new Date().toISOString().split('T')[0];
    const safeIOCs = (data.iocs || []).map(defangIOC);

    let vtBadge = !vtData?.found
      ? 'Zero-Day (Unique)'
      : `${vtData.positives}/${vtData.total}`;

    // ** CODE DISPLAY LOGIC **
    // If AI provided snippets (because files were huge), use them.
    // Otherwise, if files are small/medium, DUMP THE WHOLE THING for completeness.
    let codeBlockContent = '';
    if (data.maliciousSnippets && data.maliciousSnippets.length > 0) {
      codeBlockContent = data.maliciousSnippets
        .map(
          (s) => `
### FILE: \`${s.filename}\`
> **Analysis:** ${s.explanation}

\`\`\`php
${s.snippet}
\`\`\`
`,
        )
        .join('\n');
    } else {
      // Fallback: Dump full files (limited to 3000 chars to avoid breaking build)
      codeBlockContent = evidenceFiles
        .map(
          (f) => `
### FILE: \`${f.name}\`
\`\`\`${f.ext.replace('.', '') || 'text'}
${f.content.slice(0, 3000)}
\`\`\`
`,
        )
        .join('\n');
    }

    const mdContent = `---
title: "${data.title}"
slug: "${finalSlug}"
description: "${data.metaDescription}"
reportDate: "${date}"
threatType: "${data.threatType}"
severity: "${data.severity}"
fileHash: "${calculatedHash}"
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
${(data.executionFlow || []).map((step, i) => `${i + 1}. ${step}`).join('\n')}

## Code Signature(s)
${codeBlockContent}

## Indicators of Compromise (IOCs)
${safeIOCs.map((ioc) => `- \`${ioc}\``).join('\n')}

## Removal Protocol
${(data.manualCleaning || []).map((step) => `1. ${step}`).join('\n')}

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
`;

    fs.writeFileSync(path.join(CONTENT_DIR, `${finalSlug}.md`), mdContent);
    console.log(`    ✅ Generated Report: ${finalSlug}.md`);

    const trashDest = path.join(TRASH_DIR, caseId);
    if (fs.existsSync(trashDest))
      fs.rmSync(trashDest, { recursive: true, force: true });
    fs.renameSync(caseDir, trashDest);
    console.log(`    🗑️  Moved source to: ${trashDest}`);
  } catch (error) {
    console.error(`    ❌ Failed to process ${caseId}:`, error);
  }
}

console.log(`\n🚀 All jobs completed.`);

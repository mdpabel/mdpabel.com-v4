import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// CONFIGURATION
const DUMP_DIR = '_malware_dump';
const CONTENT_DIR = 'src/content/wordpress-threats';
const PUBLIC_BASE_DIR = 'public/images/wordpress-threats';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const VT_API_KEY = process.env.VIRUSTOTAL_API_KEY;

// Delay helper to prevent API rate limits
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Ensure directories exist
[CONTENT_DIR, PUBLIC_BASE_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log(`🛡️  Forensic Intelligence Engine Started...`);

// --- 1. HELPER: SLUG UNIQUENESS CHECKER ---
function getUniqueSlug(baseSlug) {
  // Convert to SEO-friendly format: "Malicious File" -> "malicious-file"
  let slug = baseSlug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens

  let finalSlug = slug;
  let counter = 2;

  // Check if file exists; if so, increment (e.g., malware-name-2)
  while (fs.existsSync(path.join(CONTENT_DIR, `${finalSlug}.md`))) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }
  return finalSlug;
}

// --- 2. HELPER: VIRUSTOTAL SCAN ---
async function checkVirusTotal(fileBuffer) {
  if (!VT_API_KEY) return null;

  try {
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const sha256 = hashSum.digest('hex');

    console.log(`     🔍 Checking VT Hash: ${sha256.substring(0, 15)}...`);

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
    console.error(`     ❌ VT Error: ${error.message}`);
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

  // -- DATA COLLECTION CONTAINERS --
  let contextContent = 'No specific context provided.';
  let evidenceFiles = []; // Will hold code/text content
  let savedImages = []; // Will hold paths to saved images
  let mainFileBuffer = null; // For VT Scan

  // 1. ITERATE AND SORT FILES
  for (const file of files) {
    const filePath = path.join(caseDir, file);
    const ext = path.extname(file).toLowerCase();

    // Skip directories
    if (!fs.statSync(filePath).isFile()) continue;

    // A. User Context (context.txt)
    if (file.toLowerCase().includes('context') && ext === '.txt') {
      contextContent = fs.readFileSync(filePath, 'utf-8');
      console.log(`     📝 Found User Context: ${file}`);
      continue;
    }

    // B. Images (Move to Public folder)
    if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
      const newName = `evidence-${savedImages.length + 1}${ext}`;
      fs.copyFileSync(
        filePath,
        path.join(PUBLIC_BASE_DIR, `${caseId}_${newName}`),
      );
      savedImages.push(`/images/wordpress-threats/${caseId}_${newName}`);
      continue;
    }

    // C. Evidence (Code, Configs, Logs)
    // We treat ANY other text-based file as evidence to analyze.
    const content = fs.readFileSync(filePath, 'utf-8');

    // Capture the first likely "executable" file for VirusTotal scanning
    if (!mainFileBuffer && (ext === '.php' || ext === '.js' || ext === '.sh')) {
      mainFileBuffer = fs.readFileSync(filePath);
    }

    // Add to evidence bundle for AI
    evidenceFiles.push({
      name: file,
      ext: ext,
      // Limit to 4000 chars per file to save tokens, AI gets the gist
      content: content.slice(0, 4000),
    });
  }

  if (evidenceFiles.length === 0 && savedImages.length === 0) {
    console.log(`     ⚠️  Empty case folder. Skipping.`);
    continue;
  }

  // 2. CHECK VIRUSTOTAL (Once per case, on the main file)
  let vtData = null;
  if (mainFileBuffer) {
    vtData = await checkVirusTotal(mainFileBuffer);
    if (vtData?.found)
      console.log(`     🚨 VT Detection: ${vtData.positives}/${vtData.total}`);
    if (VT_API_KEY) await delay(15000);
  }

  // 3. AI ANALYSIS (UNIVERSAL PROMPT)
  console.log(
    `   🤖 Analyst AI analyzing ${evidenceFiles.length} file(s) + context...`,
  );

  try {
    const prompt = `
      You are a Senior WordPress Malware and Security Expert. 
      Analyze the provided files and user notes to generate a specific threat report.

      =========================================
      1. USER CONTEXT: Notes from the WordPress Malware Removal Expert regarding the malware removed from the client's site.
      =========================================
      "${contextContent}"

      =========================================
      2. FORENSIC EVIDENCE: The malicious files captured by the user during the removal process.
      =========================================
      ${evidenceFiles.map((f) => `\n--- START FILE: ${f.name} ---\n${f.content}\n--- END FILE ---\n`).join('')}

      =========================================
      3. VIRUSTOTAL INTEL
      =========================================
      ${vtData?.found ? `Detections: ${vtData.positives}/${vtData.total}` : 'Result: Zero-Day / Unique (Not found in database)'}

      =========================================
      4. ANALYST INSTRUCTIONS
      =========================================
      A. INTERPRETATION:
         - Identify the malware based on the malicious code and the context provided by the user.
         - Identify the threat type, severity, IOCs, behavior, impact, difficulty, and recurrence.
         - Provide a technical analysis of how the malware works and where it hides.
         - Outline the execution flow in clear steps.
         - Provide manual cleaning steps to remove the malware.
         - Use evidence from the files and user context to support your analysis.
      
      B. WRITING STYLE:
         - Use basic, direct English. 
         - Do NOT use AI words like "delve", "comprehensive", "landscape", "meticulous".
         - Be purely technical and factual.

      C. OUTPUT FORMAT:
         Return a JSON object with these fields:
         {
           "title": "Short Technical Name",
           "slug": "kebab-case-seo-slug (e.g. 'database-js-fetch-injection')",
           "threatType": "Category (e.g. 'Database Injection', 'Cron Malware', 'Backdoor')",
           "severity": "Critical, High, or Medium",
           "iocs": ["List 3-5 specific strings/domains from the code"],
           "technicalAnalysis": "How the code works and where it hides. Connect the user context to the file evidence.",
           "executionFlow": ["Step 1", "Step 2", "Step 3"],
           "manualCleaning": ["Step 1", "Step 2", "Step 3"],
           "impact": "Impact on the website/SEO/Performance/Security.",
           "seenOn": "Location found (Normalized technical term)",
           "behavior": "What the malware does (e.g. Redirects, Steals Data)",
           "difficulty": "Easy, Moderate, or Hard",
           "recurrence": "Low, Medium, or High",
           "numberOfSiteFixed": "Include this if the user mentions how many sites they fixed this malware on",
         }
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const data = JSON.parse(completion.choices[0].message.content);

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
reportDate: "${date}"
threatType: "${data.threatType}"
severity: "${data.severity}"
fileHash: "${caseId}"
detectedPaths: ${JSON.stringify(evidenceFiles.map((f) => f.name))}
screenshots: ${JSON.stringify(savedImages)}
vtLink: "${vtData?.permalink || 'https://www.virustotal.com/gui/home/upload'}"
vtScore: "${vtBadge}"
impact: "${data.impact}"
seenOn: "${data.seenOn}"
behavior: "${data.behavior}"
difficulty: "${data.difficulty}"
recurrence: "${data.recurrence}"
numberOfSiteFixed: "${data.numberOfSiteFixed || 'N/A'}"
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
    console.log(`   ✅ Generated Report: ${finalSlug}.md`);

    // CLEANUP: Remove source folder
    fs.rmSync(caseDir, { recursive: true, force: true });
  } catch (error) {
    console.error(`   ❌ Failed to process ${caseId}:`, error);
  }
}

console.log(`\n🚀 All jobs completed.`);

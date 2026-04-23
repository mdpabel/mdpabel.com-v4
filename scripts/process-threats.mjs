import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const DUMP_DIR = '_malware_dump';
const TRASH_DIR = '_trash';
const REVIEW_DIR = '_review';
const CONTENT_DIR = 'src/content/wordpress-threats';
const PUBLIC_BASE_DIR = 'public/images/wordpress-threats';

const MODELS = {
  ANALYST: process.env.OPENAI_MODEL_ANALYST || 'gpt-5.4',
  WRITER: process.env.OPENAI_MODEL_WRITER || 'gpt-5.4',
  REVIEWER: process.env.OPENAI_MODEL_REVIEWER || 'gpt-5.4-mini',
};

const MAX_IMAGES_FOR_MODEL = 6;
const MAX_FILES_FOR_MODEL = 24;
const MAX_SNIPPETS_PER_FILE = 6;
const MAX_SNIPPET_CHARS = 5000;
const ANALYST_OUTPUT_TOKENS = 12000;
const WRITER_OUTPUT_TOKENS = 18000;
const REVIEW_OUTPUT_TOKENS = 3000;
const MAX_TITLE_LENGTH = 88;

// Publish behavior:
// - publish_with_review_notes: always publish markdown to CONTENT_DIR, save review JSON, and optionally mirror flagged drafts to REVIEW_DIR
// - strict_review: publish only when review.publishReady === true
const PUBLISH_MODE =
  process.env.THREAT_PUBLISH_MODE || 'publish_with_review_notes';
const MIRROR_FLAGGED_MARKDOWN_TO_REVIEW =
  process.env.THREAT_MIRROR_FLAGGED_TO_REVIEW !== 'false';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const VT_API_KEY = process.env.VIRUSTOTAL_API_KEY;

for (const dir of [CONTENT_DIR, PUBLIC_BASE_DIR, TRASH_DIR, REVIEW_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const DANGEROUS_KEYS = [
  'password',
  'passwd',
  'secret',
  'token',
  'api_key',
  'apikey',
  'license_key',
  'auth_key',
  'private_key',
];

const EXTENSION_RESTORE_PATTERNS = [
  'php',
  'js',
  'css',
  'html',
  'htaccess',
  'json',
  'xml',
  'sh',
  'inc',
  'phtml',
  'twig',
  'sql',
];

const SUSPICIOUS_PATTERNS = [
  /base64_decode\s*\(/gi,
  /gzinflate\s*\(/gi,
  /gzuncompress\s*\(/gi,
  /str_rot13\s*\(/gi,
  /eval\s*\(/gi,
  /assert\s*\(/gi,
  /preg_replace\s*\(.*\/e/gi,
  /create_function\s*\(/gi,
  /shell_exec\s*\(/gi,
  /system\s*\(/gi,
  /exec\s*\(/gi,
  /passthru\s*\(/gi,
  /proc_open\s*\(/gi,
  /wp_remote_get\s*\(/gi,
  /wp_remote_post\s*\(/gi,
  /file_get_contents\s*\(\s*['"]https?:\/\//gi,
  /curl_init\s*\(/gi,
  /wp_create_user\s*\(/gi,
  /wp_set_password\s*\(/gi,
  /activate_plugin\s*\(/gi,
  /deactivate_plugins\s*\(/gi,
  /plugins_loaded/gi,
  /mu-plugins/gi,
  /\.sc-backup/gi,
  /wp-content\/plugins\//gi,
  /wp-content\/themes\//gi,
  /wp-content\/mu-plugins\//gi,
  /HTTP_[A-Z0-9_]{5,}/g,
  /\$_(POST|GET|REQUEST|COOKIE|SERVER)/g,
  /document\.location/gi,
  /window\.location/gi,
  /fromCharCode\s*\(/gi,
  /atob\s*\(/gi,
  /<iframe/gi,
  /<script/gi,
  /javascript:/gi,
  /casino/gi,
  /captcha/gi,
  /[A-Za-z0-9+/=]{180,}/g,
];

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getUniqueSlug(baseSlug) {
  const clean = slugify(baseSlug || 'threat-pattern');
  let finalSlug = clean;
  let counter = 2;
  while (fs.existsSync(path.join(CONTENT_DIR, `${finalSlug}.md`))) {
    finalSlug = `${clean}-${counter}`;
    counter += 1;
  }
  return finalSlug;
}

function sanitizeYamlString(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, ' ')
    .trim();
}

function normalizeEvidenceDisplayName(fileName) {
  let normalized = fileName;
  for (const ext of EXTENSION_RESTORE_PATTERNS) {
    const pattern = new RegExp(`\\.${ext}\\.(txt|sample|evidence)$`, 'i');
    if (pattern.test(normalized)) {
      normalized = normalized.replace(pattern, `.${ext}`);
      return normalized;
    }
  }
  return normalized;
}

function guessLanguageFromName(fileName) {
  const name = fileName.toLowerCase();
  if (name.endsWith('.php') || name.endsWith('.phtml') || name.endsWith('.inc'))
    return 'php';
  if (name.endsWith('.js')) return 'js';
  if (name.endsWith('.css')) return 'css';
  if (name.endsWith('.html')) return 'html';
  if (name.endsWith('.sh')) return 'bash';
  if (name.endsWith('.json')) return 'json';
  if (name.endsWith('.xml')) return 'xml';
  return 'text';
}

function isLikelyBinary(buffer) {
  if (!buffer || buffer.length === 0) return false;
  const sample = buffer.subarray(0, Math.min(buffer.length, 4096));
  let suspicious = 0;
  for (const byte of sample) {
    if (byte === 0) return true;
    if (byte < 7 || (byte > 14 && byte < 32)) suspicious += 1;
  }
  return suspicious / sample.length > 0.15;
}

function readTextMaybe(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (isLikelyBinary(buffer)) {
    return {
      isBinary: true,
      buffer,
      text: '',
      sha256: sha256(buffer),
      printablePreview: buffer
        .toString('latin1')
        .replace(/[^\x20-\x7E\n\r\t]/g, '')
        .slice(0, 4000),
    };
  }

  return {
    isBinary: false,
    buffer,
    text: buffer.toString('utf-8'),
    sha256: sha256(buffer),
    printablePreview: '',
  };
}

function encodeImage(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).substring(1).toLowerCase();
  const mimeType = ext === 'svg' ? 'svg+xml' : ext === 'jpg' ? 'jpeg' : ext;
  return `data:image/${mimeType};base64,${imageBuffer.toString('base64')}`;
}

function defangIOC(value) {
  if (!value) return value;

  const DOT_PLACEHOLDER = '__DEFANGED_DOT__';
  let result = String(value).trim();

  result = result.replace(/\[\.\]/g, DOT_PLACEHOLDER);

  if (/^https?:\/\//i.test(result)) {
    result = result.replace(/^https?:\/\//i, (m) =>
      m.toLowerCase() === 'https://' ? 'hxxps://' : 'hxxp://',
    );
  }

  result = result.replace(/\./g, '[.]');
  result = result.replace(new RegExp(DOT_PLACEHOLDER, 'g'), '[.]');

  return result;
}

function sanitizeCodeSnippet(code) {
  if (!code) return code;

  let cleaned = String(code);

  cleaned = cleaned.replace(/https?:\/\/[^\s'"`<>]+/gi, (match) =>
    defangIOC(match),
  );
  cleaned = cleaned.replace(/[A-Za-z0-9+/=]{220,}/g, '[REDACTED_ENCODED_BLOB]');

  for (const key of DANGEROUS_KEYS) {
    const regex = new RegExp(`(${key}\\s*[:=]\\s*['"])([^'"]+)(['"])`, 'gi');
    cleaned = cleaned.replace(regex, '$1[REDACTED]$3');
  }

  cleaned = cleaned.replace(
    /(define\s*\(\s*['"][A-Z0-9_]*(SECRET|TOKEN|KEY|PASSWORD)[A-Z0-9_]*['"]\s*,\s*['"])([^'"]+)(['"]\s*\))/gi,
    '$1[REDACTED]$4',
  );
  cleaned = cleaned.replace(
    /(wp_create_user\s*\(\s*['"][^'"]+['"]\s*,\s*['"])([^'"]+)(['"])/gi,
    '$1[REDACTED]$3',
  );

  return cleaned;
}

function extractIocsLocally(text) {
  if (!text) return [];
  const values = new Set();
  const patterns = [
    /https?:\/\/[^\s'"<>`]+/gi,
    /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}\b/gi,
    /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    /HTTP_[A-Z0-9_]{5,}/g,
    /compat=verify/gi,
  ];

  for (const pattern of patterns) {
    const matches = text.match(pattern) || [];
    for (const value of matches) values.add(String(value));
  }

  return [...values].slice(0, 80);
}

function scoreTextSuspicion(text) {
  if (!text) return 0;
  let score = 0;
  for (const pattern of SUSPICIOUS_PATTERNS) {
    const matches = text.match(pattern);
    if (matches?.length) score += matches.length;
  }
  return score;
}

function extractSnippets(
  displayName,
  text,
  maxSnippets = MAX_SNIPPETS_PER_FILE,
) {
  if (!text) return [];
  const lines = text.split('\n');
  const hits = [];

  lines.forEach((line, index) => {
    if (
      SUSPICIOUS_PATTERNS.some((pattern) => {
        const fresh = new RegExp(pattern.source, pattern.flags);
        return fresh.test(line);
      })
    ) {
      hits.push(index);
    }
  });

  if (hits.length === 0 && lines.length > 0) {
    return [
      {
        filename: displayName,
        lineStart: 1,
        lineEnd: Math.min(lines.length, 80),
        code: sanitizeCodeSnippet(
          lines
            .slice(0, Math.min(lines.length, 80))
            .join('\n')
            .slice(0, MAX_SNIPPET_CHARS),
        ),
      },
    ];
  }

  const merged = [];
  for (const hit of hits) {
    const start = Math.max(0, hit - 12);
    const end = Math.min(lines.length - 1, hit + 22);
    if (merged.length && start <= merged[merged.length - 1].end + 5) {
      merged[merged.length - 1].end = Math.max(
        merged[merged.length - 1].end,
        end,
      );
    } else {
      merged.push({ start, end });
    }
  }

  return merged.slice(0, maxSnippets).map((range) => ({
    filename: displayName,
    lineStart: range.start + 1,
    lineEnd: range.end + 1,
    code: sanitizeCodeSnippet(
      lines
        .slice(range.start, range.end + 1)
        .join('\n')
        .slice(0, MAX_SNIPPET_CHARS),
    ),
  }));
}

function deriveTargetsLocally(files) {
  const targets = [];
  const seen = new Set();

  const pushTarget = (targetType, target, reason, confidence = 'medium') => {
    const key = `${targetType}:${target}`;
    if (seen.has(key)) return;
    seen.add(key);
    targets.push({ targetType, target, reason, confidence });
  };

  for (const file of files) {
    const combined = [
      file.preview,
      ...(file.snippets || []).map((s) => s.code),
    ].join('\n');

    if (
      /activate_plugin\s*\(\s*['"]([^/'"]+)\/[^'"]+['"]\s*\)/i.test(combined)
    ) {
      const matches = [
        ...combined.matchAll(
          /activate_plugin\s*\(\s*['"]([^/'"]+)\/[^'"]+['"]\s*\)/gi,
        ),
      ];
      for (const match of matches) {
        pushTarget(
          'plugin_directory',
          `wp-content/plugins/${match[1]}`,
          `Plugin slug inferred from activate_plugin() inside ${file.displayName}.`,
          'high',
        );
      }
    }

    for (const match of combined.matchAll(
      /wp-content\/plugins\/([a-z0-9._-]+)/gi,
    )) {
      pushTarget(
        'plugin_directory',
        `wp-content/plugins/${match[1]}`,
        `Suspicious plugin path referenced inside ${file.displayName}.`,
        'medium',
      );
    }

    for (const match of combined.matchAll(
      /wp-content\/themes\/([a-z0-9._-]+)/gi,
    )) {
      pushTarget(
        'theme_directory',
        `wp-content/themes/${match[1]}`,
        `Theme path referenced inside ${file.displayName}.`,
        'medium',
      );
    }

    for (const match of combined.matchAll(
      /wp-content\/mu-plugins\/([a-z0-9._-]+)/gi,
    )) {
      pushTarget(
        'mu_plugin_path',
        `wp-content/mu-plugins/${match[1]}`,
        `mu-plugins path referenced inside ${file.displayName}.`,
        'medium',
      );
    }

    for (const match of combined.matchAll(
      /\.([a-z0-9_-]+)-backup\/?([a-z0-9._-]+)?/gi,
    )) {
      pushTarget(
        'hidden_backup_path',
        match[0],
        `Hidden backup-style path referenced inside ${file.displayName}.`,
        'medium',
      );
    }

    if (/\.sc-backup/i.test(combined)) {
      pushTarget(
        'hidden_backup_path',
        'wp-content/.sc-backup',
        `Hidden backup directory referenced inside ${file.displayName}.`,
        'high',
      );
    }

    if (
      /wp_create_user\s*\(/i.test(combined) ||
      /set_role\s*\(\s*['"]administrator['"]\s*\)/i.test(combined)
    ) {
      pushTarget(
        'unauthorized_admin_review',
        'WordPress administrator accounts',
        `Admin creation/reset logic appears in ${file.displayName}.`,
        'high',
      );
    }

    if (/functions\.php/i.test(file.displayName)) {
      pushTarget(
        'theme_file',
        file.displayName,
        'Theme functions file appears to be a representative infected sample.',
        'medium',
      );
    }

    if (/mu-plugin/i.test(file.displayName) || /mu-plugins/i.test(combined)) {
      pushTarget(
        'mu_plugin_path',
        file.displayName,
        'Representative mu-plugin sample file.',
        'medium',
      );
    }
  }

  return targets;
}

function copyEvidenceImage(filePath, caseId, index) {
  const ext = path.extname(filePath).toLowerCase();
  const fileName = `${caseId}_evidence-${index}${ext}`;
  const dest = path.join(PUBLIC_BASE_DIR, fileName);
  fs.copyFileSync(filePath, dest);
  return `/images/wordpress-threats/${fileName}`;
}

function uniqueStrings(items) {
  const seen = new Set();
  const output = [];
  for (const item of items || []) {
    const clean = String(item || '').trim();
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(clean);
  }
  return output;
}

function uniqueObjects(items, keyFn) {
  const seen = new Set();
  const output = [];
  for (const item of items || []) {
    const key = keyFn(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}

function isPlaceholderScreenshotFinding(item) {
  const text =
    `${item?.observedTextOrUi || ''} ${item?.explanation || ''}`.toLowerCase();
  return (
    text.includes('no additional screenshot content available') ||
    text.includes('screenshot unavailable') ||
    text.includes('image content was not separately described') ||
    text.includes('no screenshot content available')
  );
}

function cleanLikelyEntryPoints(items) {
  const cleaned = [];
  for (const item of uniqueStrings(items)) {
    let value = item;
    value = value.replace(
      /^existing backdoor access through\s+/i,
      'Observed access mechanism: ',
    );
    value = value.replace(
      /^existing backdoor access via\s+/i,
      'Observed access mechanism: ',
    );
    cleaned.push(value);
  }
  return cleaned;
}

function normalizeTitle(title) {
  let value = String(title || '').trim();
  if (!value) return 'WordPress malware threat pattern';

  value = value.replace(
    /^WordPress persistence network using\s+/i,
    'WordPress malware with ',
  );
  value = value.replace(
    /^WordPress backdoor and persistence network using\s+/i,
    'WordPress malware with ',
  );
  value = value.replace(
    /^WordPress persistence malware using\s+/i,
    'WordPress malware with ',
  );
  value = value.replace(/\s+/g, ' ');

  if (value.length > MAX_TITLE_LENGTH) {
    const segments = value
      .split(/,\s+| and /)
      .map((s) => s.trim())
      .filter(Boolean);
    if (segments.length > 2) {
      const first = segments[0];
      const second = segments[1];
      value = `${first} and ${second}`;
    }
  }

  if (value.length > MAX_TITLE_LENGTH) {
    value = value
      .slice(0, MAX_TITLE_LENGTH)
      .replace(/\s+\S*$/, '')
      .trim();
  }

  return value;
}

function normalizeAnalysis(analysis) {
  const next = JSON.parse(JSON.stringify(analysis || {}));

  next.likelyEntryPoints = cleanLikelyEntryPoints(next.likelyEntryPoints || []);
  next.affectedComponents = uniqueStrings(next.affectedComponents || []);
  next.likelyPersistencePoints = uniqueStrings(
    next.likelyPersistencePoints || [],
  );
  next.executionFlow = uniqueStrings(next.executionFlow || []);
  next.technicalFindings = uniqueStrings(next.technicalFindings || []);
  next.observedUiSymptoms = uniqueStrings(next.observedUiSymptoms || []);
  next.observedFacts = uniqueStrings(next.observedFacts || []);
  next.supportedInferences = uniqueStrings(next.supportedInferences || []);
  next.unknowns = uniqueStrings(next.unknowns || []);
  next.sensitiveArtifacts = uniqueStrings(next.sensitiveArtifacts || []);

  next.screenshotFindings = uniqueObjects(
    (next.screenshotFindings || []).filter(
      (item) => !isPlaceholderScreenshotFinding(item),
    ),
    (item) =>
      `${String(item?.observedTextOrUi || '').toLowerCase()}|${String(item?.explanation || '').toLowerCase()}`,
  );

  next.publicIocs = uniqueObjects(
    next.publicIocs || [],
    (item) => `${item?.type || ''}|${String(item?.value || '').toLowerCase()}`,
  );
  next.removalTargets = uniqueObjects(
    next.removalTargets || [],
    (item) =>
      `${item?.targetType || ''}|${String(item?.target || '').toLowerCase()}`,
  );
  next.codeHighlights = uniqueObjects(
    next.codeHighlights || [],
    (item) =>
      `${String(item?.filename || '').toLowerCase()}|${String(item?.explanation || '').toLowerCase()}`,
  );

  const unknownText = (next.unknowns || []).join(' ').toLowerCase();
  const rootCauseText = (next.likelyEntryPoints || []).join(' ').toLowerCase();
  const entryIsUnknown =
    unknownText.includes('initial entry') ||
    unknownText.includes('initial intrusion') ||
    unknownText.includes('entry vector') ||
    rootCauseText.includes('unknown') ||
    rootCauseText.includes('not proven');

  if (entryIsUnknown && next.confidence?.rootCause === 'high') {
    next.confidence.rootCause = 'low';
  }

  return next;
}

function normalizePage(page) {
  const next = JSON.parse(JSON.stringify(page || {}));

  next.title = normalizeTitle(next.title);
  next.whatVisitorsMaySee = uniqueStrings(next.whatVisitorsMaySee || []);
  next.filesAndDirectoriesToCheck = uniqueStrings(
    next.filesAndDirectoriesToCheck || [],
  );
  next.evidenceNotes = uniqueStrings(next.evidenceNotes || []);
  next.removalSteps = uniqueStrings(next.removalSteps || []);
  next.hardeningSteps = uniqueStrings(next.hardeningSteps || []);
  next.attackChain = uniqueStrings(next.attackChain || []);
  next.faq = uniqueObjects(next.faq || [], (item) =>
    String(item?.question || '').toLowerCase(),
  );

  next.whatThisPatternIs = String(next.whatThisPatternIs || '')
    .replace(
      /WordPress backdoor and persistence network/gi,
      'multi-part WordPress backdoor and persistence infection',
    )
    .trim();

  next.screenshotSection = String(next.screenshotSection || '')
    .replace(/\bSearch phrasing:[^\n]+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  next.intro = String(next.intro || '')
    .replace(/\s+/g, ' ')
    .trim();
  next.quickAnswer = String(next.quickAnswer || '')
    .replace(/\s+/g, ' ')
    .trim();
  next.likelyRootCause = String(next.likelyRootCause || '')
    .replace(/\s+/g, ' ')
    .trim();
  next.whyItKeepsComingBack = String(next.whyItKeepsComingBack || '')
    .replace(/\s+/g, ' ')
    .trim();
  next.technicalAnalysis = String(next.technicalAnalysis || '')
    .replace(/\s+/g, ' ')
    .trim();

  return next;
}

function resolveWritePlan(finalSlug, review) {
  const contentMarkdownPath = path.join(CONTENT_DIR, `${finalSlug}.md`);
  const contentReviewPath = path.join(CONTENT_DIR, `${finalSlug}.review.json`);
  const flaggedMarkdownPath = path.join(REVIEW_DIR, `${finalSlug}.md`);
  const flaggedReviewPath = path.join(REVIEW_DIR, `${finalSlug}.review.json`);

  if (PUBLISH_MODE === 'strict_review') {
    return {
      publishMarkdownPath: review.publishReady
        ? contentMarkdownPath
        : flaggedMarkdownPath,
      reviewJsonPath: review.publishReady
        ? contentReviewPath
        : flaggedReviewPath,
      mirrorFlaggedMarkdownPath: null,
      publishedToContent: review.publishReady,
    };
  }

  return {
    publishMarkdownPath: contentMarkdownPath,
    reviewJsonPath: contentReviewPath,
    mirrorFlaggedMarkdownPath:
      !review.publishReady && MIRROR_FLAGGED_MARKDOWN_TO_REVIEW
        ? flaggedMarkdownPath
        : null,
    publishedToContent: true,
  };
}

async function checkVirusTotal(buffer) {
  if (!VT_API_KEY || !buffer) return null;
  try {
    const hash = sha256(buffer);
    const response = await fetch(
      `https://www.virustotal.com/api/v3/files/${hash}`,
      {
        method: 'GET',
        headers: { 'x-apikey': VT_API_KEY },
      },
    );

    if (response.status === 404) {
      return { found: false, hash, permalink: null, positives: 0, total: 0 };
    }

    if (!response.ok) {
      return { found: false, hash, permalink: null, positives: 0, total: 0 };
    }

    const json = await response.json();
    const stats = json?.data?.attributes?.last_analysis_stats || {};
    return {
      found: true,
      hash,
      permalink: `https://www.virustotal.com/gui/file/${hash}`,
      positives: Number(stats.malicious || 0),
      total: Number(stats.malicious || 0) + Number(stats.undetected || 0),
    };
  } catch (error) {
    console.error(`VT error: ${error.message}`);
    return null;
  }
}

async function callStructuredResponse({
  model,
  instructions,
  input,
  schemaName,
  schema,
  maxOutputTokens,
}) {
  const response = await openai.responses.create({
    model,
    store: false,
    instructions,
    input,
    max_output_tokens: maxOutputTokens,
    text: {
      format: {
        type: 'json_schema',
        name: schemaName,
        schema,
        strict: true,
      },
    },
  });

  return JSON.parse(response.output_text);
}

const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    titleCandidate: { type: 'string' },
    slugBase: { type: 'string' },
    threatType: { type: 'string' },
    severity: { type: 'string', enum: ['Critical', 'High', 'Medium', 'Low'] },
    sampleScope: { type: 'string' },
    shortSummary: { type: 'string' },
    observedFacts: { type: 'array', items: { type: 'string' } },
    supportedInferences: { type: 'array', items: { type: 'string' } },
    unknowns: { type: 'array', items: { type: 'string' } },
    observedUiSymptoms: { type: 'array', items: { type: 'string' } },
    screenshotFindings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          image: { type: 'string' },
          observedTextOrUi: { type: 'string' },
          likelySearchQuery: { type: 'string' },
          explanation: { type: 'string' },
        },
        required: [
          'image',
          'observedTextOrUi',
          'likelySearchQuery',
          'explanation',
        ],
      },
    },
    affectedComponents: { type: 'array', items: { type: 'string' } },
    likelyEntryPoints: { type: 'array', items: { type: 'string' } },
    likelyPersistencePoints: { type: 'array', items: { type: 'string' } },
    executionFlow: { type: 'array', items: { type: 'string' } },
    technicalFindings: { type: 'array', items: { type: 'string' } },
    removalTargets: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          targetType: { type: 'string' },
          target: { type: 'string' },
          reason: { type: 'string' },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
        required: ['targetType', 'target', 'reason', 'confidence'],
      },
    },
    publicIocs: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          type: { type: 'string' },
          value: { type: 'string' },
          source: { type: 'string' },
        },
        required: ['type', 'value', 'source'],
      },
    },
    sensitiveArtifacts: { type: 'array', items: { type: 'string' } },
    codeHighlights: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          filename: { type: 'string' },
          explanation: { type: 'string' },
          code: { type: 'string' },
        },
        required: ['filename', 'explanation', 'code'],
      },
    },
    confidence: {
      type: 'object',
      additionalProperties: false,
      properties: {
        rootCause: { type: 'string', enum: ['high', 'medium', 'low'] },
        persistence: { type: 'string', enum: ['high', 'medium', 'low'] },
        screenshotRead: { type: 'string', enum: ['high', 'medium', 'low'] },
        iocs: { type: 'string', enum: ['high', 'medium', 'low'] },
      },
      required: ['rootCause', 'persistence', 'screenshotRead', 'iocs'],
    },
    claimsNeedingHumanReview: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'titleCandidate',
    'slugBase',
    'threatType',
    'severity',
    'sampleScope',
    'shortSummary',
    'observedFacts',
    'supportedInferences',
    'unknowns',
    'observedUiSymptoms',
    'screenshotFindings',
    'affectedComponents',
    'likelyEntryPoints',
    'likelyPersistencePoints',
    'executionFlow',
    'technicalFindings',
    'removalTargets',
    'publicIocs',
    'sensitiveArtifacts',
    'codeHighlights',
    'confidence',
    'claimsNeedingHumanReview',
  ],
};

const PAGE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    slug: { type: 'string' },
    metaDescription: { type: 'string' },
    intro: { type: 'string' },
    quickAnswer: { type: 'string' },
    whatVisitorsMaySee: { type: 'array', items: { type: 'string' } },
    screenshotSection: { type: 'string' },
    whatThisPatternIs: { type: 'string' },
    likelyRootCause: { type: 'string' },
    whyItKeepsComingBack: { type: 'string' },
    filesAndDirectoriesToCheck: { type: 'array', items: { type: 'string' } },
    removalStrategyIntro: { type: 'string' },
    removalSteps: { type: 'array', items: { type: 'string' } },
    hardeningSteps: { type: 'array', items: { type: 'string' } },
    technicalAnalysis: { type: 'string' },
    attackChain: { type: 'array', items: { type: 'string' } },
    evidenceNotes: { type: 'array', items: { type: 'string' } },
    faq: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          question: { type: 'string' },
          answer: { type: 'string' },
        },
        required: ['question', 'answer'],
      },
    },
    proofStatement: { type: 'string' },
  },
  required: [
    'title',
    'slug',
    'metaDescription',
    'intro',
    'quickAnswer',
    'whatVisitorsMaySee',
    'screenshotSection',
    'whatThisPatternIs',
    'likelyRootCause',
    'whyItKeepsComingBack',
    'filesAndDirectoriesToCheck',
    'removalStrategyIntro',
    'removalSteps',
    'hardeningSteps',
    'technicalAnalysis',
    'attackChain',
    'evidenceNotes',
    'faq',
    'proofStatement',
  ],
};

const REVIEW_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    publishReady: { type: 'boolean' },
    issues: { type: 'array', items: { type: 'string' } },
    fixes: { type: 'array', items: { type: 'string' } },
  },
  required: ['publishReady', 'issues', 'fixes'],
};

function buildEvidenceFiles(caseDir) {
  const files = fs.readdirSync(caseDir, { withFileTypes: true });
  let contextContent =
    'Representative malware samples and screenshots from a larger real-world cleanup case.';
  const publicImagePaths = [];
  const evidenceFiles = [];
  let imageCounter = 1;

  for (const entry of files) {
    if (!entry.isFile()) continue;

    const sourceName = entry.name;
    const displayName = normalizeEvidenceDisplayName(sourceName);
    const filePath = path.join(caseDir, sourceName);
    const ext = path.extname(sourceName).toLowerCase();

    if (sourceName.toLowerCase().includes('context') && ext === '.txt') {
      contextContent = fs.readFileSync(filePath, 'utf-8');
      continue;
    }

    if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
      publicImagePaths.push(
        copyEvidenceImage(filePath, path.basename(caseDir), imageCounter),
      );
      imageCounter += 1;
      continue;
    }

    const textRecord = readTextMaybe(filePath);
    const baseText = textRecord.isBinary
      ? textRecord.printablePreview
      : textRecord.text;
    const snippets = extractSnippets(displayName, baseText);

    evidenceFiles.push({
      sourceName,
      displayName,
      ext,
      language: guessLanguageFromName(displayName),
      sizeBytes: textRecord.buffer.length,
      sha256: textRecord.sha256,
      buffer: textRecord.buffer,
      isBinary: textRecord.isBinary,
      preview: baseText.slice(0, 12000),
      suspicionScore: scoreTextSuspicion(baseText),
      localIocs: extractIocsLocally(baseText),
      snippets,
    });
  }

  return { contextContent, publicImagePaths, evidenceFiles };
}

function buildEvidenceObject(
  caseId,
  contextContent,
  evidenceFiles,
  publicImagePaths,
  vtData,
) {
  const ranked = [...evidenceFiles]
    .sort(
      (a, b) =>
        b.suspicionScore - a.suspicionScore || b.sizeBytes - a.sizeBytes,
    )
    .slice(0, MAX_FILES_FOR_MODEL);

  const localTargets = deriveTargetsLocally(ranked);

  return {
    caseId,
    userContext: contextContent,
    sampleInterpretationRule:
      'Treat uploaded files as representative samples from a larger infected site unless the context explicitly says they are the full set.',
    screenshots: publicImagePaths,
    virusTotal: vtData,
    localTargets,
    files: ranked.map((file) => ({
      sourceName: file.sourceName,
      displayName: file.displayName,
      language: file.language,
      sizeBytes: file.sizeBytes,
      sha256: file.sha256,
      isBinary: file.isBinary,
      suspicionScore: file.suspicionScore,
      localIocs: file.localIocs,
      preview: file.preview,
      snippets: file.snippets,
    })),
  };
}

function pickPrimaryBuffer(evidenceFiles) {
  if (!evidenceFiles.length) return null;
  const ranked = [...evidenceFiles].sort(
    (a, b) => b.suspicionScore - a.suspicionScore || b.sizeBytes - a.sizeBytes,
  );
  return ranked[0]?.buffer || null;
}

function buildAnalysisInput(evidence) {
  const content = [
    {
      type: 'input_text',
      text: JSON.stringify(evidence, null, 2),
    },
  ];

  for (const imagePath of evidence.screenshots.slice(0, MAX_IMAGES_FOR_MODEL)) {
    const diskPath = path.join(
      process.cwd(),
      'public',
      imagePath.replace(/^\//, ''),
    );
    if (fs.existsSync(diskPath)) {
      content.push({
        type: 'input_image',
        image_url: encodeImage(diskPath),
        detail: 'high',
      });
    }
  }

  return [{ role: 'user', content }];
}

function buildDraftInput(evidence, analysis) {
  return [
    {
      role: 'user',
      content: [
        {
          type: 'input_text',
          text: JSON.stringify({ evidence, analysis }, null, 2),
        },
      ],
    },
  ];
}

function buildReviewInput(evidence, analysis, page) {
  return [
    {
      role: 'user',
      content: [
        {
          type: 'input_text',
          text: JSON.stringify({ evidence, analysis, page }, null, 2),
        },
      ],
    },
  ];
}

async function analyzeEvidence(evidence) {
  return callStructuredResponse({
    model: MODELS.ANALYST,
    schemaName: 'threat_pattern_analysis_v3',
    schema: ANALYSIS_SCHEMA,
    maxOutputTokens: ANALYST_OUTPUT_TOKENS,
    instructions: [
      'You are a senior WordPress malware analyst.',
      'Treat uploaded files as representative samples from a larger infected site unless the evidence clearly says otherwise.',
      'Infer original filenames from safe sample names like functions.php.txt when appropriate.',
      'If a representative file points to a fake plugin, fake theme component, persistence loader, or hidden backup directory, recommend removing the whole malicious component, not only the single sample file.',
      'Separate observed facts from supported inferences and from unknowns.',
      'Describe screenshots in plain searchable language because site owners search based on what they see, such as fake CAPTCHA, casino pop-up, spam overlay, or redirect prompt.',
      'Do not emit placeholder screenshot findings such as no additional screenshot content or screenshot unavailable.',
      'Keep codeHighlights public-safe: sanitize secrets, hardcoded passwords, and raw live attacker infrastructure. Defanged domains are allowed.',
      'The likelyEntryPoints field is kept for legacy UI. Use it for observed access or re-entry mechanisms, not the original intrusion vector unless it is directly proven by the evidence.',
      'If the initial intrusion vector is unknown or not proven, confidence.rootCause must be low or medium, never high.',
      'Do not invent the initial intrusion path if it is not shown.',
      'Focus on what the malware does, how it persists, what the visitor may see, and what to remove.',
    ].join(' '),
    input: buildAnalysisInput(evidence),
  });
}

async function draftThreatPage(evidence, analysis) {
  return callStructuredResponse({
    model: MODELS.WRITER,
    schemaName: 'threat_pattern_page_v3',
    schema: PAGE_SCHEMA,
    maxOutputTokens: WRITER_OUTPUT_TOKENS,
    instructions: [
      'Write an evidence-based WordPress threat pattern page.',
      'Do not write a blog post, personal story, or fluffy case study.',
      'Write for site owners who are searching because they are already seeing the same symptoms on their site.',
      'Use clear, direct language and allow the page to be long if the evidence justifies it.',
      'Prefer strong SEO structure: what this is, what visitors may see, what files or directories to check, how the malware persists, how to remove it, and FAQ.',
      'Keep wording honest: root cause may be unknown, but persistence and malicious behavior can still be stated strongly when backed by code.',
      'Title must sound natural, stay concise, and avoid listing every component. Use at most two or three strongest signals. Title must be SEO friendly what will be searched by site owners, we will try to make the title something like issue based instead of technical jargon.',
      'Avoid phrases like persistence network when a more natural phrase such as multi-part WordPress backdoor and persistence infection fits.',
      'Make sure screenshotSection clearly explains visible frontend symptoms from the uploaded screenshots.',
      'Do not include internal-only phrasing like Search phrasing in the public page body.',
      'Avoid repeating the same point across quickAnswer, intro, likelyRootCause, whyItKeepsComingBack, and technicalAnalysis.',
      'Use representative-sample wording where needed, such as representative infected functions.php sample, representative mu-plugin backdoor sample, or representative fake plugin files from a larger infection set.',
      'Do not expose raw hardcoded passwords, tokens, or nonessential secrets in public copy.',
      'Proof statement should be strong but honest, for example based on representative malware samples and screenshots collected during real WordPress cleanup work by MD Pabel.',
    ].join(' '),
    input: buildDraftInput(evidence, analysis),
  });
}

async function reviewThreatPage(evidence, analysis, page) {
  return callStructuredResponse({
    model: MODELS.REVIEWER,
    schemaName: 'threat_pattern_review_v3',
    schema: REVIEW_SCHEMA,
    maxOutputTokens: REVIEW_OUTPUT_TOKENS,
    instructions: [
      'Review the page like a practical incident-response editor, not like a legal compliance auditor.',
      'Allow publication when the page is grounded in representative malware samples, file paths, hooks, screenshots, or triggers, even if the original intrusion vector is unknown.',
      'Do not reject pages merely for saying the samples came from real cleanup work if the wording does not claim independent certification.',
      'Reject only when the draft invents facts, exposes sensitive secrets unnecessarily, or makes cause-and-effect claims that contradict the evidence.',
      'Flag titles that are too long or list-like, placeholder screenshot findings, internal-only Search phrasing notes, or rootCause high when the original intrusion vector is unknown.',
      'Prefer small edit suggestions over blocking when the draft is mostly sound.',
    ].join(' '),
    input: buildReviewInput(evidence, analysis, page),
  });
}

function renderMarkdown(
  page,
  analysis,
  evidence,
  vtData,
  finalSlug,
  calculatedHash,
) {
  const today = new Date().toISOString().split('T')[0];
  const safeIocs = uniqueStrings(
    (analysis.publicIocs || []).map((item) => defangIOC(item.value)),
  );

  const codeSection = (analysis.codeHighlights || [])
    .map((item) => {
      const lang = guessLanguageFromName(item.filename);
      return [
        `### FILE: \`${item.filename}\``,
        `**Why it matters:** ${item.explanation}`,
        '',
        `\`\`\`${lang}`,
        sanitizeCodeSnippet(item.code),
        '\`\`\`',
      ].join('\n');
    })
    .join('\n\n');

  const faqSection = (page.faq || [])
    .map((item) => `### ${item.question}\n${item.answer}`)
    .join('\n\n');

  const removalTargets = (analysis.removalTargets || [])
    .map(
      (target) =>
        `- **${target.targetType}:** \`${target.target}\` — ${target.reason}`,
    )
    .join('\n');

  const screenshotFindings = (analysis.screenshotFindings || [])
    .map((item) => `- **${item.observedTextOrUi}** — ${item.explanation}`)
    .join('\n');

  return `---
title: "${sanitizeYamlString(page.title)}"
slug: "${sanitizeYamlString(finalSlug)}"
description: "${sanitizeYamlString(page.metaDescription)}"
reportDate: "${today}"
reportType: "Threat Pattern"
threatType: "${sanitizeYamlString(analysis.threatType)}"
severity: "${sanitizeYamlString(analysis.severity)}"
sampleScope: "${sanitizeYamlString(analysis.sampleScope)}"
fileHash: "${sanitizeYamlString(calculatedHash)}"
detectedPaths: ${JSON.stringify((evidence.files || []).map((f) => f.displayName))}
screenshots: ${JSON.stringify(evidence.screenshots || [])}
vtLink: "${sanitizeYamlString(vtData?.permalink || 'https://www.virustotal.com/gui/home/upload')}"
vtScore: "${sanitizeYamlString(vtData?.found ? `${vtData.positives}/${vtData.total}` : 'Not found / unique sample')}"
affectedComponents: ${JSON.stringify(analysis.affectedComponents || [])}
entryPoints: ${JSON.stringify(analysis.likelyEntryPoints || [])}
persistencePoints: ${JSON.stringify(analysis.likelyPersistencePoints || [])}
---

## Quick Answer
${page.quickAnswer}

## What This Threat Pattern Is
${page.whatThisPatternIs}

## What Visitors May See
${(page.whatVisitorsMaySee || []).map((item) => `- ${item}`).join('\n')}

## Screenshot-Based Symptoms
${page.screenshotSection}

${screenshotFindings ? `### Screenshot Findings\n${screenshotFindings}\n` : ''}
## Why This Usually Means the Site Is Compromised
${page.intro}

## Likely Root Cause
${page.likelyRootCause}

## Why It Keeps Coming Back
${page.whyItKeepsComingBack}

## Files and Directories to Check
${(page.filesAndDirectoriesToCheck || []).map((item) => `- ${item}`).join('\n')}

${removalTargets ? `## Removal Targets Inferred From The Samples\n${removalTargets}\n` : ''}
## Technical Analysis
${page.technicalAnalysis}

## Attack Chain
${(page.attackChain || []).map((step, index) => `${index + 1}. ${step}`).join('\n')}

## Evidence Notes
${(page.evidenceNotes || []).map((item) => `- ${item}`).join('\n')}

## Representative Malware Samples
${codeSection || '_No publishable code examples selected._'}

## Indicators of Compromise (Public-Safe)
${safeIocs.length ? safeIocs.map((ioc) => `- \`${ioc}\``).join('\n') : '- No public-safe IOC list extracted from the available samples.'}

## Removal Strategy
${page.removalStrategyIntro}

## Manual Removal Protocol
${(page.removalSteps || []).map((step, index) => `${index + 1}. ${step}`).join('\n')}

## Hardening Checklist
${(page.hardeningSteps || []).map((step) => `- ${step}`).join('\n')}

## FAQ
${faqSection || '### Is the original entry point confirmed?\nNot necessarily. Representative malware samples can still prove persistence and malicious behavior even when the first write vector is unknown.'}

> **Proof statement:** ${page.proofStatement}
>
> **Confidence:** Root cause ${analysis.confidence.rootCause}, persistence ${analysis.confidence.persistence}, screenshot read ${analysis.confidence.screenshotRead}, IOCs ${analysis.confidence.iocs}.
`;
}

async function processCase(caseId) {
  console.log(`\nProcessing case: ${caseId}`);
  const caseDir = path.join(DUMP_DIR, caseId);
  const { contextContent, publicImagePaths, evidenceFiles } =
    buildEvidenceFiles(caseDir);

  if (!evidenceFiles.length && !publicImagePaths.length) {
    console.log('  Skipped: no evidence files or screenshots found.');
    return;
  }

  const primaryBuffer = pickPrimaryBuffer(evidenceFiles);
  const calculatedHash = primaryBuffer ? sha256(primaryBuffer) : 'N/A';
  let vtData = await checkVirusTotal(primaryBuffer);
  if (VT_API_KEY) await delay(15000);

  const evidence = buildEvidenceObject(
    caseId,
    contextContent,
    evidenceFiles,
    publicImagePaths,
    vtData,
  );
  const analysis = normalizeAnalysis(await analyzeEvidence(evidence));
  const page = normalizePage(await draftThreatPage(evidence, analysis));
  const review = await reviewThreatPage(evidence, analysis, page);

  const finalSlug = getUniqueSlug(page.slug || analysis.slugBase || caseId);
  const markdown = renderMarkdown(
    page,
    analysis,
    evidence,
    vtData,
    finalSlug,
    calculatedHash,
  );

  const writePlan = resolveWritePlan(finalSlug, review);

  fs.writeFileSync(writePlan.publishMarkdownPath, markdown);
  fs.writeFileSync(writePlan.reviewJsonPath, JSON.stringify(review, null, 2));

  if (writePlan.mirrorFlaggedMarkdownPath) {
    fs.writeFileSync(writePlan.mirrorFlaggedMarkdownPath, markdown);
    const mirrorReviewPath = path.join(REVIEW_DIR, `${finalSlug}.review.json`);
    fs.writeFileSync(mirrorReviewPath, JSON.stringify(review, null, 2));
  }

  console.log(
    `  ${writePlan.publishedToContent ? 'Published' : 'Sent to review'}: ${writePlan.publishMarkdownPath}`,
  );

  if (!review.publishReady && writePlan.publishedToContent) {
    console.log(
      `  Published with review notes: ${review.issues.length} issue(s) saved.`,
    );
  }

  const trashDest = path.join(TRASH_DIR, caseId);
  if (fs.existsSync(trashDest))
    fs.rmSync(trashDest, { recursive: true, force: true });
  fs.renameSync(caseDir, trashDest);
  console.log(`  Moved source folder to: ${trashDest}`);
}

async function main() {
  const cases = fs
    .readdirSync(DUMP_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  if (!cases.length) {
    console.log('No new cases found in _malware_dump.');
    return;
  }

  console.log('Threat pattern pipeline v3 publish started...');
  console.log(
    `Models -> analyst: ${MODELS.ANALYST}, writer: ${MODELS.WRITER}, reviewer: ${MODELS.REVIEWER}`,
  );
  console.log(`Publish mode -> ${PUBLISH_MODE}`);

  for (const caseId of cases) {
    try {
      await processCase(caseId);
    } catch (error) {
      console.error(`Failed to process ${caseId}:`, error);
    }
  }

  console.log('\nAll jobs completed.');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

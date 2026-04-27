// src/lib/llms.ts

import { wordpress } from './wordpress';

export const SITE_URL = 'https://www.mdpabel.com';

export type LlmPostType = 'posts' | 'case-study' | 'guide' | 'malware-log';

export type LlmPost = {
  id?: number;
  slug: string;
  link?: string;
  date?: string;
  modified?: string;
  title?: string | { rendered?: string };
  excerpt?: string | { rendered?: string };
  content?: string | { rendered?: string };
};

export const LLMS_LIMITS = {
  llmsTxt: {
    posts: 24,
    caseStudies: 20,
    guides: 16,
    malwareLogs: 8,
  },
  llmsFull: {
    posts: 80,
    caseStudies: 40,
    guides: 30,
    malwareLogs: 10,
  },
};

export const corePages = [
  {
    title: 'Home',
    url: '/',
    description:
      'Main profile and service overview for MD Pabel, a freelance WordPress security and malware removal expert with 4,500+ hacked WordPress sites cleaned.',
  },
  {
    title: 'About MD Pabel',
    url: '/about/',
    description:
      'Background, credibility, Fiverr and Upwork experience, technical stack, education, and WordPress malware removal expertise.',
  },
  {
    title: 'WordPress Malware Removal Service',
    url: '/wordpress-malware-removal/',
    description:
      'Manual hacked WordPress cleanup, malicious redirect removal, Japanese SEO spam cleanup, blacklist recovery, backdoor removal, and post-cleanup hardening.',
  },
  {
    title: 'Google Blacklist Removal Service',
    url: '/google-blacklist-removal-service/',
    description:
      'Help for Google Safe Browsing warnings, deceptive site warnings, hacked search results, and post-cleanup review requests.',
  },
  {
    title: 'Blacklist Removal',
    url: '/blacklist-removal/',
    description:
      'Website blacklist cleanup and reputation recovery for Google, McAfee, Norton, Avast, Quttera, and other security vendors.',
  },
  {
    title: 'McAfee Blacklist Removal',
    url: '/mcafee-blacklist-removal/',
    description:
      'McAfee blocklist diagnosis, malware cleanup, reputation review preparation, and site recovery guidance.',
  },
  {
    title: 'WordPress Critical Error Fix Service',
    url: '/wordpress-critical-error-fix-service/',
    description:
      'Fixing WordPress fatal errors, white screen issues, broken plugins, theme crashes, PHP errors, and hacked-site breakage.',
  },
  {
    title: 'Hire Me',
    url: '/hire-me/',
    description:
      'Contact and hiring page for emergency WordPress malware removal, blacklist recovery, and technical troubleshooting.',
  },
  {
    title: 'Blog',
    url: '/blog/',
    description:
      'WordPress security articles, malware removal tutorials, blacklist recovery guides, and technical troubleshooting posts.',
  },
  {
    title: 'Case Studies',
    url: '/case-studies/',
    description:
      'Real-world forensic cleanup stories, malware removal investigations, hacked-site recovery examples, and SEO spam cleanup results.',
  },
  {
    title: 'Security Guides',
    url: '/guides/',
    description:
      'Step-by-step WordPress security, hardening, malware prevention, hosting, DNS, and technical guides.',
  },
];

export const PINNED_LLM_SLUGS: Record<LlmPostType, string[]> = {
  posts: [
    'wordpress-malware-removal-how-to-manually-clean-your-hacked-site',
    'how-to-detect-wordpress-malware',
    'how-to-scan-and-clean-your-wordpress-database-for-hidden-malware',
    'how-to-fix-japanese-keyword-hack-in-wordpress-the-hard-way',
    'wordpress-pharma-hack-fix-how-to-stop-pharmaceutical-spam-in-google',
    'why-wordpress-malware-keeps-coming-back-and-how-to-stop-it-forever',
    'wp-compat-plugin-the-hidden-backdoor-in-your-wordpress-site',
    'top-5-malware-types-i-keep-finding-on-hacked-wordpress-sites',
    'how-hackers-create-hidden-admin-users-in-wordpress',
    'how-to-find-and-remove-hidden-admin-users-in-wordpress-malware-analysis',
    'quttera-blacklist-removal-case-study',
    'the-complete-guide-to-javascript-redirect-malware-detection-decoding-and-removal',
  ],

  'case-study': [
    'wordpress-site-blank-page-malware',
    'how-i-removed-50000-spam-urls-from-google-after-a-japanese-keyword-hack',
    'case-study-how-i-removed-10500-seo-spam-urls-from-google-search-in-12-days',
    'failed-google-blacklist-request-how-to-find-hidden-database-malware',
    'wordpress-hacked-fake-cloudflare-verify-you-are-human-a-wordpress-malware-removal-case-study',
    'fake-captcha-malware-removal-case-study-cleaning-malware-from-wordpress',
    'wordpress-cloaking-malware-removal-case-study',
    'how-i-found-a-credit-card-stealer-that-no-security-tool-could-detect',
    'successfully-removing-328-websites-from-mcafee-blacklist-a-technical-deep-dive',
    'how-i-stopped-wp-blog-header-php-regenerate-malware-in-wordpress',
    'wp-blog-header-php-regenerate-malware-case-study',
    'wordpress-drive-by-malware-cleanup-case-study',
    'how-we-cleaned-a-hacked-wordpress-site-from-3-45m-matbet-seo-spam-and-how-you-can-prevent-it',
    'how-i-found-and-fixed-a-wordpress-mobile-redirect-hack-using-access-logs',
  ],

  guide: [
    'wordpress-security-tips-keep-your-site-safe-in-2025',
    'common-wordpress-vulnerabilities-a-complete-security-guide',
    '404-vs-410-why-google-wont-forget-your-deleted-pages',
    'avast-blacklist-removal-how-to-remove-your-url-from-avasts-block-list-step-by-step',
    'the-hidden-cost-of-free-why-wordpress-nulled-themes-are-a-security-nightmare-2025-guide',
    'why-your-website-loses-sales-even-with-perfect-seo-the-blacklist-problem',
    'application-passwords-have-been-disabled-by-wordfence',
    'why-cheap-hosting-makes-your-wordpress-site-vulnerable-to-hackers',
  ],

  'malware-log': [
    'hidden-wordpress-admin-backdoor-malware-in-depth-technical-review',
    'fake-cloudflare-captcha-malware-in-wordpress-environments',
    'analyticacnodec-com-and-analytwave-com-redirect-malware',
    'mobile-click-jacking-trojan-trojanjs-redirector-cuttlycoasia-analysis-report',
    'unmasking-trojan-php-webshell-obfuscated-backdoor-wordpress-fakeplugin-injector-exploit-kit-cloudflaremimic-powershell-and-webshell-priv8uploader-persistence-in-website-attacks',
  ],
};

export const EXCLUDED_LLM_SLUGS = new Set([
  'adding-borders-to-clipped-shapes-in-css',
  'anime-website-free-themes-wordpress-theme-the-ultimate-guide-to-creating-your-anime-site',
  'bigcommerce-vs-wordpress-which-one-should-you-build-on',
  'ceros-pages-vs-wordpress-a-practical-no-fluff-comparison',
  'the-difference-between-a-hyphen-and-an-en-dash-in-urls-and-how-to-replace-them',
  'how-to-create-a-responsive-html-table-in-wordpress-3-easy-methods',
  'how-to-install-a-wordpress-theme-3-methods',
  'fix-mailgun-authentication-failed-error-how-to-find-and-whitelist-the-right-outbound-ip',
  'cloudflare-vs-namecheap-2025-registrar-dns-cdn-whats-best-for-your-site',
  'headless-cms-vs-wordpress-which-is-right-for-your-stack',
  'headless-cms-vs-wordpress-when-headless-wordpress-wins-and-when-it-doesnt',
  'boost-speed-seo-security-with-headless-wordpress-and-next-js',
  'implementing-post-view-counters-in-a-headless-wordpress-setup-with-next-js',
  'a-complete-guide-to-next-js-server-actions-and-wordpress-contact-form-7-integration-for-building-modern-headless-forms',
  'secure-file-downloads-with-cloudflare-r2-and-next-js-complete-setup-guide',

  // Exclude from llms-full.txt because these are general, commercial,
  // comparison-based, or more likely to become outdated.
  'siteground-review-why-its-my-1-hosting-recommendation-after-4500-site-cleanups',
  'best-managed-wordpress-hosting-providers-for-speed-security-2',
  'why-choose-my-wordpress-malware-removal-service-over-major-competitors',
  'wordfence-vs-sucuri-which-is-better',
  'really-simple-security-review-secure-your-wordpress-site-with-ssl-hardening-2025-guide',
]);

const includeTerms = [
  'malware',
  'hacked',
  'hack',
  'blacklist',
  'blocklist',
  'google safe browsing',
  'deceptive site',
  'japanese keyword',
  'japanese seo',
  'seo spam',
  'pharma hack',
  'pharmaceutical spam',
  'casino spam',
  'gambling spam',
  'redirect malware',
  'redirect hack',
  'malicious redirect',
  'backdoor',
  'webshell',
  'web shell',
  'fake plugin',
  'hidden plugin',
  'hidden admin',
  'ghost admin',
  'database malware',
  'cloaking',
  'htaccess',
  '.htaccess',
  'skimmer',
  'card stealer',
  'fake captcha',
  'cloudflare verify',
  'quttera',
  'mcafee',
  'norton',
  'avast',
  'wordfence',
  'reinfection',
  'cron malware',
  'cron job malware',
  'vulnerability',
  'vulnerabilities',
  'nulled',
  'security warning',
  'wordpress security',
  'hardening',
  'wp-config',
  'wp-content',
  'infected files',
  'drive-by malware',
];

const excludeTerms = [
  'css',
  'html table',
  'anime',
  'bigcommerce',
  'ceros',
  'mailgun',
  'theme install',
  'responsive html table',
  'hyphen',
  'en dash',
  'headless cms',
  'headless wordpress',
  'next.js',
  'astro',
  'cloudflare vs namecheap',
  'speed optimization',
];

const conditionalTerms = [
  'hosting',
  'cloudflare',
  'dns',
  'backup',
  'performance',
  'server',
  'speed',
  'images',
  'uploads',
];

const conditionalSecurityTerms = [
  'security',
  'malware',
  'hacked',
  'hack',
  'blacklist',
  'recovery',
  'deleted',
  'suspended',
  'redirect',
  'cleanup',
  'vulnerable',
  'vulnerability',
  'backdoor',
  'infected',
];

const primaryTerms = [
  'wordpress malware removal',
  'hacked wordpress',
  'hacked site',
  'malware removal',
  'manual cleanup',
  'blacklist removal',
  'google blacklist',
  'mcafee blacklist',
  'quttera blacklist',
  'avast blacklist',
  'japanese keyword hack',
  'japanese seo spam',
  'seo spam',
  'redirect malware',
  'database malware',
  'fake plugin',
  'hidden plugin',
  'backdoor',
  'webshell',
  'hidden admin',
  'ghost admin',
  'pharma hack',
  'cloaking',
  'infected files',
  'reinfection',
  'wordpress hardening',
];

const proofTerms = [
  'case study',
  'how i',
  'how we',
  'removed',
  'cleaned',
  'fixed',
  'restored',
  'recovered',
  'blacklist removed',
  'search console',
  'google',
  'mcafee',
  'quttera',
  'avast',
  '12 hours',
  '12 days',
  '50,000',
  '10,500',
  '242,000',
  '328 websites',
  '1,589',
  '3.45 million',
  '4,500',
];

const weakPositioningTerms = [
  'css',
  'html table',
  'anime',
  'bigcommerce',
  'ceros',
  'mailgun',
  'theme install',
  'responsive table',
  'headless cms',
  'cloudflare vs namecheap',
];

export function absoluteUrl(path: string) {
  if (path.startsWith('http')) return path;
  return new URL(path, SITE_URL).toString();
}

export function getPostPath(postType: LlmPostType, slug: string) {
  const cleanSlug = slug.replace(/^\/|\/$/g, '');

  if (postType === 'posts') return `/blog/${cleanSlug}/`;
  if (postType === 'case-study') return `/case-studies/${cleanSlug}/`;
  if (postType === 'guide') return `/guides/${cleanSlug}/`;
  if (postType === 'malware-log') return `/malware-log/${cleanSlug}/`;

  return `/${cleanSlug}/`;
}

export function getRendered(value: unknown): string {
  if (!value) return '';

  if (typeof value === 'string') return value;

  if (
    typeof value === 'object' &&
    value !== null &&
    'rendered' in value &&
    typeof (value as { rendered?: unknown }).rendered === 'string'
  ) {
    return (value as { rendered: string }).rendered;
  }

  return '';
}

export function decodeHtml(input: string) {
  return input
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '-')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

export function stripHtml(input: string) {
  return decodeHtml(
    input
      .replace(/:contentReference\[[^\]]+\]\{[^}]+\}/g, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

export function htmlToSafeMarkdown(input: string) {
  let html = input || '';

  html = html
    .replace(/:contentReference\[[^\]]+\]\{[^}]+\}/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(
      /<pre[\s\S]*?<\/pre>/gi,
      '\n\n[Code block omitted for safety and brevity.]\n\n',
    );

  // Keep inline code text. Inline terms like wp-config.php, .htaccess,
  // wp_options, eval, base64_decode, etc. are useful for AI context.
  html = html.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '$1');

  html = html
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n\n')
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n\n#### $1\n\n')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');

  return decodeHtml(html)
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+|\s+$/g, '');
}

export function getPostTitle(post: LlmPost) {
  return stripHtml(getRendered(post.title)) || post.slug;
}

export function getPostDescription(post: LlmPost, maxLength = 180) {
  const excerpt = stripHtml(getRendered(post.excerpt));
  const contentFallback = stripHtml(getRendered(post.content));

  const text = excerpt || contentFallback;

  if (!text) return '';

  if (text.length <= maxLength) return text;

  const trimmed = text.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(' ');

  return `${trimmed.slice(0, lastSpace > 80 ? lastSpace : maxLength).trim()}...`;
}

export function getLastModified(post: LlmPost) {
  return post.modified || post.date || '';
}

function normalizeForScore(input: string) {
  return input
    .toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/[^a-z0-9+.,\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getPostSearchText(post: LlmPost) {
  return normalizeForScore(
    `${post.slug} ${getPostTitle(post)} ${getPostDescription(post)}`,
  );
}

export function shouldIncludeInLlms(post: LlmPost, postType?: LlmPostType) {
  if (!post?.slug || EXCLUDED_LLM_SLUGS.has(post.slug)) {
    return false;
  }

  const text = getPostSearchText(post);

  const hasIncludeTerm = includeTerms.some((term) => text.includes(term));
  const hasExcludeTerm = excludeTerms.some((term) => text.includes(term));
  const hasConditionalTerm = conditionalTerms.some((term) =>
    text.includes(term),
  );
  const hasConditionalSecurityTerm = conditionalSecurityTerms.some((term) =>
    text.includes(term),
  );

  if (hasIncludeTerm && !hasExcludeTerm) return true;

  if (hasIncludeTerm && hasExcludeTerm) {
    return (
      text.includes('malware') ||
      text.includes('hacked') ||
      text.includes('blacklist') ||
      text.includes('backdoor') ||
      text.includes('vulnerability') ||
      text.includes('security warning')
    );
  }

  if (hasExcludeTerm) return false;

  if (hasConditionalTerm) {
    return hasConditionalSecurityTerm;
  }

  if (postType === 'case-study') {
    return (
      text.includes('removed') ||
      text.includes('cleaned') ||
      text.includes('fixed') ||
      text.includes('restored') ||
      text.includes('recovered')
    );
  }

  return false;
}

export function scorePostByImportance(post: LlmPost, postType: LlmPostType) {
  const slug = post.slug || '';

  if (!slug || EXCLUDED_LLM_SLUGS.has(slug)) {
    return -9999;
  }

  if (!shouldIncludeInLlms(post, postType)) {
    return -999;
  }

  const title = getPostTitle(post);
  const description = getPostDescription(post);
  const text = normalizeForScore(`${slug} ${title} ${description}`);

  let score = 0;

  if (postType === 'case-study') score += 18;
  if (postType === 'posts') score += 14;
  if (postType === 'guide') score += 8;
  if (postType === 'malware-log') score += 6;

  for (const term of primaryTerms) {
    if (text.includes(term)) score += 10;
  }

  for (const term of proofTerms) {
    if (text.includes(term)) score += 5;
  }

  for (const term of weakPositioningTerms) {
    if (text.includes(term)) score -= 12;
  }

  if (slug.includes('wordpress-malware-removal')) score += 20;
  if (slug.includes('japanese-keyword-hack')) score += 18;
  if (slug.includes('blacklist')) score += 16;
  if (slug.includes('redirect')) score += 14;
  if (slug.includes('database-malware')) score += 14;
  if (slug.includes('hidden-admin')) score += 14;
  if (slug.includes('fake-plugin')) score += 14;
  if (slug.includes('backdoor')) score += 14;
  if (slug.includes('wp-blog-header')) score += 12;
  if (slug.includes('wp-compat')) score += 12;
  if (slug.includes('htaccess')) score += 12;

  const modified = getLastModified(post);
  const timestamp = modified ? new Date(modified).getTime() : 0;

  if (timestamp) {
    const daysOld = Math.max(
      0,
      (Date.now() - timestamp) / (1000 * 60 * 60 * 24),
    );

    if (daysOld <= 30) score += 12;
    else if (daysOld <= 90) score += 8;
    else if (daysOld <= 180) score += 4;
    else if (daysOld >= 365) score -= 4;
  }

  return score;
}

function titleKey(post: LlmPost) {
  return getPostTitle(post)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function selectImportantPosts(
  posts: LlmPost[],
  postType: LlmPostType,
  limit: number,
) {
  const validPosts = posts.filter((post) => {
    return post?.slug && !EXCLUDED_LLM_SLUGS.has(post.slug);
  });

  const bySlug = new Map(validPosts.map((post) => [post.slug, post]));

  const pinned = PINNED_LLM_SLUGS[postType]
    .map((slug) => bySlug.get(slug))
    .filter(Boolean) as LlmPost[];

  const pinnedSlugs = new Set(pinned.map((post) => post.slug));
  const seenTitles = new Set<string>();

  const cleanUnique = (items: LlmPost[]) => {
    return items.filter((post) => {
      const key = titleKey(post);

      if (!key) return false;
      if (seenTitles.has(key)) return false;

      seenTitles.add(key);
      return true;
    });
  };

  const scored = validPosts
    .filter((post) => !pinnedSlugs.has(post.slug))
    .filter((post) => shouldIncludeInLlms(post, postType))
    .map((post) => ({
      post,
      score: scorePostByImportance(post, postType),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;

      return (
        new Date(getLastModified(b.post) || 0).getTime() -
        new Date(getLastModified(a.post) || 0).getTime()
      );
    })
    .map((item) => item.post);

  return cleanUnique([...pinned, ...scored]).slice(0, limit);
}

export async function getLlmContent() {
  const [posts, caseStudies, guides, malwareLogs] = await Promise.all([
    wordpress.getAllPosts({ postType: 'posts' }).catch(() => []),
    wordpress.getAllPosts({ postType: 'case-study' }).catch(() => []),
    wordpress.getAllPosts({ postType: 'guide' }).catch(() => []),
    wordpress.getAllPosts({ postType: 'malware-log' }).catch(() => []),
  ]);

  return {
    posts: posts as LlmPost[],
    caseStudies: caseStudies as LlmPost[],
    guides: guides as LlmPost[],
    malwareLogs: malwareLogs as LlmPost[],
  };
}

export function postLinkLine(post: LlmPost, postType: LlmPostType) {
  const title = getPostTitle(post);
  const description = getPostDescription(post, 180);
  const url = absoluteUrl(getPostPath(postType, post.slug));

  return `- [${title}](${url})${description ? `: ${description}` : ''}`;
}

export function hasUsefulFullText(post: LlmPost, minLength = 400) {
  const content = htmlToSafeMarkdown(getRendered(post.content));

  if (!content) return false;

  const cleanContent = content.replace(/\s+/g, ' ').trim();

  if (!cleanContent) return false;

  if (
    cleanContent.includes('[No full text available in local WordPress cache.]')
  ) {
    return false;
  }

  return cleanContent.length >= minLength;
}

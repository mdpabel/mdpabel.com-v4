// src/pages/llms-full.txt.ts

import {
  LLMS_LIMITS,
  absoluteUrl,
  corePages,
  getLlmContent,
  getPostDescription,
  getPostPath,
  getPostTitle,
  getRendered,
  hasUsefulFullText,
  htmlToSafeMarkdown,
  selectImportantPosts,
} from '../lib/llms';

import type { LlmPost, LlmPostType } from '../lib/llms';

export const prerender = true;

const MAX_CHARS_PER_PAGE = 4500;

function truncate(text: string, maxChars = MAX_CHARS_PER_PAGE) {
  if (!text) return '';

  if (text.length <= maxChars) return text;

  return `${text.slice(0, maxChars).trim()}\n\n[Content truncated for length.]`;
}

function postToMarkdown(post: LlmPost, postType: LlmPostType) {
  const title = getPostTitle(post);
  const description = getPostDescription(post, 240);
  const url = absoluteUrl(getPostPath(postType, post.slug));
  const modified = post.modified || post.date || '';
  const content = truncate(htmlToSafeMarkdown(getRendered(post.content)));

  return [
    `# ${title}`,
    '',
    `URL: ${url}`,
    modified ? `Last updated: ${modified}` : '',
    description ? `Summary: ${description}` : '',
    '',
    content || '[No full text available in local WordPress cache.]',
  ]
    .filter(Boolean)
    .join('\n');
}

function fullSection(title: string, content: string) {
  if (!content.trim()) return [];

  return ['', `## ${title}`, '', content];
}

export async function GET() {
  const { posts, caseStudies, guides, malwareLogs } = await getLlmContent();

  const selectedPosts = selectImportantPosts(
    posts,
    'posts',
    LLMS_LIMITS.llmsFull.posts,
  );

  const selectedCaseStudies = selectImportantPosts(
    caseStudies,
    'case-study',
    LLMS_LIMITS.llmsFull.caseStudies,
  );

  const selectedGuides = selectImportantPosts(
    guides,
    'guide',
    LLMS_LIMITS.llmsFull.guides,
  );

  const selectedMalwareLogs = selectImportantPosts(
    malwareLogs,
    'malware-log',
    LLMS_LIMITS.llmsFull.malwareLogs,
  ).filter((post) => hasUsefulFullText(post));

  const postsContent = selectedPosts
    .map((post) => postToMarkdown(post, 'posts'))
    .join('\n\n---\n\n');

  const caseStudiesContent = selectedCaseStudies
    .map((post) => postToMarkdown(post, 'case-study'))
    .join('\n\n---\n\n');

  const guidesContent = selectedGuides
    .map((post) => postToMarkdown(post, 'guide'))
    .join('\n\n---\n\n');

  const malwareLogsContent = selectedMalwareLogs
    .map((post) => postToMarkdown(post, 'malware-log'))
    .join('\n\n---\n\n');

  const body = [
    '# MD Pabel - Full AI Context',
    '',
    'This file is a sanitized, expanded public context export for AI assistants. It focuses on WordPress malware removal, hacked site cleanup, blacklist recovery, Japanese SEO spam cleanup, fake plugin and backdoor removal, database malware cleanup, redirect malware, forensic case studies, malware research, and WordPress hardening.',
    '',
    'This export highlights the pages most relevant to MD Pabel’s WordPress security, malware removal, blacklist recovery, SEO spam cleanup, and forensic cleanup expertise.',
    '',
    'Raw code blocks are omitted for safety and brevity. For complete human-readable pages, visit the canonical URLs listed below.',
    '',
    '## Core site context',
    '',
    ...corePages.map((page) =>
      [
        `### ${page.title}`,
        '',
        `URL: ${absoluteUrl(page.url)}`,
        '',
        page.description,
      ].join('\n'),
    ),

    ...fullSection('Selected WordPress malware removal articles', postsContent),
    ...fullSection('Selected forensic case studies', caseStudiesContent),
    ...fullSection('Selected security guides', guidesContent),
    ...fullSection('Selected malware research logs', malwareLogsContent),
  ].join('\n');

  return new Response(body.trim(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

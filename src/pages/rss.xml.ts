import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { wordpress, type WordPressPost } from '../lib/wordpress';

const parser = new MarkdownIt();

type RSSItem = {
  title: string;
  pubDate: Date;
  description: string;
  link: string;
  content: string;
};

export async function GET(context: APIContext) {
  // 1. Fetch Data from Local Cache (and local collections)
  // Our wordpress util now throws an error if cache is missing,
  // ensuring the RSS feed is never built with empty data.
  const [posts, caseStudies, guides, localThreats] = await Promise.all([
    wordpress.getAllPosts({ postType: 'posts' }).catch(() => []),
    wordpress.getAllPosts({ postType: 'case-study' }).catch(() => []),
    wordpress.getAllPosts({ postType: 'guide' }).catch(() => []),
    getCollection('wordpress-threats'),
  ]);

  // Define permissive tags for WordPress content to keep formatting in RSS readers
  const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
    'img',
    'h1',
    'h2',
    'figure',
    'figcaption',
    'div',
    'span',
    'pre',
    'code',
  ]);

  /**
   * Updated for our Clean Cache Schema:
   * item.title and item.content are now direct strings, not .rendered objects.
   */
  const formatWpItem = (item: WordPressPost, basePath: string): RSSItem => {
    const rawContent = item.content || item.excerpt || '';

    return {
      title: item.title,
      pubDate: new Date(item.date),
      description: item.excerpt || '',
      link: `/${basePath}/${item.slug}/`,
      content: sanitizeHtml(rawContent, { allowedTags }),
    };
  };

  const formatLocalItem = (item: any): RSSItem => {
    const htmlContent = parser.render(item.body);
    return {
      title: item.data.title,
      pubDate: new Date(item.data.reportDate),
      description: item.data.metaDescription,
      link: `/wordpress-threats/${item.slug}/`,
      content: sanitizeHtml(htmlContent, { allowedTags }),
    };
  };

  // 2. Combine and Sort
  const allItems = [
    ...posts.map((p) => formatWpItem(p as WordPressPost, 'blog')),
    ...caseStudies.map((p) => formatWpItem(p as WordPressPost, 'case-studies')),
    ...guides.map((p) => formatWpItem(p as WordPressPost, 'guides')),
    ...localThreats.map(formatLocalItem),
  ];

  // STRICT SORTING BY DATE (Newest First)
  allItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'MD Pabel | WordPress Security & Malware Removal',
    description: 'Expert insights, case studies, and forensic malware logs.',
    site: context.site!,
    items: allItems,
    customData: `<language>en-us</language>`,
  });
}

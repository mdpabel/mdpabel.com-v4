import pLimit from 'p-limit';
import { LRUCache } from 'lru-cache';
import type { CommentsQueryOptions, CommentsResponse } from '../../types/wp';

// --- Interfaces ---

export interface WordPressComment {
  id: number;
  postId: number;
  parent: number;
  authorId: number;
  authorName: string;
  authorUrl: string;
  authorAvatar: string;
  date: string;
  status: string;
  content: string;
  link: string;
}

export interface YoastSEO {
  title: string;
  description: string;
  og_image?: { url: string }[];
  schema?: any;
}

export interface WordPressImage {
  id: number;
  url: string;
  alt: string;
  caption: string;
  title: string;
  sizes: {
    thumbnail?: string;
    medium?: string;
    large?: string;
    full: string;
  };
  width: number;
  height: number;
}

export interface WordPressAuthor {
  id: number;
  name: string;
  slug: string;
  avatar: string;
  description: string;
  url: string;
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WordPressPost<TACF = any> {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  date: string;
  modified: string;
  status: string;
  link: string;
  featuredImage?: WordPressImage;
  author: WordPressAuthor;
  categories: WordPressCategory[];
  tags: WordPressTag[];
  commentStatus: string;
  format: string;
  sticky: boolean;
  acf: TACF;
  yoastSEO: YoastSEO;
  yoastHead: string;
}

export interface PostsQueryOptions {
  postType?: string;
  page?: number;
  perPage?: number;
  search?: string;
  author?: number;
  categories?: string[];
  tags?: string[];
  orderBy?: 'date' | 'title' | 'slug' | 'modified' | 'menu_order';
  order?: 'asc' | 'desc';
  status?: 'publish' | 'draft' | 'private';
  sticky?: boolean;
  excludeSticky?: boolean;
  exclude?: number[];
  _fields?: string[];
}

export interface PostsResponse<TACF = any> {
  posts: WordPressPost<TACF>[];
  total: number;
  totalPages: number;
  hasMore: boolean;
}

// --- Main API Class ---

class WordPressAPI {
  private baseUrl: string;

  // ✅ 1. CACHING: Uses LRUCache to prevent memory leaks
  // Holds up to 100 requests for 5 minutes
  private cache = new LRUCache<string, Promise<WordPressPost<any>[]>>({
    max: 100,
    ttl: 1000 * 60 * 5,
  });

  // ✅ 2. CONCURRENCY: Uses p-limit to prevent ECONNRESET
  // Limits to 3 concurrent network requests
  private limit = pLimit(3);

  constructor() {
    this.baseUrl = import.meta.env.PUBLIC_WORDPRESS_API_URL;
    if (!this.baseUrl) {
      console.warn('PUBLIC_WORDPRESS_API_URL is not defined in .env');
    }
  }

  // ✅ AUTH HEADER: Includes User-Agent to satisfy firewalls
  private authHeader(): Record<string, string> {
    const user = import.meta.env.WP_APP_USER;
    const pass = import.meta.env.WP_APP_PASSWORD;
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (compatible; Astro-Bot/1.0)',
    };
    if (user && pass) {
      const basic = Buffer.from(`${user}:${pass}`).toString('base64');
      headers['Authorization'] = `Basic ${basic}`;
    }
    return headers;
  }

  // ✅ FETCH WRAPPER: Handles Retry, Auth, and Concurrency
  private async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retries = 3,
    delay = 1000,
  ): Promise<Response> {
    try {
      // Wrap fetch in this.limit() to queue requests
      const response = await this.limit(() =>
        fetch(url, {
          ...options,
          headers: { ...this.authHeader(), ...options.headers },
        }),
      );

      // Retry on Server Errors (500) or Rate Limits (429)
      if (!response.ok && (response.status === 429 || response.status >= 500)) {
        throw new Error(`Server status: ${response.status}`);
      }
      return response;
    } catch (error: any) {
      if (retries > 0) {
        console.warn(`⚠️ Fetch error (${error.message}). Retrying... ${url}`);
        await new Promise((res) => setTimeout(res, delay));
        return this.fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  // --- Processors (Data Cleaning) ---

  private processImage(media: any): WordPressImage | undefined {
    if (!media || !media.source_url) return undefined;
    return {
      id: media.id,
      url: media.source_url,
      alt: media.alt_text || '',
      caption: media.caption?.rendered || '',
      title: media.title?.rendered || '',
      sizes: {
        thumbnail: media.media_details?.sizes?.thumbnail?.source_url,
        medium: media.media_details?.sizes?.medium?.source_url,
        large: media.media_details?.sizes?.large?.source_url,
        full: media.source_url,
      },
      width: media.media_details?.width || 0,
      height: media.media_details?.height || 0,
    };
  }

  private processAuthor(author: any): WordPressAuthor {
    if (!author)
      return {
        id: 0,
        name: '',
        slug: '',
        avatar: '',
        description: '',
        url: '',
      };
    return {
      id: author.id,
      name: author.name || '',
      slug: author.slug || '',
      avatar: author.avatar_urls?.['96'] || '',
      description: author.description || '',
      url: author.url || '',
    };
  }

  private processCategory(cat: any): WordPressCategory {
    return {
      id: cat.id,
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      count: cat.count || 0,
    };
  }

  private processTag(tag: any): WordPressTag {
    return {
      id: tag.id,
      name: tag.name || '',
      slug: tag.slug || '',
      description: tag.description || '',
      count: tag.count || 0,
    };
  }

  private processPost<TACF = any>(post: any): WordPressPost<TACF> {
    return {
      id: post.id,
      title: post.title?.rendered || '',
      content: post.content?.rendered || '',
      excerpt: post.excerpt?.rendered || '',
      slug: post.slug || '',
      date: post.date || '',
      modified: post.modified || '',
      status: post.status || 'publish',
      link: post.link || '',
      featuredImage: this.processImage(
        post._embedded?.['wp:featuredmedia']?.[0],
      ),
      author: this.processAuthor(post._embedded?.['author']?.[0]),
      categories:
        post._embedded?.['wp:term']?.[0]?.map((c: any) =>
          this.processCategory(c),
        ) || [],
      tags:
        post._embedded?.['wp:term']?.[1]?.map((t: any) => this.processTag(t)) ||
        [],
      commentStatus: post.comment_status || 'closed',
      format: post.format || 'standard',
      sticky: post.sticky || false,
      acf: (post.acf as TACF) || ({} as TACF),
      yoastSEO: post.yoast_head_json,
      yoastHead: post.yoast_head || '',
    };
  }

  // --- Public Methods ---

  async getTotalPages(
    options: { postType?: string; perPage?: number } = {},
  ): Promise<number> {
    try {
      const postType = options.postType || 'posts';
      const perPage = options.perPage || 10;
      const url = `${this.baseUrl}/wp-json/wp/v2/${postType}?per_page=${perPage}&_fields=id`;

      const response = await this.fetchWithRetry(url, { method: 'HEAD' });
      if (!response.ok) return 1;

      const totalPages = response.headers.get('X-WP-TotalPages');
      return totalPages ? parseInt(totalPages, 10) : 1;
    } catch (error) {
      return 1;
    }
  }

  async getPosts<TACF = any>(
    options: PostsQueryOptions = {},
  ): Promise<PostsResponse<TACF>> {
    try {
      const postType = options.postType || 'posts';
      const params = new URLSearchParams();

      params.append('_embed', 'true');
      if (options.page) params.append('page', options.page.toString());
      if (options.perPage)
        params.append('per_page', options.perPage.toString());
      if (options.search) params.append('search', options.search);
      if (options.author) params.append('author', options.author.toString());
      if (options.orderBy) params.append('orderby', options.orderBy);
      if (options.order) params.append('order', options.order);
      if (options.status) params.append('status', options.status);
      if (options.exclude) params.append('exclude', options.exclude.join(','));
      if (options.categories)
        params.append('categories', options.categories.join(','));

      const url = `${this.baseUrl}/wp-json/wp/v2/${postType}?${params.toString()}`;
      console.log(`🌐 Fetching: ${url}`);

      const response = await this.fetchWithRetry(url);

      if (!response.ok) {
        console.error(`❌ API Error ${response.status}: ${url}`);
        return { posts: [], total: 0, totalPages: 0, hasMore: false };
      }

      // Safe JSON Parsing to catch HTML error pages
      const text = await response.text();
      if (text.trim().startsWith('<')) {
        console.error(`❌ Received HTML instead of JSON from: ${url}`);
        return { posts: [], total: 0, totalPages: 0, hasMore: false };
      }

      const posts = JSON.parse(text);

      if (!Array.isArray(posts)) {
        return { posts: [], total: 0, totalPages: 0, hasMore: false };
      }

      const total = parseInt(response.headers.get('X-WP-Total') || '0', 10);
      const totalPages = parseInt(
        response.headers.get('X-WP-TotalPages') || '0',
        10,
      );
      const currentPage = options.page || 1;

      return {
        posts: posts.map((post: any) => this.processPost<TACF>(post)),
        total,
        totalPages,
        hasMore: currentPage < totalPages,
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      return { posts: [], total: 0, totalPages: 0, hasMore: false };
    }
  }

  /**
   * Fetches ALL items of a type, handling pagination automatically.
   * Uses LRUCache to avoid hitting the API repeatedly during build.
   */
  async getAllPosts<TACF = any>(
    options: PostsQueryOptions = {},
  ): Promise<WordPressPost<TACF>[]> {
    const postType = options.postType || 'posts';
    const cacheKey = `all-${postType}`;

    // 1. Check Cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as Promise<WordPressPost<TACF>[]>;
    }

    console.log(`🌍 Starting full fetch for '${postType}'...`);

    // 2. Create Promise
    const requestPromise = (async () => {
      let allPosts: WordPressPost<TACF>[] = [];
      let page = 1;
      let totalPages = 1;

      try {
        do {
          const currentOptions = { ...options, page, perPage: 20 };
          const { posts, totalPages: total } =
            await this.getPosts<TACF>(currentOptions);

          if (posts.length === 0) break;

          totalPages = total;
          allPosts = [...allPosts, ...posts];

          if (totalPages > 1)
            console.log(`   ↳ Page ${page}/${totalPages} loaded.`);

          page++;
          if (page <= totalPages) await new Promise((r) => setTimeout(r, 100)); // Be nice to server
        } while (page <= totalPages);

        console.log(
          `✅ [Complete] Fetched ${allPosts.length} '${postType}' items.`,
        );
        return allPosts;
      } catch (error) {
        console.error(`❌ Error fetching ${postType}:`, error);
        this.cache.delete(cacheKey); // Clear bad cache
        return [];
      }
    })();

    // 3. Store Promise in Cache
    this.cache.set(cacheKey, requestPromise);
    return requestPromise as Promise<WordPressPost<TACF>[]>;
  }

  async getPostBySlug<TACF = any>(
    slug: string,
    postType: string = 'posts',
  ): Promise<WordPressPost<TACF> | null> {
    const cacheKey = `all-${postType}`;
    // Optimize: Check if we have the full list cached first
    if (this.cache.has(cacheKey)) {
      const all = await this.cache.get(cacheKey)!;
      const found = all.find((p) => p.slug === slug);
      if (found) return found as WordPressPost<TACF>;
    }

    try {
      const url = `${this.baseUrl}/wp-json/wp/v2/${postType}?slug=${slug}&_embed=true`;
      const res = await this.fetchWithRetry(url);
      if (!res.ok) return null;
      const data = await res.json();
      return data.length ? this.processPost<TACF>(data[0]) : null;
    } catch (e) {
      return null;
    }
  }

  async getPostById<TACF = any>(
    id: number,
    postType: string = 'posts',
  ): Promise<WordPressPost<TACF> | null> {
    try {
      const url = `${this.baseUrl}/wp-json/wp/v2/${postType}/${id}?_embed=true`;
      const res = await this.fetchWithRetry(url);
      if (!res.ok) return null;
      const data = await res.json();
      return this.processPost<TACF>(data);
    } catch (e) {
      return null;
    }
  }

  async getRelatedPosts<TACF = any>(
    postId: number,
    categoryIds: number[] = [],
    limit: number = 3,
    postType: string = 'posts',
  ): Promise<WordPressPost<TACF>[]> {
    const { posts } = await this.getPosts<TACF>({
      postType,
      perPage: limit + 4,
      exclude: [postId],
      categories: categoryIds.map(String),
    });
    return posts.sort(() => 0.5 - Math.random()).slice(0, limit);
  }

  async searchPosts<TACF = any>(q: string, opt = {}) {
    return this.getPosts<TACF>({ ...opt, search: q });
  }

  async getRecentPosts<TACF = any>(limit = 5, pt = 'posts') {
    const { posts } = await this.getPosts<TACF>({
      postType: pt,
      perPage: limit,
      orderBy: 'date',
      order: 'desc',
    });
    return posts;
  }
}

export const wordpress = new WordPressAPI();

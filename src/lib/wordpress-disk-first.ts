// src/lib/wordpress.ts
import fs from 'node:fs';
import path from 'node:path';
import type { CommentsQueryOptions, CommentsResponse } from '../../types/wp';

// --- CONFIGURATION ---
const CACHE_ROOT = path.join(process.cwd(), 'src/content/_cache');

// ... [Keep all your existing Interfaces: WordPressComment, YoastSEO, etc. exactly as you provided] ...

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
  _fields?: string[];
}

export interface PostsResponse<TACF = any> {
  posts: WordPressPost<TACF>[];
  total: number;
  totalPages: number;
  hasMore: boolean;
}

class WordPressAPI {
  private baseUrl: string;
  private _requestCache = new Map<string, Promise<WordPressPost<any>[]>>();

  constructor() {
    this.baseUrl = import.meta.env.PUBLIC_WORDPRESS_API_URL;
    if (!this.baseUrl) {
      console.warn('PUBLIC_WORDPRESS_API_URL is not defined in .env');
    }
  }

  /**
   * 🛡️ INTERNAL HELPER: READ FROM DISK
   */
  private readFromCache<TACF>(postType: string): WordPressPost<TACF>[] {
    const dir = path.join(CACHE_ROOT, postType);
    if (!fs.existsSync(dir)) {
      // We throw an error instead of returning [] because if the script didn't run,
      // the build SHOULD fail to prevent a broken site.
      throw new Error(
        `❌ Cache directory for '${postType}' not found. Run 'npm run fetch:${postType === 'posts' ? 'posts' : 'all'}' first.`,
      );
    }

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json') && f !== 'ledger.json');
    if (files.length === 0) return [];

    return files.map((file) => {
      const content = fs.readFileSync(path.join(dir, file), 'utf-8');
      return JSON.parse(content) as WordPressPost<TACF>;
    });
  }

  private async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retries = 3,
    delay = 1000,
  ): Promise<Response> {
    try {
      const response = await fetch(url, options);
      if (!response.ok && response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (retries > 0) {
        console.warn(`⚠️ Fetch failed. Retrying... (${retries} left) - ${url}`);
        await new Promise((res) => setTimeout(res, delay));
        return this.fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  // --- Helper Processors ---
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
    return {
      id: author.id,
      name: author.name || '',
      slug: author.slug || '',
      avatar: author.avatar_urls?.['96'] || '',
      description: author.description || '',
      url: author.url || '',
    };
  }

  private processCategory(category: any): WordPressCategory {
    return {
      id: category.id,
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      count: category.count || 0,
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
      featuredImage: post._embedded?.['wp:featuredmedia']?.[0]
        ? this.processImage(post._embedded['wp:featuredmedia'][0])
        : undefined,
      author: post._embedded?.['author']?.[0]
        ? this.processAuthor(post._embedded['author'][0])
        : { id: 0, name: '', slug: '', avatar: '', description: '', url: '' },
      categories:
        post._embedded?.['wp:term']?.[0]?.map((cat: any) =>
          this.processCategory(cat),
        ) || [],
      tags:
        post._embedded?.['wp:term']?.[1]?.map((tag: any) =>
          this.processTag(tag),
        ) || [],
      commentStatus: post.comment_status || 'closed',
      format: post.format || 'standard',
      sticky: post.sticky || false,
      acf: (post.acf as TACF) || ({} as TACF),
      yoastSEO: post.yoast_head_json,
      yoastHead: post.yoast_head || '',
    };
  }

  // --- Main Logic Methods ---

  async getTotalPages(
    options: { postType?: string; perPage?: number } = {},
  ): Promise<number> {
    try {
      const postType = options.postType || 'posts';
      const perPage = options.perPage || 10;

      // Try Local First
      const allLocal = this.readFromCache(postType);
      if (allLocal.length > 0) return Math.ceil(allLocal.length / perPage);

      // Fallback to Network
      const url = `${this.baseUrl}/wp-json/wp/v2/${postType}?per_page=${perPage}&_fields=id`;
      const response = await this.fetchWithRetry(url, { method: 'HEAD' });
      const totalPages = response.headers.get('X-WP-TotalPages');
      return totalPages ? parseInt(totalPages, 10) : 1;
    } catch (error) {
      return 1;
    }
  }

  async getPosts<TACF = any>(
    options: PostsQueryOptions = {},
  ): Promise<PostsResponse<TACF>> {
    const postType = options.postType || 'posts';
    const page = options.page || 1;
    const perPage = options.perPage || 10;

    try {
      // 1. Read from local cache
      let allPosts = this.readFromCache<TACF>(postType);

      // 2. Memory Filtering
      if (options.search) {
        const query = options.search.toLowerCase();
        allPosts = allPosts.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.content.toLowerCase().includes(query),
        );
      }
      if (options.author)
        allPosts = allPosts.filter((p) => p.author.id === options.author);
      if (options.categories && options.categories.length > 0) {
        allPosts = allPosts.filter((p) =>
          p.categories.some((c) => options.categories!.includes(c.slug)),
        );
      }

      // 3. 🎯 STRICT SORTING BY DATE (Newest First)
      allPosts.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      // 4. Pagination
      const total = allPosts.length;
      const totalPages = Math.ceil(total / perPage);
      const offset = (page - 1) * perPage;
      const posts = allPosts.slice(offset, offset + perPage);

      return {
        posts,
        total,
        totalPages,
        hasMore: page < totalPages,
      };
    } catch (error) {
      // ... [Keep network fallback as is] ...
      return { posts: [], total: 0, totalPages: 0, hasMore: false };
    }
  }

  async getAllPosts<TACF = any>(
    options: PostsQueryOptions = {},
  ): Promise<WordPressPost<TACF>[]> {
    const postType = options.postType || 'posts';
    try {
      const posts = this.readFromCache<TACF>(postType);

      // 🎯 Ensure getAllPosts is also sorted by date
      return posts.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } catch (e) {
      // ... [Keep fallback as is] ...
      return [];
    }
  }

  async getPostBySlug<TACF = any>(
    slug: string,
    postType: string = 'posts',
  ): Promise<WordPressPost<TACF> | null> {
    try {
      const all = this.readFromCache<TACF>(postType);
      const cached = all.find((p) => p.slug === slug);
      if (cached) return cached;
      throw new Error('Not in cache'); // Trigger fallback
    } catch (e) {
      console.log(`📡 [Missing Cache] Fetching ${slug} from Network...`);
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/${postType}?slug=${slug}&_embed=true`,
      );
      const posts = await response.json();

      if (posts.length > 0) {
        const clean = this.processPost<TACF>(posts[0]);
        // ✅ SELF-HEAL: Save it so it's there for the next build
        const filePath = path.join(CACHE_ROOT, postType, `${clean.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(clean, null, 2));
        return clean;
      }
      return null;
    }
  }

  async getPostById<TACF = any>(
    id: number,
    postType: string = 'posts',
  ): Promise<WordPressPost<TACF> | null> {
    try {
      const filePath = path.join(CACHE_ROOT, postType, `${id}.json`);
      if (fs.existsSync(filePath))
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      throw new Error();
    } catch (e) {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/${postType}/${id}?_embed=true`,
      );
      const post = await response.json();
      return this.processPost<TACF>(post);
    }
  }

  async getCategories(): Promise<WordPressCategory[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/categories?per_page=100`,
      );
      const categories = await response.json();
      return categories.map((category: any) => this.processCategory(category));
    } catch (error) {
      return [];
    }
  }

  async getTags(): Promise<WordPressTag[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/tags?per_page=100`,
      );
      const tags = await response.json();
      return tags.map((tag: any) => this.processTag(tag));
    } catch (error) {
      return [];
    }
  }

  async getCategoryIdsBySlug(slugs: string[]): Promise<number[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/categories?slug=${slugs.join(',')}&per_page=100`,
      );
      const categories = await response.json();
      return categories.map((cat: any) => cat.id);
    } catch (error) {
      return [];
    }
  }

  async getTagIdsBySlug(slugs: string[]): Promise<number[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/tags?slug=${slugs.join(',')}&per_page=100`,
      );
      const tags = await response.json();
      return tags.map((tag: any) => tag.id);
    } catch (error) {
      return [];
    }
  }

  async getRelatedPosts<TACF = any>(
    postId: number,
    categoryIds: number[] = [],
    limit: number = 3,
    postType: string = 'posts',
  ): Promise<WordPressPost<TACF>[]> {
    try {
      const all = this.readFromCache<TACF>(postType);
      let targetCats = categoryIds;
      if (targetCats.length === 0) {
        const current = all.find((p) => p.id === postId);
        if (current) targetCats = current.categories.map((c) => c.id);
      }
      return all
        .filter(
          (p) =>
            p.id !== postId &&
            p.categories.some((c) => targetCats.includes(c.id)),
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, limit);
    } catch (e) {
      const { posts } = await this.getPosts<TACF>({
        postType,
        perPage: 50,
        categories: categoryIds.map(String),
      });
      return posts
        .filter((p) => p.id !== postId)
        .sort(() => 0.5 - Math.random())
        .slice(0, limit);
    }
  }

  async searchPosts<TACF = any>(
    query: string,
    options: Omit<PostsQueryOptions, 'search'> = {},
  ): Promise<PostsResponse<TACF>> {
    return this.getPosts<TACF>({ ...options, search: query });
  }

  async getPostsByCategory<TACF = any>(
    categorySlug: string[],
    options: Omit<PostsQueryOptions, 'categories'> = {},
  ): Promise<PostsResponse<TACF>> {
    return this.getPosts<TACF>({ ...options, categories: [...categorySlug] });
  }

  async getPostsByTag<TACF = any>(
    tagSlug: string,
    options: Omit<PostsQueryOptions, 'tags'> = {},
  ): Promise<PostsResponse<TACF>> {
    return this.getPosts<TACF>({ ...options, tags: [tagSlug] });
  }

  async getPostsByAuthor<TACF = any>(
    authorId: number,
    options: Omit<PostsQueryOptions, 'author'> = {},
  ): Promise<PostsResponse<TACF>> {
    return this.getPosts<TACF>({ ...options, author: authorId });
  }

  async getRecentPosts<TACF = any>(
    limit: number = 5,
    postType: string = 'posts',
  ): Promise<WordPressPost<TACF>[]> {
    const { posts } = await this.getPosts<TACF>({
      postType,
      perPage: limit,
      orderBy: 'date',
      order: 'desc',
    });
    return posts;
  }

  async getPopularPosts<TACF = any>(
    limit: number = 5,
    postType: string = 'posts',
  ): Promise<WordPressPost<TACF>[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/${postType}?per_page=${limit}&orderby=comment_count&order=desc&_embed=true`,
      );
      const posts = await response.json();
      return posts.map((post: any) => this.processPost<TACF>(post));
    } catch (error) {
      return [];
    }
  }

  async postViewCounter(postId: number) {
    const response = await fetch(
      `${this.baseUrl}/wp-json/custom/v1/post-views/${postId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        cache: 'no-cache',
      },
    );
    const data = await response.json();
    return { views: data.views || 0 };
  }

  private authHeader(): Record<string, string> {
    const user = import.meta.env.WP_APP_USER;
    const pass = import.meta.env.WP_APP_PASSWORD;
    if (!user || !pass) return {};
    return { Authorization: `Basic ${btoa(`${user}:${pass}`)}` };
  }

  private processComment(raw: any): WordPressComment {
    return {
      id: raw.id,
      postId: raw.post,
      parent: raw.parent || 0,
      authorId: raw.author || 0,
      authorName: raw.author_name || '',
      authorUrl: raw.author_url || '',
      authorAvatar: raw.author_avatar_urls?.['96'] || '',
      date: raw.date || '',
      status: raw.status || '',
      content: raw.content?.rendered || '',
      link: raw.link || '',
    };
  }

  private buildCommentTree(list: WordPressComment[]): WordPressComment[] {
    const byId = new Map<
      number,
      WordPressComment & { children: WordPressComment[] }
    >();
    list.forEach((c) => byId.set(c.id, { ...c, children: [] }));
    const roots: (WordPressComment & { children: WordPressComment[] })[] = [];
    list.forEach((c) => {
      const node = byId.get(c.id)!;
      if (c.parent && byId.has(c.parent))
        byId.get(c.parent)!.children.push(node);
      else roots.push(node);
    });
    return roots;
  }

  async getComments(
    postId: number,
    options: CommentsQueryOptions = {},
  ): Promise<CommentsResponse> {
    try {
      const params = new URLSearchParams({
        post: String(postId),
        per_page: String(options.perPage ?? 50),
        page: String(options.page ?? 1),
        orderby: 'date',
        order: options.order ?? 'asc',
        status: options.status ?? 'approve',
      });
      const res = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/comments?${params.toString()}`,
        { headers: { ...this.authHeader() } },
      );
      if (!res.ok)
        return {
          comments: [],
          tree: [],
          total: 0,
          totalPages: 0,
          hasMore: false,
        };
      const raw = await res.json();
      const comments = (raw as any[]).map(this.processComment.bind(this));
      return {
        comments,
        tree: this.buildCommentTree(comments),
        total: parseInt(res.headers.get('X-WP-Total') || '0', 10),
        totalPages: parseInt(res.headers.get('X-WP-TotalPages') || '0', 10),
        hasMore:
          (options.page ?? 1) <
          parseInt(res.headers.get('X-WP-TotalPages') || '0', 10),
      };
    } catch (err) {
      return {
        comments: [],
        tree: [],
        total: 0,
        totalPages: 0,
        hasMore: false,
      };
    }
  }
}

export const wordpress = new WordPressAPI();

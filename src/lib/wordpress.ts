// src/lib/wordpress.ts

import type { CommentsQueryOptions, CommentsResponse } from '../../types/wp';

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

  // ✅ SMART CACHE: Stores separate promises for 'posts', 'case-study', 'guide', etc.
  private _requestCache = new Map<string, Promise<WordPressPost<any>[]>>();

  constructor() {
    this.baseUrl = import.meta.env.PUBLIC_WORDPRESS_API_URL;
    if (!this.baseUrl) {
      console.warn('PUBLIC_WORDPRESS_API_URL is not defined in .env');
    }
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
        console.warn(
          `⚠️ Fetch failed. Retrying in ${delay}ms... (${retries} attempts left) - ${url}`,
        );
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
    };
  }

  // --- Main Fetch Methods ---

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
      console.error('Error fetching total pages:', error);
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
      if (options._fields && options._fields.length > 0) {
        params.append('_fields', options._fields.join(','));
      }

      const url = `${this.baseUrl}/wp-json/wp/v2/${postType}?${params.toString()}`;
      const response = await this.fetchWithRetry(url);

      if (!response.ok) {
        return { posts: [], total: 0, totalPages: 0, hasMore: false };
      }

      const posts = await response.json();
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
   * ✅ SMART SINGLETON: Fetches ALL items of a specific type once.
   * Caches them separately based on the postType.
   */
  async getAllPosts<TACF = any>(
    options: PostsQueryOptions = {},
  ): Promise<WordPressPost<TACF>[]> {
    const postType = options.postType || 'posts';

    // Create a unique key (e.g., 'all-posts', 'all-case-study')
    const cacheKey = `all-${postType}`;

    // 1. Check if we already have a promise for this specific post type
    if (this._requestCache.has(cacheKey)) {
      console.log(`⚡ [Cache Hit] Reuse existing promise for '${cacheKey}'`);
      return this._requestCache.get(cacheKey) as Promise<WordPressPost<TACF>[]>;
    }

    console.log(
      `🌍 [Cache Miss] Starting SINGLE fetch for all '${postType}'...`,
    );

    // 2. Create the Promise
    const requestPromise = (async () => {
      let allPosts: WordPressPost<TACF>[] = [];
      let page = 1;
      let totalPages = 1;
      const startTime = Date.now();

      try {
        do {
          const currentOptions = { ...options, page, perPage: 50 };
          const { posts, totalPages: total } =
            await this.getPosts<TACF>(currentOptions);

          totalPages = total;
          allPosts = [...allPosts, ...posts];

          // 📝 Log progress for larger sites
          if (totalPages > 1) {
            console.log(
              `   ➤ Fetched page ${page} of ${totalPages} for '${postType}' (${posts.length} items)`,
            );
          }

          if (page < totalPages) {
            await new Promise((r) => setTimeout(r, 50));
          }
          page++;
        } while (page <= totalPages);

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(
          `✅ [Cache Ready] Stored ${allPosts.length} '${postType}' items in ${duration}s.`,
        );
        return allPosts;
      } catch (error) {
        console.error(`❌ Error fetching ${postType}:`, error);
        this._requestCache.delete(cacheKey); // Clear cache on failure
        return [];
      }
    })();

    // 3. Store the promise in the Map
    this._requestCache.set(cacheKey, requestPromise);

    return requestPromise as Promise<WordPressPost<TACF>[]>;
  }

  // ✅ CACHE-AWARE: Single Post by Slug
  async getPostBySlug<TACF = any>(
    slug: string,
    postType: string = 'posts',
  ): Promise<WordPressPost<TACF> | null> {
    // 1. Check the specific cache for this postType
    const cacheKey = `all-${postType}`;
    if (this._requestCache.has(cacheKey)) {
      try {
        const allPosts = await this._requestCache.get(cacheKey)!;
        const cached = allPosts.find((p) => p.slug === slug);
        if (cached) {
          // console.log(`⚡ [Memory Hit] Found post "${slug}" in '${cacheKey}'`); // Optional verbose log
          return cached as WordPressPost<TACF>;
        }
      } catch (e) {
        /* ignore */
      }
    }

    // 2. Fallback to Network
    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/${postType}?slug=${slug}&_embed=true`,
      );
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const posts = await response.json();
      return posts.length > 0 ? this.processPost<TACF>(posts[0]) : null;
    } catch (error) {
      console.error(`Error fetching post by slug ${slug}:`, error);
      return null;
    }
  }

  // ✅ CACHE-AWARE: Single Post by ID
  async getPostById<TACF = any>(
    id: number,
    postType: string = 'posts',
  ): Promise<WordPressPost<TACF> | null> {
    // 1. Check memory first
    const cacheKey = `all-${postType}`;
    if (this._requestCache.has(cacheKey)) {
      try {
        const allPosts = await this._requestCache.get(cacheKey)!;
        const cached = allPosts.find((p) => p.id === id);
        if (cached) return cached as WordPressPost<TACF>;
      } catch (e) {
        /* ignore */
      }
    }

    // 2. Fallback to Network
    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/${postType}/${id}?_embed=true`,
      );
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Status: ${response.status}`);
      }
      const post = await response.json();
      return this.processPost<TACF>(post);
    } catch (error) {
      console.error(`Error fetching post by ID ${id}:`, error);
      return null;
    }
  }

  async getCategories(): Promise<WordPressCategory[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/categories?per_page=100`,
      );
      if (!response.ok) return [];
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
      if (!response.ok) return [];
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
      if (!response.ok) return [];
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
      if (!response.ok) return [];
      const tags = await response.json();
      return tags.map((tag: any) => tag.id);
    } catch (error) {
      return [];
    }
  }

  // ✅ CACHE-AWARE: Related Posts
  async getRelatedPosts<TACF = any>(
    postId: number,
    categoryIds: number[] = [],
    limit: number = 3,
    postType: string = 'posts',
  ): Promise<WordPressPost<TACF>[]> {
    // 1. Check memory first
    const cacheKey = `all-${postType}`;
    if (this._requestCache.has(cacheKey)) {
      try {
        const allPosts = await this._requestCache.get(cacheKey)!;

        // Find categories if missing
        let targetCats = categoryIds;
        if (targetCats.length === 0) {
          const currentPost = allPosts.find((p) => p.id === postId);
          if (currentPost) targetCats = currentPost.categories.map((c) => c.id);
        }

        if (targetCats.length === 0) return [];

        const related = allPosts
          .filter(
            (p) =>
              p.id !== postId &&
              p.categories.some((c) => targetCats.includes(c.id)),
          )
          .sort(() => 0.5 - Math.random())
          .slice(0, limit);

        return related as WordPressPost<TACF>[];
      } catch (e) {
        /* Fallback */
      }
    }

    // 2. Fallback to Network
    try {
      if (categoryIds.length === 0) {
        const post = await this.getPostById<TACF>(postId, postType);
        if (post && post.categories.length > 0) {
          categoryIds = post.categories.map((cat) => cat.id);
        }
      }

      if (categoryIds.length === 0) return [];

      const { posts } = await this.getPosts<TACF>({
        postType,
        perPage: 50,
        status: 'publish',
        // @ts-ignore
        categories: categoryIds,
        exclude: [postId],
        _fields: ['id', 'title', 'slug', 'date', 'featured_media', '_embedded'],
      });

      if (posts.length === 0) return [];
      return posts.sort(() => 0.5 - Math.random()).slice(0, limit);
    } catch (error) {
      console.error('Error fetching related posts:', error);
      return [];
    }
  }

  // ... [Standard methods] ...

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
      if (!response.ok) return [];
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
    if (!response.ok) return { views: 0 };
    const data = await response.json();
    return { views: data.views || 0 };
  }

  private authHeader(): Record<string, string> {
    const user = import.meta.env.WP_APP_USER;
    const pass = import.meta.env.WP_APP_PASSWORD;
    if (!user || !pass) return {};
    const basic = btoa(`${user}:${pass}`);
    return { Authorization: `Basic ${basic}` };
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
      if (c.parent && byId.has(c.parent)) {
        byId.get(c.parent)!.children.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  }

  async getComments(
    postId: number,
    options: CommentsQueryOptions = {},
  ): Promise<CommentsResponse> {
    try {
      const page = options.page ?? 1;
      const perPage = options.perPage ?? 50;
      const order = options.order ?? 'asc';
      const status = options.status ?? 'approve';
      const params = new URLSearchParams();
      params.set('post', String(postId));
      params.set('per_page', String(perPage));
      params.set('page', String(page));
      params.set('orderby', 'date');
      params.set('order', order);
      if (status) params.set('status', status);

      const url = `${this.baseUrl}/wp-json/wp/v2/comments?${params.toString()}`;
      const res = await fetch(url, { headers: { ...this.authHeader() } });

      if (!res.ok)
        return {
          comments: [],
          tree: [],
          total: 0,
          totalPages: 0,
          hasMore: false,
        };

      const raw = await res.json();
      const total = parseInt(res.headers.get('X-WP-Total') || '0', 10);
      const totalPages = parseInt(
        res.headers.get('X-WP-TotalPages') || '0',
        10,
      );
      const comments = (raw as any[]).map(this.processComment.bind(this));
      const tree = this.buildCommentTree(comments);

      return { comments, tree, total, totalPages, hasMore: page < totalPages };
    } catch (err) {
      console.error('Error fetching comments:', err);
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

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

  constructor() {
    this.baseUrl = import.meta.env.PUBLIC_WORDPRESS_API_URL;
    if (!this.baseUrl) {
      console.warn('PUBLIC_WORDPRESS_API_URL is not defined in .env');
    }
  }

  /**
   * 🛡️ RETRY LOGIC HELPER
   * Prevents build crashes on ECONNRESET or timeouts
   */
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
        return this.fetchWithRetry(url, options, retries - 1, delay * 2); // Exponential backoff
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

      const url = `${this.baseUrl}/wp-json/wp/v2/${postType}?${params.toString()}`;

      // ✅ USE RETRY FETCH
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
   * ✅ OPTIMIZED: Fetches ALL posts with delay to prevent server crash.
   */
  async getAllPosts<TACF = any>(
    options: PostsQueryOptions = {},
  ): Promise<WordPressPost<TACF>[]> {
    let allPosts: WordPressPost<TACF>[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      try {
        // Fetch 50 items (safer than 100 on weak servers)
        const currentOptions = { ...options, page, perPage: 50 };
        const { posts, totalPages: total } =
          await this.getPosts<TACF>(currentOptions);

        totalPages = total;
        allPosts = [...allPosts, ...posts];

        // ✅ Add a small delay between pages to be kind to the server
        if (page < totalPages) {
          await new Promise((r) => setTimeout(r, 200));
        }

        page++;
      } catch (error) {
        console.error(`Error fetching all posts page ${page}:`, error);
        break;
      }
    } while (page <= totalPages);

    return allPosts;
  }

  // Get single post by slug
  async getPostBySlug<TACF = any>(
    slug: string,
    postType: string = 'posts',
  ): Promise<WordPressPost<TACF> | null> {
    try {
      // ASTRO CHANGE: Removed Next.js cache tags
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/${postType}?slug=${slug}&_embed=true`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.status}`);
      }

      const posts = await response.json();

      return posts.length > 0 ? this.processPost<TACF>(posts[0]) : null;
    } catch (error) {
      console.error(`Error fetching post by slug ${slug}:`, error);
      return null;
    }
  }

  // Get single post by ID
  async getPostById<TACF = any>(
    id: number,
    postType: string = 'posts',
  ): Promise<WordPressPost<TACF> | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/${postType}/${id}?_embed=true`,
      );

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch post: ${response.status}`);
      }

      const post = await response.json();
      return this.processPost<TACF>(post);
    } catch (error) {
      console.error(`Error fetching post by ID ${id}:`, error);
      return null;
    }
  }

  // Get all categories
  async getCategories(): Promise<WordPressCategory[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/categories?per_page=100`,
      );

      if (!response.ok) return [];

      const categories = await response.json();
      return categories.map((category: any) => this.processCategory(category));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Get all tags
  async getTags(): Promise<WordPressTag[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/tags?per_page=100`,
      );

      if (!response.ok) return [];

      const tags = await response.json();
      return tags.map((tag: any) => this.processTag(tag));
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }

  // Helper method to get category IDs by slugs
  async getCategoryIdsBySlug(slugs: string[]): Promise<number[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/categories?slug=${slugs.join(
          ',',
        )}&per_page=100`,
      );

      if (!response.ok) return [];

      const categories = await response.json();
      return categories.map((cat: any) => cat.id);
    } catch (error) {
      console.error('Error fetching category IDs:', error);
      return [];
    }
  }

  // Helper method to get tag IDs by slugs
  async getTagIdsBySlug(slugs: string[]): Promise<number[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/tags?slug=${slugs.join(
          ',',
        )}&per_page=100`,
      );

      if (!response.ok) return [];

      const tags = await response.json();
      return tags.map((tag: any) => tag.id);
    } catch (error) {
      console.error('Error fetching tag IDs:', error);
      return [];
    }
  }

  /**
   * ✅ NEW METHOD: Get total pages via HEAD request (Lightweight)
   * Used for generating static paths without downloading post content.
   */
  async getTotalPages(
    options: { postType?: string; perPage?: number } = {},
  ): Promise<number> {
    try {
      const postType = options.postType || 'posts';
      const perPage = options.perPage || 10;

      // Construct URL with query params
      // We explicitly ask for 1 item per page if perPage isn't set, just to get the headers
      // But usually perPage matches the build setting
      const url = `${this.baseUrl}/wp-json/wp/v2/${postType}?per_page=${perPage}&_fields=id`;

      // Perform HEAD request to get headers only
      const response = await this.fetchWithRetry(url, { method: 'HEAD' });

      if (!response.ok) {
        console.warn(
          `Failed to fetch headers for total pages: ${response.status}`,
        );
        return 1; // Fallback to avoid build crash
      }

      const totalPages = response.headers.get('X-WP-TotalPages');
      return totalPages ? parseInt(totalPages, 10) : 1;
    } catch (error) {
      console.error('Error fetching total pages:', error);
      return 1; // Fallback
    }
  }

  // Optimized: Get related posts
  // Accepts categoryIds directly to avoid fetching the current post again
  // Optimized & Randomized: Get related posts
  async getRelatedPosts<TACF = any>(
    postId: number,
    categoryIds: number[] = [],
    limit: number = 3,
    postType: string = 'posts',
  ): Promise<WordPressPost<TACF>[]> {
    try {
      // 1. Fallback: If no categories provided, fetch current post to find them
      if (categoryIds.length === 0) {
        const post = await this.getPostById<TACF>(postId, postType);
        if (post && post.categories.length > 0) {
          categoryIds = post.categories.map((cat) => cat.id);
        }
      }

      if (categoryIds.length === 0) return [];

      // 2. Fetch a "Pool" of posts (e.g., 20 latest) instead of just 3
      // This gives us enough variety to shuffle them.
      const poolSize = 100;

      const { posts } = await this.getPosts<TACF>({
        postType,
        perPage: poolSize, // Fetch 20, not 3

        // @ts-ignore
        categories: categoryIds,
        exclude: [postId],
        // Only fetch fields we need for the card (Lightweight)
        _fields: ['id', 'title', 'slug', 'date', 'featured_media', '_embedded'],
      });

      if (posts.length === 0) return [];

      // 3. Shuffle the pool (Randomize!)
      // This runs at build time, assigning a unique random set to each page.
      const shuffled = posts.sort(() => 0.5 - Math.random());

      // 4. Return only the requested amount (e.g., 3)
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error('Error fetching related posts:', error);
      return [];
    }
  }

  // Search posts
  async searchPosts<TACF = any>(
    query: string,
    options: Omit<PostsQueryOptions, 'search'> = {},
  ): Promise<PostsResponse<TACF>> {
    return this.getPosts<TACF>({ ...options, search: query });
  }

  // Get posts by category
  async getPostsByCategory<TACF = any>(
    categorySlug: string[],
    options: Omit<PostsQueryOptions, 'categories'> = {},
  ): Promise<PostsResponse<TACF>> {
    return this.getPosts<TACF>({ ...options, categories: [...categorySlug] });
  }

  // Get posts by tag
  async getPostsByTag<TACF = any>(
    tagSlug: string,
    options: Omit<PostsQueryOptions, 'tags'> = {},
  ): Promise<PostsResponse<TACF>> {
    return this.getPosts<TACF>({ ...options, tags: [tagSlug] });
  }

  // Get posts by author
  async getPostsByAuthor<TACF = any>(
    authorId: number,
    options: Omit<PostsQueryOptions, 'author'> = {},
  ): Promise<PostsResponse<TACF>> {
    return this.getPosts<TACF>({ ...options, author: authorId });
  }

  // Get recent posts
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

  // Get popular posts (by comment count)
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
      console.error('Error fetching popular posts:', error);
      return [];
    }
  }

  async postViewCounter(postId: number) {
    const response = await fetch(
      `${this.baseUrl}/wp-json/custom/v1/post-views/${postId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        cache: 'no-cache',
      },
    );

    if (!response.ok)
      return {
        views: 0,
      };

    const data = await response.json();
    return {
      views: data.views || 0,
    };
  }

  // Build Basic auth header
  private authHeader(): Record<string, string> {
    const user = import.meta.env.WP_APP_USER;
    const pass = import.meta.env.WP_APP_PASSWORD;
    if (!user || !pass) return {};

    // ASTRO/CLOUDFLARE CHANGE: Use btoa() instead of Buffer.from()
    // btoa is available in browser/worker environments
    const basic = btoa(`${user}:${pass}`);
    return { Authorization: `Basic ${basic}` };
  }

  // Process a comment object
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

  // Build a nested tree from a flat list of comments
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

  // Get comments for a post
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

      // ASTRO CHANGE: Standard fetch, auth added via headers
      const res = await fetch(url, {
        headers: { ...this.authHeader() },
      });

      if (!res.ok) {
        return {
          comments: [],
          tree: [],
          total: 0,
          totalPages: 0,
          hasMore: false,
        };
      }

      const raw = await res.json();
      const total = parseInt(res.headers.get('X-WP-Total') || '0', 10);
      const totalPages = parseInt(
        res.headers.get('X-WP-TotalPages') || '0',
        10,
      );
      const comments = (raw as any[]).map(this.processComment.bind(this));
      const tree = this.buildCommentTree(comments);

      return {
        comments,
        tree,
        total,
        totalPages,
        hasMore: page < totalPages,
      };
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

// Export singleton instance
export const wordpress = new WordPressAPI();

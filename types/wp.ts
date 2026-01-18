export interface YoastSEO {
  title: string;
  robots: {
    index: string;
    follow: string;
    'max-snippet': string;
    'max-image-preview': string;
    'max-video-preview': string;
  };
  canonical: string;
  og_locale: string;
  og_type: string;
  og_title: string;
  og_description?: string;
  og_url: string;
  og_site_name: string;
  article_published_time?: string;
  article_modified_time?: string;
  og_image?: Array<{
    url: string;
    width: number;
    height: number;
    type: string;
  }>;
  author?: string;
  twitter_card: string;
  twitter_misc?: Record<string, string>;
  schema: {
    '@context': string;
    '@graph': Array<unknown>;
  };
}

export type ACFImage = {
  id: number;
  full_image_url: string;
  thumbnail_image_url: string;
  large_srcset: string;
  medium_srcset: string;
  alt_text?: string;
  title?: string;
  media_details: {
    width: number;
    height: number;
    sizes: any;
  };
};

export type PersonalInfoACF = {
  name: string;
  title__headline: string;
  button_text: string;
  button_url: string;
  button_target: '_self' | '_blank';
  social_media_comma_seperated: string;
  images: ACFImage[];
  logo: {
    url: string;
  };
};

interface Author {
  id: number;
  name: string;
  slug: string;
  avatar: string;
  description: string;
  url: string;
}

interface Screenshot {
  id: number;
  title: string;
  full_image_url: string;
  media_details: {
    width: number;
    height: number;
  };
}

export interface ExperienceAcf {
  job_title: string;
  job_start_year: string;
  job_end_year: string;
  company_name: string;
  location: string;
  job_description: string;
  company_logo: {
    url: string;
  }; // Replace with more specific type if structure is known
}

export interface ProjectAcf {
  short_project_description: string;
  project_description: string;
  'tools_&_technologies': string;
  screenshots: {
    full_image_url: string;
  }[];
}

export interface ReviewAcf {
  client_name: string;
  testimonial_author_title: string;
  testimonial_quote: string;
  image: {
    url: string;
  };
}

export interface CaseStudyAcf {
  client_name: string;
  completion_date: string;
  project_duration: string;
  screenshots: Screenshot[];
}

export interface ServiceAcf {
  subtitle: string;
  short_description: string;
  detailed_description: string;
  features: string;
  orig_price: number;
  discounted_price: number;
}

// --- Comments ---

export interface WordPressComment {
  id: number;
  postId: number;
  parent: number;
  authorId: number;
  authorName: string;
  authorUrl: string;
  authorAvatar: string; // 96px (WordPress default)
  date: string;
  status: string; // 'approved' | 'hold' | 'spam' | 'trash' | etc.
  content: string; // rendered HTML
  link: string;
  // Built client-side for nesting convenience:
  children?: WordPressComment[];
}

export interface CommentsQueryOptions {
  page?: number;
  perPage?: number; // WP max is typically 100
  order?: 'asc' | 'desc'; // default 'asc' for chronological
  status?: 'approve' | 'hold' | 'spam' | 'trash'; // WP REST filter; unauth'd can usually only see 'approve'
}

export interface CommentsResponse {
  comments: WordPressComment[]; // flat
  tree: WordPressComment[]; // nested, for rendering threads
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface CreateCommentInput {
  postId: number;
  content: string; // raw user input (WP sanitizes and returns rendered)
  authorName: string;
  authorEmail: string; // required by WP unless you change discussion settings
  parent?: number; // reply-to
  authorUrl?: string;
}

export interface CreateCommentResult {
  ok: boolean;
  pending: boolean; // true if awaiting moderation
  comment?: WordPressComment;
  error?: string;
}

export interface DevelopmentServiceData {
  slug: string;
  name: string;
  seoTitle: string;
  description: string;
  eyebrow: string;
  headline: string;
  intro: string;
  bestFor: string[];
  deliverables: Array<{ title: string; description: string }>;
  technology: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export const developmentServices: Record<string, DevelopmentServiceData> = {
  wordpress: {
    slug: '/website-development/wordpress-development/',
    name: 'WordPress Development',
    seoTitle: 'WordPress Development Services | Custom, Secure & Fast Websites',
    description: 'Custom WordPress development for business websites, WooCommerce, themes, plugins, migrations, performance, security, and maintainable content editing.',
    eyebrow: 'Flexible content, careful engineering',
    headline: 'WordPress development that remains easy to own after launch.',
    intro: 'I build and improve WordPress websites around clear content structure, secure implementation, fast user experience, practical editing, and the integrations the business actually needs.',
    bestFor: ['Business and professional-service websites', 'WooCommerce stores and product catalogs', 'Publishing and content-heavy websites', 'Membership, course, and lead-generation sites', 'Teams that need familiar visual editing', 'Existing WordPress sites that need a careful rebuild'],
    deliverables: [
      { title: 'Custom website builds', description: 'Original responsive interfaces implemented around the brand, content, and conversion journey.' },
      { title: 'Theme and block development', description: 'Maintainable templates, blocks, fields, and editing guardrails without unnecessary page-builder complexity.' },
      { title: 'WooCommerce development', description: 'Products, checkout, payments, shipping, email flows, subscriptions, and store-specific integrations.' },
      { title: 'Plugin and API work', description: 'Custom functionality and connections to CRMs, forms, analytics, external APIs, and business systems.' },
      { title: 'Migration and rebuilds', description: 'Move from another host, CMS, builder, or unstable theme while preserving important URLs and content.' },
      { title: 'Performance and security', description: 'Lean implementation, caching, media handling, update planning, hardening, and responsible access setup.' },
    ],
    technology: ['WordPress', 'WooCommerce', 'PHP', 'JavaScript', 'Gutenberg', 'ACF', 'REST API', 'MySQL', 'Cloudflare'],
    faqs: [
      { question: 'Do you use page builders?', answer: 'I can work with Elementor and existing builders, but new builds use the lightest editing approach that satisfies the content team. Native blocks, controlled fields, and custom templates often age better.' },
      { question: 'Can you rebuild without changing existing URLs?', answer: 'Yes. Preserving valuable URL paths, metadata, redirects, and internal links is part of the migration plan when the existing site has search traffic.' },
      { question: 'Do you develop custom WordPress plugins?', answer: 'Yes, when custom functionality is better isolated in a plugin than tied to a theme. The scope includes security, permissions, data validation, and maintainability.' },
    ],
  },
  nextjs: {
    slug: '/website-development/nextjs-development/',
    name: 'Next.js Development',
    seoTitle: 'Next.js Development Services | Full-Stack Apps & Websites',
    description: 'Next.js development for modern websites, SaaS products, portals, dashboards, APIs, authentication, databases, and headless content experiences.',
    eyebrow: 'React applications with a product mindset',
    headline: 'Next.js development for websites that behave like products.',
    intro: 'I build full-stack Next.js applications and content platforms with clear architecture, secure data flows, responsive interfaces, dependable deployment, and enough documentation to keep moving.',
    bestFor: ['SaaS products and customer portals', 'Dashboards and internal tools', 'Authenticated workflows and role-based access', 'Headless WordPress and composable content', 'Data-rich interactive websites', 'Teams already working in React and TypeScript'],
    deliverables: [
      { title: 'Product interfaces', description: 'Responsive dashboards, workflows, account areas, data views, and conversion-focused marketing pages.' },
      { title: 'Authentication and access', description: 'Sign-in, sessions, permissions, protected routes, and secure server-side authorization.' },
      { title: 'Database-backed features', description: 'Practical data models, migrations, validation, queries, background work, and admin workflows.' },
      { title: 'API and integration work', description: 'Route handlers, external APIs, webhooks, payments, email, storage, analytics, and CRM connections.' },
      { title: 'Headless content', description: 'Next.js frontends connected to WordPress or other content systems with preview and revalidation workflows.' },
      { title: 'Deployment and observability', description: 'Environment management, error reporting, logging, analytics, performance, and recovery-aware releases.' },
    ],
    technology: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'Auth.js', 'Tailwind CSS', 'Vercel'],
    faqs: [
      { question: 'Is Next.js good for SEO?', answer: 'It can be excellent when content is rendered appropriately, metadata and canonical rules are correct, internal links are crawlable, and performance is managed. The framework alone does not guarantee search visibility.' },
      { question: 'Can Next.js use WordPress as a CMS?', answer: 'Yes. Headless WordPress can provide familiar editing while Next.js controls the frontend, but preview, caching, forms, search, and plugin-dependent features need deliberate integration.' },
      { question: 'Can you continue an existing Next.js project?', answer: 'Yes. I begin with an architecture, dependency, security, deployment, and code-quality review before estimating new feature work.' },
    ],
  },
  astro: {
    slug: '/website-development/astro-development/',
    name: 'Astro Development',
    seoTitle: 'Astro Development Services | Fast Content & Marketing Websites',
    description: 'Astro website development for fast marketing sites, publications, documentation, portfolios, content platforms, and modern SEO-focused rebuilds.',
    eyebrow: 'Content-first performance',
    headline: 'Astro development for websites that should feel instant, not overengineered.',
    intro: 'I build Astro websites with a small browser footprint, flexible content sources, intentional SEO foundations, accessible interfaces, and interactive islands only where they add real value.',
    bestFor: ['Marketing and lead-generation websites', 'Blogs, publications, and content hubs', 'Documentation and knowledge bases', 'Personal brands and portfolios', 'International and high-traffic static content', 'Rebuilds where performance and simplicity matter'],
    deliverables: [
      { title: 'Original Astro websites', description: 'Custom design and component architecture for responsive, content-led experiences.' },
      { title: 'Content collections', description: 'Typed Markdown, MDX, or CMS content models with clear editorial structure and templates.' },
      { title: 'CMS integrations', description: 'Connect WordPress, headless CMS platforms, APIs, or local content with reliable build and preview workflows.' },
      { title: 'Selective interactivity', description: 'React, Vue, or native components loaded only where the visitor actually needs interaction.' },
      { title: 'SEO and structured data', description: 'Metadata, canonical URLs, sitemaps, schema, internal linking, redirects, and indexable rendered HTML.' },
      { title: 'Deployment optimization', description: 'Static or server output, image handling, caching, redirects, monitoring, and host-specific configuration.' },
    ],
    technology: ['Astro', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'MDX', 'React', 'Content APIs', 'Cloudflare'],
    faqs: [
      { question: 'Is Astro only for static websites?', answer: 'No. Astro supports server rendering, endpoints, actions, and interactive framework components. Its strongest advantage is letting each route ship only the JavaScript it needs.' },
      { question: 'Can an existing WordPress site move to Astro?', answer: 'Yes, if the required WordPress features are mapped carefully. WordPress can remain as a headless CMS, or content can move to collections or another CMS.' },
      { question: 'Is Astro suitable for eCommerce?', answer: 'It can power content and storefront experiences connected to a commerce backend, but checkout, account, inventory, and editorial needs determine whether a hybrid or different stack is more appropriate.' },
    ],
  },
  ai: {
    slug: '/website-development/ai-vibe-coding/',
    name: 'AI & Vibe Coding Development',
    seoTitle: 'AI Vibe Coding Developer | Audit, Fix & Finish AI-Built Apps',
    description: 'Professional help for AI- and vibe-coded apps: architecture review, security, debugging, testing, integrations, performance, deployment, and continued development.',
    eyebrow: 'From fast prototype to dependable product',
    headline: 'Keep the speed of vibe coding. Add the engineering it still needs.',
    intro: 'I help founders audit, repair, secure, and finish websites and applications created with AI coding tools—without treating generated code as automatically wrong or production-ready.',
    bestFor: ['Lovable, Bolt, Replit, Cursor, or Copilot projects', 'MVPs that work but are difficult to change safely', 'Apps with authentication or database concerns', 'Projects blocked by recurring AI-generated bugs', 'Founders preparing for real users or payment flows', 'Teams that need a human owner for architecture and deployment'],
    deliverables: [
      { title: 'Code and architecture audit', description: 'Map the application, dependencies, data flows, duplicated logic, hidden assumptions, and highest-risk areas.' },
      { title: 'Security hardening', description: 'Review secrets, authentication, authorization, input validation, database policies, uploads, and exposed endpoints.' },
      { title: 'Bug fixing and stabilization', description: 'Trace recurring failures to their cause instead of stacking more prompts and patches on top.' },
      { title: 'Testing and observability', description: 'Add critical automated checks, error reporting, logging, and reproducible development workflows.' },
      { title: 'Feature development', description: 'Continue building with a consistent model, reusable components, validated server logic, and clear state handling.' },
      { title: 'Production deployment', description: 'Set up environments, domains, email, storage, payments, migrations, backups, and a maintainable release path.' },
    ],
    technology: ['Cursor', 'GitHub Copilot', 'Lovable', 'Bolt', 'Replit', 'Next.js', 'Supabase', 'PostgreSQL', 'Cloudflare'],
    faqs: [
      { question: 'Is vibe-coded software always insecure?', answer: 'No. Risk depends on the architecture, prompts, tools, review, and deployment. AI can produce useful code, but sensitive features still need explicit authorization, validation, secret handling, and testing.' },
      { question: 'Do you need to rewrite the whole project?', answer: 'Usually not. I first identify which parts are sound, which are merely messy, and which create real security or reliability risk. A targeted stabilization plan is often more sensible than a rewrite.' },
      { question: 'Can you work inside Cursor or another AI tool?', answer: 'Yes. AI can remain part of the workflow. The important change is adding architectural direction, review, version control, tests, and accountable technical decisions.' },
    ],
  },
};

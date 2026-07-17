# MD Pabel website rebuild strategy

## Positioning

MD Pabel is an independent WordPress security specialist. The site should earn
trust through first-hand case evidence, a transparent investigation process,
clear authorship, and practical guidance—not generic security claims.

## Search architecture

Each indexable page owns one primary intent. Closely related secondary terms are
covered on that page instead of creating thin keyword variations.

### Commercial pages

- `/services/` — service directory and decision page
- `/wordpress-malware-removal/` — WordPress malware removal service
- `/wordpress-maintenance/` — ongoing WordPress care, updates, backups, security,
  uptime, and performance
- `/blacklist-removal/` — website blacklist removal service hub
- `/google-blacklist-removal-service/` — Google Safe Browsing recovery
- `/mcafee-blacklist-removal/` — McAfee blacklist and WebAdvisor recovery
- `/avast-blacklist-removal/` — Avast blacklist recovery
- `/fake-captcha-malware-removal/` — fake CAPTCHA malware cleanup
- `/remove-japanese-seo-spam/` — Japanese keyword hack and SEO spam cleanup
- `/wordpress-error-fixing/` — WordPress error fixing hub and error index
- `/wordpress-critical-error-fix-service/` — focused critical error child page
- `/wordpress-500-internal-server-error-fix/` — focused HTTP 500 child page
- `/website-development/` — development hub for WordPress, Next.js, Astro, and
  AI-assisted/vibe-coded projects
- `/website-development/wordpress-development/` — WordPress development
- `/website-development/nextjs-development/` — Next.js development
- `/website-development/astro-development/` — Astro development
- `/website-development/ai-vibe-coding/` — production hardening and development
  for AI-assisted projects

### Trust and conversion pages

- `/about/` — expert profile, experience, methodology, and verifiable profiles
- `/case-studies/` — first-hand recovery evidence
- `/malware-log/` — technical field observations
- `/hire-me/` — contact and qualification
- `/free-wordpress-scan/` — malware scan lead tool
- `/free-wordpress-blacklist-scan/` — blacklist check lead tool

### Information hubs

- `/blog/` — practical WordPress security guidance
- `/guides/` — comprehensive task-oriented guides
- `/free-wordpress-security-course/` — structured learning hub
- `/fake-wordpress-plugins/` — threat research database

## On-page contract

Every indexable page must include:

1. A unique, intent-matched title, description, canonical, H1, and social image.
2. A concise answer or value proposition in the first visible section.
3. Clear authorship or provider identity linked to `/about/`.
4. First-hand proof where relevant: case metrics, screenshots, investigation
   notes, or a transparent methodology.
5. Contextual internal links to one parent hub, related supporting content, and
   one appropriate conversion page.
6. Breadcrumb markup and only schema that accurately matches visible content.
7. A visible updated/reviewed date for editorial content.

## Structured data contract

- Home: `WebSite`, `Person`, and `WebPage`
- About: `ProfilePage` with `Person` as `mainEntity`
- Service: `Service`, `WebPage`, and `BreadcrumbList`
- Article/guide: `Article` or `BlogPosting`, `Person`, and `BreadcrumbList`
- Case study: `Article` with first-hand author/provider attribution
- Course: `Course` only where the visible page represents the course
- FAQ: `FAQPage` only where all marked-up questions and answers are visible

Schema will describe the page; it will not be used to add unsupported ratings,
prices, locations, credentials, or claims.

## Migration rules

- Preserve useful existing URLs wherever possible.
- Use permanent redirects only when two old URLs are intentionally consolidated.
- Never redirect unrelated retired content to the homepage.
- Only canonical, indexable URLs belong in the sitemap.
- Keep the legacy implementation in `old/pages/` until the new route set has
  passed content, link, schema, and build validation.

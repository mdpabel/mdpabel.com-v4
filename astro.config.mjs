import { defineConfig } from 'astro/config';
import critters from 'astro-critters';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.mdpabel.com',
  // Add this integrations array
  integrations: [critters(), sitemap()],

  image: {
    domains: ['cms.mdpabel.com'],
  },
  vite: {
    plugins: [tailwindcss()],
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  build: {
    // Forces all project styles to be inlined into the HTML
    inlineStylesheets: 'always',
  },

  redirects: {
    '/bd/wordpress-malware-removal': {
      status: 301,
      destination: '/wordpress-malware-removal',
    },
    '/custom-website-development': {
      status: 301,
      destination: '/wordpress-malware-removal',
    },
    '/fix-wordpress-errors': {
      status: 301,
      destination: '/wordpress-malware-removal',
    },
    '/malware-removal-guides': {
      status: 301,
      destination: '/wordpress-malware-removal',
    },
    '/services': {
      status: 301,
      destination: '/wordpress-security-maintenance-service',
    },
    '/explore': {
      status: 301,
      destination: '/blog',
    },
    '/contact': {
      status: 301,
      destination: '/hire-me',
    },
    '/blacklist-removal-service': {
      status: 301,
      destination: '/blacklist-removal',
    },
    '/services/fix-website-errors': {
      status: 301,
      destination: '/wordpress-malware-removal',
    },
    '/services/wordpress-malware-removal': {
      status: 301,
      destination: '/wordpress-malware-removal',
    },
    '/refund-policy': {
      status: 301,
      destination: '/',
    },
    '/headless-wordpress-development': {
      status: 301,
      destination: '/',
    },
    '/terms': {
      status: 301,
      destination: '/',
    },
    '/privacy': {
      status: 301,
      destination: '/',
    },

    // --- CASE STUDIES REDIRECTS ---
    '/case-studies/wordpress-hacked-how-i-restored-my-site-after-everything-was-deleted':
      {
        status: 301,
        destination:
          '/case-studies/wordpress-hacked-how-i-restored-a-client-site-after-everything-was-deleted',
      },
    '/wordpress-malware-case-study-removing-hidden-executable-files-after-a-bluehost-account-suspension':
      {
        status: 301,
        destination: '/case-studies',
      },

    // --- BLOG REDIRECTS ---
    '/blog/ai-powered-wordpress-attacks-in-2025-how-hackers-are-outsmarting-plugins-and-what-to-do':
      {
        status: 301,
        destination: '/blog',
      },
    '/blog/how-hackers-hide-backdoors-wordpress-examples-detection/': {
      status: 301,
      destination: '/blog',
    },
    '/the-wp-security-phishing-plugin-analyzing-the-fake-wordpress-security-team-malware':
      {
        status: 301,
        destination: '/blog',
      },
    '/is-your-wordpress-site-showing-a-fake-im-not-a-robot-pop-up-you-have-the-hseo-malware':
      {
        status: 301,
        destination: '/blog',
      },
    '/how-we-removed-a-cloudflare-redirect-virus-massive-seo-spam-injection-from-a-hacked-wordpress-site':
      {
        status: 301,
        destination: '/blog',
      },

    // --- PATH CORRECTIONS (Moving to /blog/ folder) ---
    '/how-to-fix-the-wordpress-white-screen-of-death-caused-by-zeura-malware':
      '/blog/how-to-fix-the-wordpress-white-screen-of-death-caused-by-zeura-malware',
    '/hidden-backdoors-fake-plugins-how-hackers-live-in-your-wordpress-dashboard':
      '/blog/hidden-backdoors-fake-plugins-how-hackers-live-in-your-wordpress-dashboard',
    '/can-a-jpg-file-contain-malware-uncovering-the-fake-image-backdoor':
      '/blog/can-a-jpg-file-contain-malware-uncovering-the-fake-image-backdoor',
    '/found-suspicious-code-in-functions-php-the-ghost-admin-hack-explained':
      '/blog/found-suspicious-code-in-functions-php-the-ghost-admin-hack-explained',
    '/how-hackers-hide-backdoors-in-wordpress-real-examples-detection':
      '/blog/how-hackers-hide-backdoors-in-wordpress-real-examples-detection',
    '/wordpress-redirecting-to-play-and-learn-or-click-allow-check-your-theme-headers-now':
      '/blog/wordpress-redirecting-to-play-and-learn-or-click-allow-check-your-theme-headers-now',
    '/wordpress-pharma-hack-fix-how-to-stop-pharmaceutical-spam-in-google':
      '/blog/wordpress-pharma-hack-fix-how-to-stop-pharmaceutical-spam-in-google',
    '/the-complete-guide-to-javascript-redirect-malware-detection-decoding-and-removal':
      '/blog/the-complete-guide-to-javascript-redirect-malware-detection-decoding-and-removal',
    '/how-to-scan-and-clean-your-wordpress-database-for-hidden-malware':
      '/blog/how-to-scan-and-clean-your-wordpress-database-for-hidden-malware',
    '/how-to-remove-fetch-malware-from-wordpress-database-sengatanlebah-jasabacklink':
      '/blog/how-to-remove-fetch-malware-from-wordpress-database-sengatanlebah-jasabacklink',
    '/best-managed-wordpress-hosting-providers-for-speed-security-2':
      '/blog/best-managed-wordpress-hosting-providers-for-speed-security-2',
    '/case-study-cleaning-1162-infected-htaccess-files-on-bluehost-the-lockout-hack':
      '/blog/case-study-cleaning-1162-infected-htaccess-files-on-bluehost-the-lockout-hack',
  },
});

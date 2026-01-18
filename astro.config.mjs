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

  // build: {
  //   // Forces all project styles to be inlined into the HTML
  //   inlineStylesheets: 'always',
  // },
});

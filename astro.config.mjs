import { defineConfig } from 'astro/config';
import critters from 'astro-critters';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.mdpabel.com',
  // Add this integrations array
  integrations: [critters(), sitemap()],

  image: {
    domains: ['cms.mdpabel.com', 'leetcard.jacoblin.cool'],
  },
  vite: {
    plugins: [tailwindcss()],
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  build: {
    inlineStylesheets: 'auto',
  },
});

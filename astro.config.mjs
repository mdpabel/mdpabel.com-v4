import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import critters from 'astro-critters';

export default defineConfig({
  site: 'https://www.mdpabel.com',
  trailingSlash: 'ignore',
  // Add this integrations array
  integrations: [critters()],

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

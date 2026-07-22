import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import critters from "astro-critters";
import rehypeResearchEvidence from "./scripts/rehype-research-evidence.mjs";

export default defineConfig({
  site: "https://www.mdpabel.com",
  trailingSlash: "always",
  // Add this integrations array
  integrations: [critters()],

  markdown: {
    rehypePlugins: [rehypeResearchEvidence],
  },

  image: {
    domains: ["media.mdpabel.com", "cms.mdpabel.com", "leetcard.jacoblin.cool"],
  },
  vite: {
    plugins: [tailwindcss()],
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },

  build: {
    inlineStylesheets: "auto",
  },
});

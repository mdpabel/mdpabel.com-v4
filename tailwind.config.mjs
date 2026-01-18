import typography from '@tailwindcss/typography';
import defaultTheme from 'tailwindcss/defaultTheme'; // ✅ ADDED THIS IMPORT

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
      },
      fontFamily: {
        // This sets 'font-serif' to use Source Serif 4
        serif: ["'Source Serif 4 Variable'", ...defaultTheme.fontFamily.serif],
        // This keeps 'font-sans' as Inter (or system default)
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [typography],
};

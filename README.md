# MD Pabel

Astro website for MD Pabel's WordPress security, recovery, maintenance, and
development services.

## Commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local development server |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run sync` | Sync remote WordPress content to local content files |
| `npm run build:prod` | Sync content and build the production site |

## Active structure

- `src/pages/` contains the live routes.
- `src/components/new/` contains the current shared UI.
- `src/layouts/NewLayout.astro` is the current site layout.
- `src/data/newServices.ts` and `src/data/developmentServices.ts` contain the
  current service-page data.
- `src/lib/wordpress.ts` handles WordPress content access.
- `public/` contains deployment files, verification files, and assets used by
  the current site.

Legacy implementation files are retained under `old/` and are excluded from
the active Astro build.

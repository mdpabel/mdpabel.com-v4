import { copyFile, cp, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const serverDirectory = resolve(projectRoot, 'dist/server');
const hostingDirectory = resolve(projectRoot, 'dist/.openai');

await mkdir(serverDirectory, { recursive: true });
await mkdir(hostingDirectory, { recursive: true });

await copyFile(
  resolve(projectRoot, 'server/bookLeadHandler.js'),
  resolve(serverDirectory, 'bookLeadHandler.js'),
);

await writeFile(
  resolve(serverDirectory, 'index.js'),
  `import { handleBookLead } from './bookLeadHandler.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/book-leads') {
      return handleBookLead(request, env);
    }

    if (env?.ASSETS?.fetch) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Static asset binding unavailable', {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  },
};
`,
  'utf8',
);

await copyFile(
  resolve(projectRoot, '.openai/hosting.json'),
  resolve(hostingDirectory, 'hosting.json'),
);

await cp(
  resolve(projectRoot, 'drizzle'),
  resolve(hostingDirectory, 'drizzle'),
  { recursive: true },
);

console.log('Prepared Astro static output for Sites hosting.');

import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const serverDirectory = resolve(projectRoot, 'dist/server');
const hostingDirectory = resolve(projectRoot, 'dist/.openai');

await mkdir(serverDirectory, { recursive: true });
await mkdir(hostingDirectory, { recursive: true });

await writeFile(
  resolve(serverDirectory, 'index.js'),
  `export default {
  async fetch(request, env) {
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

console.log('Prepared Astro static output for Sites hosting.');

// Generates the static pages: index.html (English) and ar/index.html (Arabic).
// Usage: node build.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { copy, clinic, meta } from './src/content.mjs';
import { renderPage } from './src/template.mjs';

const root = dirname(fileURLToPath(import.meta.url));

const pages = [
  { lang: 'en', out: 'index.html', base: '', otherHref: 'ar/', otherLang: 'ar' },
  { lang: 'ar', out: 'ar/index.html', base: '../', otherHref: '../', otherLang: 'en' }
];

for (const p of pages) {
  const html = renderPage({ ...p, t: copy[p.lang], meta: meta[p.lang], clinic });
  const file = join(root, p.out);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log(`wrote ${p.out} (${(html.length / 1024).toFixed(1)} KB)`);
}

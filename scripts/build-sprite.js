/**
 * Собирает SVG-спрайт из файлов в src/assets/svg/
 * Запуск: npm run sprite
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const svgDir = path.resolve(__dirname, '../src/assets/svg');
const outputFile = path.resolve(svgDir, 'sprite.svg');

const files = fs
  .readdirSync(svgDir)
  .filter((f) => f.endsWith('.svg') && f !== 'sprite.svg');

if (files.length === 0) {
  console.log('Нет SVG-файлов для сборки.');
  process.exit(0);
}

const symbols = files.map((file) => {
  const name = path.basename(file, '.svg');
  const content = fs.readFileSync(path.join(svgDir, file), 'utf8');

  const viewBox = content.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 24 24';
  const inner = content
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .replace(/\s*xmlns(:\w+)?="[^"]*"/g, '')
    .trim();

  return `  <symbol id="${name}" viewBox="${viewBox}">\n    ${inner}\n  </symbol>`;
});

const sprite = [
  '<?xml version="1.0" encoding="utf-8"?>',
  '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">',
  ...symbols,
  '</svg>',
].join('\n');

fs.writeFileSync(outputFile, sprite, 'utf8');

console.log(`✓ Спрайт собран: ${files.length} иконок`);
files.forEach((f) => console.log(`  · ${path.basename(f, '.svg')}`));

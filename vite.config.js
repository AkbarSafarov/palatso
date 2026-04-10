import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import nunjucks from 'vite-plugin-nunjucks';
import nunjucksLib from 'nunjucks';

const templatesDir = path.resolve(__dirname, 'src/templates');
const pagesDir = path.resolve(__dirname, 'src/pages');

/**
 * При изменении любого .njk или .html файла шаблонов — полная перезагрузка страницы.
 */
function nunjucksHmrPlugin() {
  return {
    name: 'nunjucks-hmr',
    apply: 'serve',
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.njk')) {
        server.moduleGraph.invalidateAll();
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  };
}

/**
 * Встраивает SVG-спрайт сразу после <body> в каждый HTML-файл.
 * Работает и в dev-сервере, и в билде — без fetch, без JS.
 */
function inlineSvgSpritePlugin() {
  const spritePath = path.resolve(__dirname, 'src/assets/svg/sprite.svg');
  return {
    name: 'inline-svg-sprite',
    transformIndexHtml(html) {
      const sprite = fs.readFileSync(spritePath, 'utf-8')
        .replace(/fill="white"/g, 'fill="currentColor"')
        .replace(/<\?xml[^?]*\?>\s*/g, '');
      return html.replace('<body>', `<body>\n${sprite}`);
    },
  };
}

/**
 * Убирает атрибут crossorigin из тегов скриптов и стилей в билде,
 * чтобы файлы можно было открывать напрямую через file:// протокол.
 */
function removeCrossOriginPlugin() {
  return {
    name: 'remove-crossorigin',
    apply: 'build',
    transformIndexHtml(html) {
      return html
        .replace(/\s+crossorigin(?:="[^"]*")?/g, '')
        .replace(/\s+type="module"/g, '');
    },
  };
}

export default defineConfig({
  root: pagesDir,
  base: './',
  publicDir: path.resolve(__dirname, 'public'),
  plugins: [
    nunjucksHmrPlugin(),
    inlineSvgSpritePlugin(),
    nunjucks({
      templatesDir,
      nunjucksEnvironment: new nunjucksLib.Environment(
        new nunjucksLib.FileSystemLoader(templatesDir, { noCache: true }),
        { noCache: true }
      ),
    }),
    removeCrossOriginPlugin(),
  ],
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      input: {
        index: path.resolve(pagesDir, 'index.html'),
        catalog: path.resolve(pagesDir, 'catalog/index.html'),
        about: path.resolve(pagesDir, 'about/index.html'),
        '404': path.resolve(pagesDir, '404/index.html'),
      },
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      allow: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'public')],
    },
  },
});

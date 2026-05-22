import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import { remarkCustomBlocks } from './src/remark-custom-blocks.mjs';
import remarkOptimizeImages from './src/remark-optimize-images.mjs';
import remarkLazyImages from './src/remark-lazy-images.mjs';
import compress from 'astro-compress';

export default defineConfig({
  adapter: vercel(),
  integrations: [
    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          minifyCSS: true,
          minifyJS: true
        }
      },
      Image: {
        sharp: {
          // Compression WebP/AVIF
          webp: { quality: 80 },
          avif: { quality: 70 },
          jpeg: { quality: 80 },
          png: { compressionLevel: 9 }
        }
      },
      JavaScript: true,
      SVG: true,
      Logger: 1 // Affiche un résumé
    })
  ],
  site: 'https://musique-facile.fr',
  output: 'hybrid',

  // Optimisations d'images natives Astro
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    domains: ['musique-facile.fr'],
    formats: ['webp', 'avif']
  },

  markdown: {
    remarkPlugins: [remarkCustomBlocks, remarkOptimizeImages, remarkLazyImages],
  },

  // Optimisations de build
  build: {
    inlineStylesheets: 'always', // Inline TOUS les CSS pour eliminer le render-blocking
    assets: 'assets'
  },

  vite: {
    build: {
      // Minification optimale
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Retire les console.log en production
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.debug']
        }
      },
      // Note : on laisse Astro+Vite gérer le chunking et le naming par défaut.
      // Une config rollupOptions custom (entryFileNames + manualChunks « vendor »)
      // cassait le bundle SSR Vercel : le chunk vendor n'était pas inclus dans
      // .vercel/output/_functions, provoquant ERR_MODULE_NOT_FOUND au runtime
      // sur toutes les pages SSR (/guides/[slug], /merci-lead-magnet, /api/*).
      // Le cache-busting est déjà géré nativement par Vite via hashes.
      chunkSizeWarningLimit: 1000
    },
    // Optimisations CSS
    css: {
      devSourcemap: false
    }
  }
});
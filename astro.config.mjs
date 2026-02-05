import { defineConfig } from 'astro/config';
import { remarkCustomBlocks } from './src/remark-custom-blocks.mjs';
import remarkOptimizeImages from './src/remark-optimize-images.mjs';
import remarkLazyImages from './src/remark-lazy-images.mjs';
import compress from 'astro-compress';

export default defineConfig({
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
  output: 'static',

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
    inlineStylesheets: 'auto', // Inline les petits CSS pour réduire les requêtes
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
      rollupOptions: {
        output: {
          // Cache busting avec hashes
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
          // Code splitting optimisé
          manualChunks: (id) => {
            // Séparer les dépendances node_modules
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      },
      // Augmenter la limite de warning de taille
      chunkSizeWarningLimit: 1000
    },
    // Optimisations CSS
    css: {
      devSourcemap: false
    }
  },
  collections: {
    blog: {
      schema: {
        type: 'content',
        title: String,
        description: String,
        ogImage: String,
        prod: {
          type: 'string',
          default: 'Y'
        },
        multi: {
          type: 'string',
          default: 'N'
        },
        number: {
          type: 'string',
          optional: true
        },
        next: {
          type: 'string',
          optional: true
        },
        prev: {
          type: 'string',
          optional: true
        },
        author: String,
        datePublished: String,
        dateModified: String,
        introduction: String,
        videos: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: String,
              url: String
            }
          },
          optional: true
        },
        podcast: {
          type: 'object',
          properties: {
            title: String,
            url: String
          },
          optional: true
        },
        conclusion: String,
        relatedLinks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: String,
              url: String,
              description: String
            }
          },
          optional: true
        }
      }
    }
  }
});
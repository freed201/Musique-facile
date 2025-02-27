import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://musique-facile.fr',
  output: 'static',
  vite: {
    build: {
      rollupOptions: {
        output: {
          // Add hashes to filenames for cache busting
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      }
    }
  },
  collections: {
    blog: {
      schema: {
        type: 'content',
        title: String,
        description: String,
        ogImage: String,
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
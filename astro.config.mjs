import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://freed201.github.io', // Remplacez par votre nom d'utilisateur
  base: '/Musique-facile', // Nom de votre dépôt GitHub
});


import { defineConfig } from 'astro/config';

export default defineConfig({
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

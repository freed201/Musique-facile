/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module 'astro:content' {
  interface ContentCollectionConfig {
    blog: {
      type: 'content';
      schema: {
        title: string;
        description: string;
        ogImage: string;
        author: string;
        datePublished: string;
        dateModified: string;
        introduction: string;
        videos?: {
          title: string;
          url: string;
        }[];
        podcast?: {
          title: string;
          url: string;
        };
        conclusion: string;
        relatedLinks?: {
          title: string;
          url: string;
          description: string;
        }[];
      };
    };
  }
}
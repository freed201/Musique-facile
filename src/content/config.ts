import { defineCollection, z } from 'astro:content';

const coursesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    affichage: z.enum(['Y', 'N']).default('Y'),
    classement: z.number().min(1).max(3).default(3),
    // Données SEO de base
    title: z.string(),
    description: z.string(),
    ogImage: z.string(),
    bestSeller: z.boolean().optional(),
    theme: z.enum(['guitar', 'piano', 'ukulele', 'solfege']),
    datePublished: z.string(),
    dateModified: z.string(),

    // Données de la page
    hero: z.object({
      badge: z.string(),
      title: z.string(),
      subtitle: z.string(),
      cta: z.object({
        text: z.string(),
        price: z.string()
      }),
      video: z.object({
        url: z.string()
      }),
      stats: z.array(z.object({
        value: z.string(),
        label: z.string(),
        icon: z.string()
      })),
      imageBK: z.string()
    }),

    timeline: z.array(z.object({
      number: z.number(),
      title: z.string(),
      objective: z.string(),
      image: z.string(),
      imageAlt: z.string(),
      details: z.array(z.string())
    })),

    teachers: z.object({
      mainTeachers: z.array(z.object({
        firstName: z.string(),
        lastName: z.string(),
        subtitle: z.string(),
        description: z.string().max(100),
        photo: z.string(),
        website: z.string().optional()
      })).min(1).max(2),
      guests: z.array(z.object({
        name: z.string(),
        subtitle: z.string(),
        photo: z.string(),
        website: z.string().optional()
      })).max(4).optional()
    }),

    frustrations: z.object({
      title: z.string(),
      items: z.array(z.object({
        icon: z.string(),
        text: z.string()
      })),
      solution: z.string()
    }),

    valeurUnique: z.object({
      title: z.string(),
      description: z.string(),
      avantages: z.array(z.object({
        icon: z.string(),
        text: z.string()
      }))
    }),

    preuveSociale: z.object({
      testimonials: z.array(z.object({
        text: z.string(),
        author: z.string(),
        avatar: z.string()
      })),
      stats: z.object({
        students: z.string(),
        successRate: z.string(),
        timeframe: z.string()
      }),
      partners: z.array(z.object({
        name: z.string(),
        logo: z.string()
      }))
    }),

    benefices: z.object({
      title: z.string(),
      items: z.array(z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string()
      })),
      backgroundImage: z.string()
    }),

    cta: z.object({
      title: z.string(),
      subtitle: z.string(),
      buttonText: z.string(),
      buttonLink: z.string(),
      backgroundImage: z.string(),
      features: z.array(z.object({
        icon: z.string(),
        text: z.string()
      }))
    }),

    faq: z.object({
      title: z.string(),
      subtitle: z.string(),
      questions: z.array(z.object({
        question: z.string(),
        answer: z.string()
      })),
      backgroundPattern: z.string()
    })
  })
});

export const collections = {
  'courses': coursesCollection
};

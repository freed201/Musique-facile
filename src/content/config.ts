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

    // Données schema.org
    provider: z.object({
      name: z.string(),
      url: z.string(),
      logo: z.string()
    }),
    educationalLevel: z.array(z.string()).default(['Beginner']),
    courseMode: z.string().default(['Online']),
    audience: z.object({
      type: z.string(),
      audienceType: z.array(z.string())
    }),
    hasCourseInstance: z.object({
      duration: z.string(),
      offers: z.object({
        type: z.string(),
        priceCurrency: z.string(),
        price: z.string(),
        availability: z.string(),
        category: z.string()
      })
    }),

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
        id: z.string() // Changé de url à id
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
        logo: z.string(),
        buttonLink: z.string()
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

const livresCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    ogImage: z.string(),
    coverImage: z.string(),
    price: z.string(),
    author: z.string(),
    datePublished: z.string(),
    dateModified: z.string(),
    isbn: z.string().optional(),
    pages: z.number(),
    format: z.string(),
    language: z.string(),
    features: z.array(z.object({
      icon: z.string(),
      text: z.string()
    })),
    testimonials: z.array(z.object({
      text: z.string(),
      author: z.string(),
      role: z.string().optional()
    })),
    tableOfContents: z.array(z.object({
      title: z.string(),
      items: z.array(z.string())
    })),
    bonuses: z.array(z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string()
    })).optional(),
    buyLink: z.string(),
    preview: z.string().optional()
  })
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    meta: z.string().optional(),
    keywords: z.string().optional(),
    author: z.string(),
    publisher: z.string().optional(),
    publisherLogo: z.string().optional(),
    ogImage: z.string(),
    datePublished: z.string(),
    dateModified: z.string(),
    theme: z.enum(['guitar', 'piano', 'ukulele', 'solfege', 'general']).optional(),

    // Nouveaux champs pour maillage interne (Phase 3)
    tags: z.array(z.string()).default([]),
    category: z.enum(['débutant', 'intermédiaire', 'avancé', 'théorie', 'pratique', 'tutoriel', 'général']).optional(),
    level: z.enum(['débutant', 'intermédiaire', 'avancé', 'tous-niveaux']).default('tous-niveaux'),
    instrument: z.enum(['guitare', 'piano', 'ukulele', 'solfege', 'général']).optional(),

    schemaType: z.string().optional(),
    prod: z.enum(['Y', 'N']).optional(),
    multi: z.enum(['Y', 'N']).optional(),
    number: z.string().optional(),
    prev: z.string().optional(),
    next: z.string().optional(),
    introduction: z.string().optional(),
    conclusion: z.string().optional(),
    songInfo: z.object({
      inBook: z.boolean(),
      bookPage: z.number().optional(),
      tempo: z.number().optional(),
      chordCount: z.number().optional(),
      key: z.string().optional(),
      difficulty: z.string().optional()
    }).optional(),
    videos: z.array(z.object({
      title: z.string(),
      url: z.string()
    })).optional(),
    podcast: z.object({
      url: z.string()
    }).optional(),
    relatedLinks: z.array(z.object({
      title: z.string(),
      url: z.string()
    })).optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string()
    })).optional()
  })
});

export const collections = {
  'courses': coursesCollection,
  'livres': livresCollection,
  'blog': blogCollection
};

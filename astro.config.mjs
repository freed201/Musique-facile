import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import { remarkCustomBlocks } from './src/remark-custom-blocks.mjs';
import remarkOptimizeImages from './src/remark-optimize-images.mjs';
import remarkLazyImages from './src/remark-lazy-images.mjs';
import remarkAffiliateLinks from './src/remark-affiliate-links.mjs';
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

  // Redirections 301 internes (traduites en vraies redirections HTTP par
  // l'adapter Vercel). Migrées depuis public/_redirects (format Netlify,
  // ignoré par Vercel). ATTENTION : les destinations EXTERNES (https://...)
  // ne fonctionnent pas ici (Astro les traite en chemin relatif) — elles
  // vivent dans vercel.json > redirects.
  redirects: {
    '/stage2025': '/stage2026',

    // Anciennes pages
    '/maitriser-la-guitare': '/cours/cours-de-guitare',
    '/le-piano': '/cours/cours-de-piano',
    '/author/fred': '/blog',
    '/apprends-le-piano-facilement-cours-de-piano-en-ligne': '/cours/cours-de-piano',
    '/apprends-le-solfege-facilement-cours-de-solfege-en-ligne': '/cours/cours-de-solfege',
    '/apprends-la-guitare-facilement-cours-de-guitare-en-ligne-pour-debutants': '/cours/cours-de-guitare',

    // Anciens articles WordPress → blog
    '/307-across-the-universe-the-beatles': '/blog/tutoriel-across-the-universe-pour-debutants',
    '/205-back-to-black-amy-winehouse': '/blog/apprendre-back-to-black-guitare',
    '/15-clandestino-manu-chao': '/blog/jouer-clandestino-guitare-tutoriel',
    '/305-dont-stop-me-now-queen': '/blog/tutoriel-dont-stop-me-now-queen',
    '/309-fields-of-gold-sting': '/blog/jouer-fields-of-gold-sting',
    '/12-everybody-hurts-r-e-m': '/blog/tutoriel-everybody-hurts-facile',
    '/13-foule-sentimentale-alain-souchon': '/blog/tutoriel-foule-sentimentale-chanson',
    '/69-hallelujah-leonard-cohen': '/blog/jouer-hallelujah-jeff-buckley-guitare',
    '/05-hey-ya-outkast': '/blog/jouer-hey-ya-outkast-guitare',
    '/306-hey-jude-the-beatles': '/blog/apprendre-hey-jude-guitare',
    '/94-house-of-the-rising-sun-the-animals': '/blog/tutoriel-guitare-house-of-the-rising-sun',
    '/29-jveux-du-soleil-au-ptit-bonheur': '/blog/tutoriel-jveux-du-soleil-chanson-francaise',
    '/09-la-seine-vanessa-paradis-et-m': '/blog/jouer-la-seine-vanessa-m',
    '/312-les-copains-dabord-georges-brassens': '/blog/tutoriel-les-copains-dabord-guitare',
    '/302-lopportuniste-jacques-dutronc': '/blog/jouer-lopportuniste-dutronc-guitare',
    '/300-mr-jones-counting-crows': '/blog/apprendre-mr-jones-guitare',
    '/63-ironic-alanis-morissette': '/blog/apprendre-ironic-guitare',
    '/301-lucky-man-richard-ashcroft': '/blog/apprendre-lucky-man-guitare',
    '/54-machistador-m': '/blog/apprendre-machistador-guitare',
    '/303-more-than-words-extreme': '/blog/tutoriel-more-than-words-guitare',
    '/47-one-u2': '/blog/apprendre-one-guitare',
    '/201-perfect-ed-sheeran': '/blog/apprendre-perfect-guitare',
    '/18-partons-vite-kaolin': '/blog/apprendre-partons-vite-guitare',
    '/04-redemption-song-bob-marley': '/blog/apprendre-redemption-song-guitare',
    '/58-respire-mickey-3d': '/blog/apprendre-respire-guitare',
    '/304-riche-claudio-capeo': '/blog/apprendre-riche-guitare',
    '/45-smells-like-teen-spirit-nirvana': '/blog/apprendre-smells-like-teen-spirit-guitare',
    '/11-so-lonely-the-police': '/blog/apprendre-so-lonely-guitare',
    '/93-stand-by-me-ben-e-king': '/blog/apprendre-stand-by-me-guitare',
    '/310-sweet-dreams-are-made-of-this-eurythmics': '/blog/apprendre-sweet-dreams-guitare',
    '/51-un-autre-monde-telephone': '/blog/apprendre-un-autre-monde-guitare',
    '/76-une-belle-histoire-michel-fugain-et-le-big-bazar': '/blog/apprendre-une-belle-histoire-guitare',
    '/66-whats-up-4-non-blondes': '/blog/apprendre-whats-up-guitare',
    '/311-where-did-you-sleep-last-night-nirvana': '/blog/nirvana-where-did-you-sleep-guitare',
    '/35-where-is-my-mind-pixies': '/blog/apprendre-where-is-my-mind-guitare',
    '/62-wonderwall-oasis': '/blog/apprendre-wonderwall-guitare',
    '/68-wild-world-cat-stevens': '/blog/apprendre-wild-world-guitare',
    '/308-chasing-cars-snow-patrol': '/blog/apprendre-chasing-cars-guitare',
    '/apprendre-a-jouer-nous-on-sait-de-pierre-garnier': '/blog/nous-on-sait-guitare-tuto',

    // Archives & vestiges WordPress
    '/category/[...slug]': '/blog',
    '/tag/[...slug]': '/blog',
    '/archive/[...slug]': '/blog',
    '/page/[...slug]': '/blog',
    '/feed': '/blog',
    '/rss': '/blog',
    '/wp-content/uploads/[...slug]': '/images/[...slug]',
    '/wp-content/[...slug]': '/blog',
    '/wp-includes/[...slug]': '/',
    '/wp-admin': '/',
    '/wp-login.php': '/',
  },

  // Optimisations d'images natives Astro
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    domains: ['musique-facile.fr'],
    formats: ['webp', 'avif']
  },

  markdown: {
    remarkPlugins: [remarkCustomBlocks, remarkOptimizeImages, remarkLazyImages, remarkAffiliateLinks],
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
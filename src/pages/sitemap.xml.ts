import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import pageRevisions from '../data/page-revisions.json';

/**
 * Sitemap — https://musique-facile.fr/sitemap.xml
 *
 * RÈGLE SUR <lastmod>
 * Une date n'est publiée que si elle correspond à une modification réelle :
 *  - pages de collection  → `dateModified` du frontmatter, sinon `datePublished` ;
 *  - pages statiques      → date du dernier commit touchant le fichier de la page,
 *                           précalculée dans src/data/page-revisions.json
 *                           (`npm run seo:revisions`).
 * Quand aucune date fiable n'existe, l'URL sort **sans** <lastmod>. Une balise
 * absente vaut mieux qu'une date inventée : Google cesse de tenir compte des
 * lastmod d'un site qui les date tous du jour du déploiement.
 *
 * Ce qui a été retiré : une table `REVISIONS` de dates saisies à la main, qui
 * dérivait dès qu'on modifiait une page sans penser à la mettre à jour.
 */
export const GET: APIRoute = async () => {
  const now = new Date();

  const isPublishable = (data: Record<string, any>) => {
    if (Object.prototype.hasOwnProperty.call(data, 'prod') && data.prod !== 'Y') {
      return false;
    }
    if (Object.prototype.hasOwnProperty.call(data, 'affichage') && data.affichage !== 'Y') {
      return false;
    }
    if (Object.prototype.hasOwnProperty.call(data, 'datePublished')) {
      const publishDate = new Date(data.datePublished);
      if (Number.isNaN(publishDate.getTime())) return false;
      if (publishDate > now) return false;
    }
    return true;
  };

  const blogPosts = await getCollection('blog', ({ data }) => isPublishable(data));
  const courses = await getCollection('courses', ({ data }) => isPublishable(data));
  const programmes = await getCollection('programmes', ({ data }) => isPublishable(data));
  const ressources = await getCollection('ressources', ({ data }) => isPublishable(data));
  const livres = await getCollection('livres', ({ data }) => isPublishable(data));

  const baseUrl = 'https://musique-facile.fr';
  const revisions = pageRevisions.revisions as Record<string, string>;

  /** Normalise une date en ISO, ou renvoie null si elle est absente ou invalide. */
  const toISO = (date: unknown): string | null => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(String(date));
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  };

  /** Une entrée <url>. `lastmod` est omis quand la date n'est pas connue. */
  const entry = (path: string, changefreq: string, priority: string, lastmod: string | null) =>
    [
      '  <url>',
      `    <loc>${baseUrl}${path}</loc>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
      '  </url>',
    ].join('\n');

  /** Page statique : la date vient du fichier généré, ou rien. */
  const staticEntry = (path: string, changefreq: string, priority: string) =>
    entry(path, changefreq, priority, toISO(revisions[path]));

  /** Page de collection : `dateModified`, à défaut `datePublished`, à défaut rien. */
  const collectionEntry = (
    path: string,
    changefreq: string,
    priority: string,
    data: Record<string, any>,
  ) => entry(path, changefreq, priority, toISO(data.dateModified) ?? toISO(data.datePublished));

  const urls = [
    staticEntry('/', 'daily', '1.0'),
    staticEntry('/a-propos/', 'monthly', '0.9'),
    staticEntry('/auteur/fred-fieffe/', 'monthly', '0.8'),

    staticEntry('/cours/', 'weekly', '0.9'),
    staticEntry('/cours/cours-de-guitare/', 'weekly', '0.9'),
    staticEntry('/cours/cours-de-piano/', 'weekly', '0.9'),
    staticEntry('/cours/cours-de-ukulele/', 'weekly', '0.9'),
    staticEntry('/cours/cours-de-solfege/', 'weekly', '0.9'),

    staticEntry('/blog/', 'daily', '0.9'),
    ...blogPosts.map((post) =>
      collectionEntry(`/blog/${post.slug}/`, 'monthly', '0.7', post.data),
    ),

    ...courses.map((course) =>
      collectionEntry(`/cours/${course.slug}/`, 'monthly', '0.8', course.data),
    ),
    ...programmes.map((programme) =>
      collectionEntry(`/cours/programme/${programme.slug}/`, 'monthly', '0.8', programme.data),
    ),

    staticEntry('/ressources-gratuites/', 'weekly', '0.8'),
    staticEntry('/ressources-gratuites/guitare/', 'weekly', '0.7'),
    staticEntry('/ressources-gratuites/piano/', 'weekly', '0.7'),
    staticEntry('/ressources-gratuites/ukulele/', 'weekly', '0.7'),
    ...ressources.map((ressource) =>
      collectionEntry(`/ressources/${ressource.slug}/`, 'monthly', '0.7', ressource.data),
    ),

    staticEntry('/livres/', 'monthly', '0.8'),
    ...livres.map((livre) => collectionEntry(`/livres/${livre.slug}/`, 'monthly', '0.7', livre.data)),

    staticEntry('/contact/', 'yearly', '0.6'),
    staticEntry('/mentions-legales-cgv/', 'yearly', '0.3'),
    staticEntry('/politique-confidentialite/', 'yearly', '0.3'),

    staticEntry('/offre/', 'weekly', '0.9'),
    staticEntry('/5-accords-magiques/', 'monthly', '0.6'),
    staticEntry('/quel-instrument-choisir/', 'monthly', '0.6'),
    staticEntry('/faq/', 'monthly', '0.6'),
    staticEntry('/plan-du-site/', 'monthly', '0.4'),
    staticEntry('/liens/', 'monthly', '0.6'),
    staticEntry('/stage2026/', 'monthly', '0.7'),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600, s-maxage=3600',
    },
  });
};

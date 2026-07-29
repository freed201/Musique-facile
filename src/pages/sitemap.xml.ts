import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

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

  // Récupérer toutes les collections de contenu (filtrage strict)
  const blogPosts = await getCollection('blog', ({ data }) => isPublishable(data));
  const courses = await getCollection('courses', ({ data }) => isPublishable(data));
  const programmes = await getCollection('programmes', ({ data }) => isPublishable(data));
  const ressources = await getCollection('ressources', ({ data }) => isPublishable(data));
  const livres = await getCollection('livres', ({ data }) => isPublishable(data));

  const baseUrl = 'https://musique-facile.fr';

  // Fonction helper pour formater les dates
  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString();
  };

  /**
   * Dernière révision réelle des pages statiques (celles sans frontmatter).
   *
   * Ne PAS utiliser `new Date()` ici : le sitemap est généré au build, donc
   * chaque déploiement annoncerait à Google que toutes ces pages ont changé,
   * même quand elles n'ont pas bougé. Un sitemap qui date tout au jour du
   * build perd sa valeur de signal.
   *
   * Ces dates viennent du dernier commit touchant chaque page
   * (`git log -1 --format=%cs -- <fichier>`). À mettre à jour quand on
   * modifie réellement une de ces pages.
   */
  const REVISIONS: Record<string, string> = {
    accueil: '2026-07-16',
    aPropos: '2026-07-16',
    auteur: '2026-07-17',
    blogIndex: '2026-07-07',
    coursIndex: '2026-07-16',
    coursGuitare: '2026-07-16',
    coursPiano: '2026-07-16',
    coursUkulele: '2026-07-16',
    coursSolfege: '2026-07-16',
    ressourcesGratuites: '2026-07-16',
    livresIndex: '2026-07-16',
    contact: '2026-07-16',
    offre: '2026-07-10',
    faq: '2026-07-16',
    planDuSite: '2026-07-17',
    stage2026: '2026-07-10',
    cinqAccords: '2026-07-16',
    quelInstrument: '2026-07-17',
    mentionsLegales: '2026-04-10',
    confidentialite: '2026-04-10',
  };

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

  <!-- Page principale -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${formatDate(REVISIONS.accueil)}</lastmod>
  </url>

  <!-- À propos -->
  <url>
    <loc>${baseUrl}/a-propos/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <lastmod>${formatDate(REVISIONS.aPropos)}</lastmod>
  </url>

  <!-- Page auteur (E-E-A-T) -->
  <url>
    <loc>${baseUrl}/auteur/fred-fieffe/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <lastmod>${formatDate(REVISIONS.auteur)}</lastmod>
  </url>

  <!-- Pages de cours principales -->
  <url>
    <loc>${baseUrl}/cours/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <lastmod>${formatDate(REVISIONS.coursIndex)}</lastmod>
  </url>

  <url>
    <loc>${baseUrl}/cours/cours-de-guitare/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <lastmod>${formatDate(REVISIONS.coursGuitare)}</lastmod>
  </url>

  <url>
    <loc>${baseUrl}/cours/cours-de-piano/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <lastmod>${formatDate(REVISIONS.coursPiano)}</lastmod>
  </url>

  <url>
    <loc>${baseUrl}/cours/cours-de-ukulele/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <lastmod>${formatDate(REVISIONS.coursUkulele)}</lastmod>
  </url>

  <url>
    <loc>${baseUrl}/cours/cours-de-solfege/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <lastmod>${formatDate(REVISIONS.coursSolfege)}</lastmod>
  </url>

  <!-- Articles de blog -->
  ${blogPosts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}/</loc>
    <lastmod>${formatDate(post.data.dateModified || post.data.datePublished)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}

  <!-- Blog listing -->
  <url>
    <loc>${baseUrl}/blog/</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${formatDate(REVISIONS.blogIndex)}</lastmod>
  </url>

  <!-- Cours détaillés -->
  ${courses.map(course => `
  <url>
    <loc>${baseUrl}/cours/${course.slug}/</loc>
    <lastmod>${formatDate(course.data.dateModified || course.data.datePublished)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}

  <!-- Programmes -->
  ${programmes.map(programme => `
  <url>
    <loc>${baseUrl}/cours/programme/${programme.slug}/</loc>
    <lastmod>${formatDate(programme.data.dateModified || programme.data.datePublished)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}

  <!-- Ressources gratuites -->
  <url>
    <loc>${baseUrl}/ressources-gratuites/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${formatDate(REVISIONS.ressourcesGratuites)}</lastmod>
  </url>

  <url>
    <loc>${baseUrl}/ressources-gratuites/guitare/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${formatDate(REVISIONS.ressourcesGratuites)}</lastmod>
  </url>

  <url>
    <loc>${baseUrl}/ressources-gratuites/piano/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${formatDate(REVISIONS.ressourcesGratuites)}</lastmod>
  </url>

  <url>
    <loc>${baseUrl}/ressources-gratuites/ukulele/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${formatDate(REVISIONS.ressourcesGratuites)}</lastmod>
  </url>

  ${ressources.map(ressource => `
  <url>
    <loc>${baseUrl}/ressources/${ressource.slug}/</loc>
    <lastmod>${formatDate(ressource.data.dateModified || ressource.data.datePublished || REVISIONS.ressourcesGratuites)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}

  <!-- Livres -->
  <url>
    <loc>${baseUrl}/livres/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <lastmod>${formatDate(REVISIONS.livresIndex)}</lastmod>
  </url>

  ${livres.map(livre => `
  <url>
    <loc>${baseUrl}/livres/${livre.slug}/</loc>
    <lastmod>${formatDate(livre.data.dateModified || livre.data.datePublished || REVISIONS.livresIndex)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}

  <!-- Pages légales et contact -->
  <url>
    <loc>${baseUrl}/contact/</loc>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
    <lastmod>${formatDate(REVISIONS.contact)}</lastmod>
  </url>

  <url>
    <loc>${baseUrl}/mentions-legales-cgv/</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
    <lastmod>${formatDate(REVISIONS.mentionsLegales)}</lastmod>
  </url>

  <url>
    <loc>${baseUrl}/politique-confidentialite/</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
    <lastmod>${formatDate(REVISIONS.confidentialite)}</lastmod>
  </url>

  <!-- Pages marketing -->
  <url>
    <loc>${baseUrl}/offre/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <lastmod>${formatDate(REVISIONS.offre)}</lastmod>
  </url>

  <url>
    <loc>${baseUrl}/5-accords-magiques/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <lastmod>${formatDate(REVISIONS.cinqAccords)}</lastmod>
  </url>

  <url>
    <loc>${baseUrl}/quel-instrument-choisir/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <lastmod>${formatDate(REVISIONS.quelInstrument)}</lastmod>
  </url>

  <!-- FAQ -->
  <url>
    <loc>${baseUrl}/faq/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <lastmod>${formatDate(REVISIONS.faq)}</lastmod>
  </url>

  <!-- Plan du site -->
  <url>
    <loc>${baseUrl}/plan-du-site/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
    <lastmod>${formatDate(REVISIONS.planDuSite)}</lastmod>
  </url>

  <!-- Page hub « liens » (link in bio) -->
  <url>
    <loc>${baseUrl}/liens/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <lastmod>${formatDate(REVISIONS.accueil)}</lastmod>
  </url>

  <!-- Stage -->
  <url>
    <loc>${baseUrl}/stage2026/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>${formatDate(REVISIONS.stage2026)}</lastmod>
  </url>

</urlset>`;

  return new Response(sitemap.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600, s-maxage=3600'
    }
  });
};

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
    <lastmod>${formatDate(new Date())}</lastmod>
  </url>

  <!-- À propos -->
  <url>
    <loc>${baseUrl}/a-propos</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <lastmod>${formatDate(new Date())}</lastmod>
  </url>

  <!-- Pages de cours principales -->
  <url>
    <loc>${baseUrl}/cours</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <lastmod>${formatDate(new Date())}</lastmod>
  </url>

  <url>
    <loc>${baseUrl}/cours/cours-de-guitare</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${baseUrl}/cours/cours-de-piano</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${baseUrl}/cours/cours-de-ukulele</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${baseUrl}/cours/cours-de-solfege</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Articles de blog -->
  ${blogPosts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${formatDate(post.data.dateModified || post.data.datePublished)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}

  <!-- Blog listing -->
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${formatDate(new Date())}</lastmod>
  </url>

  <!-- Cours détaillés -->
  ${courses.map(course => `
  <url>
    <loc>${baseUrl}/cours/${course.slug}</loc>
    <lastmod>${formatDate(course.data.dateModified || course.data.datePublished)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}

  <!-- Programmes -->
  ${programmes.map(programme => `
  <url>
    <loc>${baseUrl}/cours/programme/${programme.slug}</loc>
    <lastmod>${formatDate(programme.data.dateModified || programme.data.datePublished)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}

  <!-- Ressources gratuites -->
  <url>
    <loc>${baseUrl}/ressources-gratuites</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/ressources-gratuites/guitare</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${baseUrl}/ressources-gratuites/piano</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${baseUrl}/ressources-gratuites/ukulele</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  ${ressources.map(ressource => `
  <url>
    <loc>${baseUrl}/ressources/${ressource.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}

  <!-- Livres -->
  <url>
    <loc>${baseUrl}/livres</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  ${livres.map(livre => `
  <url>
    <loc>${baseUrl}/livres/${livre.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}

  <!-- Pages légales et contact -->
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>${baseUrl}/mentions-legales-cgv</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <url>
    <loc>${baseUrl}/politique-confidentialite</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Pages marketing -->
  <url>
    <loc>${baseUrl}/5-accords-magiques</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>${baseUrl}/quel-instrument-choisir</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

</urlset>`;

  return new Response(sitemap.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600, s-maxage=3600'
    }
  });
};

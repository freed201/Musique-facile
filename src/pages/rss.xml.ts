import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

/**
 * Flux RSS du blog — /rss.xml
 *
 * Les 20 articles publiés les plus récents. « Publié » a le même sens que
 * partout ailleurs sur le site (cf. sitemap.xml.ts et blog/[slug].astro) :
 * `prod: "Y"` ET une date de publication qui n'est pas dans le futur.
 *
 * Cette route est prérendue au build (pas de `prerender = false`), elle sort
 * donc en fichier statique.
 */
export const GET: APIRoute = async (context) => {
  const site = context.site?.toString().replace(/\/$/, '') ?? 'https://musique-facile.fr';
  const now = new Date();

  const posts = (await getCollection('blog', ({ data }) => {
    if (data.prod !== 'Y') return false;
    const published = new Date(data.datePublished);
    return !Number.isNaN(published.getTime()) && published <= now;
  }))
    .sort(
      (a, b) =>
        new Date(b.data.datePublished).getTime() - new Date(a.data.datePublished).getTime(),
    )
    .slice(0, 20);

  return rss({
    title: 'Blog Musique Facile',
    description:
      "Apprendre la guitare, le piano, l'ukulélé et le solfège : tutoriels, méthodes et guides d'achat par Fred Fieffé.",
    site,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: `${site}/blog/${post.slug}/`,
      pubDate: new Date(post.data.datePublished),
      author: post.data.author,
      categories: post.data.tags,
    })),
    customData: '<language>fr-fr</language>',
  });
};

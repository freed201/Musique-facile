import { writeFileSync } from 'fs';
import { join } from 'path';

interface SitemapEntry {
  url: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  lastmod?: string;
}

function generateSitemap() {
  const baseUrl = 'https://musique-facile.fr';

  const staticPages: SitemapEntry[] = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/cours', changefreq: 'weekly', priority: 0.9 },
    { url: '/blog', changefreq: 'daily', priority: 0.8 },
    { url: '/contact', changefreq: 'monthly', priority: 0.7 },
    { url: '/mentions-legales-cgv', changefreq: 'monthly', priority: 0.5 }
  ];

  const instrumentPages: SitemapEntry[] = [
    { url: '/cours/cours-de-guitare', changefreq: 'weekly', priority: 0.9 },
    { url: '/cours/cours-de-piano', changefreq: 'weekly', priority: 0.9 },
    { url: '/cours/cours-de-ukulele', changefreq: 'weekly', priority: 0.9 },
    { url: '/cours/cours-de-solfege', changefreq: 'weekly', priority: 0.9 }
  ];

  const allPages = [...staticPages, ...instrumentPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

  writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
  console.log('Sitemap généré avec succès !');
}

generateSitemap();
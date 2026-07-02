#!/usr/bin/env node

/**
 * Script pour analyser les articles du blog et identifier
 * pourquoi certains ne s'affichent pas
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

const BLOG_DIR = './src/content/blog';

async function analyzeArticles() {
  const files = await readdir(BLOG_DIR);
  const markdownFiles = files.filter(f => f.endsWith('.md'));

  console.log(`📚 Total de fichiers markdown: ${markdownFiles.length}\n`);

  const currentDate = new Date();
  const results = {
    total: 0,
    visible: [],
    hiddenProdN: [],
    hiddenPrev: [],
    hiddenFuture: [],
    hiddenBoth: [],
    errors: []
  };

  for (const file of markdownFiles) {
    try {
      const filePath = join(BLOG_DIR, file);
      const content = await readFile(filePath, 'utf-8');
      const { data } = matter(content);

      results.total++;

      const isProdN = data.prod === 'N';
      const hasPrev = !!data.prev;
      const publishDate = data.datePublished ? new Date(data.datePublished) : null;
      const isFuture = publishDate && publishDate > currentDate;

      // Appliquer la même logique que index.astro
      let isHidden = false;
      let reason = [];

      if (isProdN) {
        reason.push('prod: N');
        isHidden = true;
      }
      if (isFuture) {
        reason.push('date future');
        isHidden = true;
      }
      if (hasPrev) {
        reason.push('prev field');
        isHidden = true;
      }

      const articleInfo = {
        file,
        prod: data.prod,
        prev: data.prev,
        datePublished: data.datePublished,
        title: data.title
      };

      if (isHidden) {
        if (isProdN && hasPrev) {
          results.hiddenBoth.push({ ...articleInfo, reason: reason.join(', ') });
        } else if (isProdN) {
          results.hiddenProdN.push({ ...articleInfo, reason: reason.join(', ') });
        } else if (hasPrev) {
          results.hiddenPrev.push({ ...articleInfo, reason: reason.join(', ') });
        } else if (isFuture) {
          results.hiddenFuture.push({ ...articleInfo, reason: reason.join(', ') });
        }
      } else {
        results.visible.push(articleInfo);
      }

    } catch (error) {
      results.errors.push({ file, error: error.message });
    }
  }

  // Afficher les résultats
  console.log('📊 RÉSULTATS DE L\'ANALYSE\n');
  console.log('='.repeat(60));
  console.log(`Total fichiers analysés:     ${results.total}`);
  console.log(`Articles VISIBLES:           ${results.visible.length} ✅`);
  console.log(`Cachés (prod: N):            ${results.hiddenProdN.length}`);
  console.log(`Cachés (prev):               ${results.hiddenPrev.length}`);
  console.log(`Cachés (date future):        ${results.hiddenFuture.length}`);
  console.log(`Cachés (prod: N + prev):     ${results.hiddenBoth.length}`);
  console.log(`Erreurs de parsing:          ${results.errors.length}`);
  console.log('='.repeat(60));

  const expectedVisible = results.total
    - results.hiddenProdN.length
    - results.hiddenPrev.length
    - results.hiddenFuture.length
    - results.hiddenBoth.length;

  console.log(`\n🧮 Calcul attendu:`);
  console.log(`   ${results.total} - ${results.hiddenProdN.length} - ${results.hiddenPrev.length} - ${results.hiddenFuture.length} - ${results.hiddenBoth.length} = ${expectedVisible}`);
  console.log(`   Visible réel: ${results.visible.length}`);

  if (expectedVisible !== results.visible.length) {
    console.log(`\n⚠️  ERREUR DE CALCUL: ${expectedVisible} attendu vs ${results.visible.length} réel`);
  }

  // Afficher les détails des articles cachés
  if (results.hiddenProdN.length > 0) {
    console.log(`\n📝 Articles cachés (prod: N):`);
    results.hiddenProdN.forEach(a => console.log(`   - ${a.file}`));
  }

  if (results.hiddenPrev.length > 0) {
    console.log(`\n🔗 Articles cachés (prev - série):`);
    results.hiddenPrev.forEach(a => console.log(`   - ${a.file} (prev: ${a.prev})`));
  }

  if (results.hiddenBoth.length > 0) {
    console.log(`\n🔒 Articles cachés (prod: N + prev):`);
    results.hiddenBoth.forEach(a => console.log(`   - ${a.file} (prev: ${a.prev})`));
  }

  if (results.hiddenFuture.length > 0) {
    console.log(`\n📅 Articles avec date future:`);
    results.hiddenFuture.forEach(a => console.log(`   - ${a.file} (${a.datePublished})`));
  }

  if (results.errors.length > 0) {
    console.log(`\n❌ Erreurs de parsing:`);
    results.errors.forEach(e => console.log(`   - ${e.file}: ${e.error}`));
  }

  // Sauvegarder un fichier détaillé
  const detailedReport = {
    date: new Date().toISOString(),
    summary: {
      total: results.total,
      visible: results.visible.length,
      hiddenProdN: results.hiddenProdN.length,
      hiddenPrev: results.hiddenPrev.length,
      hiddenFuture: results.hiddenFuture.length,
      hiddenBoth: results.hiddenBoth.length,
      errors: results.errors.length
    },
    visibleArticles: results.visible.map(a => a.file).sort(),
    hiddenArticles: {
      prodN: results.hiddenProdN.map(a => ({ file: a.file, title: a.title })),
      prev: results.hiddenPrev.map(a => ({ file: a.file, title: a.title, prev: a.prev })),
      both: results.hiddenBoth.map(a => ({ file: a.file, title: a.title, prev: a.prev })),
      future: results.hiddenFuture.map(a => ({ file: a.file, title: a.title, date: a.datePublished }))
    }
  };

  await mkdir('./seo-audit', { recursive: true });
  await writeFile(
    './seo-audit/BLOG-ARTICLES-ANALYSIS.json',
    JSON.stringify(detailedReport, null, 2)
  );

  console.log(`\n💾 Rapport détaillé sauvegardé: seo-audit/BLOG-ARTICLES-ANALYSIS.json\n`);
}

analyzeArticles().catch(console.error);

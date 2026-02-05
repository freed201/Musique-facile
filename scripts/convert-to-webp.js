/**
 * Script pour convertir les images JPG/PNG en WebP
 * Usage: node scripts/convert-to-webp.js
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public', 'images');

// Extensions à convertir
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// Configuration de conversion
const WEBP_CONFIG = {
  quality: 85,
  effort: 6, // 0-6, plus élevé = meilleure compression mais plus lent
};

/**
 * Récupère récursivement tous les fichiers d'un répertoire
 */
async function getAllFiles(dir, fileList = []) {
  try {
    const files = await readdir(dir);

    for (const file of files) {
      const filePath = join(dir, file);
      const fileStat = await stat(filePath);

      if (fileStat.isDirectory()) {
        await getAllFiles(filePath, fileList);
      } else {
        fileList.push(filePath);
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la lecture du répertoire ${dir}:`, error.message);
  }

  return fileList;
}

/**
 * Convertit une image en WebP
 */
async function convertToWebP(inputPath) {
  try {
    const ext = extname(inputPath).toLowerCase();

    if (!IMAGE_EXTENSIONS.includes(ext)) {
      return;
    }

    // Ne pas reconvertir si le fichier WebP existe déjà
    const outputPath = inputPath.replace(ext, '.webp');

    try {
      await stat(outputPath);
      console.log(`⏭️  Déjà converti: ${basename(inputPath)}`);
      return;
    } catch {
      // Le fichier n'existe pas, on continue
    }

    // Convertir l'image
    await sharp(inputPath)
      .webp(WEBP_CONFIG)
      .toFile(outputPath);

    // Obtenir les tailles pour comparaison
    const inputStat = await stat(inputPath);
    const outputStat = await stat(outputPath);
    const reduction = ((1 - outputStat.size / inputStat.size) * 100).toFixed(1);

    console.log(`✅ ${basename(inputPath)} → ${basename(outputPath)} (-${reduction}%)`);
  } catch (error) {
    console.error(`❌ Erreur lors de la conversion de ${basename(inputPath)}:`, error.message);
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Début de la conversion des images en WebP...\n');
  console.log(`📁 Répertoire: ${publicDir}\n`);

  try {
    const allFiles = await getAllFiles(publicDir);
    const imageFiles = allFiles.filter(file =>
      IMAGE_EXTENSIONS.includes(extname(file).toLowerCase())
    );

    if (imageFiles.length === 0) {
      console.log('ℹ️  Aucune image à convertir trouvée.');
      return;
    }

    console.log(`📸 ${imageFiles.length} image(s) trouvée(s)\n`);

    let converted = 0;
    for (const file of imageFiles) {
      await convertToWebP(file);
      converted++;
    }

    console.log(`\n✨ Conversion terminée ! ${converted} image(s) traitée(s).`);
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
}

// Exécuter le script
main();

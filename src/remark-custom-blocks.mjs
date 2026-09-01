import { visit } from 'unist-util-visit';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { secureExternalLinks } from './utils/external-link-rel.mjs';

// Regex pour détecter les blocs personnalisés
const CUSTOM_BLOCK_REGEX = /^::: ?(info|tip|warning|section-colored)(?: ?\{([^}]*)\})?\s*$/;

// Fonction pour convertir le Markdown en HTML
async function markdownToHtml(markdown) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  // Ce pipeline est indépendant de celui des articles : les liens qu'il produit
  // n'ont pas été vus par remark-affiliate-links. On leur applique la même règle.
  return secureExternalLinks(String(result));
}

/**
 * Reconstruit le Markdown d'un nœud inline.
 *
 * L'ancienne version lisait `child.value`, qui n'existe QUE sur les nœuds
 * `text`. Un lien, du gras, de l'italique ou du code inline n'ont pas de
 * `value` mais des `children` : leur texte disparaissait purement et
 * simplement du bloc rendu. Un « [Czerny](https://fr.wikipedia.org/…) » écrit
 * dans un bloc ::: info sortait en « études de  ou les exercices de  ».
 *
 * Le contenu du bloc étant ensuite repassé par markdownToHtml(), il suffit de
 * restituer le Markdown d'origine pour que tout soit rendu correctement.
 */
function inlineToMarkdown(node) {
  if (node == null) return '';
  switch (node.type) {
    case 'text':
      return node.value ?? '';
    case 'inlineCode':
      return '`' + (node.value ?? '') + '`';
    case 'strong':
      return '**' + (node.children ?? []).map(inlineToMarkdown).join('') + '**';
    case 'emphasis':
      return '*' + (node.children ?? []).map(inlineToMarkdown).join('') + '*';
    case 'delete':
      return '~~' + (node.children ?? []).map(inlineToMarkdown).join('') + '~~';
    case 'link': {
      const label = (node.children ?? []).map(inlineToMarkdown).join('');
      const title = node.title ? ` "${node.title}"` : '';
      return `[${label}](${node.url}${title})`;
    }
    case 'image':
      return `![${node.alt ?? ''}](${node.url})`;
    case 'break':
      return '  \n';
    case 'html':
      return node.value ?? '';
    default:
      // paragraphe ou conteneur inconnu : on descend dans ses enfants
      return (node.children ?? []).map(inlineToMarkdown).join('') || (node.value ?? '');
  }
}

export function remarkCustomBlocks() {
  return async (tree) => {
    const newChildren = [];
    let currentBlock = null;
    let currentContent = [];

    for (const node of tree.children) {
      if (node.type === 'paragraph' && node.children?.[0]?.type === 'text') {
        const text = node.children[0].value.trim();
        const match = text.match(CUSTOM_BLOCK_REGEX);
        
        if (match) {
          // Si on trouve un début de bloc
          if (!currentBlock) {
            currentBlock = {
              type: match[1],
              attrs: match[2] || ''
            };
          }
          continue;
        }
        
        // Détection de la fin d'un bloc
        if (text === ':::' && currentBlock) {
          const content = await markdownToHtml(currentContent.join('\n\n'));
          const attrs = currentBlock.attrs || '';
          const attrsObj = {};
          
          // Parse les attributs
          if (attrs) {
            const attrMatches = attrs.match(/(\w+)="([^"]*)"|\{([^}]*)\}/g);
            if (attrMatches) {
              attrMatches.forEach(attr => {
                if (attr.startsWith('{')) {
                  // Gestion du background pour section-colored
                  attrsObj.background = attr.slice(1, -1);
                } else {
                  const [key, value] = attr.split('=');
                  if (key && value) {
                    attrsObj[key] = value.replace(/['"]/g, '');
                  }
                }
              });
            }
          }

          // Génération de la classe et du style
          const className = currentBlock.type === 'section-colored' 
            ? 'section-colored' 
            : `${currentBlock.type}-box`;
          
          const style = attrsObj.background 
            ? ` style="background-color: ${attrsObj.background};"` 
            : '';

          // Création du HTML
          newChildren.push({
            type: 'html',
            value: `<div class="${className}"${style}>\n${content}\n</div>`
          });

          currentBlock = null;
          currentContent = [];
          continue;
        }
      }

      if (currentBlock) {
        // Ajouter le contenu au bloc courant
        if (node.type === 'paragraph') {
          currentContent.push(inlineToMarkdown(node));
        } else {
          currentContent.push(node.value || '');
        }
      } else {
        newChildren.push(node);
      }
    }

    tree.children = newChildren;
  };
}
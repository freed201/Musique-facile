/**
 * theme.ts — de quel univers relève une page ?
 *
 * Depuis le 2026-09-06, le header prend la couleur de l'instrument : il lui
 * faut donc connaître l'univers dès le rendu, sans JavaScript et sans clignoter.
 * Les layouts posent la classe `theme-*` sur <body> ; le header, qui est un
 * enfant du body, hérite alors de --header-bg.
 *
 * L'univers vient de la prop `theme` quand la page en a une (fiches cours,
 * articles), sinon de l'adresse : /cours/cours-de-guitare/, /blog/guitare/,
 * /blog/apprendre-wonderwall-guitare/ relèvent tous de la guitare.
 */
export type Univers = 'guitar' | 'piano' | 'ukulele' | 'solfege';

const MOTS: [RegExp, Univers][] = [
  [/guitar/i, 'guitar'],
  [/piano/i, 'piano'],
  [/ukulele|ukulélé/i, 'ukulele'],
  [/solfege|solfège|lecture-de-notes|quintes|rythmes/i, 'solfege'],
];

export function universDeLUrl(pathname: string): Univers | undefined {
  for (const [re, u] of MOTS) if (re.test(pathname)) return u;
  return undefined;
}

const UNIVERS: Univers[] = ['guitar', 'piano', 'ukulele', 'solfege'];

/**
 * La classe à poser sur <body>. Un thème non reconnu (les articles passent
 * « main » par défaut) est ignoré au profit de l'adresse : un tuto Wonderwall
 * vit dans l'univers guitare même si son frontmatter ne le dit pas.
 */
export function classeUnivers(theme: string | undefined, pathname: string): string | undefined {
  const u = (UNIVERS.includes(theme as Univers) ? (theme as Univers) : undefined) ?? universDeLUrl(pathname);
  return u ? `theme-${u}` : undefined;
}

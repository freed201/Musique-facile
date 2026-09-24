/**
 * src/data/catalogue.ts — l'échelle des formations, pour la home.
 *
 * Les 18 fiches (src/content/courses) portent leurs chiffres (élèves, leçons,
 * durée, prix, note) : la home les lit au build avec getCollection. Ce qui
 * n'est PAS dans les fiches, et qu'il faut pour orienter un acheteur en trois
 * secondes, est ici : sur quel barreau de l'échelle se place chaque cours, un
 * titre court, et « pour qui » en une phrase. Les niveaux `educationalLevel`
 * des fiches sont trop lâches (« Beginner, Intermediate, Advanced » sur la
 * moitié des cours) pour servir tels quels.
 *
 * BROUILLON à valider par Fred : ces trois lignes par cours sont ses mots.
 * Modèle : l'échelle de grades de JustinGuitar, avec sa question d'entrée
 * « où en êtes-vous ? » qui place l'élève sur le bon barreau.
 */

export type Rung = 1 | 2 | 3;

export const RUNGS: Record<Rung, string> = {
  1: 'Je débute',
  2: 'Je joue un peu',
  3: 'Je joue déjà',
};

export interface CatalogueEntry {
  /** Barreau de l'échelle : 1 débutant, 2 je joue un peu, 3 je joue déjà. */
  rung: Rung;
  /** Titre court, tel qu'on le dirait à l'oral. */
  short: string;
  /** Pour qui, en une phrase. */
  who: string;
}

export const catalogue: Record<string, CatalogueEntry> = {
  /* Guitare */
  'apprendre-guitare-debutant': { rung: 1, short: 'Guitare débutant', who: "Vous n'avez jamais tenu une guitare, ou vous avez lâché il y a longtemps." },
  'apprendre-guitare-shuffle': { rung: 2, short: 'Le shuffle à la guitare', who: 'Vos accords sont là, vous voulez du groove.' },
  'apprendre-piano-facile-guitaristes': { rung: 2, short: 'Le piano pour guitaristes', who: 'Vous jouez de la guitare et vous voulez passer au clavier sans repartir de zéro.' },
  'maitrise-technique-guitare-avancee': { rung: 3, short: 'Guitare Odyssée, 52 semaines', who: 'Un an de progression guidée, pour qui joue déjà.' },

  /* Piano */
  'piano-facile-apprendre-debutant': { rung: 1, short: 'Piano débutant', who: 'Vous rêvez de piano, mais le solfège vous a toujours arrêté à la porte.' },
  'apprendre-les-accords-piano': { rung: 2, short: 'Les accords au piano', who: 'Jouer n’importe quel accord, de la triade au renversement.' },
  'ameliorer-oreille-piano': { rung: 2, short: "L'oreille au piano", who: 'Reconnaître ce que vous entendez, pour jouer sans partition.' },
  'apprendre-piano-shuffle': { rung: 2, short: 'Le shuffle au piano', who: 'Le groove blues, pour qui joue déjà un peu.' },
  'cours-exercices-techniques-piano': { rung: 2, short: 'Technique : cinq exercices clés', who: 'Délier les doigts, quel que soit votre niveau.' },
  'piano-force-agilite': { rung: 3, short: 'Force et finesse', who: 'Jouer avec nuance, pour qui joue déjà.' },
  'maitrise-technique-piano-avancee': { rung: 3, short: 'Piano Odyssée, 52 semaines', who: 'Un an de perfectionnement, avec des musiciens invités.' },

  /* Ukulélé */
  'apprendre-ukulele-debutant': { rung: 1, short: 'Ukulélé débutant', who: "L'instrument le plus simple pour commencer, et la première chanson en trois semaines." },
  'apprendre-la-rythmique-ukulele-facilement': { rung: 2, short: 'La rythmique au ukulélé', who: 'Vos accords sont là, la main droite hésite encore.' },
  'apprendre-ukulele-shuffle': { rung: 2, short: 'Le shuffle au ukulélé', who: 'Le groove, pour qui enchaîne déjà ses accords.' },

  /* Solfège */
  'lecture-de-notes-niveau-debutant': { rung: 1, short: 'Lire les notes', who: 'Vous jouez peut-être déjà, mais une partition reste un mur.' },
  'cours-solfege-rythmes': { rung: 2, short: 'Lire les rythmes', who: 'Vous lisez les notes, pas encore les durées.' },
  'comprendre-cycle-des-quintes': { rung: 2, short: 'Le cycle des quintes', who: 'Comprendre les tonalités, et les accords qui vont ensemble.' },
  'solfege-expert-formation': { rung: 3, short: 'Solfège avancé', who: 'Pour qui lit déjà et veut aller au bout.' },
};

/** Les Packs de /offre/ : quels cours ils contiennent (slugs des fiches). */
export const packOf: Record<string, string[]> = {
  guitar: ['apprendre-guitare-debutant', 'maitrise-technique-guitare-avancee', 'apprendre-guitare-shuffle'],
  ukulele: ['apprendre-ukulele-debutant', 'apprendre-la-rythmique-ukulele-facilement', 'apprendre-ukulele-shuffle'],
  piano: ['piano-facile-apprendre-debutant', 'lecture-de-notes-niveau-debutant'],
  solfege: [],
};

/** « PT3H30M » → « 3 h 30 ». */
export function humanDuration(iso: string): string {
  const m = /PT(?:(\d+)H)?(?:(\d+)M?)?/.exec(iso);
  if (!m) return '';
  const h = m[1] ? Number(m[1]) : 0;
  const min = m[2] ? Number(m[2]) : 0;
  if (h && min) return `${h} h ${String(min).padStart(2, '0')}`;
  if (h) return `${h} h`;
  return `${min} min`;
}

/** Le chiffre « leçons / chapitres / vidéos » et le chiffre « élèves » des stats du hero. */
export function pickStats(stats: { value: string; label: string }[]) {
  const lessons = stats.find((s) => /leçon|chapitre|vidéo|semaine|exercice/i.test(s.label));
  const students = stats.find((s) => /élèves|guitaristes/i.test(s.label));
  return {
    lessons: lessons ? `${lessons.value.replace('+', '')} ${lessons.label.toLowerCase().replace(/^de /, '')}` : '',
    students: students ? `${students.value.replace('.', ' ')} élèves` : '',
  };
}

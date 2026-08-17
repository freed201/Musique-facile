/**
 * Traduit les emojis du frontmatter des fiches cours vers les noms d'icônes
 * SVG de `src/components/Icon.astro`.
 *
 * Les 18 fiches `src/content/courses/*.md` stockent leurs pictogrammes sous
 * forme d'emojis (`icon: "🎸"`). Rendus tels quels, ils dépendent de la police
 * système : rendu différent sur macOS, Windows et Android, et incohérents avec
 * les sections déjà passées au SVG. Ce mapping les convertit à l'affichage,
 * sans toucher au contenu.
 *
 * Un emoji non répertorié retourne `null` : l'appelant retombe alors sur
 * l'emoji d'origine plutôt que d'afficher un trou.
 */
const EMOJI_TO_ICON: Record<string, string> = {
  // Instruments
  '🎸': 'guitar',
  '🎹': 'piano',
  '🪕': 'ukulele',
  '🎻': 'guitar',

  // Musique
  '🎵': 'note',
  '🎶': 'note',
  '🎼': 'notes-double',
  '🎤': 'mic',
  '🎧': 'mic',

  // Progression, objectifs
  '🎯': 'target',
  // Version contour : dans les fiches, les pictogrammes sont tous en trait.
  // L'étoile pleine (`star`) reste réservée aux notations.
  '⭐': 'star-outline',
  '🌟': 'star-outline',
  '🏆': 'trophy',
  '🚀': 'rocket',
  '💪': 'muscle',
  '✨': 'sparkles',
  '🔥': 'fire',
  '⚡': 'lightning',
  '💡': 'lightbulb',

  // Contenu, supports
  '📚': 'books',
  '📖': 'book',
  '📘': 'book',
  '🎥': 'video',
  '📹': 'video',
  '🎬': 'video',
  '🎓': 'graduation',
  '📝': 'pencil',
  '📅': 'calendar',
  '📱': 'smartphone',
  '⬇️': 'download',

  // Temps
  '⏰': 'clock',
  '🕐': 'clock',
  '⌛': 'hourglass',
  '⏳': 'hourglass',

  // Personnes
  '👥': 'users',
  '👤': 'users',
  '👨‍🎓': 'user-graduate',

  // Ressentis, garanties
  '😕': 'frown',
  '😟': 'frown',
  '😰': 'frown',
  '💰': 'coin',
  '💳': 'credit-card',
  '🔒': 'lock',
  '🛡️': 'check-circle',
  '🎁': 'gift',
  '✅': 'check-circle',
  '✔️': 'check',
  '❓': 'question',
  '🏠': 'home',
  '🌊': 'wave',
  '🏖️': 'beach',
  '↩️': 'undo',
  '📧': 'email',
  '✉️': 'email',
};

/**
 * Retourne le nom d'icône SVG correspondant à un emoji, ou `null` si l'emoji
 * n'est pas répertorié (l'appelant affiche alors l'emoji d'origine).
 *
 * Accepte aussi un nom d'icône déjà valide, qui est renvoyé tel quel : une
 * fiche peut ainsi écrire `icon: "guitar"` sans passer par un emoji.
 */
export function emojiToIcon(value: string | undefined | null): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const mapped = EMOJI_TO_ICON[trimmed];
  if (mapped) return mapped;

  // Déjà un nom d'icône (pas d'emoji) : on le laisse passer.
  if (/^[a-z][a-z-]*$/.test(trimmed)) return trimmed;

  // Certains emojis arrivent avec un sélecteur de variante U+FE0F.
  const withoutVariation = trimmed.replace(/️/g, '');
  return EMOJI_TO_ICON[withoutVariation] ?? null;
}

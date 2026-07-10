/**
 * Templates d'emails transactionnels J0 (livraison du lead magnet PDF).
 *
 * Appelés depuis /api/subscribe quand le payload contient un leadMagnet valide.
 * Pour les emails de séquence (J+1, J+3, J+7), voir docs/EMAIL_SEQUENCES.md
 * et configurer dans Brevo Marketing Automation.
 */

export interface LeadMagnetEmailMeta {
  /** Sujet de l'email J0 */
  subject: string;
  /** Génère le HTML complet de l'email (inline styles pour compat email clients) */
  html: (ctx: { firstName?: string; baseUrl: string }) => string;
}

const baseStyle = `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;line-height:1.55;color:#1a1a2e`;
const wrapStyle = `max-width:600px;margin:0 auto;padding:24px;background:#ffffff`;
const btnStyle = (bg: string) =>
  `display:inline-block;padding:14px 28px;background:${bg};color:#ffffff;font-weight:600;font-size:16px;text-decoration:none;border-radius:8px;margin:8px 0`;
const footerStyle = `font-size:13px;color:#888;line-height:1.5;border-top:1px solid #eee;padding-top:16px;margin-top:32px`;

const greeting = (firstName?: string) => (firstName ? `Salut ${firstName},` : 'Salut,');

export const leadMagnetEmails: Record<string, LeadMagnetEmailMeta> = {
  'guitare-5-accords-magiques': {
    subject: '🎸 Ton guide « 5 Accords Magiques » est là',
    html: ({ firstName, baseUrl }) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Ton guide guitare</title></head>
<body style="margin:0;background:#f8f9fc;${baseStyle}">
  <div style="${wrapStyle}">
    <p style="font-size:18px;margin:0 0 16px">${greeting(firstName)}</p>

    <p>Bienvenue dans l'aventure Musique Facile. Tu viens de débloquer un raccourci pédagogique qui m'a pris 12 ans à formaliser : <strong>5 accords ouverts + 1 rythmique universelle = 100 chansons jouables</strong>.</p>

    <p>Pas de théorie. Pas de solfège. Tu joues, c'est tout.</p>

    <p style="text-align:center;margin:32px 0">
      <a href="${baseUrl}/lead-magnets/guitare-5-accords-magiques.pdf" style="${btnStyle('#2E7D32')}">📥 Télécharger le guide PDF</a>
    </p>

    <p><strong>Mon conseil pour les 24 prochaines heures :</strong></p>
    <ol style="padding-left:20px">
      <li>Imprime la carte de poche (dernière page) et colle-la sur ton mur ou ton manche</li>
      <li>Travaille seulement <strong>Em → G</strong> ce soir, 5 minutes, en boucle</li>
      <li>Demain : ajoute D. Le surlendemain : C. Le 4ᵉ jour : Am</li>
    </ol>

    <p>En une semaine, tu auras les 5 accords. C'est promis.</p>

    <p>Si tu as la moindre question, réponds à cet email — je lis tout.</p>

    <p style="margin-top:24px">— Fred Fieffé<br>
    <em style="font-size:14px;color:#666">Auteur Hal Leonard · Spectacle primé Samuel Paty 2024 · 80 000+ élèves</em></p>

    <div style="${footerStyle}">
      Tu reçois cet email parce que tu as demandé le guide « Les 5 Accords Magiques » sur musique-facile.fr.<br>
      Pour te désinscrire en 1 clic : <a href="{{unsubscribe}}" style="color:#666">cliquer ici</a>.
    </div>
  </div>
</body></html>`,
  },

  'piano-lire-les-notes': {
    subject: '🎹 Ton guide « Lire les notes au piano » est là',
    html: ({ firstName, baseUrl }) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Ton guide piano</title></head>
<body style="margin:0;background:#f8f9fc;${baseStyle}">
  <div style="${wrapStyle}">
    <p style="font-size:18px;margin:0 0 16px">${greeting(firstName)}</p>

    <p>Bienvenue. Tu viens de prendre la décision qui change tout : <strong>arrêter de subir le solfège et apprendre à le lire</strong>.</p>

    <p>Dans ce guide, j'ai concentré 15 ans d'enseignement en 5 astuces. Pas de FACE, pas de méthode rébarbative. Des repères que tu vas retenir <strong>vraiment</strong>.</p>

    <p style="text-align:center;margin:32px 0">
      <a href="${baseUrl}/lead-magnets/piano-lire-les-notes.pdf" style="${btnStyle('#1565C0')}">📥 Télécharger le guide PDF</a>
    </p>

    <p><strong>Mon conseil pour les 7 prochains jours :</strong></p>
    <ol style="padding-left:20px">
      <li>Aujourd'hui : récite la gamme Do-Ré-Mi-Fa-Sol-La-Si-Do dans les 2 sens, 30 secondes, 3 fois</li>
      <li>Jour 2 : apprends les 4 repères de la clé de sol (les 2 Do, les 2 Sol)</li>
      <li>Jour 3 : même chose pour la clé de fa (Do et Fa)</li>
      <li>Jour 4 à 7 : 10 minutes de déchiffrage facile, tous les jours</li>
    </ol>

    <p>En 21 jours, tu déchiffres une chanson sans t'arrêter. C'est un engagement.</p>

    <p>Une question ? Réponds à cet email — je lis tout.</p>

    <p style="margin-top:24px">— Fred Fieffé<br>
    <em style="font-size:14px;color:#666">Auteur Hal Leonard · Spectacle primé Samuel Paty 2024 · 80 000+ élèves</em></p>

    <div style="${footerStyle}">
      Tu reçois cet email parce que tu as demandé le guide « Lire les notes au piano » sur musique-facile.fr.<br>
      Pour te désinscrire en 1 clic : <a href="{{unsubscribe}}" style="color:#666">cliquer ici</a>.
    </div>
  </div>
</body></html>`,
  },

  'ukulele-4-accords': {
    subject: '🌺 Ton guide « 4 Accords du Ukulélé » est là',
    html: ({ firstName, baseUrl }) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Ton guide ukulélé</title></head>
<body style="margin:0;background:#f8f9fc;${baseStyle}">
  <div style="${wrapStyle}">
    <p style="font-size:18px;margin:0 0 16px">${greeting(firstName)}</p>

    <p>Bravo. Le ukulélé est l'instrument le plus rapide à prendre en main au monde. Avec 4 accords et un peu d'envie, tu joues tes premières chansons dès ce soir.</p>

    <p>Le guide est dans le PDF ci-dessous : diagrammes clairs, rythmique pop universelle, et un cycle de chansons à jouer en boucle.</p>

    <p style="text-align:center;margin:32px 0">
      <a href="${baseUrl}/lead-magnets/ukulele-4-accords.pdf" style="${btnStyle('#EA580C')}">📥 Télécharger le guide PDF</a>
    </p>

    <p><strong>Mon conseil pour ce soir :</strong></p>
    <ol style="padding-left:20px">
      <li>Imprime la carte de poche du guide</li>
      <li>Travaille uniquement <strong>C → Am</strong>, 5 minutes, en boucle (c'est l'enchaînement le plus simple)</li>
      <li>Demain : ajoute F. Le surlendemain : G</li>
      <li>Jour 4 : tu joues « Stand By Me » en entier</li>
    </ol>

    <p>Le ukulélé pardonne tout. C'est ça qui le rend magique.</p>

    <p>Une question ? Réponds à cet email — je lis tout.</p>

    <p style="margin-top:24px">— Fred Fieffé<br>
    <em style="font-size:14px;color:#666">Auteur Hal Leonard · Spectacle primé Samuel Paty 2024 · 80 000+ élèves</em></p>

    <div style="${footerStyle}">
      Tu reçois cet email parce que tu as demandé le guide « Les 4 Accords du Ukulélé » sur musique-facile.fr.<br>
      Pour te désinscrire en 1 clic : <a href="{{unsubscribe}}" style="color:#666">cliquer ici</a>.
    </div>
  </div>
</body></html>`,
  },
};

/**
 * Envoie l'email transactionnel J0 (livraison du PDF).
 * Idempotent côté logique applicative : si Brevo échoue, on log mais on ne casse pas la subscription.
 */
export async function sendLeadMagnetEmail(opts: {
  email: string;
  leadMagnet: string;
  firstName?: string;
  apiKey: string;
  senderEmail: string;
  senderName: string;
  baseUrl: string;
}): Promise<{ ok: boolean; error?: string }> {
  const meta = leadMagnetEmails[opts.leadMagnet];
  if (!meta) {
    return { ok: false, error: `Lead magnet inconnu : ${opts.leadMagnet}` };
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': opts.apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { email: opts.senderEmail, name: opts.senderName },
        to: [{ email: opts.email, name: opts.firstName || undefined }],
        subject: meta.subject,
        htmlContent: meta.html({ firstName: opts.firstName, baseUrl: opts.baseUrl }),
        tags: ['lead-magnet-J0', opts.leadMagnet],
      }),
    });

    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: `Brevo SMTP ${res.status}: ${JSON.stringify(data)}` };
  } catch (err) {
    return { ok: false, error: `Network: ${(err as Error).message}` };
  }
}

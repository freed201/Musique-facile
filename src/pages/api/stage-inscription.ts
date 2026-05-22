/**
 * POST /api/stage-inscription
 * Traite une demande d'inscription au stage d'ukulélé (Juillet 2026).
 *
 * Body JSON :
 * {
 *   firstName: string (requis)
 *   lastName: string (requis)
 *   email: string (requis)
 *   phone: string (requis)
 *   niveau: 'initie' | 'debutant'
 *   format: '3jours' | '5jours'
 *   ukulelePret: boolean
 *   chantInteresse: boolean
 *   message?: string
 *   consent: boolean (requis)
 * }
 *
 * Effets :
 *  1. Inscrit le contact dans Brevo (liste dédiée BREVO_LIST_STAGE_2026) avec attributs stage.
 *     ⚠️ N'inscrit PAS dans la liste générale ni dans la liste ukulélé du blog : la liste est
 *     réservée aux communications spécifiques au stage (relances, rappels, infos pratiques).
 *  2. Envoie un email transactionnel récap à Fred (STAGE_NOTIFICATION_EMAIL)
 *  3. Envoie un email de confirmation au prospect
 *
 * Env vars requises :
 *   BREVO_API_KEY              -- clé API v3 (xkeysib-...)
 *   BREVO_LIST_STAGE_2026      -- ID liste dédiée stage juillet 2026 (numérique)
 *   BREVO_SENDER_EMAIL         -- (optionnel) défaut: contact@musique-facile.fr
 *   BREVO_SENDER_NAME          -- (optionnel) défaut: Fred Fieffé · Musique Facile
 *   STAGE_NOTIFICATION_EMAIL   -- (optionnel) défaut: contact@musique-facile.fr
 */
import type { APIRoute } from 'astro';

export const prerender = false;

const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';
const BREVO_SMTP_URL = 'https://api.brevo.com/v3/smtp/email';

interface InscriptionBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  niveau?: 'initie' | 'debutant';
  format?: '3jours' | '5jours';
  ukulelePret?: boolean;
  chantInteresse?: boolean;
  message?: string;
  consent?: boolean;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

const niveauLabel = (n?: string) => (n === 'initie' ? 'Initié (9h30 – 12h)' : 'Débutant (13h30 – 16h)');
const formatLabel = (f?: string) => (f === '5jours' ? '5 jours (Lun → Ven) — 150€' : '3 jours (Lun → Mer) — 100€');

const buildNotifEmail = (data: Required<Omit<InscriptionBody, 'consent'>>) => {
  const safe = {
    firstName: escapeHtml(data.firstName),
    lastName: escapeHtml(data.lastName),
    email: escapeHtml(data.email),
    phone: escapeHtml(data.phone),
    message: escapeHtml(data.message || '—'),
  };
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Nouvelle inscription stage</title></head>
<body style="margin:0;background:#f8f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;line-height:1.55;color:#1a1a2e">
  <div style="max-width:640px;margin:0 auto;padding:24px;background:#ffffff">
    <h1 style="color:#EA580C;margin:0 0 16px;font-size:22px">🌺 Nouvelle inscription stage ukulélé — Juillet 2026</h1>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr><td style="padding:10px;background:#fff5ed;font-weight:600;width:180px;border-bottom:1px solid #ffe6d6">Prénom</td><td style="padding:10px;border-bottom:1px solid #f5f5f5">${safe.firstName}</td></tr>
      <tr><td style="padding:10px;background:#fff5ed;font-weight:600;border-bottom:1px solid #ffe6d6">Nom</td><td style="padding:10px;border-bottom:1px solid #f5f5f5">${safe.lastName}</td></tr>
      <tr><td style="padding:10px;background:#fff5ed;font-weight:600;border-bottom:1px solid #ffe6d6">Email</td><td style="padding:10px;border-bottom:1px solid #f5f5f5"><a href="mailto:${safe.email}" style="color:#EA580C">${safe.email}</a></td></tr>
      <tr><td style="padding:10px;background:#fff5ed;font-weight:600;border-bottom:1px solid #ffe6d6">Téléphone</td><td style="padding:10px;border-bottom:1px solid #f5f5f5"><a href="tel:${safe.phone}" style="color:#EA580C">${safe.phone}</a></td></tr>
      <tr><td style="padding:10px;background:#fff5ed;font-weight:600;border-bottom:1px solid #ffe6d6">Niveau</td><td style="padding:10px;border-bottom:1px solid #f5f5f5"><strong>${niveauLabel(data.niveau)}</strong></td></tr>
      <tr><td style="padding:10px;background:#fff5ed;font-weight:600;border-bottom:1px solid #ffe6d6">Format</td><td style="padding:10px;border-bottom:1px solid #f5f5f5"><strong>${formatLabel(data.format)}</strong></td></tr>
      <tr><td style="padding:10px;background:#fff5ed;font-weight:600;border-bottom:1px solid #ffe6d6">Prêt ukulélé ?</td><td style="padding:10px;border-bottom:1px solid #f5f5f5">${data.ukulelePret ? '✅ <strong>Oui</strong>' : 'Non'}</td></tr>
      <tr><td style="padding:10px;background:#fff5ed;font-weight:600;border-bottom:1px solid #ffe6d6">Atelier chant (jeudi) ?</td><td style="padding:10px;border-bottom:1px solid #f5f5f5">${data.chantInteresse ? '✅ <strong>Intéressé(e)</strong>' : 'Non'}</td></tr>
      <tr><td style="padding:10px;background:#fff5ed;font-weight:600;vertical-align:top">Message</td><td style="padding:10px">${safe.message.replace(/\n/g, '<br>')}</td></tr>
    </table>
    <p style="font-size:13px;color:#888;border-top:1px solid #eee;padding-top:16px">Réponds directement à cet email pour reprendre contact avec le futur stagiaire.</p>
  </div>
</body></html>`;
};

const buildConfirmEmail = (firstName: string, niveau: string, format: string, ukulelePret: boolean, chantInteresse: boolean) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Inscription stage ukulélé reçue</title></head>
<body style="margin:0;background:#f8f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;line-height:1.6;color:#1a1a2e">
  <div style="max-width:600px;margin:0 auto;padding:24px;background:#ffffff">
    <p style="font-size:18px;margin:0 0 16px">Salut ${escapeHtml(firstName)},</p>

    <p>Génial, ta demande d'inscription au <strong>stage d'ukulélé du 6 au 10 juillet 2026 à Grasse</strong> est bien arrivée 🌺</p>

    <div style="background:#fff5ed;border-left:4px solid #EA580C;padding:16px 20px;border-radius:6px;margin:24px 0">
      <p style="margin:0 0 8px"><strong>Récapitulatif :</strong></p>
      <p style="margin:4px 0">🎯 Niveau : <strong>${niveauLabel(niveau)}</strong></p>
      <p style="margin:4px 0">📅 Format : <strong>${formatLabel(format)}</strong></p>
      <p style="margin:4px 0">🎸 Prêt d'ukulélé : <strong>${ukulelePret ? 'Oui, à prévoir' : 'Non, j\'apporte le mien'}</strong></p>
      <p style="margin:4px 0">🎤 Atelier chant du jeudi : <strong>${chantInteresse ? 'Intéressé(e)' : 'Non concerné'}</strong></p>
    </div>

    <p><strong>La suite :</strong></p>
    <ol style="padding-left:20px;margin:8px 0 24px">
      <li>On t'envoie un email de confirmation avec les modalités de paiement (sous 24 à 48h)</li>
      <li>Une fois confirmée, ta place est officiellement réservée</li>
      <li>Quelques jours avant le stage, tu reçois toutes les infos pratiques (matériel, accès, planning détaillé)</li>
    </ol>

    <p>Si tu as la moindre question d'ici là, réponds à cet email — je te recontacte rapidement.</p>

    <p style="margin-top:24px">— Fred Fieffé<br>
    <em style="font-size:14px;color:#666">Musique Facile · Stage ukulélé Grasse 2026</em></p>

    <div style="font-size:13px;color:#888;line-height:1.5;border-top:1px solid #eee;padding-top:16px;margin-top:32px">
      Tu reçois cet email parce que tu viens de t'inscrire au stage d'ukulélé sur musique-facile.fr.<br>
      📍 Happiness School — 95 Av. de la Libération, 06130 Grasse
    </div>
  </div>
</body></html>`;

export const POST: APIRoute = async ({ request }) => {
  let body: InscriptionBody;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Requête invalide' }, 400);
  }

  const { firstName, lastName, email, phone, niveau, format, ukulelePret, chantInteresse, message, consent } = body;

  if (!firstName || firstName.trim().length < 2) return json({ error: 'Prénom requis' }, 400);
  if (!lastName || lastName.trim().length < 2) return json({ error: 'Nom requis' }, 400);
  if (!email || !isValidEmail(email)) return json({ error: 'Email invalide' }, 400);
  if (!phone || phone.trim().length < 6) return json({ error: 'Téléphone requis' }, 400);
  if (niveau !== 'initie' && niveau !== 'debutant') return json({ error: 'Niveau invalide' }, 400);
  if (format !== '3jours' && format !== '5jours') return json({ error: 'Format invalide' }, 400);
  if (consent !== true) return json({ error: 'Consentement requis' }, 400);

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return json({ error: 'Service email non configuré' }, 500);

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'contact@musique-facile.fr';
  const senderName = process.env.BREVO_SENDER_NAME || 'Fred Fieffé · Musique Facile';
  const notificationEmail = process.env.STAGE_NOTIFICATION_EMAIL || 'contact@musique-facile.fr';

  // Liste dédiée au stage : on N'inscrit PAS le contact dans la liste générale
  // ni dans la liste ukulélé du blog — RGPD + ciblage propre pour les emails de stage uniquement.
  const stageList = parseInt(process.env.BREVO_LIST_STAGE_2026 ?? '', 10);
  if (Number.isNaN(stageList)) return json({ error: 'Liste stage non configurée' }, 500);
  const listIds = [stageList];

  const cleanData = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    niveau,
    format,
    ukulelePret: !!ukulelePret,
    chantInteresse: !!chantInteresse,
    message: (message || '').trim(),
  };

  try {
    await fetch(BREVO_CONTACTS_URL, {
      method: 'POST',
      headers: { accept: 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
      body: JSON.stringify({
        email: cleanData.email,
        listIds,
        attributes: {
          PRENOM: cleanData.firstName.slice(0, 80),
          NOM: cleanData.lastName.slice(0, 80),
          SMS: cleanData.phone.slice(0, 30),
          INSTRUMENT: 'ukulele',
          STAGE_2026_NIVEAU: cleanData.niveau,
          STAGE_2026_FORMAT: cleanData.format,
          STAGE_2026_PRET_UKULELE: cleanData.ukulelePret ? 'oui' : 'non',
          STAGE_2026_CHANT: cleanData.chantInteresse ? 'oui' : 'non',
          SOURCE: 'stage-juillet-2026',
          OPTIN_DATE: new Date().toISOString(),
        },
        updateEnabled: true,
      }),
    });
    // On ne bloque pas sur l'inscription Brevo (les emails sont l'essentiel)

    const notifRes = await fetch(BREVO_SMTP_URL, {
      method: 'POST',
      headers: { accept: 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
      body: JSON.stringify({
        sender: { email: senderEmail, name: 'Site Musique Facile' },
        to: [{ email: notificationEmail, name: 'Fred Fieffé' }],
        replyTo: { email: cleanData.email, name: `${cleanData.firstName} ${cleanData.lastName}` },
        subject: `🌺 Nouvelle inscription stage — ${cleanData.firstName} ${cleanData.lastName} (${cleanData.niveau})`,
        htmlContent: buildNotifEmail(cleanData),
        tags: ['stage-juillet-2026', 'inscription-stage'],
      }),
    });

    if (!notifRes.ok) {
      const errData = await notifRes.json().catch(() => ({}));
      console.warn('[stage-inscription] Notif email failed:', notifRes.status, errData);
      return json({ error: 'Envoi notification échoué' }, 502);
    }

    const confirmRes = await fetch(BREVO_SMTP_URL, {
      method: 'POST',
      headers: { accept: 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: [{ email: cleanData.email, name: `${cleanData.firstName} ${cleanData.lastName}` }],
        subject: '🌺 Ton inscription au stage d\'ukulélé est bien reçue',
        htmlContent: buildConfirmEmail(cleanData.firstName, cleanData.niveau, cleanData.format, cleanData.ukulelePret, cleanData.chantInteresse),
        tags: ['stage-juillet-2026', 'confirmation-stagiaire'],
      }),
    });

    if (!confirmRes.ok) {
      console.warn('[stage-inscription] Confirm email failed:', confirmRes.status);
      // La notif est partie, on ne casse pas la réponse au prospect
    }

    return json({ ok: true });
  } catch (err) {
    console.error('[stage-inscription] Unexpected error:', err);
    return json({ error: 'Service indisponible' }, 503);
  }
};

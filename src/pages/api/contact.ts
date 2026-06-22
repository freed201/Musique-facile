/**
 * POST /api/contact
 * Formulaire de contact de la page hub /liens (et réutilisable ailleurs).
 *
 * Fait deux choses :
 *   1. Crée / met à jour le contact dans Brevo (liste « Contacts » dédiée, fallback GENERAL).
 *   2. Envoie un email de NOTIFICATION à Fred avec le message (Brevo transactionnel),
 *      avec reply-to = email du visiteur (Fred peut répondre en 1 clic).
 *
 * Body JSON :
 * {
 *   name: string (requis)
 *   email: string (requis)
 *   message: string (requis)
 *   consent: boolean (requis)   // RGPD : autorisation d'être recontacté
 *   source?: string             // ex: "hub:/liens"
 * }
 *
 * Env vars (Vercel + .env local) :
 *   BREVO_API_KEY            -- clé API v3 (xkeysib-...)   [REQUIS]
 *   BREVO_LIST_CONTACT       -- (optionnel) ID liste « Contacts hub » ; fallback BREVO_LIST_GENERAL
 *   BREVO_LIST_GENERAL       -- ID liste par défaut (numérique)
 *   BREVO_SENDER_EMAIL       -- expéditeur validé Brevo (déf. contact@musique-facile.fr)
 *   BREVO_SENDER_NAME        -- nom expéditeur (déf. « Fred Fieffé · Musique Facile »)
 *   CONTACT_NOTIFY_EMAIL     -- destinataire de la notif (déf. support@musique-facile.fr)
 *   PUBLIC_SITE_URL          -- base URL (déf. https://musique-facile.fr)
 *
 * La clé API n'est JAMAIS exposée au client : tout passe par cet endpoint serverless.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';
const BREVO_SMTP_URL = 'https://api.brevo.com/v3/smtp/email';

interface ContactBody {
  name?: string;
  email?: string;
  message?: string;
  consent?: boolean;
  source?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

/** Échappe le HTML pour éviter toute injection dans l'email de notification. */
const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  );

const pickContactListIds = (): number[] => {
  const ids = new Set<number>();
  const contactList = parseInt(process.env.BREVO_LIST_CONTACT ?? '', 10);
  const general = parseInt(process.env.BREVO_LIST_GENERAL ?? '', 10);
  if (!Number.isNaN(contactList)) ids.add(contactList);
  if (!Number.isNaN(general)) ids.add(general);
  return [...ids];
};

export const POST: APIRoute = async ({ request }) => {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Requête invalide' }, 400);
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const message = (body.message ?? '').trim();
  const { consent, source } = body;

  if (!name || name.length > 120) {
    return json({ error: 'Nom invalide' }, 400);
  }
  if (!email || !isValidEmail(email)) {
    return json({ error: 'Email invalide' }, 400);
  }
  if (!message || message.length < 2 || message.length > 5000) {
    return json({ error: 'Message invalide' }, 400);
  }
  if (consent !== true) {
    return json({ error: 'Consentement requis' }, 400);
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return json({ error: 'Service de contact non configuré' }, 500);
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'contact@musique-facile.fr';
  const senderName = process.env.BREVO_SENDER_NAME || 'Fred Fieffé · Musique Facile';
  const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL || 'support@musique-facile.fr';

  // ── 1. Créer / mettre à jour le contact dans Brevo (best-effort, ne bloque pas la notif) ──
  const listIds = pickContactListIds();
  if (listIds.length > 0) {
    try {
      await fetch(BREVO_CONTACTS_URL, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
          listIds,
          attributes: {
            PRENOM: name.slice(0, 80),
            SOURCE: (source || 'hub:/liens').slice(0, 200),
            // Pour stocker le message dans Brevo, créez un attribut texte « MESSAGE »
            // dans Contacts > Paramètres > Attributs, puis décommentez la ligne ci-dessous :
            // MESSAGE: message.slice(0, 255),
            OPTIN_DATE: new Date().toISOString(),
          },
          updateEnabled: true,
        }),
      });
      // On ignore volontairement les erreurs (doublon, etc.) : la notif ci-dessous est prioritaire.
    } catch {
      // Réseau indisponible côté Brevo contacts : on continue, la notif reste l'essentiel.
    }
  }

  // ── 2. Notification email à Fred (c'est le cœur de « faire entrer en contact ») ──
  const baseUrl = process.env.PUBLIC_SITE_URL || 'https://musique-facile.fr';
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  const notifHtml = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Nouveau message</title></head>
<body style="margin:0;background:#f5f0fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;line-height:1.55;color:#241440">
  <div style="max-width:600px;margin:0 auto;padding:24px;background:#ffffff">
    <p style="font-size:13px;color:#6C3FA0;font-weight:700;letter-spacing:.04em;text-transform:uppercase;margin:0 0 8px">📩 Nouveau message — page /liens</p>
    <h1 style="font-size:20px;margin:0 0 16px;color:#241440">${safeName} t'a écrit</h1>
    <table style="width:100%;border-collapse:collapse;font-size:15px">
      <tr><td style="padding:6px 0;color:#6b7280;width:90px">Nom</td><td style="padding:6px 0"><strong>${safeName}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0"><a href="mailto:${safeEmail}" style="color:#6C3FA0">${safeEmail}</a></td></tr>
    </table>
    <div style="margin:20px 0;padding:16px 20px;background:#f5f0fa;border-left:4px solid #6C3FA0;border-radius:8px">
      <p style="margin:0;white-space:pre-wrap">${safeMessage}</p>
    </div>
    <p style="text-align:center;margin:28px 0">
      <a href="mailto:${safeEmail}?subject=Re%3A%20ton%20message%20sur%20Musique%20Facile" style="display:inline-block;padding:14px 28px;background:#6C3FA0;color:#ffffff;font-weight:600;font-size:16px;text-decoration:none;border-radius:8px">Répondre à ${safeName}</a>
    </p>
    <p style="font-size:13px;color:#888;border-top:1px solid #eee;padding-top:16px;margin-top:24px">
      Message reçu via <a href="${baseUrl}/liens" style="color:#888">${baseUrl}/liens</a> — ajouté à ta liste Brevo.
    </p>
  </div>
</body></html>`;

  try {
    const res = await fetch(BREVO_SMTP_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: [{ email: notifyEmail, name: 'Musique Facile' }],
        replyTo: { email, name },
        subject: `📩 Nouveau message de ${name} (page /liens)`,
        htmlContent: notifHtml,
        tags: ['contact-hub', 'liens'],
      }),
    });

    if (res.ok) return json({ ok: true });
    return json({ error: 'Envoi du message impossible' }, 502);
  } catch {
    return json({ error: 'Service indisponible' }, 503);
  }
};

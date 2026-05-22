/**
 * POST /api/subscribe
 * Inscrit un contact à Brevo dans la(les) liste(s) appropriée(s).
 *
 * Body JSON :
 * {
 *   email: string (requis)
 *   instrument?: 'guitare' | 'piano' | 'ukulele' | 'solfege' | 'général'
 *   firstName?: string
 *   source?: string             // ex: "blog:apprendre-hey-jude-guitare"
 *   leadMagnet?: string         // ex: "5-accords-magiques"
 *   consent: boolean (requis)   // RGPD
 * }
 *
 * Env vars requises (Vercel + .env local) :
 *   BREVO_API_KEY            -- clé API v3 (xkeysib-...)
 *   BREVO_LIST_GENERAL       -- ID liste par défaut (numérique)
 *   BREVO_LIST_GUITARE       -- (optionnel) ID liste guitare
 *   BREVO_LIST_PIANO         -- (optionnel) ID liste piano
 *   BREVO_LIST_UKULELE       -- (optionnel) ID liste ukulele
 *
 * Si une liste instrument-spécifique n'est pas définie, on retombe sur GENERAL.
 */
import type { APIRoute } from 'astro';
import { sendLeadMagnetEmail } from './_lead-magnet-emails';

export const prerender = false;

const BREVO_API_URL = 'https://api.brevo.com/v3/contacts';

interface SubscribeBody {
  email?: string;
  instrument?: string;
  firstName?: string;
  source?: string;
  leadMagnet?: string;
  consent?: boolean;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

const pickListIds = (instrument?: string): number[] => {
  const general = parseInt(process.env.BREVO_LIST_GENERAL ?? '', 10);
  const map: Record<string, string | undefined> = {
    guitare: process.env.BREVO_LIST_GUITARE,
    piano: process.env.BREVO_LIST_PIANO,
    ukulele: process.env.BREVO_LIST_UKULELE,
  };
  const ids = new Set<number>();
  if (!Number.isNaN(general)) ids.add(general);
  if (instrument && map[instrument]) {
    const id = parseInt(map[instrument] as string, 10);
    if (!Number.isNaN(id)) ids.add(id);
  }
  return [...ids];
};

export const POST: APIRoute = async ({ request }) => {
  let body: SubscribeBody;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Requête invalide' }, 400);
  }

  const { email, instrument, firstName, source, leadMagnet, consent } = body;

  if (!email || !isValidEmail(email)) {
    return json({ error: 'Email invalide' }, 400);
  }
  if (consent !== true) {
    return json({ error: 'Consentement requis' }, 400);
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return json({ error: 'Service email non configuré' }, 500);
  }

  const listIds = pickListIds(instrument);
  if (listIds.length === 0) {
    return json({ error: 'Aucune liste configurée' }, 500);
  }

  const attributes: Record<string, string> = {};
  if (firstName) attributes.PRENOM = firstName.slice(0, 80);
  if (instrument) attributes.INSTRUMENT = instrument;
  if (source) attributes.SOURCE = source.slice(0, 200);
  if (leadMagnet) attributes.LEAD_MAGNET = leadMagnet.slice(0, 80);
  attributes.OPTIN_DATE = new Date().toISOString();

  try {
    const brevoRes = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds,
        attributes,
        updateEnabled: true,
      }),
    });

    const contactOk = brevoRes.ok || brevoRes.status === 204;
    let alreadyExisted = false;

    if (!contactOk) {
      // Brevo renvoie 400 + code "duplicate_parameter" si l'email existe déjà
      // mais que updateEnabled n'est pas géré ; on traite ça comme un succès soft.
      if (brevoRes.status === 400) {
        const data = await brevoRes.json().catch(() => ({}));
        if ((data as { code?: string }).code === 'duplicate_parameter') {
          alreadyExisted = true;
        } else {
          return json({ error: 'Données refusées par Brevo' }, 400);
        }
      } else {
        return json({ error: 'Erreur côté Brevo' }, 502);
      }
    }

    // J0 — Email transactionnel de livraison du PDF (uniquement si leadMagnet fourni)
    if (leadMagnet) {
      const senderEmail = process.env.BREVO_SENDER_EMAIL || 'contact@musique-facile.fr';
      const senderName = process.env.BREVO_SENDER_NAME || 'Fred Fieffé · Musique Facile';
      const baseUrl = process.env.PUBLIC_SITE_URL || 'https://musique-facile.fr';
      const emailRes = await sendLeadMagnetEmail({
        email,
        leadMagnet,
        firstName,
        apiKey,
        senderEmail,
        senderName,
        baseUrl,
      });
      if (!emailRes.ok) {
        // On log mais on ne casse pas la souscription (le contact est déjà dans Brevo)
        console.warn('[subscribe] Email J0 failed:', emailRes.error);
      }
    }

    return json({ ok: true, alreadyExisted });
  } catch {
    return json({ error: 'Service email indisponible' }, 503);
  }
};

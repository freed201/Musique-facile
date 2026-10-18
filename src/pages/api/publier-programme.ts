/**
 * GET /api/publier-programme
 * Publication des articles programmés : relance un build quand un article
 * atteint sa date de parution.
 *
 * POURQUOI CET ENDPOINT EXISTE
 * Le site est généré au build. `src/pages/blog/[slug].astro` ne produit la page
 * d'un article que si `prod: "Y"` ET `datePublished <= date du build`. Un article
 * daté du futur n'existe donc pas tant qu'aucun build ne tourne après sa date,
 * et le dépôt n'avait aucun redéploiement automatique : un article programmé
 * restait invisible indéfiniment.
 *
 * CE QU'IL FAIT
 * Appelé une fois par jour par le cron déclaré dans `vercel.json`, il lit la
 * collection `blog` et cherche un article publiable dont la date de parution
 * est AUJOURD'HUI. S'il en trouve un, il appelle le Deploy Hook Vercel, ce qui
 * relance un build : l'article devient alors une vraie page. Sinon il ne fait
 * rien, pour ne pas reconstruire le site 365 fois par an sans raison.
 *
 * La collection lue ici date du dernier build, ce qui n'est pas un problème :
 * `getCollection` renvoie TOUS les articles, y compris ceux dont la date est à
 * venir. Le filtrage par date n'a lieu que dans `getStaticPaths`.
 *
 * SÉCURITÉ
 * La route déclenche un déploiement : elle ne doit pas être appelable par
 * n'importe qui. Vercel joint l'en-tête `Authorization: Bearer <CRON_SECRET>`
 * à ses appels de cron dès que la variable `CRON_SECRET` existe. Sans secret
 * configuré, la route refuse de s'exécuter plutôt que de rester ouverte.
 *
 * Variables d'environnement (à créer dans les réglages Vercel) :
 *   CRON_SECRET          -- chaîne aléatoire, partagée avec le cron Vercel  [REQUIS]
 *   VERCEL_DEPLOY_HOOK   -- URL du Deploy Hook du projet, branche master    [REQUIS]
 *
 * Le Deploy Hook se crée dans Vercel : Settings, Git, Deploy Hooks.
 *
 * Déclenchement manuel, en cas de cron manqué : relancer un déploiement depuis
 * le tableau de bord Vercel suffit, cette route n'est pas nécessaire.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

/** Date du jour au format AAAA-MM-JJ, en heure de Paris. */
function aujourdhuiParis(): string {
  return new Intl.DateTimeFormat('fr-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function reponse(corps: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(corps), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export const GET: APIRoute = async ({ request }) => {
  const secret = import.meta.env.CRON_SECRET;
  const hook = import.meta.env.VERCEL_DEPLOY_HOOK;

  // Sans secret, la route resterait un bouton « reconstruire le site » ouvert
  // à tous : on refuse de fonctionner plutôt que de prendre ce risque.
  if (!secret) {
    return reponse({ ok: false, raison: 'CRON_SECRET non configuré' }, 503);
  }
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return reponse({ ok: false, raison: 'non autorisé' }, 401);
  }
  if (!hook) {
    return reponse({ ok: false, raison: 'VERCEL_DEPLOY_HOOK non configuré' }, 503);
  }

  const aujourdhui = aujourdhuiParis();

  const aParaitre = (await getCollection('blog'))
    .filter((a) => a.data.prod === 'Y' && String(a.data.datePublished).slice(0, 10) === aujourdhui)
    .map((a) => a.slug);

  if (aParaitre.length === 0) {
    return reponse({ ok: true, date: aujourdhui, redeploiement: false, articles: [] });
  }

  const r = await fetch(hook, { method: 'POST' });
  if (!r.ok) {
    return reponse(
      { ok: false, date: aujourdhui, raison: `Deploy Hook en erreur (${r.status})`, articles: aParaitre },
      502,
    );
  }

  return reponse({ ok: true, date: aujourdhui, redeploiement: true, articles: aParaitre });
};

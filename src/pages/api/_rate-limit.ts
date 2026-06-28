/**
 * _rate-limit.ts — limiteur de débit best-effort en mémoire.
 *
 * Protège les endpoints publics (subscribe, contact, stage-inscription) contre
 * le matraquage / spam basique, sans dépendance externe.
 *
 * ⚠️ Limite connue : la mémoire est PROPRE À CHAQUE INSTANCE serverless Vercel
 * et remise à zéro à chaque cold start. C'est donc une protection « best-effort »
 * (elle arrête un même IP qui matraque une instance chaude), pas une garantie
 * stricte multi-instances. Pour une garantie forte, brancher un store partagé
 * (Vercel KV / Upstash Redis) en remplaçant l'implémentation de `rateLimit`.
 *
 * Le préfixe `_` exclut ce fichier du routing Astro (utilitaire, pas une route).
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Récupère l'IP client derrière le proxy Vercel (x-forwarded-for). */
export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

export interface RateLimitResult {
  ok: boolean;
  /** Secondes avant de pouvoir réessayer (0 si autorisé). */
  retryAfter: number;
}

/**
 * Fenêtre fixe : au plus `limit` requêtes par `windowMs` et par `key`.
 */
export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): RateLimitResult {
  const now = Date.now();

  // Nettoyage opportuniste pour borner la taille de la Map (évite une fuite mémoire).
  if (buckets.size > 5_000) {
    for (const [k, b] of buckets) {
      if (now >= b.resetAt) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  return { ok: true, retryAfter: 0 };
}

/** Réponse 429 standard avec en-tête Retry-After. */
export function tooManyRequests(retryAfter: number): Response {
  return new Response(
    JSON.stringify({ error: 'Trop de tentatives. Patientez quelques instants avant de réessayer.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
      },
    }
  );
}

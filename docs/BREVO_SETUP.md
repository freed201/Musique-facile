# Setup Brevo — Lead magnets Musique Facile

Guide pas-à-pas pour activer le pipeline complet **capture email → livraison PDF immédiate (J0) → séquence de nurture (J+1, J+3, J+7)**.

## TL;DR

Ce qui est déjà en place côté code :
- Endpoint `/api/subscribe` qui crée/MAJ le contact Brevo avec attributs (PRENOM, INSTRUMENT, SOURCE, LEAD_MAGNET, OPTIN_DATE)
- Envoi automatique de l'**email J0** (livraison du PDF) via Brevo SMTP API juste après la création du contact
- Templates HTML des 3 emails J0 dans `src/lib/lead-magnet-emails.ts`

Ce qui reste à configurer **manuellement** dans l'interface Brevo :
1. Vérifier que les listes existent et leurs IDs sont dans Vercel
2. Vérifier le sender email/domaine
3. Configurer les **3 automations** de séquence (cf `docs/EMAIL_SEQUENCES.md`)

---

## 1. Variables d'environnement (Vercel)

À ajouter dans le projet Vercel : **Settings → Environment Variables** (Production + Preview).

| Variable | Valeur | Note |
|---|---|---|
| `BREVO_API_KEY` | `xkeysib-...` | Clé API v3 (Brevo → SMTP & API → API Keys) |
| `BREVO_LIST_GENERAL` | `1` ou autre ID | ID numérique de la liste « Général » dans Brevo |
| `BREVO_LIST_GUITARE` | `2` ou autre ID | (optionnel) ID liste guitare — sinon fallback sur GENERAL |
| `BREVO_LIST_PIANO` | `3` ou autre ID | (optionnel) ID liste piano |
| `BREVO_LIST_UKULELE` | `4` ou autre ID | (optionnel) ID liste ukulélé |
| `BREVO_SENDER_EMAIL` | `contact@musique-facile.fr` | Email vérifié côté Brevo (cf section 2) |
| `BREVO_SENDER_NAME` | `Fred Fieffé · Musique Facile` | Nom expéditeur affiché dans les emails |
| `PUBLIC_SITE_URL` | `https://musique-facile.fr` | URL absolue pour générer les liens PDF dans les emails |

**Comment trouver un ID de liste dans Brevo** :
1. Aller dans **Contacts → Lists**
2. Cliquer sur une liste
3. L'ID est dans l'URL : `https://app.brevo.com/contact/list/<ID>`

---

## 2. Vérifier le sender email côté Brevo

Avant que les emails transactionnels puissent partir, le **sender** doit être autorisé.

1. Brevo → **Senders & IP**
2. Soit ajouter un **single sender** (ex: `contact@musique-facile.fr`) et confirmer le clic mail de validation
3. Soit (mieux) ajouter un **sending domain** : configurer SPF, DKIM, DMARC pour `musique-facile.fr` — délivrabilité bien meilleure

→ Une fois vérifié, mettre la valeur exacte dans `BREVO_SENDER_EMAIL` côté Vercel.

---

## 3. Lister et nommer les listes proprement

**Listes recommandées** (à créer dans Brevo → Contacts → Lists si pas déjà fait) :

| Nom de liste | Usage |
|---|---|
| `Newsletter générale` | Tous les inscrits, peu importe l'instrument |
| `Lead magnet · Guitare` | Inscrits via guide « 5 accords » |
| `Lead magnet · Piano` | Inscrits via guide « Lire les notes » |
| `Lead magnet · Ukulélé` | Inscrits via guide « 4 accords » |

Le contact est ajouté automatiquement à **2 listes** : Générale + sa liste instrument.

L'attribut `LEAD_MAGNET` (slug du PDF, ex `guitare-5-accords-magiques`) permet ensuite de filtrer/déclencher des automations spécifiques.

---

## 4. Vérifier que l'attribut `LEAD_MAGNET` existe

Brevo → **Contacts → Attributes** : créer l'attribut s'il n'existe pas.

| Nom | Type | Description |
|---|---|---|
| `PRENOM` | Text | Prénom |
| `INSTRUMENT` | Text | guitare / piano / ukulele / solfege / général |
| `SOURCE` | Text | Origine de l'inscription (ex: `blog:apprendre-perfect-guitare`, `landing:guitare-5-accords-magiques`) |
| `LEAD_MAGNET` | Text | Slug du guide demandé (ex: `guitare-5-accords-magiques`) |
| `OPTIN_DATE` | Date ou Text | Timestamp ISO de la souscription |

---

## 5. Configurer les 3 automations de séquence

Voir le fichier **`docs/EMAIL_SEQUENCES.md`** (généré séparément) qui contient :
- Les 9 templates HTML des emails de séquence (J+1, J+3, J+7 × 3 lead magnets)
- Les étapes pas-à-pas pour créer chaque workflow dans Brevo Marketing Automation

**Logique générale** :
- Trigger : « A contact has been added to list » → Lead magnet · X
- Wait 1 day → Send email J+1
- Wait 2 days → Send email J+3
- Wait 4 days → Send email J+7

---

## 6. Vérifier que tout marche

Test E2E :

1. Aller sur `/guides/guitare-5-accords-magiques` (landing dédiée) ou un article blog guitare
2. Soumettre un email de test (perso, ou Mailtrap)
3. Vérifier :
   - Redirection vers `/merci-lead-magnet?lm=guitare-5-accords-magiques` ✅
   - PDF téléchargeable depuis la page merci ✅
   - **Email J0 reçu dans les 2 min** avec le lien PDF (vérifier spam si rien)
   - Contact présent dans Brevo (liste Générale + Guitare, attributs corrects)
4. Attendre 24h → email J+1 reçu (une fois les automations Brevo configurées)

---

## 7. Debug

Si un email ne part pas :

- **Vercel logs** : Dashboard Vercel → projet → Functions → `/api/subscribe` → voir les logs (warning `[subscribe] Email J0 failed: ...`)
- **Brevo logs** : Brevo → Statistics → Email → voir si l'email apparaît (livré, soft bounce, rejeté)
- **Sender non vérifié** : erreur 401/403 — revérifier section 2
- **Domaine SPF/DKIM** : si en spam systématique, vérifier l'authentification du domaine

---

## 8. Coûts Brevo

- Plan gratuit : **300 emails/jour** suffit pour démarrer
- Plan Lite (~25€/mois) : 20k emails/mois (à passer dès que la liste dépasse ~500-1000 contacts actifs)

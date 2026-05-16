# Configuration des workflows Brevo pour les lead magnets

Ce document détaille la configuration **côté Brevo** pour que les inscriptions aux lead magnets déclenchent automatiquement l'envoi du PDF par email.

**Audience :** toi (Fred), à faire une fois dans le dashboard Brevo.

**Temps estimé :** 20-30 min pour configurer le tunnel guitare complet. Les 2 autres se dupliqueront en 5 min chacun.

---

## 🎯 Architecture cible

```
Visiteur remplit le form /5-accords-magiques
        ↓
POST /api/subscribe (serverless Vercel)
        ↓
Création contact Brevo
  - Listes : GENERAL + GUITARE
  - Attribut LEAD_MAGNET = "guitare-5-accords-magiques"
  - Attribut PRENOM, INSTRUMENT=guitare, SOURCE, OPTIN_DATE
        ↓
Trigger workflow Brevo "Livraison Lead Magnet — Guitare"
        ↓
Email envoyé immédiatement avec lien vers PDF
        ↓
[+ 2 jours] Email "Tu as commencé ?"
[+ 5 jours] Email "Une astuce pour le D"
[+ 9 jours] Email "Le cours complet à -15%"
```

---

## 📦 Étape 1 — Uploader le PDF

Le PDF se trouve dans `/public/lead-magnets/` sur le site. URL publique :

```
https://musique-facile.fr/lead-magnets/guitare-5-accords-magiques.pdf
```

Pour la version preview Vercel, l'URL sera :

```
https://TON-PREVIEW-URL.vercel.app/lead-magnets/guitare-5-accords-magiques.pdf
```

**À faire :**
1. Une fois ton PDF Canva exporté, le déposer dans le dossier `public/lead-magnets/` du repo Git
2. Push → Vercel redéploie → le PDF est accessible à l'URL ci-dessus
3. **Vérifier** que le PDF se télécharge bien en visitant l'URL dans un navigateur

---

## 📧 Étape 2 — Configurer l'email de livraison dans Brevo

### 2.1 Créer un nouveau template d'email

Dashboard Brevo → **Campaigns → Email Templates → Create a template**

- **Nom du template :** `Lead Magnet — Guitare — 5 Accords Magiques`
- **Subject :** `🎸 Voilà ton guide des 5 Accords Magiques, [PRENOM] !`
- **From name :** `Fred — Musique Facile`
- **From email :** `fred@musique-facile.fr` (ou ton adresse vérifiée dans Brevo)
- **Reply-to :** `fred@musique-facile.fr`

### 2.2 Contenu de l'email (à coller dans Brevo)

```
Salut [PRENOM] !

Ton guide est prêt. Tu peux le télécharger ici :

👉 [BOUTON : Télécharger "Les 5 Accords Magiques" (PDF)]
   Lien : https://musique-facile.fr/lead-magnets/guitare-5-accords-magiques.pdf

Quelques conseils pour bien démarrer :

1. Imprime le PDF si tu peux (les diagrammes d'accords sont plus lisibles sur papier que sur écran).
2. Commence par l'accord Em — c'est le plus simple, deux doigts suffisent.
3. Avant de t'entraîner aux 5 accords, regarde la vidéo bonus (90 secondes) :
   → [lien YouTube non listé à coller]

Le truc le plus important du guide ? Ça paraît bête mais c'est la rythmique universelle, page 9. La main droite qui ne s'arrête jamais. La plupart des débutants passent à côté. Si tu ne devais lire qu'une page, ce serait celle-là.

Réponds-moi directement si tu as la moindre question. Je lis tout.

À très vite,

Fred
Musique Facile
12 ans d'enseignement · 80 000+ élèves formés · Lauréat du Prix Samuel Paty 2024

PS : Tu peux aussi voir le PDF en ligne tout de suite ici :
https://musique-facile.fr/lead-magnets/guitare-5-accords-magiques.pdf
```

**Variables Brevo utilisées** : `[PRENOM]` (auto-remplacé par l'attribut PRENOM du contact)

### 2.3 Tester l'email

Dans Brevo, utilise la fonction **Send Test Email** pour t'envoyer le template à ta propre adresse, et vérifier :
- Le bouton de téléchargement fonctionne
- Le PRENOM est bien remplacé
- L'aperçu mobile est lisible

---

## ⚙️ Étape 3 — Créer l'automation Brevo

Dashboard Brevo → **Automation → Create a new automation**

### 3.1 Paramètres de l'automation

- **Nom :** `Livraison — Guitare 5 Accords Magiques`
- **Type :** Custom workflow (workflow personnalisé)

### 3.2 Entry point (point d'entrée)

**Trigger :** "A contact is added to a list" (un contact est ajouté à une liste)

- **Liste à surveiller :** ta liste GUITARE (l'ID que tu as mis dans `BREVO_LIST_GUITARE` dans Vercel)
- **Condition supplémentaire :** filtrer sur l'attribut `LEAD_MAGNET = guitare-5-accords-magiques`
  - Ça évite que l'automation se déclenche pour un opt-in newsletter "normale" sur la liste guitare

**Pourquoi cette condition est cruciale :** ta liste GUITARE va recevoir :
- Les inscrits au lead magnet (LEAD_MAGNET=guitare-5-accords-magiques)
- Les inscrits à l'opt-in inline du blog (LEAD_MAGNET vide)

Sans filtre, tu enverrais le PDF guitare aux deuxièmes qui ne l'ont jamais demandé. Mauvais signal RGPD.

### 3.3 Étape 1 de l'automation : envoi immédiat du PDF

**Action :** "Send an email" (envoyer un email)

- **Template :** sélectionner `Lead Magnet — Guitare — 5 Accords Magiques`
- **Delay :** None (immédiat)

### 3.4 Étape 2 : email de follow-up à J+2

**Action :** "Wait" (attendre)
- **Delay :** 2 days

**Action :** "Send an email"
- **Template :** créer un nouveau template `Follow-up J+2 — Guitare — As-tu commencé`
- **Subject :** `🎸 [PRENOM], tu as essayé le premier accord ?`
- **Contenu suggéré :**

```
Salut [PRENOM],

Petite question : tu as essayé l'accord Em du guide ?

Si tu l'as fait, voilà la chose que personne ne te dit : la première semaine, tes doigts vont te faire mal. C'est normal. Ce sont les nerfs au bout des doigts qui s'habituent à la pression. Ça passe au bout de 5-7 jours, et après tu ne ressens plus rien.

Donc ne t'arrête pas si ça te fait mal. Continue. C'est juste un cap.

Et si tu n'as pas encore commencé, voilà mon conseil : 10 minutes ce soir, pas plus. Pas 1 heure. 10 minutes. C'est plus efficace que tu ne le crois.

Je t'envoie une astuce pour le passage le plus difficile (le D) dans 3 jours.

À très vite,

Fred
```

### 3.5 Étape 3 : email à J+5

**Action :** "Wait" + 3 jours
**Action :** "Send an email"
- **Template :** `Follow-up J+5 — Guitare — Astuce D`
- **Subject :** `🎸 [PRENOM], l'astuce du D que je n'ai pas mise dans le PDF`
- **Contenu suggéré :**

```
Salut [PRENOM],

Pour le D, j'ai une astuce que je n'ai pas voulu mettre dans le PDF parce qu'elle marche sur 70% des gens mais pas 100%.

Voilà : pose tes 3 doigts du D normalement. Puis, sans rien bouger, étouffe la 5e corde (A) en faisant ressortir le bord de ton index. Tu sentiras le bord de l'index toucher la corde A par-dessous. Si tu y arrives, tu peux gratter les 6 cordes sans que ça gronde.

C'est pas évident au début. Si ça marche pas pour toi, reste sur le D classique à 4 cordes, c'est très bien aussi.

Tu sais quoi ? Si tu joues déjà les 5 accords du guide, tu en sais plus que 90% des gens qui ont commencé la guitare cette année. Sérieux.

Continue.

Fred

PS : Si tu veux aller plus loin que ce que le PDF te montre, mon cours complet "Guitare Facile" reprend cette méthode en vidéo, étape par étape, sur 30 modules. Tu peux le découvrir ici si ça t'intéresse :
👉 https://musique-facile.fr/cours/cours-de-guitare
```

### 3.6 Étape 4 (optionnelle) : email J+9 avec offre

À configurer une fois que tu as observé un taux d'ouverture acceptable sur les emails précédents (>20%). Inutile de pousser une offre à des gens qui n'ouvrent pas tes emails.

---

## 🔁 Étape 4 — Activer l'automation

Une fois tout configuré :

1. Test final : crée-toi un faux contact avec PRENOM=Test, EMAIL=ton+test@gmail.com, INSTRUMENT=guitare, LEAD_MAGNET=guitare-5-accords-magiques. Ajoute-le à la liste GUITARE.
2. Vérifie que l'automation se déclenche (Brevo affiche le contact comme "in workflow")
3. Reçois l'email, télécharge le PDF, vérifie le lien
4. **Active l'automation** (toggle ON dans le coin supérieur droit)

---

## 🐛 Troubleshooting

**L'email n'arrive pas après inscription**
- Vérifier dans Brevo → Contacts → trouver le contact qui s'est inscrit, regarder son historique. Si tu vois "Added to list GUITARE" mais pas "Email sent", c'est l'automation qui n'a pas fait son travail.
- Causes possibles : automation pas activée, condition de filtrage trop stricte, template avec une erreur.

**Le PDF ne se télécharge pas depuis l'email**
- L'URL doit être HTTPS et publique. Tester l'URL en mode incognito.
- Si le PDF n'existe pas encore sur le serveur, le bouton renvoie un 404. Upload-le d'abord.

**Le contact n'est jamais créé dans Brevo**
- Problème côté endpoint Vercel. Vérifier les Vercel Function logs : Dashboard Vercel → Project → Functions → Logs.
- Causes courantes : BREVO_API_KEY mal copiée, listIds invalides, format de payload incorrect.

**Le contact est créé mais sans l'attribut LEAD_MAGNET**
- Vérifier que l'attribut LEAD_MAGNET existe dans Brevo (Contacts → Attributes). Si non, le créer comme un attribut de type Text. Ensuite, l'API peut le remplir.

---

## 📊 Mesures à suivre

Une fois le tunnel actif, surveille ces métriques chaque semaine (Brevo → Statistics) :

| Métrique | Cible saine | Action si en dessous |
|---|---|---|
| Taux d'ouverture email livraison | > 50% | Subject trop générique, retravailler |
| Taux de clic sur le PDF | > 30% | Email trop long, retravailler |
| Désinscriptions sur l'email J+2 | < 5% | Frequence ou ton ne plaît pas, ralentir |
| Taux d'inscription sur la page de capture | > 5% | Page de capture à optimiser |

---

## 🎹 Duplication pour piano et 🌺 ukulélé

Une fois le tunnel guitare validé, dupliquer pour piano + ukulélé :

1. **Brevo > Automation** : "Duplicate" sur ton automation guitare
2. Renommer en `Livraison — Piano — 5 Mélodies à 5 Doigts`
3. Changer le trigger : surveiller la liste **PIANO** + filtrer `LEAD_MAGNET = piano-5-melodies-5-doigts`
4. Adapter le template d'email (titre, lien PDF, anecdotes spécifiques piano)
5. Idem pour ukulélé

Le code de capture (`/5-melodies-piano` et `/4-accords-ukulele`) sera produit dans la prochaine session, en se basant exactement sur la page `/5-accords-magiques` qu'on vient de faire.

---

*Document de référence pour la configuration Brevo des lead magnets Musique Facile — Version 1.0, mai 2026.*

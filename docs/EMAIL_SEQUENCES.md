# Emails de séquence Brevo — Lead magnets Musique Facile

## Vue d'ensemble

3 lead magnets × 4 emails = **12 templates** à créer dans Brevo Templates.

| Email | Délai | Audience | Objectif |
|---|---|---|---|
| **J+1** | 24h après capture | Tous les inscrits | Engagement, premier défi |
| **J+3** | 72h | Tous les inscrits | Valeur pédagogique + soft mention cours |
| **J+7** | 7 jours | Tous les inscrits | Présentation du cours, garantie comme levier |
| **J+14** | 14 jours | **Segment** : engagés non-acheteurs | Relance unique avec code `MAGIQUE15` (-15%), deadline 48h |

**Ton Fred** : tu partout, phrases courtes, slogans signature glissés (« 10 minutes par jour bat 2 heures le dimanche »), pas de bullet-list pour les infos commerciales, métaphores rares mais choisies. Signature : `— Fred` (mails 1-2-3 de la séquence) ou `— Fred Fieffé · Musique Facile` (J+7 et J+14).

---

## 🎸 Guitare — Séquence « 5 Accords Magiques »

### J+1 — Guitare
**Subject:** Pose tes doigts ce soir

```html
<p>Salut {{contact.PRENOM}},</p>

<p>Ce soir, fais juste ça : prends ta guitare, joue <strong>Em → G</strong>, dix fois. Va-et-vient lent.</p>

<p>2 minutes. Pas plus.</p>

<p>10 minutes par jour bat 2 heures le dimanche. Le cerveau retient quand tu fais court et régulier.</p>

<p>Demain, ajoute D. Surlendemain, C. Puis Am.</p>

<p>Une semaine, tu as les 5 accords. C'est mécanique.</p>

<p>— Fred</p>

<p><small><a href="{{unsubscribe}}">Se désinscrire en 1 clic</a></small></p>
```

### J+3 — Guitare
**Subject:** Les yeux sur le manche, c'est foutu

```html
<p>Salut {{contact.PRENOM}},</p>

<p>Si tu changes d'accord en regardant tes doigts, tu vas plafonner.</p>

<p>C'est l'erreur que je corrige chez 9 élèves sur 10. Le cerveau attend l'image avant d'envoyer l'ordre aux doigts. Lent.</p>

<p>La solution : <strong>change d'accord les yeux fermés</strong>.</p>

<p>Mal au début. Très mal. Puis beaucoup mieux. Après trois jours, tu sens la position arriver sans regarder.</p>

<p>Travaille-le 3 minutes par jour sur Em → G → Em → G. Sans regarder. Comme tu cherches l'interrupteur dans le noir : tu sais où il est.</p>

<p>Si tu veux la suite — la rythmique qui groove, les barrés sans douleur, l'oreille qui retrouve les accords toute seule — tout est dans le <a href="https://musique-facile.fr/cours/cours-de-guitare">cours complet</a>. Mais commence par les yeux fermés. C'est gratuit et ça change tout.</p>

<p>— Fred</p>

<p><small><a href="{{unsubscribe}}">Se désinscrire en 1 clic</a></small></p>
```

### J+7 — Guitare
**Subject:** La semaine est passée

```html
<p>Salut {{contact.PRENOM}},</p>

<p>Une semaine. Si tu as bossé un peu, tu enchaînes Em, G, D, C, Am. Tu as 100 chansons disponibles.</p>

<p>À un moment, tu vas vouloir plus : la rythmique qui groove vraiment, les barrés qui ne font plus mal, l'oreille qui retrouve les accords d'une chanson juste en l'écoutant.</p>

<p>C'est ce que j'ai construit dans le <a href="https://musique-facile.fr/cours/cours-de-guitare">cours de guitare complet</a>. 12 ans d'enseignement, 80 000+ élèves passés par mes méthodes, un Prix Samuel Paty 2024 qui dit que la pédagogie tient la route.</p>

<p>89€ une fois, accès à vie, garantie satisfait ou remboursé 15 jours. Tu testes, si ça ne te parle pas tu me dis et je rembourse. Pas de question, pas de débat.</p>

<p>Si tu veux voir avant, la page du cours détaille tout : modules, durée, premières leçons.</p>

<p><a href="https://musique-facile.fr/cours/cours-de-guitare">→ musique-facile.fr/cours/cours-de-guitare</a></p>

<p>— Fred Fieffé · Musique Facile</p>

<p><small><a href="{{unsubscribe}}">Se désinscrire en 1 clic</a></small></p>
```

### J+14 — Guitare (relance avec code, segment engagés non-acheteurs)
**Subject:** 48h, c'est la seule fois

```html
<p>Salut {{contact.PRENOM}},</p>

<p>Deux semaines que je t'envoie des emails guitare. Si tu n'as pas accroché au cours, ignore celui-ci.</p>

<p>Mais si tu y as pensé sans te lancer, voici un coup de pouce :</p>

<p>
  <strong>Code MAGIQUE15</strong> → -15% sur le cours de guitare complet<br>
  Valable <strong>48h</strong> à partir de maintenant<br>
  89€ → 75,65€
</p>

<p>C'est la seule fois où je fais ce geste sur cette séquence. Pas un truc qui revient tous les mois.</p>

<p><a href="https://musique-facile.fr/cours/cours-de-guitare">→ musique-facile.fr/cours/cours-de-guitare</a> (code à entrer à la commande)</p>

<p>La garantie 15j satisfait ou remboursé reste valable en plus. Tu testes, ça ne te plaît pas, tu me dis, je rembourse.</p>

<p>— Fred</p>

<p><small><a href="{{unsubscribe}}">Se désinscrire en 1 clic</a></small></p>
```

---

## 🎹 Piano — Séquence « Lire les notes »

### J+1 — Piano
**Subject:** Ouvre une partition ce soir

```html
<p>Salut {{contact.PRENOM}},</p>

<p>Petit exercice. Ouvre n'importe quelle partition (carnet, Google, livre).</p>

<p>Repère <strong>un Do central</strong>. Pas plus. Une note.</p>

<p>30 secondes par jour, sept jours d'affilée. Tu connaîtras le Do central par cœur, instantanément, à vie.</p>

<p>Le cerveau construit la lecture autour de points fixes. Ancre le Do, le reste se place autour : Ré au-dessus, Si en dessous. C'est la logique de voisinage du guide.</p>

<p>— Fred</p>

<p><small><a href="{{unsubscribe}}">Se désinscrire en 1 clic</a></small></p>
```

### J+3 — Piano
**Subject:** Arrête de nommer note par note

```html
<p>Salut {{contact.PRENOM}},</p>

<p>Si tu lis « do… ré… mi… fa… » dans ta tête, tu lis lettre par lettre.</p>

<p>Ça marche au début. Puis tu plafonnes. Tu n'arrives jamais à lire fluide.</p>

<p>La vraie lecture, c'est l'<strong>astuce 4 du guide : par tierces</strong>. Au piano, presque tout est construit par sauts d'une note sur deux. Do-Mi-Sol. Ré-Fa-La. Tu reconnais la forme — ligne-ligne ou interligne-interligne — tu joues. Tu ne nommes plus.</p>

<p>5 minutes ce soir : prends 4 mesures faciles. Au lieu de nommer, dis « monte » ou « descend ». Joue lentement.</p>

<p>Quelques jours et tu liras 2 fois plus vite, sans rien forcer.</p>

<p>C'est exactement la logique du <a href="https://musique-facile.fr/cours/cours-de-piano">cours de piano complet</a>. Pas de FACE, pas de solfège scolaire, des repères qui marchent.</p>

<p>— Fred</p>

<p><small><a href="{{unsubscribe}}">Se désinscrire en 1 clic</a></small></p>
```

### J+7 — Piano
**Subject:** Tu lis. Et maintenant ?

```html
<p>Salut {{contact.PRENOM}},</p>

<p>Une semaine que tu as les 5 astuces. Si tu les as travaillées un peu, ta lecture a déjà bougé.</p>

<p>Tu vas vouloir plus, vite : les deux mains ensemble sans qu'une se prenne pour l'autre, la rythmique (croches, syncopes — l'autre moitié de la lecture), improviser autour d'un morceau.</p>

<p>Le <a href="https://musique-facile.fr/cours/cours-de-piano">cours de piano complet</a> est construit autour de ça. Pas de FACE. Pas de gammes par cœur pendant six mois. Tu joues une vraie chanson dès la deuxième leçon. C'est ma méthode, testée sur 80 000+ élèves, et un Prix Samuel Paty 2024 qui valide la pédagogie.</p>

<p>89€ une fois, accès à vie, garantie 15 jours satisfait ou remboursé. Tu testes, si ça ne matche pas tu me dis et je rembourse. Pas de question.</p>

<p>Si tu veux voir, la page du cours détaille le programme et montre les premières leçons.</p>

<p><a href="https://musique-facile.fr/cours/cours-de-piano">→ musique-facile.fr/cours/cours-de-piano</a></p>

<p>— Fred Fieffé · Musique Facile</p>

<p><small><a href="{{unsubscribe}}">Se désinscrire en 1 clic</a></small></p>
```

### J+14 — Piano (relance avec code, segment engagés non-acheteurs)
**Subject:** Une fois, et c'est tout

```html
<p>Salut {{contact.PRENOM}},</p>

<p>Deux semaines que je t'envoie des conseils piano. Si tu n'as pas eu envie du cours, ignore celui-ci.</p>

<p>Mais si tu y as pensé sans te lancer, voici un coup de pouce :</p>

<p>
  <strong>Code MAGIQUE15</strong> → -15% sur le cours de piano complet<br>
  Valable <strong>48h</strong>, dès maintenant<br>
  89€ → 75,65€
</p>

<p>Une fois. Pas un truc récurrent. C'est la seule fois où je le fais sur cette séquence.</p>

<p>La garantie 15j satisfait ou remboursé reste valable en plus. Tu testes le cours, si ça ne te parle pas tu me le dis et je rembourse.</p>

<p><a href="https://musique-facile.fr/cours/cours-de-piano">→ musique-facile.fr/cours/cours-de-piano</a> (code à la commande)</p>

<p>— Fred</p>

<p><small><a href="{{unsubscribe}}">Se désinscrire en 1 clic</a></small></p>
```

---

## 🌺 Ukulélé — Séquence « 4 Accords »

### J+1 — Ukulélé
**Subject:** 2 minutes, ce soir

```html
<p>Salut {{contact.PRENOM}},</p>

<p>Prends ton ukulélé. Pose tes doigts sur <strong>C</strong>. Gratte quatre fois.</p>

<p>Puis <strong>Am</strong>. Gratte quatre fois. Retour C.</p>

<p>Encore. Encore. Encore.</p>

<p>Deux minutes max. Pas plus. Surtout pas plus.</p>

<p>La main gauche se forme en micro-répétitions, pas en sessions d'une heure. C'est contre-intuitif et c'est vrai. Demain tu sens la différence.</p>

<p>— Fred</p>

<p><small><a href="{{unsubscribe}}">Se désinscrire en 1 clic</a></small></p>
```

### J+3 — Ukulélé
**Subject:** Le secret est dans la main droite

```html
<p>Salut {{contact.PRENOM}},</p>

<p>Tu as remarqué qu'avec C, G, Am, F tu joues la moitié des tubes radio ?</p>

<p>Ce qui te manque, c'est la rythmique. Et presque tout le monde fait la même erreur : chercher un pattern compliqué.</p>

<p>Le secret est dans la main droite. <strong>Elle ne s'arrête jamais.</strong> Elle descend et monte en continu, comme un pendule. Tu joues les cordes quand il faut, tu loupes l'air sinon. Mais le mouvement, lui, ne s'arrête pas.</p>

<p>Essaie : main droite en va-et-vient régulier sur C, peu importe le rythme exact. Cinq minutes. Tu sens le groove arriver tout seul.</p>

<p>C'est tout bête. Et c'est ce qui sépare un ukulélé scolaire d'un ukulélé qui groove.</p>

<p>Dans le <a href="https://musique-facile.fr/cours/cours-de-ukulele">cours de ukulélé complet</a>, je décortique chaque rythmique des grands tubes. Mais commence déjà par le mouvement continu. C'est la base.</p>

<p>— Fred</p>

<p><small><a href="{{unsubscribe}}">Se désinscrire en 1 clic</a></small></p>
```

### J+7 — Ukulélé
**Subject:** Les 4 accords, et la suite

```html
<p>Salut {{contact.PRENOM}},</p>

<p>Une semaine. Si tu as joué un peu chaque jour, tes 4 accords sont en place. N'importe quelle tablature ukulélé, tu trouves quelque chose à jouer.</p>

<p>Tu vas vouloir plus, vite : varier les rythmiques (reggae, bossa, ballade), ajouter quelques accords (Dm, Em, F7), transposer pour chanter dans ta tonalité.</p>

<p>Le <a href="https://musique-facile.fr/cours/cours-de-ukulele">cours de ukulélé complet</a> sert à ça. Pas de théorie, pas de solfège. Tu joues, c'est tout. C'est ma méthode, testée sur 80 000+ élèves, Prix Samuel Paty 2024 pour le travail pédagogique.</p>

<p>89€ une fois, accès à vie, garantie 15 jours satisfait ou remboursé. Tu testes, tu n'es pas convaincu, tu me dis, je rembourse.</p>

<p>Si tu veux jeter un œil, la page du cours montre les premières leçons et tout le programme.</p>

<p><a href="https://musique-facile.fr/cours/cours-de-ukulele">→ musique-facile.fr/cours/cours-de-ukulele</a></p>

<p>— Fred Fieffé · Musique Facile</p>

<p><small><a href="{{unsubscribe}}">Se désinscrire en 1 clic</a></small></p>
```

### J+14 — Ukulélé (relance avec code, segment engagés non-acheteurs)
**Subject:** 48h, c'est la seule fois

```html
<p>Salut {{contact.PRENOM}},</p>

<p>Deux semaines qu'on échange autour du ukulélé. Si tu n'as pas accroché au cours complet, passe cet email.</p>

<p>Mais si tu y as pensé sans te lancer :</p>

<p>
  <strong>Code MAGIQUE15</strong> → -15% sur le cours de ukulélé complet<br>
  Valable <strong>48h</strong> à partir de maintenant<br>
  89€ → 75,65€
</p>

<p>C'est la seule fois où je fais ce geste sur la séquence. Pas un truc qui revient tous les mois.</p>

<p><a href="https://musique-facile.fr/cours/cours-de-ukulele">→ musique-facile.fr/cours/cours-de-ukulele</a> (code à la commande)</p>

<p>Garantie 15j satisfait ou remboursé en plus. Tu testes, ça ne te plaît pas, je rembourse.</p>

<p>— Fred</p>

<p><small><a href="{{unsubscribe}}">Se désinscrire en 1 clic</a></small></p>
```

---

## Configuration dans Brevo Marketing Automation

### Séquence principale (J+1 / J+3 / J+7) — 3 workflows à créer

**Pour chaque lead magnet** (guitare, piano, ukulélé) :

1. **Templates** → créer les 3 templates (J+1, J+3, J+7) avec les HTML ci-dessus
2. **Automation** → Créer un workflow
3. **Trigger** : « A contact has been added to a list » → liste « Lead magnet · Guitare » (ou Piano / Ukulélé)
4. **Étape 1** : Wait 1 day
5. **Étape 2** : Send email → template J+1
6. **Étape 3** : Wait 2 days (cumul = 3 jours)
7. **Étape 4** : Send email → template J+3
8. **Étape 5** : Wait 4 days (cumul = 7 jours)
9. **Étape 6** : Send email → template J+7
10. Activer le workflow

Répéter pour les 2 autres listes.

### Email J+14 (relance avec code) — 3 workflows séparés

**Logique** : déclenché uniquement pour les **non-acheteurs engagés** (ont ouvert au moins 1 mail de la séquence, mais pas encore acheté le cours).

#### Étape A — Préparer l'attribut « HAS_BOUGHT »

Cet attribut doit être posé à `true` sur le contact quand l'achat est confirmé (à brancher avec ton système de paiement — Stripe webhook, ou manuel pour démarrer).

Si tu n'as pas encore d'automatisation côté paiement, tu peux temporairement :
- Soit envoyer J+14 à tous (les acheteurs ignoreront, mais reçoivent un email avec promo dont ils n'ont plus besoin)
- Soit décocher manuellement les acheteurs dans la liste avant le J+14 (ingérable à l'échelle)

**Recommandation** : commencer avec l'attribut, même si en MVP tu le poses à la main pour les premiers achats.

#### Étape B — Créer un segment dans Brevo

1. **Contacts → Segments → New segment** : `Lead magnet Guitare · engagés non-acheteurs`
2. Conditions :
   - **A appartient à la liste** : « Lead magnet · Guitare »
   - **ET** **L'attribut HAS_BOUGHT n'est pas égal à** : `true`
   - **ET** (optionnel mais recommandé) **A ouvert au moins** : 1 email dans les 14 derniers jours

#### Étape C — Workflow J+14

1. **Automation** → Créer un workflow
2. **Trigger** : « A contact has been added to a list » → liste « Lead magnet · Guitare »
3. **Étape 1** : Wait 14 days
4. **Étape 2** : Condition « Is contact in segment ? » → segment `Lead magnet Guitare · engagés non-acheteurs`
   - **Si oui** : envoyer template J+14 Guitare
   - **Sinon** : End workflow
5. Activer

Répéter pour Piano et Ukulélé.

### Notes pratiques

- **Tester chaque template via « Send test »** avant activation des workflows
- **Penser au merge tag** : l'attribut Brevo doit s'appeler exactement `PRENOM` (sinon adapter `{{contact.PRENOM}}` à ce que tu utilises)
- **`{{unsubscribe}}`** est automatiquement remplacé par le lien de désinscription Brevo
- **Désinscription** : si un contact se désinscrit, Brevo le sort automatiquement de toutes les séquences
- **KPI à surveiller** :
  - Taux d'ouverture J+1 cible **> 50%** (mail le plus chaud)
  - Taux d'ouverture J+7 cible **> 35%**
  - Taux de clic J+7 vers page cours cible **> 5%**
  - Taux de conversion J+14 cible **> 2%** des engagés non-acheteurs
- **Code MAGIQUE15** : à créer dans ton système de paiement avec une durée de vie large (la deadline 48h est dans le mail, pas dans le code) — sinon créer un code unique par envoi

### Si tu utilises Stripe pour le paiement

Pour gérer le code `MAGIQUE15` côté Stripe :
1. **Stripe Dashboard → Products → Coupons → Create coupon**
2. **Type** : Percentage off → `15%`
3. **Duration** : Once
4. **Max redemptions** : sans limite (Brevo enverra seulement aux engagés non-acheteurs)
5. **Promotion code** : `MAGIQUE15`
6. Brancher à ton checkout (champ promo code activé)

Pour synchroniser `HAS_BOUGHT = true` dans Brevo après un achat :
- Webhook Stripe `checkout.session.completed` → endpoint `/api/payment-success` (à créer)
- L'endpoint update le contact Brevo via API `/v3/contacts/{email}` avec `attributes.HAS_BOUGHT = true`
- C'est un dev à faire à part — pas dans le scope de cette session

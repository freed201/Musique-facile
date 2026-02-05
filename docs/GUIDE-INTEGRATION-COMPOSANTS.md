# Guide d'Intégration — Composants Modernisés

## Vue d'ensemble

Ce guide explique comment intégrer les nouveaux composants créés lors de l'audit UX de janvier 2025.

### Composants créés

| Fichier | Description | Remplace |
|---------|-------------|----------|
| `HeroModern.astro` | Hero épuré avec 1 CTA | `Hero.astro` |
| `CoursGrid.astro` | Grille de cours moderne | `Cours.astro` |
| `TemoignagesModern.astro` | Carousel témoignages | `Temoignages.astro` |
| `LeadCaptureForm.astro` | Formulaire lead capture | `EmailCaptureForm.astro` |
| `FooterModern.astro` | Footer simplifié | `Footer.astro` |
| `VideoPlayer.astro` | Wrapper vidéo YouTube/Vimeo | Nouveau |

### Page de preview

Une page de démonstration est disponible :
```
URL: /preview-refonte
Fichier: src/pages/preview-refonte.astro
```

---

## 1. HeroModern.astro

### Import

```astro
---
import HeroModern from '../components/HeroModern.astro';
---
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "Apprenez la musique..." | Titre principal H1 |
| `subtitle` | string | "Rejoignez 80 000..." | Sous-titre descriptif |
| `ctaText` | string | "Essayer gratuitement" | Texte du bouton principal |
| `ctaUrl` | string | "/cours" | URL du CTA |
| `videoUrl` | string | "#" | URL de la vidéo démo |

### Exemple

```astro
<HeroModern
  title="Jouez votre première chanson en 7 jours"
  subtitle="La méthode qui a formé 80 000 musiciens débutants"
  ctaText="Commencer maintenant"
  ctaUrl="/cours"
/>
```

### Remplacement

Dans `src/pages/index.astro`, remplacer :
```diff
- import Hero from '../components/Hero.astro';
+ import HeroModern from '../components/HeroModern.astro';

...

- <Hero />
+ <HeroModern />
```

---

## 2. CoursGrid.astro

### Import

```astro
---
import CoursGrid from '../components/CoursGrid.astro';
---
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "Choisissez votre instrument" | Titre de section |
| `subtitle` | string | "Des cours structurés..." | Description |
| `courses` | Course[] | [Guitare, Piano, Ukulélé, Solfège] | Liste des cours |

### Type Course

```typescript
interface Course {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  url: string;
  theme: 'guitar' | 'piano' | 'ukulele' | 'solfege';
  stats?: { videos: number; hours: string; };
}
```

### Exemple personnalisé

```astro
<CoursGrid
  title="Nos formations"
  courses={[
    {
      id: 'guitar',
      icon: '🎸',
      title: 'Guitare Débutant',
      description: 'Votre première formation guitare',
      features: ['Accords de base', 'Premières chansons'],
      url: '/cours/cours-de-guitare',
      theme: 'guitar',
      stats: { videos: 82, hours: '4h' }
    }
  ]}
/>
```

---

## 3. TemoignagesModern.astro

### Import

```astro
---
import TemoignagesModern from '../components/TemoignagesModern.astro';
---
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "Ce que nos élèves en disent" | Titre de section |
| `testimonials` | Testimonial[] | [3 témoignages par défaut] | Liste des témoignages |

### Type Testimonial

```typescript
interface Testimonial {
  id: string;
  name: string;
  role: string;
  image?: string;
  quote: string;
  rating: number;
  instrument: 'guitar' | 'piano' | 'ukulele' | 'solfege';
}
```

### Carousel automatique

Le carousel inclut :
- Scroll horizontal natif (mobile-friendly)
- Boutons prev/next
- Dots de navigation
- Mise à jour automatique des dots au scroll

---

## 4. LeadCaptureForm.astro

### Import

```astro
---
import LeadCaptureForm from '../components/LeadCaptureForm.astro';
---
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "Recevez votre guide gratuit" | Titre |
| `subtitle` | string | "Les 5 accords magiques..." | Description du lead magnet |
| `buttonText` | string | "Recevoir mon guide" | Texte du bouton |
| `successMessage` | string | "Vérifiez votre boîte mail !" | Message de succès |
| `leadMagnet` | string | "5-accords-guitare" | ID du lead magnet (pour tracking) |
| `theme` | 'light' \| 'dark' | "dark" | Thème de couleur |

### ⚠️ IMPORTANT: Configuration Backend

Le formulaire est **prêt visuellement** mais nécessite une connexion backend.

#### Option 1: Netlify Functions (recommandé)

1. Créer `netlify/functions/subscribe.js` :

```javascript
const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { email, leadMagnet } = JSON.parse(event.body);

  // Exemple ActiveCampaign
  const response = await fetch('https://VOTRE_COMPTE.api-us1.com/api/3/contacts', {
    method: 'POST',
    headers: {
      'Api-Token': process.env.ACTIVECAMPAIGN_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contact: { email, fieldValues: [{ field: '1', value: leadMagnet }] }
    })
  });

  if (response.ok) {
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }
  return { statusCode: 500, body: 'Error' };
};
```

2. Modifier `LeadCaptureForm.astro` ligne ~130 :

```javascript
const response = await fetch('/.netlify/functions/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, leadMagnet })
});
```

#### Option 2: SendGrid

```javascript
// Utiliser @sendgrid/mail
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Ajouter au client SendGrid Marketing
await sgMail.send({
  to: email,
  from: 'contact@musique-facile.fr',
  templateId: 'd-VOTRE_TEMPLATE_ID',
  dynamicTemplateData: { leadMagnet }
});
```

---

## 5. FooterModern.astro

### Import

```astro
---
import FooterModern from '../components/FooterModern.astro';
---
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showNewsletter` | boolean | false | Afficher formulaire newsletter (non implémenté) |

### Personnalisation

Les liens sociaux sont configurés en dur dans le composant.
Pour modifier, éditer le tableau `socialLinks` dans le fichier.

---

## 6. VideoPlayer.astro

### Import

```astro
---
import VideoPlayer from '../components/VideoPlayer.astro';
---
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | string | **requis** | URL YouTube ou Vimeo |
| `title` | string | "Vidéo" | Titre pour accessibilité |
| `poster` | string | Auto (YouTube) | Image de couverture |
| `aspectRatio` | '16/9' \| '4/3' \| '1/1' | "16/9" | Ratio d'aspect |
| `autoplay` | boolean | false | Autoplay après clic |

### Exemple

```astro
<VideoPlayer
  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  title="Introduction au cours de guitare"
  aspectRatio="16/9"
/>

<VideoPlayer
  url="https://vimeo.com/123456789"
  title="Démo piano"
  poster="/images/poster-piano.webp"
/>
```

### Fonctionnement

1. Affiche une miniature avec bouton play
2. Au clic, charge l'iframe (lazy loading)
3. Améliore les performances (pas d'iframe au chargement initial)

---

## Intégration complète

### Étape 1: Tester sur /preview-refonte

Avant de modifier la page d'accueil :
1. Lancer `npm run dev`
2. Visiter http://localhost:4321/preview-refonte
3. Vérifier le rendu sur mobile et desktop

### Étape 2: Remplacer progressivement

Dans `src/pages/index.astro` :

```astro
---
// Anciens imports
// import Hero from '../components/Hero.astro';
// import Cours from '../components/Cours.astro';
// import Temoignages from '../components/Temoignages.astro';
// import Footer from '../components/Footer.astro';

// Nouveaux imports
import HeroModern from '../components/HeroModern.astro';
import CoursGrid from '../components/CoursGrid.astro';
import TemoignagesModern from '../components/TemoignagesModern.astro';
import LeadCaptureForm from '../components/LeadCaptureForm.astro';
import FooterModern from '../components/FooterModern.astro';
---

<Layout title="Musique Facile">
  <HeroModern />

  <!-- Section avantages existante ou nouvelle -->

  <CoursGrid />

  <LeadCaptureForm
    title="Votre guide gratuit"
    subtitle="Les 5 accords pour jouer 100 chansons"
    theme="dark"
  />

  <TemoignagesModern />

  <!-- Pricing existant ou simplifié -->

  <FooterModern />
</Layout>
```

### Étape 3: Supprimer les sections non nécessaires

La page actuelle a 13+ sections. Recommandation de structure simplifiée :

1. Hero (HeroModern)
2. Avantages (3 features)
3. Cours (CoursGrid)
4. Lead Capture (LeadCaptureForm)
5. Témoignages (TemoignagesModern)
6. Pricing (simplifié)
7. CTA Final
8. Footer (FooterModern)

**Total: 8 sections** (vs 13+ actuellement)

---

## Variables d'environnement

Créer un fichier `.env` (non versionné) :

```env
# ActiveCampaign
ACTIVECAMPAIGN_API_KEY=your_api_key
ACTIVECAMPAIGN_URL=https://account.api-us1.com

# SendGrid (alternative)
SENDGRID_API_KEY=SG.xxxxx

# Google Tag Manager (optionnel, pour rendre configurable)
GTM_ID=GTM-NP758HSC
```

---

## Checklist de déploiement

- [ ] Tester /preview-refonte en local
- [ ] Configurer le backend pour LeadCaptureForm
- [ ] Remplacer Hero.astro par HeroModern.astro
- [ ] Remplacer Cours.astro par CoursGrid.astro
- [ ] Remplacer Temoignages.astro par TemoignagesModern.astro
- [ ] Remplacer Footer.astro par FooterModern.astro
- [ ] Ajouter LeadCaptureForm avant le pricing
- [ ] Supprimer les sections redondantes
- [ ] Tester sur mobile (Chrome DevTools)
- [ ] Vérifier les performances (Lighthouse)
- [ ] Déployer en staging pour validation client

---

## Support

Pour toute question sur l'intégration :
- Relire l'audit : `docs/AUDIT-UX-COMPLET-2025.md`
- Consulter les composants source dans `src/components/`
- Tester la page preview : `/preview-refonte`

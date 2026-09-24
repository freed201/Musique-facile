# Les quatre photos de la carte postale de rentrée

Ces images sont le recto de la carte postale de `/carte-postale/` (et, à terme,
de la page d'accueil). Tant qu'un fichier est absent, le recto retombe sur un
dessin CSS : aucune image cassée, aucune 404.

## Fichiers attendus

| Fichier | Instrument |
|---|---|
| `carte-guitar.webp` | Guitare |
| `carte-piano.webp` | Piano |
| `carte-ukulele.webp` | Ukulélé |
| `carte-solfege.webp` | Solfège |

Format : **3:2 horizontal**, 1800 × 1200 px, WebP (passer par
`npm run optimize-images` après avoir déposé les JPG/PNG).

## Consignes communes aux quatre images

Elles doivent former une série : même lumière, même palette, même distance.
Photographie, pas illustration. Lumière naturelle de fin d'après-midi, douce,
venant d'une fenêtre à gauche. Intérieur chaleureux et vécu, pas un studio ni
une salle de conservatoire. Bois clair, murs crème, textile.

Aucun texte, aucun logo, aucune marque d'instrument lisible. Aucun visage.
Une main ou un avant-bras est permis, jamais une personne entière. Profondeur
de champ moyenne, l'instrument net, le fond légèrement flou. Pas de vignettage
appuyé, pas de filtre saturé. Le bas de l'image reste calme sur environ 20 %
de sa hauteur : la légende du site s'y pose.

Palette : crème, beige, bois miel, une touche de vert sombre pour la guitare,
de bleu-vert pour le piano, de terre cuite pour le ukulélé, de rouge sombre
pour le solfège.

## Prompts de génération

**Guitare (`carte-guitar.webp`)**

> Photographie horizontale 3:2. Une guitare folk en bois clair appuyée contre
> un mur crème, dans un salon vécu. Un carnet ouvert et un crayon posés au sol
> à côté, une tasse de café. Lumière naturelle douce de fin d'après-midi
> venant de la gauche, ombres longues et tendres. Palette crème, beige, bois
> miel, un coussin vert sombre au second plan. Mise au point sur la guitare,
> arrière-plan légèrement flou. Aucun texte, aucun logo, aucune marque
> lisible, aucun visage. Rendu photographique naturel, sans filtre saturé.
> Zone basse de l'image calme et peu chargée.

**Piano (`carte-piano.webp`)**

> Photographie horizontale 3:2. Un piano droit en bois foncé dans une pièce
> claire, couvercle ouvert, un carnet ouvert posé sur le pupitre. Une fenêtre
> hors champ à gauche baigne les touches d'une lumière douce de fin
> d'après-midi. Palette crème, beige, bois, une touche de bleu-vert profond.
> Mise au point sur le clavier, arrière-plan légèrement flou. Aucun texte,
> aucun logo, aucune marque lisible, aucun visage. Rendu photographique
> naturel. Zone basse de l'image calme et peu chargée.

**Ukulélé (`carte-ukulele.webp`)**

> Photographie horizontale 3:2. Un ukulélé soprano posé sur une table en bois
> clair près d'une fenêtre ouverte, un carnet ouvert et un verre d'eau à côté.
> Lumière naturelle chaude de fin d'après-midi venant de la gauche. Palette
> crème, beige, bois clair, une touche de terre cuite. Mise au point sur le
> ukulélé, arrière-plan légèrement flou. Aucun texte, aucun logo, aucune
> marque lisible, aucun visage. Rendu photographique naturel. Zone basse de
> l'image calme et peu chargée.

**Solfège (`carte-solfege.webp`)**

> Photographie horizontale 3:2. Une partition ouverte sur un pupitre en bois,
> un crayon posé en travers des portées, quelques feuilles empilées à côté.
> Lumière naturelle douce de fin d'après-midi venant de la gauche, le papier
> légèrement translucide. Palette crème, papier vieilli, bois, une touche de
> rouge sombre. Mise au point sur la partition, arrière-plan légèrement flou.
> Aucun texte lisible sur le papier au-delà des notes, aucun logo, aucun
> visage. Rendu photographique naturel. Zone basse de l'image calme et peu
> chargée.

## Vérification avant de déposer

- Aucune note de musique aberrante sur une partition visible : les moteurs
  d'images en écrivent souvent d'illisibles. Préférer un cadrage où la
  partition est nette mais partiellement hors champ.
- Aucun doigt surnuméraire sur une main visible.
- Aucun texte inventé sur une couverture de carnet.

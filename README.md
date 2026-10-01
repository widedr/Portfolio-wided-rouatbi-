# Wided Rouatbi — Portfolio v2

Portfolio éditorial et animé de **Wided Rouatbi**, Senior Product Designer.
Positionnement : *« Je rends lisibles les produits métier complexes, avec l'IA dans mon process. »*

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4** + tokens en variables CSS (`app/globals.css`)
- **GSAP 3.15** (ScrollTrigger, SplitText, Draggable, Inertia, Flip) via `@gsap/react`
- **Lenis** pour le smooth scroll, synchronisé avec ScrollTrigger
- i18n **FR / EN** par segment `[locale]` + dictionnaires typés (`lib/content/fr.ts`, `en.ts`)

```bash
npm install
npm run dev        # http://localhost:3000 → redirige vers /fr ou /en
npm run build      # build de production (pages statiques)
npm run lint
npm run typecheck
```

## Structure

```
app/[locale]/
  layout.tsx                → polices, header, menu, footer, loader, curseur
  page.tsx                  → accueil
  work/page.tsx             → archive (tous les projets)
  work/[slug]/page.tsx      → détail projet (étude de cas ou fiche courte)
components/
  layout/   Header, Menu, Footer, Loader, Cursor, SmoothScroll, LocaleSwitch…
  motion/   RevealText, Reveal, RevealImage, Magnetic, Marquee, CountUp, HighlightText
  home/     HeroCarousel, Intro, Portrait, SelectedWork, Bands, Expertise, NextCta
  projects/ ProjectCard, ArchiveList, case-study/*
lib/
  motion.ts                 → easings, durées, staggers, media queries
  i18n.ts                   → locales, helpers
  projects.ts               → modèle Project + présentation (secteur, tagline, thème)
  content/projects-source.ts→ textes FR/EN des 22 projets (repris de la v1)
  content/case-studies/     → études de cas complètes (Mathis BS)
proxy.ts                    → redirection / → /fr ou /en (Accept-Language)
```

## Ajouter une étude de cas

1. Créer `lib/content/case-studies/<slug>.ts` en suivant le type `CaseStudy` (`lib/projects.ts`).
2. Le brancher dans `presentation["<slug>"].caseStudy`.
3. Les visuels vont dans `public/images/<slug>/`.

La page détail suit la trame : ouverture · en bref · contexte métier · ce qui bloquait ·
ce que j'ai conçu · au quotidien · comment j'ai travaillé (+ making-of IA) · écrans clés ·
résultats & apprentissages · projet suivant.

## Accessibilité et mouvement

- `prefers-reduced-motion` : pas de smooth scroll, parallax, curseur ni déformation ; contenu affiché directement.
- Les états cachés initiaux sont posés par JavaScript : le site reste lisible sans JS.
- Navigation clavier complète (carrousel ← →, menu avec piège du focus et Échap, onglets, lightbox).
- Loader joué une seule fois par session.

## Feuille de route

- [x] Étape 1 — fondations, accueil, archive, étude de cas Mathis BS
- [ ] Étape 2 — pages Projets (carrousel / grille + filtres), À propos, Contact (formulaire)
- [ ] Étape 3 — transitions de page (rideau, Flip liste → détail, projet suivant)
- [ ] Étape 4 — passe Lighthouse, déploiement Vercel

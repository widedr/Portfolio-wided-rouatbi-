import type { CaseStudy } from "../../projects";

const screen = { width: 533, height: 357 };

export const mathisCaseStudy: CaseStudy = {
  subtitle: {
    fr: "Rendre lisible la fiscalité immobilière des bailleurs sociaux.",
    en: "Making social-housing property tax legible.",
  },
  status: {
    fr: "Conception, avant développement",
    en: "Design phase, ahead of development",
  },
  client: { fr: "Neoshore (produit interne)", en: "Neoshore (in-house product)" },

  context: {
    text: {
      fr: [
        "Un bailleur social construit, loue et entretient des logements à loyer modéré. Comme tout propriétaire, il paie la taxe foncière, mais sur des milliers de logements à la fois.",
        "Chaque année, des exonérations, des dégrèvements et des événements patrimoniaux (une vente, une démolition) font bouger la facture. Les équipes jonglent entre plusieurs outils pour suivre, analyser, simuler et déclarer.",
        "Le leader du marché vise tout le monde. Les bailleurs de taille moyenne, eux, restent mal équipés. Mathis BS est fait pour eux.",
      ],
      en: [
        "A social housing provider builds, rents out and maintains low-rent homes. Like any owner it pays property tax, but on thousands of homes at once.",
        "Every year, exemptions, tax relief and asset events (a sale, a demolition) shift the bill. Teams juggle several tools to track, analyse, simulate and file.",
        "The market leader targets everyone. Mid-sized providers remain under-equipped. Mathis BS is built for them.",
      ],
    },
    facts: [
      { value: "1 000–15 000", label: { fr: "logements par bailleur ciblé", en: "homes per target provider" } },
      { value: "16", label: { fr: "modules analysés dans l'audit concurrentiel", en: "modules analysed in the competitive audit" } },
      { value: "~95", label: { fr: "fonctionnalités priorisées au backlog", en: "features prioritised in the backlog" } },
    ],
  },

  problems: [
    {
      id: "01",
      title: { fr: "Des données éparpillées.", en: "Scattered data." },
      text: {
        fr: "Patrimoine, cadastre et fiscalité vivaient dans des outils séparés. Personne n'avait de vue consolidée.",
        en: "Assets, land registry and tax data lived in separate tools. Nobody had a consolidated view.",
      },
    },
    {
      id: "02",
      title: { fr: "Un simulateur pour deux usages.", en: "One simulator for two jobs." },
      text: {
        fr: "Suivre la fiscalité dans la durée et décider d'une vente ponctuelle ne relèvent pas du même raisonnement.",
        en: "Monitoring tax over time and deciding on a one-off sale don't follow the same reasoning.",
      },
    },
    {
      id: "03",
      title: { fr: "Une navigation trop profonde.", en: "Navigation that ran too deep." },
      text: {
        fr: "Trop d'entrées de premier niveau dispersaient des informations liées sur plusieurs pages.",
        en: "Too many top-level entries spread related information across several pages.",
      },
    },
    {
      id: "04",
      title: { fr: "Un vocabulaire qui n'était pas le leur.", en: "Vocabulary that wasn't theirs." },
      text: {
        fr: "Certains libellés reprenaient le jargon interne au lieu des mots des gestionnaires et des comptables.",
        en: "Some labels used internal jargon instead of the words asset managers and accountants use.",
      },
    },
  ],

  solutions: [
    {
      title: { fr: "Une vision patrimoniale consolidée.", en: "A consolidated asset view." },
      text: {
        fr: "Données patrimoniales, cadastrales et fiscales réunies sur une carte et une fiche par bien.",
        en: "Asset, land-registry and tax data brought together on one map and one record per property.",
      },
      solves: ["01"],
    },
    {
      title: { fr: "Deux moteurs au lieu d'un.", en: "Two engines instead of one." },
      text: {
        fr: "La Projection fiscale suit le patrimoine existant en continu. Le Simulateur de projet aide à trancher un événement ponctuel. Deux modèles mentaux, deux outils.",
        en: "Tax Projection follows the existing portfolio continuously. Project Simulator helps decide on a one-off event. Two mental models, two tools.",
      },
      solves: ["02"],
    },
    {
      title: { fr: "Moins de menus, des fiches plus riches.", en: "Fewer menus, richer records." },
      text: {
        fr: "J'ai réduit les entrées de premier niveau en regroupant les informations connexes dans une même fiche.",
        en: "I cut top-level entries by grouping related information inside a single record.",
      },
      solves: ["03", "01"],
    },
    {
      title: { fr: "Les mots du métier.", en: "The users' own words." },
      text: {
        fr: "J'ai réécrit le vocabulaire d'un module avec l'expert fiscal interne pour qu'il colle au langage des utilisateurs.",
        en: "I rewrote a module's vocabulary with the in-house tax expert so it matches the users' language.",
      },
      solves: ["04"],
    },
  ],

  personas: [
    {
      role: { fr: "Le gestionnaire patrimonial", en: "The asset manager" },
      situation: {
        fr: "Il doit expliquer pourquoi la taxe foncière d'un quartier a augmenté, avec des données dans trois outils.",
        en: "He has to explain why a neighbourhood's property tax went up, with data spread across three tools.",
      },
      outcome: {
        fr: "Il filtre la carte par commune et lit le montant par bien sans quitter l'écran.",
        en: "He filters the map by municipality and reads the amount per property without leaving the screen.",
      },
      image: "/images/mathis/patrimoine.png",
    },
    {
      role: { fr: "La responsable fiscale", en: "The tax lead" },
      situation: {
        fr: "La direction envisage de vendre un ensemble de logements et veut connaître l'impact fiscal avant de décider.",
        en: "Management is considering selling a housing block and wants the tax impact before deciding.",
      },
      outcome: {
        fr: "Elle ouvre le Simulateur de projet, pas la Projection : l'outil correspond à la question posée.",
        en: "She opens the Project Simulator, not the Projection: the tool matches the question asked.",
      },
      image: "/images/mathis/simulation.png",
    },
    {
      role: { fr: "Le comptable", en: "The accountant" },
      situation: {
        fr: "Il traite des dizaines d'écritures liées aux taxes en fin de période.",
        en: "He processes dozens of tax-related entries at period end.",
      },
      outcome: {
        fr: "Il enchaîne les traitements dans une seule liste, avec statut et actions en bout de ligne.",
        en: "He works through entries in one list, with status and actions at the end of each row.",
      },
      image: "/images/mathis/comptabilite.png",
    },
  ],

  process: [
    {
      step: { fr: "Audit concurrentiel", en: "Competitive audit" },
      text: {
        fr: "Audit fonctionnel documenté du leader du marché, analyse des écarts.",
        en: "Documented functional audit of the market leader, gap analysis.",
      },
    },
    {
      step: { fr: "Spécifications", en: "Specifications" },
      text: {
        fr: "Besoin cadré par le PO, traduit en specs actionnables pour les développeurs.",
        en: "Needs scoped by the PO, turned into actionable specs for developers.",
      },
    },
    {
      step: { fr: "Architecture de l'information", en: "Information architecture" },
      text: {
        fr: "Regroupements, profondeur de navigation, vocabulaire produit.",
        en: "Groupings, navigation depth, product vocabulary.",
      },
    },
    {
      step: { fr: "Design system", en: "Design system" },
      text: {
        fr: "Composants de données : KPI, tableaux, cartes, graphiques.",
        en: "Data components: KPIs, tables, maps, charts.",
      },
    },
    {
      step: { fr: "Prototypage", en: "Prototyping" },
      text: { fr: "Maquettes Figma haute fidélité, revues avec l'expert fiscal.", en: "High-fidelity Figma designs, reviewed with the tax expert." },
    },
    {
      step: { fr: "Passage au développement", en: "Handoff to development" },
      text: { fr: "Specs et maquettes prêtes pour l'équipe de développement.", en: "Specs and designs ready for the development team." },
    },
  ],

  aiMethod: {
    title: { fr: "methode-ia.md", en: "ai-method.md" },
    lines: {
      fr: [
        "# Où l'IA intervient dans mon process",
        "",
        "- Explorer plus de pistes de conception, plus vite",
        "- Structurer les enseignements de l'audit concurrentiel",
        "- Passer de la spécification fonctionnelle au design Figma",
        "",
        "# Ce que je garde",
        "",
        "- Les arbitrages d'architecture de l'information",
        "- La validation métier, avec l'expert fiscal",
        "- La précision réglementaire : pas d'approximation",
      ],
      en: [
        "# Where AI fits in my process",
        "",
        "- Explore more design directions, faster",
        "- Structure the competitive audit's findings",
        "- Go from functional spec to Figma design",
        "",
        "# What stays with me",
        "",
        "- Information architecture trade-offs",
        "- Domain validation, with the tax expert",
        "- Regulatory precision: no approximation",
      ],
    },
  },

  screens: [
    {
      src: "/images/mathis/patrimoine.png",
      ...screen,
      title: { fr: "Patrimoine", en: "Assets" },
      alt: {
        fr: "Écran Patrimoine : carte des biens par commune, à côté d'une fiche avec le montant de taxe foncière.",
        en: "Assets screen: map of properties by municipality, next to a record showing the property tax amount.",
      },
      decision: {
        fr: "La carte et la fiche du bien partagent le même écran. Regrouper plutôt que disperser : l'utilisateur garde le contexte géographique pendant qu'il lit les chiffres.",
        en: "The map and the property record share one screen. Grouping instead of scattering: users keep the geographic context while reading the numbers.",
      },
    },
    {
      src: "/images/mathis/simulation.png",
      ...screen,
      title: { fr: "Projection fiscale", en: "Tax projection" },
      alt: {
        fr: "Écran Projection fiscale : indicateurs clés, graphique d'évolution sur dix ans et alertes.",
        en: "Tax projection screen: key indicators, ten-year trend chart and alerts.",
      },
      decision: {
        fr: "La projection continue est séparée du simulateur de projet. Ici, on suit le patrimoine existant : des KPI en haut, la tendance au centre, les alertes à droite.",
        en: "Continuous projection is kept apart from the project simulator. Here you monitor the existing portfolio: KPIs on top, the trend in the middle, alerts on the right.",
      },
    },
    {
      src: "/images/mathis/fiscalite.png",
      ...screen,
      title: { fr: "Opportunités", en: "Opportunities" },
      alt: {
        fr: "Écran Opportunités : économies fiscales détectées, classées par type avec leur montant.",
        en: "Opportunities screen: detected tax savings, grouped by type with their amount.",
      },
      decision: {
        fr: "Les opportunités sont classées par type, montant visible d'emblée. L'utilisateur voit d'abord où se trouvent les économies, puis le détail.",
        en: "Opportunities are grouped by type with the amount visible upfront. Users first see where the savings are, then the detail.",
      },
    },
    {
      src: "/images/mathis/degrevements.png",
      ...screen,
      title: { fr: "Dégrèvements", en: "Tax relief" },
      alt: {
        fr: "Écran Dégrèvements TFPB : dossiers en cartes avec avancement et montant.",
        en: "Property-tax relief screen: case files as cards with progress and amount.",
      },
      decision: {
        fr: "Chaque dossier est une carte avec son avancement et son montant. On suit l'état de tous les dossiers sans en ouvrir un seul.",
        en: "Each case file is a card with its progress and amount. You can follow every file without opening any of them.",
      },
    },
    {
      src: "/images/mathis/comptabilite.png",
      ...screen,
      title: { fr: "Comptabilité", en: "Accounting" },
      alt: {
        fr: "Écran Comptabilité : liste des traitements avec statut et actions.",
        en: "Accounting screen: list of entries with status and actions.",
      },
      decision: {
        fr: "Une liste unique, statut et actions en bout de ligne : le comptable traite en série, sans changer de vue.",
        en: "One list, with status and actions at the end of each row: the accountant works in batches without switching views.",
      },
    },
    {
      src: "/images/mathis/reporting.png",
      ...screen,
      title: { fr: "Rapport final", en: "Final report" },
      alt: {
        fr: "Écran Rapport final : montant dégrevé par dispositif et carte des communes.",
        en: "Final report screen: relief amount per scheme and a map of municipalities.",
      },
      decision: {
        fr: "Le rapport résume le montant dégrevé par dispositif et par commune. C'est le livrable que l'équipe présente en interne, donc il doit se lire en dix secondes.",
        en: "The report sums up relief per scheme and per municipality. It's what the team presents internally, so it has to read in ten seconds.",
      },
    },
  ],

  results: {
    statement: {
      fr: "Le produit est encore en conception : pas de métriques d'impact à ce stade, et je préfère ne pas en inventer. Par confidentialité, une partie de l'audit et certains détails fonctionnels restent privés.",
      en: "The product is still in the design phase: no impact metrics yet, and I'd rather not invent any. For confidentiality, part of the audit and some functional details stay private.",
    },
    learnings: [
      {
        fr: "Dans un domaine réglementaire, l'expert métier est mon premier utilisateur. Je valide avec lui avant de valider à l'écran.",
        en: "In a regulated domain, the domain expert is my first user. I validate with them before I validate on screen.",
      },
      {
        fr: "Deux usages qui se ressemblent peuvent cacher deux modèles mentaux. Les séparer a simplifié les deux.",
        en: "Two similar-looking jobs can hide two mental models. Splitting them made both simpler.",
      },
      {
        fr: "L'IA m'a fait gagner du temps sur l'exploration. Les arbitrages, eux, sont restés humains.",
        en: "AI saved me time on exploration. The trade-offs stayed human.",
      },
    ],
  },
};

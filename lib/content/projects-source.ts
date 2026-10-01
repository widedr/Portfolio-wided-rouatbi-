// Content ported verbatim from the previous portfolio (widedr/portfolio-wided-rouatbi).
// Presentation fields (sector, tagline, theme, case study) live in ../projects.ts.
import type { Localized } from "../i18n";

export type SourceProject = {
  slug: string;
  title: string;
  employer: string;
  role: string;
  duration: Localized;
  description: Localized;
  longDescription: Localized<string[]>;
  tags: string[];
  image?: string;
};

export const sourceProjects: SourceProject[] = [
  {
    slug: "mathis-bs",
    title: "Mathis BS",
    employer: "Neoshore",
    role: "UX/UI Designer & Product Designer",
    duration: { fr: "Depuis mars 2026", en: "Since March 2026" },
    description: {
      fr: "Plateforme SaaS de gestion fiscale immobilière pour bailleurs sociaux.",
      en: "SaaS platform for real-estate tax management for social housing providers.",
    },
    longDescription: {
      fr: [
        "Mathis BS est une solution SaaS dédiée aux bailleurs sociaux pour simplifier et automatiser la gestion de leur fiscalité immobilière. La plateforme centralise les données patrimoniales, cadastrales et fiscales afin de faciliter le suivi des taxes foncières, l'analyse des charges fiscales, la simulation des impacts futurs et les traitements comptables et déclaratifs.",
        "L'objectif : fiabiliser les données, automatiser les processus métier et offrir aux équipes une vision consolidée de leur patrimoine et de leurs obligations fiscales — un sujet complexe rendu lisible par un dashboard clair et une hiérarchie visuelle pensée pour des utilisateurs métier, pas seulement techniques.",
      ],
      en: [
        "Mathis BS is a SaaS solution for social housing providers to simplify and automate the management of their real-estate taxation. The platform centralizes asset, cadastral and tax data to streamline property tax tracking, tax charge analysis, future impact simulation, and accounting and filing workflows.",
        "The goal: make data reliable, automate business processes and give teams a consolidated view of their assets and tax obligations — a complex topic made legible through a clear dashboard and a visual hierarchy designed for business users, not just technical ones.",
      ],
    },
    tags: ["SaaS B2B", "Fiscalité immobilière", "Product Design", "Design System", "Data Visualization"],
    image: "/images/projects/mathis-bs.jpg",
  },
  {
    slug: "attunea",
    title: "Attunea",
    employer: "Satoripop",
    role: "UX/UI Designer",
    duration: { fr: "8 mois", en: "8 months" },
    description: {
      fr: "Unifier technologie, design et besoins utilisateurs dans une expérience fluide, pour l'app web (CRM) et le site.",
      en: "Unifying technology, design and user needs into one seamless experience, across the web app (CRM) and the website.",
    },
    longDescription: {
      fr: [
        "Attunea réunit technologie, design et besoins utilisateurs au sein d'une expérience digitale cohérente. J'ai travaillé à la fois sur l'application web (CRM) et sur le site, en structurant l'information et en unifiant les parcours entre les deux surfaces.",
        "La phase de recherche a mis en évidence plusieurs axes clés : parité fonctionnelle entre les surfaces, modèle de données unifié et composants réutilisables — des insights qui ont guidé la construction d'un design system partagé. Le résultat couvre la gestion des routines, des projets et des réunions dans une interface claire et modulaire.",
      ],
      en: [
        "Attunea brings together technology, design and user needs into one coherent digital experience. I worked on both the web app (CRM) and the website, structuring information and unifying the journeys across both surfaces.",
        "The research phase surfaced several key themes: feature parity across surfaces, a unified data model, and reusable components — insights that shaped a shared design system. The result covers routines, project and meeting management in a clear, modular interface.",
      ],
    },
    tags: ["UI/UX", "Dashboard", "Design System", "Web Design", "Benchmarking"],
    image: "/images/projects/attunea.jpg",
  },
  {
    slug: "five-guys",
    title: "Five Guys",
    employer: "Satoripop",
    role: "UX/UI Designer",
    duration: { fr: "4 mois", en: "4 months" },
    description: {
      fr: "Optimiser le workflow et la gestion des formulaires pour fluidifier les processus organisationnels.",
      en: "Optimizing workflow and form management to streamline organizational processes.",
    },
    longDescription: {
      fr: [
        "Ce projet visait à optimiser le workflow et la gestion des formulaires internes, en simplifiant des processus organisationnels jusque-là fragmentés.",
        "Le travail de recherche (cartographie des flux, interviews utilisateurs, benchmark) a nourri un audit complet de la plateforme existante avant refonte. La solution finale introduit un constructeur de workflows visuel et un panneau de suivi détaillé des demandes, pensés pour réduire la charge cognitive des équipes opérationnelles.",
      ],
      en: [
        "This project aimed to optimize workflow and internal form management, simplifying organizational processes that had previously been fragmented.",
        "Research work (flow mapping, user interviews, benchmarking) fed a full audit of the existing platform ahead of the redesign. The final solution introduces a visual workflow builder and a detailed request-tracking panel, designed to reduce cognitive load for operations teams.",
      ],
    },
    tags: ["Dashboard", "Design System", "Audit"],
    image: "/images/projects/five-guys.jpg",
  },
  {
    slug: "travel-shaper",
    title: "Travel Shaper",
    employer: "Satoripop",
    role: "UX/UI Designer",
    duration: { fr: "10 mois", en: "10 months" },
    description: {
      fr: "Plateforme de voyage propulsée par l'IA centralisant réservation, découverte et planification.",
      en: "AI-powered travel platform centralizing booking, discovery and planning.",
    },
    longDescription: {
      fr: [
        "Travel Shaper est une plateforme propulsée par l'IA qui centralise la réservation, la découverte et la planification de voyages en un seul endroit.",
        "La phase d'idéation s'est appuyée sur une User Story Map détaillant le MVP et les parcours prioritaires. Le résultat est une expérience mobile-first et conversationnelle : un assistant de chat guide l'utilisateur du choix de destination jusqu'à la réservation, avec une attention particulière portée au voyage éco-responsable.",
      ],
      en: [
        "Travel Shaper is an AI-powered platform that centralizes travel booking, discovery and planning in one place.",
        "The ideation phase relied on a User Story Map detailing the MVP and priority journeys. The result is a mobile-first, conversational experience: a chat assistant guides the user from choosing a destination through to booking, with a particular focus on eco-responsible travel.",
      ],
    },
    tags: ["Dashboard", "Design System", "Audit"],
    image: "/images/projects/travel-shaper.jpg",
  },
  {
    slug: "carrefour-tn",
    title: "Carrefour.tn",
    employer: "Satoripop",
    role: "UX/UI Designer",
    duration: { fr: "3 mois", en: "3 months" },
    description: {
      fr: "Refonte du site Carrefour Tunisie pour une expérience d'achat digitale moderne et fluide.",
      en: "Redesign of the Carrefour Tunisia website for a modern, seamless digital shopping experience.",
    },
    longDescription: {
      fr: [
        "Carrefour Tunisie avait besoin d'un site reflétant son innovation, sa qualité et sa praticité. La refonte s'est concentrée sur la navigation, le design visuel et l'utilisabilité pour renforcer la présence en ligne de l'enseigne.",
        "L'approche a été pensée mobile-first, avec une nouvelle page d'accueil et un système de localisation des magasins repensé pour guider les clients du parcours en ligne jusqu'au point de vente.",
      ],
      en: [
        "Carrefour Tunisia needed a website reflecting its innovation, quality and convenience. The redesign focused on navigation, visual design and usability to strengthen the brand's online presence.",
        "The approach was mobile-first, with a new homepage and a redesigned store-locator system to guide customers from the online journey through to the point of sale.",
      ],
    },
    tags: ["UI/UX", "Dashboard", "Audit"],
    image: "/images/projects/carrefour-tn.jpg",
  },
  {
    slug: "planet-tax-solution",
    title: "Planet Tax Solution",
    employer: "Satoripop",
    role: "UX/UI Designer",
    duration: { fr: "5 mois", en: "5 months" },
    description: {
      fr: "Expérience fluide et intuitive pour les marchands, du back-office au front-office fiscal.",
      en: "Smooth, intuitive experience for merchants, from the back office to the tax front office.",
    },
    longDescription: {
      fr: [
        "En tant que designer UX/UI sur Planet Tax Solution, j'ai conçu une expérience fluide et intuitive pour les marchands, couvrant à la fois le back-office et le front-office fiscal.",
        "Le travail est parti de wireframes en mode skeleton pour valider rapidement l'architecture de l'information, avant d'aboutir à un dashboard complet incluant statistiques de vente et une déclinaison mobile pour un usage en point de vente.",
      ],
      en: [
        "As UX/UI designer on Planet Tax Solution, I designed a smooth, intuitive experience for merchants, covering both the back office and the tax-facing front office.",
        "The work started with skeleton wireframes to quickly validate the information architecture, leading to a full dashboard with sales statistics and a mobile version for point-of-sale use.",
      ],
    },
    tags: ["Wireframes", "Backoffice", "Front office"],
    image: "/images/projects/planet-tax-solution.jpg",
  },
  {
    slug: "clever-harvest",
    title: "Clever Harvest",
    employer: "Satoripop",
    role: "UX/UI Designer",
    duration: { fr: "5 mois", en: "5 months" },
    description: {
      fr: "Plateforme de traçabilité intuitive pour des produits agricoles comme l'olive, le café et le cacao.",
      en: "Intuitive traceability platform for agricultural products like olive, coffee and cocoa.",
    },
    longDescription: {
      fr: [
        "Sur Clever Harvest, j'ai contribué à façonner une plateforme de traçabilité intuitive pour des filières agricoles comme l'olive, le café ou le cacao.",
        "Le design system responsive mis en place permet de suivre chaque produit via des écrans de traçabilité par QR code, dans une identité visuelle inspirée du monde agricole.",
      ],
      en: [
        "On Clever Harvest, I helped shape an intuitive traceability platform for agricultural supply chains such as olive, coffee and cocoa.",
        "The responsive design system I built lets users track each product through QR-code traceability screens, in a visual identity inspired by the agricultural world.",
      ],
    },
    tags: ["Design System", "Dashboard", "Responsive"],
    image: "/images/projects/clever-harvest.jpg",
  },
  {
    slug: "demco",
    title: "Demco",
    employer: "WeAre Moon",
    role: "UX/UI Designer",
    duration: { fr: "7 mois", en: "7 months" },
    description: {
      fr: "Plateforme B2B pour la fabrication durable, simplifiant lancement de collections et collaborations.",
      en: "B2B platform for sustainable manufacturing, simplifying collection launches and collaborations.",
    },
    longDescription: {
      fr: [
        "Demco est une plateforme B2B pensée pour des clients de la fabrication durable, simplifiant le lancement de nouvelles collections, les demandes de collaboration et la planification de réunions.",
        "Le projet a démarré par une phase de wireframing et de recherche pour cartographier les besoins des équipes commerciales et de production, avant d'aboutir à des grilles produits et des formulaires de commande directe pensés pour un usage B2B exigeant.",
      ],
      en: [
        "Demco is a B2B platform designed for sustainable-manufacturing clients, simplifying new collection launches, collaboration requests and meeting scheduling.",
        "The project started with wireframing and research to map the needs of sales and production teams, leading to product grids and direct order forms designed for demanding B2B use.",
      ],
    },
    tags: ["Wireframes", "B2B Platform", "Research"],
    image: "/images/projects/demco.jpg",
  },
  {
    slug: "rizouya",
    title: "Rizouya",
    employer: "WeAre Moon",
    role: "UX/UI Designer",
    duration: { fr: "4 mois", en: "4 months" },
    description: {
      fr: "Plateforme tunisienne connectant chercheurs d'emploi et employeurs.",
      en: "Tunisian platform connecting job seekers and employers.",
    },
    longDescription: {
      fr: [
        "Rizouya connecte chercheurs d'emploi et employeurs sur le marché tunisien.",
        "Après une phase de wireframing et de benchmark concurrentiel, l'interface finale met l'accent sur la mise en relation : recherche d'offres, mise en avant des profils et suivi des candidatures dans une identité visuelle sobre et professionnelle.",
      ],
      en: [
        "Rizouya connects job seekers and employers in the Tunisian market.",
        "After a wireframing and competitive-benchmark phase, the final interface focuses on matchmaking: job search, profile highlighting and application tracking, in a sober, professional visual identity.",
      ],
    },
    tags: ["Wireframes", "Benchmark"],
    image: "/images/projects/rizouya.jpg",
  },
  {
    slug: "avs-vip-services",
    title: "AVS VIP Services",
    employer: "WeAre Moon",
    role: "UX/UI Designer",
    duration: { fr: "6 mois", en: "6 months" },
    description: {
      fr: "Gestion des contrats membres et suivi des commandes pour un club VIP.",
      en: "Member contract management and order tracking for a VIP club.",
    },
    longDescription: {
      fr: [
        "Pour l'équipe AVS, la plateforme offre des capacités robustes pour gérer efficacement les contrats des membres et suivre le flux des commandes.",
        "La recherche et le benchmark menés en amont ont permis de concevoir un back-office couvrant la gestion des contrats, la planification et le suivi des places de parking, dans une identité visuelle sombre et premium assortie d'accents dorés.",
      ],
      en: [
        "For the AVS team, the platform offers robust capabilities to efficiently manage member contracts and track order flow.",
        "Upfront research and benchmarking shaped a back office covering contract management, scheduling and parking-space tracking, in a dark, premium visual identity with gold accents.",
      ],
    },
    tags: ["Wireframes", "Research"],
    image: "/images/projects/avs-vip-services.jpg",
  },
  {
    slug: "clinique-veterinaire-hammamet",
    title: "Clinique Vétérinaire Hammamet",
    employer: "Freelance",
    role: "UX/UI Designer",
    duration: { fr: "3 mois", en: "3 months" },
    description: {
      fr: "Site et app pour aider les propriétaires d'animaux à trouver soins, toilettage et adoption.",
      en: "Website and app helping pet owners find care, grooming and adoption services.",
    },
    longDescription: {
      fr: [
        "Ce site et cette application aident les propriétaires d'animaux à trouver facilement tout ce dont leurs compagnons ont besoin : soins vétérinaires, toilettage, produits et adoption.",
        "Le travail de branding et de benchmark a nourri une identité chaleureuse et rassurante, portée par la photographie animalière, pour humaniser une prise de rendez-vous vétérinaire souvent perçue comme austère.",
      ],
      en: [
        "This website and app help pet owners easily find everything their companions need: veterinary care, grooming, products and adoption.",
        "Branding and benchmark work shaped a warm, reassuring identity carried by pet photography, humanizing a vet-appointment booking flow often perceived as clinical.",
      ],
    },
    tags: ["Branding", "Benchmark"],
    image: "/images/projects/clinique-veterinaire-hammamet.jpg",
  },
  {
    slug: "bridge-global-funding",
    title: "Bridge Global Funding",
    employer: "Satoripop",
    role: "UX/UI Designer",
    duration: { fr: "6 mois", en: "6 months" },
    description: {
      fr: "Plateforme data-driven connectant des femmes entrepreneures à des investisseurs.",
      en: "Data-driven platform connecting women entrepreneurs with investors.",
    },
    longDescription: {
      fr: [
        "The Bridge Funding Global est une plateforme data-driven qui donne aux femmes entrepreneures les moyens d'optimiser leur levée de fonds et de se connecter à des investisseurs proactifs.",
        "Le design system et le back-office construits pendant ce projet couvrent la prise de rendez-vous et la planification d'événements, dans une identité visuelle marine et or pensée pour inspirer confiance auprès d'un public d'investisseurs.",
      ],
      en: [
        "The Bridge Funding Global is a data-driven platform empowering women entrepreneurs to optimize their fundraising and connect with proactive investors.",
        "The design system and back office built during this project cover appointment booking and event scheduling, in a navy-and-gold visual identity meant to inspire trust with an investor audience.",
      ],
    },
    tags: ["Design System", "Research", "Back office"],
    image: "/images/projects/bridge-global-funding.jpg",
  },
  {
    slug: "convergence",
    title: "Convergence",
    employer: "Satoripop",
    role: "UX/UI Designer",
    duration: { fr: "6 mois", en: "6 months" },
    description: {
      fr: "Transformation digitale pour l'assurance, la banque et la finance, avec chatbot intégré.",
      en: "Digital transformation for insurance, banking and finance, with a built-in chatbot.",
    },
    longDescription: {
      fr: [
        "Convergence accompagne la transformation digitale des acteurs de l'assurance, de la banque et de la finance en délivrant des solutions innovantes, chatbot inclus.",
        "La page \"Solutions & Interfaces\" met en avant une promesse claire — construire des liens forts avec ses clients — appuyée par un dashboard de suivi et des graphiques de performance, dans une identité violette engageante.",
      ],
      en: [
        "Convergence drives digital transformation for insurance, banking and finance players by delivering innovative solutions, chatbot included.",
        "The \"Solutions & Interfaces\" page highlights a clear promise — building strong ties with customers — backed by a tracking dashboard and performance charts, in an engaging purple visual identity.",
      ],
    },
    tags: ["Chatbot", "Design System", "Mobile App"],
    image: "/images/projects/convergence.jpg",
  },
  {
    slug: "fuze-digital-africa",
    title: "Fuzé Digital Africa",
    employer: "Satoripop",
    role: "UX/UI Designer",
    duration: { fr: "1 mois", en: "1 month" },
    description: {
      fr: "Démocratiser l'accès au financement en Afrique francophone.",
      en: "Democratizing access to funding in Francophone Africa.",
    },
    longDescription: {
      fr: [
        "Fuzé vise à démocratiser l'accès au financement en Afrique francophone, un territoire où l'accès aux liquidités reste un frein majeur pour de nombreux entrepreneurs.",
        "En un mois, la landing page conçue mise sur une identité colorée et des illustrations engageantes pour rendre accessible un sujet financier souvent perçu comme complexe.",
      ],
      en: [
        "Fuzé aims to democratize access to funding in Francophone Africa, a region where access to liquidity remains a major barrier for many entrepreneurs.",
        "In one month, the landing page I designed leans on a colorful identity and engaging illustrations to make an often-complex financial topic approachable.",
      ],
    },
    tags: ["Landing page", "Visual design"],
    image: "/images/projects/fuze-digital-africa.jpg",
  },
  {
    slug: "ess-identity",
    title: "ESS Identity",
    employer: "Satoripop",
    role: "UX/UI Designer",
    duration: { fr: "1 mois", en: "1 month" },
    description: {
      fr: "Plateforme de billetterie en ligne pour les matchs de football du club ESS.",
      en: "Online ticketing platform for ESS football club matches.",
    },
    longDescription: {
      fr: [
        "ESS Identity est une plateforme dédiée à la billetterie en ligne pour les matchs de football du club ESS.",
        "L'identité rouge et marine du club structure l'ensemble du site, de la mise en avant des résultats sportifs jusqu'à la boutique de maillots, pour une expérience fluide de l'achat de billet au jour de match.",
      ],
      en: [
        "ESS Identity is a platform dedicated to effortless online ticketing for ESS football club matches.",
        "The club's red-and-navy identity structures the whole site, from match results to the jersey shop, for a smooth experience from ticket purchase to match day.",
      ],
    },
    tags: ["Landing page", "Visual design"],
    image: "/images/projects/ess-identity.jpg",
  },
  {
    slug: "masaya",
    title: "Masaya",
    employer: "Satoripop",
    role: "UX/UI Designer",
    duration: { fr: "4 mois", en: "4 months" },
    description: {
      fr: "Destination tout-en-un pour séjours, activités et événements hôteliers.",
      en: "All-in-one destination for hotel stays, activities and events.",
    },
    longDescription: {
      fr: [
        "Masaya est une destination tout-en-un pour réserver séjours, activités et événements hôteliers.",
        "Pensée mobile-first, l'application s'appuie sur un design system dédié pour guider l'utilisateur de la découverte d'une destination jusqu'à la réservation, dans une identité chaleureuse à dominante orange.",
      ],
      en: [
        "Masaya is an all-in-one destination for booking hotel stays, activities and events.",
        "Built mobile-first, the app relies on a dedicated design system to guide the user from discovering a destination through to booking, in a warm, orange-forward identity.",
      ],
    },
    tags: ["Design System", "Mobile First"],
    image: "/images/projects/masaya.jpg",
  },
  {
    slug: "comptat-credit-debit",
    title: "Comptat Crédit Débit",
    employer: "Diginov / Design code",
    role: "UX/UI Designer",
    duration: { fr: "1 mois", en: "1 month" },
    description: {
      fr: "Consulter revenus et dépenses en toute simplicité, depuis son mobile.",
      en: "Checking income and expenses with ease, straight from your phone.",
    },
    longDescription: {
      fr: [
        "Cette application mobile permet aux utilisateurs de consulter leurs transactions de revenus et de dépenses en toute simplicité.",
        "Le design system mis en place privilégie la lisibilité des données financières au quotidien, avec un système de notifications pensé pour garder l'utilisateur informé sans le submerger.",
      ],
      en: [
        "This mobile app lets users check their income and expense transactions with ease.",
        "The design system I built prioritizes everyday readability of financial data, with a notification system designed to keep users informed without overwhelming them.",
      ],
    },
    tags: ["Design System", "Visual design"],
    image: "/images/projects/comptat-credit-debit.jpg",
  },
  {
    slug: "sheikh-zayed-grand-mosque",
    title: "Sheikh Zayed Grand Mosque",
    employer: "Freelance",
    role: "UX/UI Designer",
    duration: { fr: "3 mois", en: "3 months" },
    description: {
      fr: "App visiteurs pour découvrir histoire, architecture et horaires de prière.",
      en: "Visitor app for exploring history, architecture and prayer times.",
    },
    longDescription: {
      fr: [
        "Cette application mobile vise à enrichir l'expérience des visiteurs de la Grande Mosquée Cheikh Zayed : histoire, architecture, horaires de prière, événements et réservations.",
        "L'identité visuelle épurée et élégante s'efface au profit du contenu — galerie photo et informations architecturales — pour respecter la dimension patrimoniale et spirituelle du lieu.",
      ],
      en: [
        "This mobile app aims to enrich the visitor experience at the Sheikh Zayed Grand Mosque: history, architecture, prayer schedules, events and bookings.",
        "The clean, elegant visual identity steps back in favor of content — photo gallery and architectural information — to respect the site's heritage and spiritual dimension.",
      ],
    },
    tags: ["Design System", "Visual design"],
    image: "/images/projects/sheikh-zayed-grand-mosque.jpg",
  },
  {
    slug: "kindeal",
    title: "Kindeal",
    employer: "WeAre Moon",
    role: "UX/UI Designer",
    duration: { fr: "3 mois", en: "3 months" },
    description: {
      fr: "App de contrôle parental alliant neurosciences et éducation positive.",
      en: "Parental-control app blending neuroscience and positive education.",
    },
    longDescription: {
      fr: [
        "KinDeal est une application de contrôle parental conçue par des parents, pour des parents, alliant principes de neurosciences et d'éducation positive.",
        "L'interface, ludique et bienveillante, transforme la gestion du temps d'écran en défis positifs pour toute la famille plutôt qu'en simples restrictions.",
      ],
      en: [
        "KinDeal is a parental-control app designed by parents, for parents, combining neuroscience principles with positive education.",
        "The playful, gentle interface turns screen-time management into positive challenges for the whole family rather than plain restrictions.",
      ],
    },
    tags: ["Design System", "Visual design"],
    image: "/images/projects/kindeal.jpg",
  },
  {
    slug: "split",
    title: "Split",
    employer: "WeAre Moon",
    role: "UX/UI Designer",
    duration: { fr: "3 mois", en: "3 months" },
    description: {
      fr: "Première application de covoiturage nouvelle génération en Tunisie.",
      en: "Tunisia's first next-generation carpooling app.",
    },
    longDescription: {
      fr: [
        "Split est une application de covoiturage nouvelle génération, pensée pour le marché tunisien.",
        "L'expérience s'articule autour d'une carte de mise en relation en temps réel et d'un suivi de trajet clair, dans une identité marine et blanche qui inspire confiance et sécurité.",
      ],
      en: [
        "Split is a next-generation carpooling app designed for the Tunisian market.",
        "The experience is built around a real-time matching map and clear trip tracking, in a navy-and-white identity that inspires trust and safety.",
      ],
    },
    tags: ["Design System", "Visual design"],
    image: "/images/projects/split.jpg",
  },
  {
    slug: "comptat-rh",
    title: "Comptat RH",
    employer: "Diginov / Design code",
    role: "UX/UI Designer",
    duration: { fr: "3 mois", en: "3 months" },
    description: {
      fr: "Gestion des congés, du temps de travail et des documents RH pour les entreprises.",
      en: "Leave, time-tracking and HR document management for companies.",
    },
    longDescription: {
      fr: [
        "Cette application mobile est dédiée aux entreprises pour la gestion de leurs employés : suivi des congés, pointage du temps de travail et documents RH.",
        "L'objectif était de simplifier des démarches RH souvent perçues comme fastidieuses, avec des parcours courts pour poser un congé, badger ou consulter une attestation depuis son mobile.",
      ],
      en: [
        "This mobile app is dedicated to companies managing their employees: leave monitoring, time tracking and HR documents.",
        "The goal was to simplify HR processes often perceived as tedious, with short flows to request leave, clock in, or view a certificate straight from a phone.",
      ],
    },
    tags: ["Design System", "Visual design"],
    image: "/images/projects/comptat-rh.jpg",
  },
  {
    slug: "cash-money-soccer-tour",
    title: "Cash Money Soccer Tour",
    employer: "Satoripop",
    role: "UX/UI Designer",
    duration: { fr: "1 mois", en: "1 month" },
    description: {
      fr: "Landing page événementielle pour le plus grand tournoi de foot amateur, avec cagnotte à gagner.",
      en: "Event landing page for the biggest amateur football tournament, with a prize pot to win.",
    },
    longDescription: {
      fr: [
        "Cash Money Soccer Tour est la landing page du plus grand tournoi de football amateur, mettant en avant une cagnotte à gagner et un parcours d'inscription simple pour les équipes participantes.",
        "L'identité visuelle sombre à dominante noir et or, portée par une photographie sportive dynamique, installe une tension compétitive dès l'arrivée sur le site — jusqu'au back-office de suivi des équipes, matchs et résultats.",
      ],
      en: [
        "Cash Money Soccer Tour is the landing page for the biggest amateur football tournament, highlighting a prize pot to win and a simple sign-up flow for participating teams.",
        "The dark, black-and-gold visual identity, carried by dynamic sports photography, sets a competitive tone from the moment you land — all the way to the back office tracking teams, matches and results.",
      ],
    },
    tags: ["Landing page", "Visual design", "Dashboard"],
    image: "/images/projects/cash-money-soccer-tour.jpg",
  },
];

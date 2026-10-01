import type { Localized } from "./i18n";
import { sourceProjects, type SourceProject } from "./content/projects-source";
import { mathisCaseStudy } from "./content/case-studies/mathis-bs";

export type CaseStudy = {
  subtitle: Localized;
  status?: Localized;
  client: Localized;
  context: { text: Localized<string[]>; facts: { value: string; label: Localized }[] };
  problems: { id: string; title: Localized; text: Localized }[];
  solutions: { title: Localized; text: Localized; solves: string[] }[];
  personas: { role: Localized; situation: Localized; outcome: Localized; image?: string }[];
  process: { step: Localized; text: Localized }[];
  aiMethod?: { title: Localized; lines: Localized<string[]> };
  aiMakingOf?: { before: string; after: string; caption: Localized };
  screens: { src: string; width: number; height: number; alt: Localized; title: Localized; decision: Localized }[];
  results: {
    metrics?: { value: number; suffix?: string; label: Localized }[];
    quotes?: Localized[];
    statement?: Localized;
    learnings: Localized[];
  };
};

export type Project = SourceProject & {
  order: number;
  featured: boolean;
  year?: number;
  sector: Localized;
  tagline: Localized;
  theme: { bg: string; fg: string; accent?: string };
  cover: { src: string; width: number; height: number };
  liveUrl?: string;
  caseStudy?: CaseStudy;
};

type Presentation = Omit<Project, keyof SourceProject | "order" | "cover"> & { cover?: Partial<Project["cover"]> };

const coverSize = { width: 1600, height: 1345 };
const ink = { bg: "#0f0f0e", fg: "#f2efe9" };

const presentation: Record<string, Presentation> = {
  "mathis-bs": {
    featured: true,
    year: 2026,
    sector: { fr: "Fiscalité immobilière", en: "Real-estate tax" },
    tagline: {
      fr: "SaaS B2B pour bailleurs sociaux, conçu seule de A à Z",
      en: "B2B SaaS for social housing, designed solo end to end",
    },
    theme: { bg: "#1a1530", fg: "#f2efe9", accent: "#f2894b" },
    cover: { width: 1800, height: 1257 },
    caseStudy: mathisCaseStudy,
  },
  attunea: {
    featured: true,
    sector: { fr: "SaaS B2B · CRM", en: "B2B SaaS · CRM" },
    tagline: {
      fr: "Un design system commun à l'app web et au site",
      en: "One design system for the web app and the website",
    },
    theme: { bg: "#10165c", fg: "#f2efe9" },
  },
  "travel-shaper": {
    featured: true,
    sector: { fr: "Voyage · IA", en: "Travel · AI" },
    tagline: {
      fr: "Un assistant conversationnel, de l'idée de voyage à la réservation",
      en: "A conversational assistant, from trip idea to booking",
    },
    theme: { bg: "#3a1830", fg: "#f2efe9" },
  },
  "carrefour-tn": {
    featured: true,
    sector: { fr: "E-commerce · Retail", en: "E-commerce · Retail" },
    tagline: {
      fr: "Refonte mobile-first et localisateur de magasins repensé",
      en: "Mobile-first redesign and a rethought store locator",
    },
    theme: { bg: "#0c2550", fg: "#f2efe9" },
  },
  "five-guys": {
    featured: false,
    sector: { fr: "Opérations internes", en: "Internal operations" },
    tagline: { fr: "Un constructeur de workflows visuel", en: "A visual workflow builder" },
    theme: ink,
  },
  "planet-tax-solution": {
    featured: false,
    sector: { fr: "Fintech · Détaxe", en: "Fintech · Tax refund" },
    tagline: { fr: "Back-office et front-office fiscal pour marchands", en: "Tax back office and front office for merchants" },
    theme: ink,
  },
  "clever-harvest": {
    featured: false,
    sector: { fr: "Agritech", en: "Agritech" },
    tagline: { fr: "Traçabilité par QR code, de la récolte au produit", en: "QR-code traceability, from harvest to product" },
    theme: ink,
  },
  demco: {
    featured: false,
    sector: { fr: "Industrie B2B", en: "B2B manufacturing" },
    tagline: { fr: "Collections et commandes pour la fabrication durable", en: "Collections and orders for sustainable manufacturing" },
    theme: ink,
  },
  rizouya: {
    featured: false,
    sector: { fr: "Emploi", en: "Recruitment" },
    tagline: { fr: "Mettre en relation candidats et employeurs", en: "Matching job seekers and employers" },
    theme: ink,
  },
  "avs-vip-services": {
    featured: false,
    sector: { fr: "Services premium", en: "Premium services" },
    tagline: { fr: "Contrats membres et suivi des commandes", en: "Member contracts and order tracking" },
    theme: ink,
  },
  "clinique-veterinaire-hammamet": {
    featured: false,
    sector: { fr: "Santé animale", en: "Pet care" },
    tagline: { fr: "Soins, toilettage et adoption au même endroit", en: "Care, grooming and adoption in one place" },
    theme: ink,
  },
  "bridge-global-funding": {
    featured: false,
    sector: { fr: "Fintech", en: "Fintech" },
    tagline: { fr: "Relier entrepreneures et investisseurs", en: "Connecting women founders and investors" },
    theme: ink,
  },
  convergence: {
    featured: false,
    sector: { fr: "Banque & assurance", en: "Banking & insurance" },
    tagline: { fr: "Transformation digitale avec chatbot intégré", en: "Digital transformation with a built-in chatbot" },
    theme: ink,
  },
  "fuze-digital-africa": {
    featured: false,
    sector: { fr: "Fintech", en: "Fintech" },
    tagline: { fr: "Rendre le financement accessible", en: "Making funding approachable" },
    theme: ink,
  },
  "ess-identity": {
    featured: false,
    sector: { fr: "Sport", en: "Sport" },
    tagline: { fr: "Billetterie en ligne d'un club de football", en: "Online ticketing for a football club" },
    theme: ink,
  },
  masaya: {
    featured: false,
    sector: { fr: "Hôtellerie", en: "Hospitality" },
    tagline: { fr: "Séjours, activités et événements dans une app", en: "Stays, activities and events in one app" },
    theme: ink,
  },
  "comptat-credit-debit": {
    featured: false,
    sector: { fr: "Fintech", en: "Fintech" },
    tagline: { fr: "Revenus et dépenses en un coup d'œil", en: "Income and expenses at a glance" },
    theme: ink,
  },
  "sheikh-zayed-grand-mosque": {
    featured: false,
    sector: { fr: "Culture", en: "Culture" },
    tagline: { fr: "Une app de visite : histoire, architecture, horaires", en: "A visitor app: history, architecture, prayer times" },
    theme: ink,
  },
  kindeal: {
    featured: false,
    sector: { fr: "Famille", en: "Family" },
    tagline: { fr: "Contrôle parental et éducation positive", en: "Parental control and positive parenting" },
    theme: ink,
  },
  split: {
    featured: false,
    sector: { fr: "Mobilité", en: "Mobility" },
    tagline: { fr: "Le covoiturage nouvelle génération en Tunisie", en: "Next-generation carpooling in Tunisia" },
    theme: ink,
  },
  "comptat-rh": {
    featured: false,
    sector: { fr: "RH", en: "HR" },
    tagline: { fr: "Congés, temps de travail et documents RH", en: "Leave, working time and HR documents" },
    theme: ink,
  },
  "cash-money-soccer-tour": {
    featured: false,
    sector: { fr: "Sport · Événementiel", en: "Sport · Events" },
    tagline: { fr: "Landing page d'un tournoi de foot amateur", en: "Landing page for an amateur football tournament" },
    theme: ink,
  },
};

export const projects: Project[] = sourceProjects.map((p, i) => {
  const extra = presentation[p.slug];
  if (!extra) throw new Error(`Missing presentation for project "${p.slug}"`);
  return {
    ...p,
    ...extra,
    order: i + 1,
    cover: { src: p.image ?? `/images/projects/${p.slug}.jpg`, ...coverSize, ...extra.cover },
  };
});

export const featuredProjects = projects.filter((p) => p.featured);

/** Home "selected work" grid: strong projects not already in the featured carousel. */
export const selectedProjects = ["five-guys", "clever-harvest", "planet-tax-solution", "convergence", "bridge-global-funding", "masaya"].map(
  (slug) => getProject(slug)!,
);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

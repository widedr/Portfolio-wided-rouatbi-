// "About" and "Experience" content, ported from the previous portfolio (v1).
import type { Localized } from "../i18n";

export const about = {
  leadPrefix: {
    fr: "Passionnée par la création ",
    en: "Passionate about creating ",
  } as Localized,
  leadHighlight: {
    fr: "d'expériences utilisateur intuitives, élégantes et augmentées par l'IA.",
    en: "intuitive, elegant, AI-augmented user experiences.",
  } as Localized,
  bio: {
    fr: "Designer UX/UI, j'aime concevoir des solutions digitales qui allient sens du détail et approche centrée utilisateur. Avec plus de 6 ans d'expérience dans la fintech, l'e-commerce et le voyage, j'ai appris à traduire des besoins métier complexes en interfaces claires — et j'intègre aujourd'hui l'intelligence artificielle à chaque étape de mon process créatif, de la recherche au prototypage.",
    en: "UX/UI designer, I love crafting digital solutions that combine attention to detail with a user-centered approach. With over 6 years of experience across fintech, e-commerce and travel, I've learned to translate complex business needs into clear interfaces — and I now weave artificial intelligence into every step of my creative process, from research to prototyping.",
  } as Localized,
  sectors: {
    fr: ["Fintech", "E-commerce", "Voyage", "SaaS B2B"],
    en: ["Fintech", "E-commerce", "Travel", "B2B SaaS"],
  } as Localized<string[]>,
  education: { fr: "Master en Design Visuel", en: "Master's in Visual Design" } as Localized,
  languages: { fr: "Arabe · Français · Anglais", en: "Arabic · French · English" } as Localized,
  skills: [
    {
      title: { fr: "Recherche", en: "Research" },
      items: {
        fr: ["Interviews utilisateurs", "Personas", "Analyse", "Benchmark", "Design centré utilisateur"],
        en: ["User interviews", "User personas", "Analysis", "Benchmarking", "User-centered design"],
      },
    },
    {
      title: { fr: "Design", en: "Design" },
      items: {
        fr: ["Brainstorming", "Wireframing", "Design System", "UI Design", "Prototypage"],
        en: ["Brainstorming", "Wireframing", "Design System", "UI Design", "Prototyping"],
      },
    },
    {
      title: { fr: "Outils & méthodes", en: "Tools & methods" },
      items: {
        fr: ["Figma", "Adobe XD", "Illustrator", "Photoshop", "FigJam", "Notion", "Design Thinking", "Agile/Scrum"],
        en: ["Figma", "Adobe XD", "Illustrator", "Photoshop", "FigJam", "Notion", "Design Thinking", "Agile/Scrum"],
      },
    },
    {
      title: { fr: "Soft skills", en: "Soft skills" },
      items: {
        fr: ["Esprit d'équipe", "Créativité & curiosité", "Organisation & rigueur", "Communication", "Flexibilité & adaptabilité"],
        en: ["Team spirit", "Creativity & curiosity", "Organization & rigor", "Communication", "Flexibility & adaptability"],
      },
    },
  ] as { title: Localized; items: Localized<string[]> }[],
};

export type Experience = {
  company: string;
  role: Localized;
  period: Localized;
  current?: boolean;
  description: Localized;
  tags: string[];
};

export const experiences: Experience[] = [
  {
    company: "Neoshore",
    role: { fr: "UX/UI Designer & Product Designer", en: "UX/UI Designer & Product Designer" },
    period: { fr: "Mars 2026 — Aujourd'hui", en: "March 2026 — Present" },
    current: true,
    description: {
      fr: "Conception de l'expérience produit pour des solutions SaaS B2B destinées aux acteurs de l'immobilier et de la fiscalité. De la recherche utilisateur à l'architecture de l'information, du design system au prototypage haute-fidélité — en collaboration étroite avec les équipes produit et tech. Intégration d'outils IA pour accélérer l'idéation et fluidifier le passage du design au code.",
      en: "Designing the product experience for B2B SaaS solutions serving real-estate and tax professionals. From user research to information architecture, from design systems to high-fidelity prototyping — working closely with product and engineering teams. Integrating AI tools to speed up ideation and streamline the handoff from design to code.",
    },
    tags: ["SaaS B2B", "Design System", "Fiscalité immobilière", "AI Tooling"],
  },
  {
    company: "Satoripop",
    role: { fr: "UX/UI Designer", en: "UX/UI Designer" },
    period: { fr: "Février 2022 — Mars 2026", en: "February 2022 — March 2026" },
    description: {
      fr: "Conception de design systems cohérents pour des clients des secteurs banque, e-commerce et voyage (Carrefour.tn, Attunea, Travel Shaper, Convergence, Bridge Global Funding...). Wireframes et prototypes interactifs en temps réel avec les développeurs, interviews utilisateurs et tests de prototypes. Accompagnement de stagiaires et mentorat de designers juniors sur des projets réels.",
      en: "Building cohesive design systems for clients in banking, e-commerce and travel (Carrefour.tn, Attunea, Travel Shaper, Convergence, Bridge Global Funding...). Wireframes and interactive prototypes built in real time with developers, user interviews and prototype testing. Mentoring interns and junior designers on real client projects.",
    },
    tags: ["Figma", "Adobe XD", "Design System", "Mentorat"],
  },
  {
    company: "Institut Supérieur des Beaux-Arts de Sousse",
    role: { fr: "Expert professor", en: "Expert professor" },
    period: { fr: "Septembre 2024 — Juillet 2025", en: "September 2024 — July 2025" },
    description: {
      fr: "Enseignement et accompagnement d'étudiants en UX/UI, design thinking et fondamentaux du design produit digital.",
      en: "Teaching and mentoring students in UX/UI, design thinking and the fundamentals of digital product design.",
    },
    tags: ["Enseignement", "Design Thinking", "UX/UI"],
  },
  {
    company: "GoMyCode",
    role: { fr: "UX/UI Instructor", en: "UX/UI Instructor" },
    period: { fr: "Octobre 2021 — Juin 2022", en: "October 2021 — June 2022" },
    description: {
      fr: "Formation de plus de 20 étudiants en design UX/UI : théorie, méthodologie et bonnes pratiques. Accompagnement pédagogique et amélioration continue des supports de cours.",
      en: "Trained 20+ students in UX/UI design: theory, methodology and best practices. Provided pedagogical support and continuously improved course materials.",
    },
    tags: ["Formation", "Pédagogie", "UX/UI"],
  },
  {
    company: "Diginov / Design code",
    role: { fr: "UX/UI Designer", en: "UX/UI Designer" },
    period: { fr: "Octobre 2021 — Janvier 2022", en: "October 2021 — January 2022" },
    description: {
      fr: "Co-conception d'applications mobiles et web avec une forte orientation UX (Comptat RH, Comptat Crédit Débit). Analyse des besoins clients, proposition de parcours utilisateurs optimisés et collaboration étroite avec les équipes techniques.",
      en: "Co-designed mobile and web applications with a strong UX focus (Comptat RH, Comptat Crédit Débit). Analyzed client needs, proposed optimized user journeys and worked closely with engineering teams.",
    },
    tags: ["Adobe XD", "Illustrator", "Mobile & Web"],
  },
  {
    company: "WeAre Moon",
    role: { fr: "UX/UI Designer", en: "UX/UI Designer" },
    period: { fr: "Août 2020 — Septembre 2021", en: "August 2020 — September 2021" },
    description: {
      fr: "Première immersion professionnelle dans le UX/UI. Conception de concepts graphiques sous la supervision d'une designer senior et production d'assets visuels pour plusieurs projets clients (Split, Rizouya, Demco, AVS, Kindeal).",
      en: "First professional immersion in UX/UI. Designed graphic concepts under the supervision of a senior designer and produced visual assets for several client projects (Split, Rizouya, Demco, AVS, Kindeal).",
    },
    tags: ["Adobe XD", "Illustrator", "Photoshop"],
  },
];

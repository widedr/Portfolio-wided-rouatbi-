export const site = {
  name: "Wided Rouatbi",
  email: "widedrouatbi@gmail.com",
  timezone: "Africa/Tunis",
  city: "Sousse",
  /**
   * Hero background video. Drop an MP4 (H.264, muted, ~10–20 s, < 6 MB) into
   * public/videos/ and fill this in; until then the hero cross-fades project visuals.
   */
  heroVideo: { webm: "/videos/hero.webm", mp4: "/videos/hero.mp4" } as null | { webm: string; mp4: string },
  heroImages: ["/images/projects/mathis-bs.jpg", "/images/projects/attunea.jpg", "/images/projects/travel-shaper.jpg", "/images/projects/carrefour-tn.jpg"],
  links: {
    linkedin: "https://www.linkedin.com/in/wided-rouatbi-25501a15a/",
    github: "https://github.com/widedr",
    whatsapp: "https://wa.me/21654367147",
    cvFr: "/cv/wided-rouatbi-cv-fr.pdf",
    cvEn: "/cv/wided-rouatbi-cv-en.pdf",
  },
} as const;

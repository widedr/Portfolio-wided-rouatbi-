import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { ChatWidget } from "@/components/layout/ChatWidget";
import { Cursor } from "@/components/layout/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Loader } from "@/components/layout/Loader";
import { PointerFill } from "@/components/layout/PointerFill";
import { RouteAnnouncer } from "@/components/layout/RouteAnnouncer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

const display = Inter_Tight({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display-face",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono-face",
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL("https://portfolio-wided-rouatbi.vercel.app"),
    title: { default: dict.meta.title, template: "%s — Wided Rouatbi" },
    description: dict.meta.description,
    alternates: { languages: { fr: "/fr", en: "/en" } },
    openGraph: { title: dict.meta.title, description: dict.meta.description, locale, type: "website" },
  };
}

export const viewport: Viewport = {
  themeColor: "#0f0f0e",
  colorScheme: "dark",
};

/*
 * Runs before first paint:
 * - `js` class lets CSS hide hero intro elements only when JS will reveal them;
 * - `data-loader-seen` hides the first-load screen for the rest of the session.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('wr-loader-seen'))d.setAttribute('data-loader-seen','')}catch(e){}})();`;

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={locale} className={`${display.variable} ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`.loader{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a href="#main" className="skip-link">
          {dict.a11y.skip}
        </a>
        <Loader role={dict.loader.role} />
        <SmoothScroll>
          <Header locale={locale} dict={dict} />
          <main id="main">{children}</main>
          <Footer dict={dict} />
        </SmoothScroll>
        <ChatWidget dict={dict} locale={locale} />
        <Cursor />
        <PointerFill />
        <RouteAnnouncer prefix={dict.a11y.pageChanged} />
      </body>
    </html>
  );
}

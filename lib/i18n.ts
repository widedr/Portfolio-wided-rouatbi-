import { fr } from "./content/fr";
import { en } from "./content/en";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export type Localized<T = string> = Record<Locale, T>;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export type Dictionary = typeof fr;

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Pick the current-locale value from a localized field. */
export function l<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

/** Build a locale-prefixed href. */
export function href(locale: Locale, path = "") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean === "/" ? "" : clean}`;
}

/** Swap the locale prefix of a pathname. */
export function switchLocalePath(pathname: string, to: Locale) {
  const parts = pathname.split("/");
  if (isLocale(parts[1] ?? "")) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join("/") || `/${to}`;
}

/** Fill `{key}` placeholders: format("Projet {i} sur {n}", { i: 1, n: 4 }). */
export function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));
}

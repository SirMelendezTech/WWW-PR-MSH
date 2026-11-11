export type Locale = "en" | "es";
export const locales: Locale[] = ["en", "es"];
export const defaultLocale: Locale = "es";

// Spanish is unprefixed ("/hardware/"), English is prefixed ("/en/hardware/") —
// matches astro.config.mjs's i18n.routing.prefixDefaultLocale: false.
export function getLocaleFromPath(pathname: string): Locale {
  return pathname.startsWith("/en/") || pathname === "/en" ? "en" : "es";
}

// Swap the locale prefix on a path, e.g. "/hardware/" <-> "/en/hardware/".
// Callers can pass an unprefixed path (the Spanish URL) and any target locale.
export function localizePath(pathname: string, target: Locale): string {
  const current = getLocaleFromPath(pathname);
  if (current === target) return pathname;
  if (target === "en") return `/en${pathname}`;
  return pathname.replace(/^\/en(\/|$)/, "/") || "/";
}

// Doc slug -> content collection id for a given locale. English docs live at
// "src/content/docs/<slug>.md"; Spanish translations live under
// "src/content/docs/es/<slug>.md", giving the collection id "es/<slug>".
export function docEntryId(slug: string, locale: Locale): string {
  return locale === "es" ? `es/${slug}` : slug;
}

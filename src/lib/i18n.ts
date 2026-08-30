export type Locale = "en" | "es";
export const locales: Locale[] = ["en", "es"];
export const defaultLocale: Locale = "en";

// English is unprefixed ("/hardware/"), Spanish is prefixed ("/es/hardware/") —
// matches astro.config.mjs's i18n.routing.prefixDefaultLocale: false.
export function getLocaleFromPath(pathname: string): Locale {
  return pathname.startsWith("/es/") || pathname === "/es" ? "es" : "en";
}

// Swap the locale prefix on a path, e.g. "/hardware/" <-> "/es/hardware/".
export function localizePath(pathname: string, target: Locale): string {
  const current = getLocaleFromPath(pathname);
  if (current === target) return pathname;
  if (target === "es") return `/es${pathname}`;
  return pathname.replace(/^\/es(\/|$)/, "/") || "/";
}

// Doc slug -> content collection id for a given locale. English docs live at
// "src/content/docs/<slug>.md"; Spanish translations live under
// "src/content/docs/es/<slug>.md", giving the collection id "es/<slug>".
export function docEntryId(slug: string, locale: Locale): string {
  return locale === "es" ? `es/${slug}` : slug;
}

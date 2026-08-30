import { getEntry } from "astro:content";
import { docEntryId, type Locale } from "./i18n";

// Look up a docs entry for a locale, falling back to the English entry
// (with untranslated: true) when no "<slug>.es" translation exists yet.
export async function getLocalizedDocEntry(slug: string, locale: Locale) {
  if (locale === "es") {
    const esEntry = await getEntry("docs", docEntryId(slug, "es"));
    if (esEntry) return { entry: esEntry, untranslated: false };
  }
  const enEntry = await getEntry("docs", slug);
  if (!enEntry) throw new Error(`Missing docs entry: ${slug}`);
  return { entry: enEntry, untranslated: locale === "es" };
}

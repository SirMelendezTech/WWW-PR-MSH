import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "./i18n";

export type BlogPost = CollectionEntry<"blog">;

/** All blog posts for one locale, newest first. */
export async function getBlogPosts(lang: Locale): Promise<BlogPost[]> {
  return (await getCollection("blog"))
    .filter((p) => (p.data.lang ?? "en") === lang)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Up to `limit` same-category posts other than `post`, within the same locale set. */
export function relatedPosts(post: BlogPost, all: BlogPost[], limit = 3) {
  return all
    .filter((p) => p.id !== post.id && p.data.category === post.data.category)
    .slice(0, limit)
    .map((p) => ({ id: p.id, title: p.data.title, category: p.data.category }));
}

/** URL for a post id in the given locale. */
export function blogPostHref(lang: Locale, id: string): string {
  return lang === "es" ? `/es/blog/${id}/` : `/blog/${id}/`;
}

/**
 * URL of this post's counterpart in `target` locale (matched by translationKey),
 * or null when no translation exists.
 */
export async function alternateLocaleHref(post: BlogPost, target: Locale): Promise<string | null> {
  const key = post.data.translationKey;
  if (!key) return null;
  const match = (await getBlogPosts(target)).find((p) => p.data.translationKey === key);
  return match ? blogPostHref(target, match.id) : null;
}

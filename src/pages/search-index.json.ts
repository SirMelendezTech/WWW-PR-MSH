import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { useStrings } from "../lib/ui-strings";
import { blogPostHref } from "../lib/blog";

export const prerender = true;

type Entry = { title: string; section: string; url: string; excerpt: string; lang: "en" | "es" };

const docRoutes: Record<string, string> = {
  "getting-started": "/getting-started/",
  hardware: "/hardware/",
  settings: "/settings/",
  "how-it-works": "/how-it-works/",
  "pr-mesh": "/pr-mesh/",
};

export const GET: APIRoute = async () => {
  const docs = await getCollection("docs");
  const blog = await getCollection("blog");

  const enDocs = docs.filter((d) => (d.data.lang ?? "en") === "en");
  const esDocs = docs.filter((d) => d.data.lang === "es");
  const enBlog = blog.filter((p) => (p.data.lang ?? "en") === "en");
  const esBlog = blog.filter((p) => p.data.lang === "es");

  const en = useStrings("en");
  const es = useStrings("es");

  const entries: Entry[] = [
    ...enDocs.map((d) => ({
      title: d.data.title,
      section: en.docs.sidebarLabel,
      url: docRoutes[d.id] ?? "/",
      excerpt: d.data.description,
      lang: "en" as const,
    })),
    ...enBlog.map((p) => ({
      title: p.data.title,
      section: `${en.blogPost.blogCrumb} · ${p.data.category}`,
      url: blogPostHref("en", p.id),
      excerpt: p.data.description,
      lang: "en" as const,
    })),
    { title: en.community.title, section: "Site", url: "/community/", excerpt: en.community.description, lang: "en" },
    { title: en.map.title, section: "Site", url: "/map/", excerpt: en.map.description, lang: "en" },
    { title: en.links.title, section: "Site", url: "/links/", excerpt: en.links.description, lang: "en" },

    ...esDocs.map((d) => ({
      title: d.data.title,
      section: es.docs.sidebarLabel,
      url: docRoutes[d.id.replace(/^es\//, "")] ? `/es${docRoutes[d.id.replace(/^es\//, "")]}` : "/es/",
      excerpt: d.data.description,
      lang: "es" as const,
    })),
    ...esBlog.map((p) => ({
      title: p.data.title,
      section: `${es.blogPost.blogCrumb} · ${p.data.category}`,
      url: blogPostHref("es", p.id),
      excerpt: p.data.description,
      lang: "es" as const,
    })),
    { title: es.community.title, section: "Sitio", url: "/es/community/", excerpt: es.community.description, lang: "es" },
    { title: es.map.title, section: "Sitio", url: "/es/map/", excerpt: es.map.description, lang: "es" },
    { title: es.links.title, section: "Sitio", url: "/es/links/", excerpt: es.links.description, lang: "es" },
  ];

  return new Response(JSON.stringify(entries), {
    headers: { "Content-Type": "application/json" },
  });
};

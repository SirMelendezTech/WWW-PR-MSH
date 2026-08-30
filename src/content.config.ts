import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    section: z.string(),
    lang: z.enum(["en", "es"]).default("en"),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string(),
    category: z.enum([
      "News",
      "Tutorials",
      "Hardware",
      "Field Reports",
      "Node Builds",
      "Community",
      "Puerto Rico Mesh Updates",
    ]),
    tags: z.array(z.string()).default([]),
    readingTime: z.string(),
    lang: z.enum(["en", "es"]).default("en"),
    // Shared key linking an EN post to its ES translation (and vice versa),
    // so the header language switch can jump between them.
    translationKey: z.string().optional(),
  }),
});

export const collections = { docs, blog };

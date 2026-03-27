import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    coverImage: z.string().optional(),
    date: z.date().optional(),
    tags: z.array(z.string()).optional(),
    locale: z.enum(['da', 'en']).default('da'),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    images: z.array(z.object({
      src: z.string(),
      alt: z.string(),
    })).optional(),
  }),
});

export const collections = { projects };

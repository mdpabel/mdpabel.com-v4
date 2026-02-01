import { defineCollection, z } from 'astro:content';

const threatsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    // ADD THIS LINE:
    slug: z.string().optional(),

    reportDate: z.string(),
    threatType: z.string(),
    severity: z.enum(['Critical', 'High', 'Medium', 'Low']),
    fileHash: z.string(),
    detectedPaths: z.array(z.string()).optional(),
    screenshots: z.array(z.string()).optional(),

    // VirusTotal Data
    vtLink: z.string().optional(),
    vtScore: z.string().optional(),

    // Field Notes (The "Human" Data)
    impact: z.string().optional(),
    seenOn: z.string().optional(),
    behavior: z.string().optional(),
    difficulty: z.string().optional(),
    recurrence: z.string().optional(),
  }),
});

export const collections = {
  'wordpress-threats': threatsCollection,
};

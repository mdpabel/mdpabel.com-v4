import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const lessonReference = z
  .object({
    slug: z.string(),
    label: z.string(),
  })
  .nullable();

const wordpressSecurityCourse = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/wordpress-security-course",
  }),
  schema: z.object({
    lessonNumber: z.number().int().min(1).max(8),
    slug: z.string(),
    title: z.string(),
    shortTitle: z.string(),
    description: z.string(),
    socialDescription: z.string(),
    readingTime: z.number().int().positive(),
    previousLesson: lessonReference,
    nextLesson: lessonReference,
    objectives: z.array(z.string()).min(3).max(5),
    action: z.object({
      title: z.string(),
      introduction: z.string(),
      steps: z.array(z.string()).min(1),
    }),
    commonMistakes: z.array(z.string()).min(1),
    checklist: z.array(z.string()).min(1),
    furtherReading: z
      .array(
        z.object({
          href: z.string(),
          label: z.string(),
          description: z.string(),
        }),
      )
      .min(2)
      .max(5),
  }),
});

// Preserve the repository's legacy collection contract. Its content is managed
// separately, but active RSS and threat components still reference this type.
const wordpressThreats = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string().optional(),
    reportDate: z.string(),
    threatType: z.string(),
    severity: z.enum(["Critical", "High", "Medium", "Low"]),
    fileHash: z.string(),
    detectedPaths: z.array(z.string()).optional(),
    screenshots: z.array(z.string()).optional(),
    vtLink: z.string().optional(),
    vtScore: z.string().optional(),
    impact: z.string().optional(),
    seenOn: z.string().optional(),
    behavior: z.string().optional(),
    difficulty: z.string().optional(),
    recurrence: z.string().optional(),
  }),
});

export const collections = {
  wordpressSecurityCourse,
  "wordpress-threats": wordpressThreats,
};

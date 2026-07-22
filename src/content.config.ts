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

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const internalLink = z
  .object({
    title: z.string().min(3),
    href: z.string().regex(/^\/[a-z0-9][a-z0-9\-/]*\/$/),
  })
  .strict();

const researchScreenshot = z
  .object({
    src: z.string().regex(/^\/wordpress-threats\/.+\.(?:png|jpe?g|webp)$/i),
    alt: z.string().min(12),
    caption: z.string().min(20),
    supports: z.string().min(12),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    privacyReviewed: z.boolean(),
  })
  .strict();

const researchIndicator = z
  .object({
    value: z.string().min(2),
    type: z.string().min(3),
    confidence: z.enum(["higher", "contextual"]),
  })
  .strict();

const relatedService = internalLink.nullable();

const siteOwnerSignals = z
  .object({
    symptomGroups: z
      .array(
        z.enum([
          "redirects-popups",
          "spam-unwanted-content",
          "hidden-users",
          "unknown-plugins",
          "recurring-malware",
          "suspicious-files-code",
          "login-credential-risk",
          "access-errors-warnings",
        ]),
      )
      .min(1)
      .max(3),
    searchDescription: z.string().min(80).max(170),
    summary: z.string().min(80).max(360),
    observed: z.array(z.string().min(12)).max(3),
    possible: z.array(z.string().min(12)).max(4),
    questions: z.array(z.string().min(12)).min(1).max(3),
    evidenceNote: z.string().min(30).max(300),
  })
  .strict()
  .superRefine((data, context) => {
    if (data.observed.length + data.possible.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["observed"],
        message:
          "Site-owner discovery requires at least one observed or possible signal.",
      });
    }
  });

const strictResearchSchema = z
  .object({
    title: z.string().min(3).max(160),
    h1: z.string().min(3).max(180),
    description: z.string().min(80).max(170),
    status: z.enum(["draft", "review", "published", "archived"]),
    reportDate: dateString,
    lastReviewed: dateString.nullable(),
    threatCategory: z.string().min(3),
    affectedComponents: z.array(z.string()),
    observedLocations: z.array(z.string()),
    confirmedBehaviors: z.array(z.string()),
    confidence: z.enum(["High", "Medium", "Low"]),
    severity: z.enum(["Critical", "High", "Medium", "Low"]),
    severityRationale: z.string().min(30),
    evidenceSource: z.string().min(20),
    schemaType: z.enum(["TechArticle", "Article"]),
    screenshots: z.array(researchScreenshot),
    indicators: z.array(researchIndicator),
    limitations: z.array(z.string()).min(1),
    relatedResearch: z
      .array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
      .max(3),
    relatedGuides: z.array(internalLink).max(3),
    relatedCaseStudies: z.array(internalLink).max(2),
    relatedService,
    siteOwner: siteOwnerSignals,
    canonical: z.string().url().nullable(),
    index: z.boolean(),
  })
  .strict()
  .superRefine((data, context) => {
    if (data.index && data.status !== "published") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["index"],
        message: "Only published research entries may be indexable.",
      });
    }
    if (data.status === "published") {
      if (data.title.length < 20 || data.title.length > 75) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["title"],
          message: "Published research titles must be 20–75 characters.",
        });
      }
      if (data.h1.length < 20 || data.h1.length > 90) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["h1"],
          message: "Published research H1 values must be 20–90 characters.",
        });
      }
      if (
        !data.canonical?.startsWith("https://www.mdpabel.com/malware-research/")
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["canonical"],
          message:
            "Published research requires a malware-research canonical URL.",
        });
      }
      if (!data.lastReviewed) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["lastReviewed"],
          message: "Published research requires a last-reviewed date.",
        });
      }
      if (data.confirmedBehaviors.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmedBehaviors"],
          message:
            "Published research requires at least one confirmed behavior.",
        });
      }
      if (data.screenshots.some((screenshot) => !screenshot.privacyReviewed)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["screenshots"],
          message: "Every published screenshot must pass privacy review.",
        });
      }
    }
  });

function normalizeLegacyResearchDraft(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const data = value as Record<string, unknown>;
  if (typeof data.status === "string") return value;

  const title =
    typeof data.title === "string"
      ? data.title
      : "Unreviewed WordPress malware research draft";
  const reportDate =
    typeof data.reportDate === "string" ? data.reportDate : "2026-01-01";
  const allowedSeverities = new Set(["Critical", "High", "Medium", "Low"]);
  const severity =
    typeof data.severity === "string" && allowedSeverities.has(data.severity)
      ? data.severity
      : "Medium";

  // Legacy drafts remain in this collection, but prohibited and unreviewed
  // fields are deliberately not carried into the typed research record.
  return {
    title,
    h1: title,
    description:
      "Unreviewed WordPress malware research draft retained for evidence-led editorial and privacy review before publication.",
    status: "draft",
    reportDate,
    lastReviewed: null,
    threatCategory:
      typeof data.threatType === "string"
        ? data.threatType
        : "Unreviewed malware artifact",
    affectedComponents: [],
    observedLocations: [],
    confirmedBehaviors: [],
    confidence: "Low",
    severity,
    severityRationale:
      "Legacy severity is retained for internal triage and has not yet been revalidated for publication.",
    evidenceSource:
      "Unreviewed evidence retained from an anonymized WordPress client investigation",
    schemaType: "Article",
    screenshots: [],
    indicators: [],
    limitations: [
      "This legacy draft has not completed evidence, factual, code-safety, and screenshot-privacy review.",
    ],
    relatedResearch: [],
    relatedGuides: [],
    relatedCaseStudies: [],
    relatedService: null,
    siteOwner: {
      symptomGroups: ["suspicious-files-code"],
      searchDescription:
        "Found an unfamiliar WordPress file or code change? This unreviewed research draft is retained for evidence and privacy review before publication.",
      summary:
        "This draft may help investigate an unfamiliar WordPress artifact, but its site-owner signals have not yet completed factual, evidence, and privacy review.",
      observed: [],
      possible: [
        "A scanner or file review may identify an unfamiliar artifact that requires manual investigation.",
      ],
      questions: [
        "What does this unfamiliar WordPress artifact mean for my website?",
      ],
      evidenceNote:
        "Do not use this draft for a diagnosis until its underlying evidence has completed manual review.",
    },
    canonical: null,
    index: false,
  };
}

const wordpressThreats = defineCollection({
  type: "content",
  schema: z.preprocess(normalizeLegacyResearchDraft, strictResearchSchema),
});

export const collections = {
  wordpressSecurityCourse,
  "wordpress-threats": wordpressThreats,
};

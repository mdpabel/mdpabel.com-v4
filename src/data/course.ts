export const COURSE_BASE = "/free-wordpress-security-course/";
export const COURSE_STORAGE_KEY =
  "mdpabel:free-wordpress-security-course:completed:v1";

export const courseMeta = {
  title: "Free WordPress Security Course for Website Owners",
  description:
    "Learn how to protect a WordPress website with practical lessons on login security, plugins, backups, hardening, malware warning signs, and recovery.",
  socialDescription:
    "A free, self-paced WordPress security course for site owners who want clear preventive steps, early warning signs, and a calm recovery plan.",
  image: "/images/blog-opengraph-image.png",
};

export const selfAssessment = [
  "Every administrator uses a unique password stored in a password manager.",
  "Two-factor authentication protects WordPress and the email account used for recovery.",
  "I can identify every administrator, application password, plugin, and theme.",
  "WordPress, PHP, plugins, and themes are on supported versions.",
  "Complete files-and-database backups are created automatically.",
  "At least one protected backup copy is stored outside the hosting account.",
  "A backup has been restored successfully in a test environment.",
  "I check the public site while logged out on desktop and mobile.",
  "Search Console, hosting, and security alerts have a named reviewer.",
  "I have a written response plan for a redirect, unknown administrator, or browser warning.",
];

export const finalChecklist = [
  {
    heading: "Every week",
    items: [
      "Confirm off-site backups completed successfully.",
      "Review urgent vulnerability, hosting, and security notices.",
      "Check key pages logged out on desktop and mobile.",
      "Record unexpected users, redirects, downloads, popups, or warnings.",
    ],
  },
  {
    heading: "Every month",
    items: [
      "Review administrators, application passwords, and connected provider access.",
      "Update supported WordPress core, plugins, themes, and PHP through a tested process.",
      "Remove unused software and investigate unknown or must-use plugins.",
      "Review Search Console, file changes, scheduled tasks, resources, and security alerts.",
      "Verify backup retention and the recovery information sheet.",
    ],
  },
  {
    heading: "Every quarter",
    items: [
      "Restore a backup in an isolated environment and test key workflows.",
      "Review access across WordPress, hosting, email, registrar, DNS/CDN, and backups.",
      "Confirm two-factor recovery methods and stored recovery codes.",
      "Review whether every plugin and theme is necessary and maintained.",
      "Walk through the incident-response worksheet with the responsible people.",
    ],
  },
  {
    heading: "After a major change or incident",
    items: [
      "After a vulnerability notice: update or remove, test, and check for signs of exploitation.",
      "After staff or developer access ends: revoke every account, session, key, and shared secret.",
      "After migration: verify DNS, HTTPS, backups, permissions, cron, email, and old-host access.",
      "After cleanup: confirm the entry point is closed, create a known-good backup, and monitor for reinfection.",
    ],
  },
];

export const courseFaqs = [
  {
    question: "Is this WordPress security course really free?",
    answer:
      "Yes. All eight text lessons and the printable checklist are public. No account, payment, or email signup is required.",
  },
  {
    question: "Do I need technical WordPress experience?",
    answer:
      "No. The course is written for site owners and beginners. Technical articles are linked as optional deeper reading when a topic needs more detail.",
  },
  {
    question: "How long does the course take?",
    answer:
      "The eight lessons take about an hour to read in total. The practical actions take longer and can be completed one lesson at a time.",
  },
  {
    question:
      "Will completing the checklist guarantee my site cannot be hacked?",
    answer:
      "No. The steps reduce common risks and improve recovery readiness, but no public website can be guaranteed never to be compromised.",
  },
  {
    question: "Does the course replace professional malware removal?",
    answer:
      "No. It teaches prevention, detection, and a defensive response process. If a site is already compromised or handles sensitive data, qualified help may be the safer option.",
  },
  {
    question: "Where is my lesson progress stored?",
    answer:
      "Completed lesson identifiers are stored only in this browser using local storage. Progress needs no account and does not sync between devices.",
  },
];

export function getLessonPath(slug: string) {
  return `${COURSE_BASE}${slug}/`;
}

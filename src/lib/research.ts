import type { CollectionEntry } from "astro:content";

export function getResearchSlug(entry: CollectionEntry<"wordpress-threats">) {
  if (entry.data.canonical) {
    const segments = new URL(entry.data.canonical).pathname
      .split("/")
      .filter(Boolean);
    const slug = segments.at(-1);
    if (slug) return slug;
  }

  return entry.id.replace(/\.md$/, "");
}

export function getResearchOverlapScore(
  current: CollectionEntry<"wordpress-threats">,
  candidate: CollectionEntry<"wordpress-threats">,
) {
  const explicitPosition = current.data.relatedResearch.indexOf(
    getResearchSlug(candidate),
  );
  let score = explicitPosition >= 0 ? 100 - explicitPosition : 0;
  if (current.data.threatCategory === candidate.data.threatCategory)
    score += 12;

  const candidateComponents = new Set(
    candidate.data.affectedComponents.map((value) => value.toLowerCase()),
  );
  score +=
    current.data.affectedComponents.filter((value) =>
      candidateComponents.has(value.toLowerCase()),
    ).length * 4;
  return score;
}

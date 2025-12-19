type CitationInput = {
  title: string;
  author?: string | null;
  publishedAt?: string | null;
  url?: string | null;
};

const publisher = "AI/ML Society";

function extractYear(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return String(date.getUTCFullYear());
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 48);
}

export function buildCitation({ title, author, publishedAt, url }: CitationInput): string {
  const cleanTitle = title.trim() || "Untitled";
  const cleanAuthor = author?.trim() || "Unknown author";
  const year = extractYear(publishedAt) ?? "n.d.";
  const yearLabel = year.endsWith(".") ? year : `${year}.`;
  const parts = [
    `${cleanAuthor}.`,
    `"${cleanTitle}."`,
    `${publisher},`,
    `${yearLabel}`,
  ];

  if (url) {
    parts.push(url);
  }

  return parts.join(" ").trim();
}

export function buildBibTeX({ title, author, publishedAt, url }: CitationInput): string {
  const cleanTitle = title.trim() || "Untitled";
  const cleanAuthor = author?.trim() || "Unknown author";
  const year = extractYear(publishedAt);
  const key = `ai-ml-society-${slugify(cleanTitle)}${year ? `-${year}` : ""}`;

  const lines = [
    `@article{${key},`,
    `  title = {${cleanTitle}},`,
    `  author = {${cleanAuthor}},`,
  ];

  if (year) {
    lines.push(`  year = {${year}},`);
  }

  if (url) {
    lines.push(`  url = {${url}},`);
  }

  lines.push(`  publisher = {${publisher}},`);
  lines.push("}");

  return lines.join("\n");
}

import { describe, expect, it } from "vitest";

import { buildBibTeX, buildCitation } from "./citation";

describe("buildCitation", () => {
  it("builds a citation with author, year, and url", () => {
    const result = buildCitation({
      title: "Testing AI Systems",
      author: "Ada Lovelace",
      publishedAt: "2025-12-18T12:00:00Z",
      url: "https://example.com/articles/testing-ai",
    });

    expect(result).toBe(
      "Ada Lovelace. \"Testing AI Systems.\" AI/ML Society, 2025. https://example.com/articles/testing-ai"
    );
  });

  it("falls back when author and date are missing", () => {
    const result = buildCitation({ title: "Untitled" });

    expect(result).toBe("Unknown author. \"Untitled.\" AI/ML Society, n.d.");
  });
});

describe("buildBibTeX", () => {
  it("builds a bibtex entry", () => {
    const result = buildBibTeX({
      title: "Testing AI Systems",
      author: "Ada Lovelace",
      publishedAt: "2025-12-18",
      url: "https://example.com/articles/testing-ai",
    });

    expect(result).toContain("@article{ai-ml-society-testing-ai-systems-2025,");
    expect(result).toContain("title = {Testing AI Systems},");
    expect(result).toContain("author = {Ada Lovelace},");
    expect(result).toContain("year = {2025},");
    expect(result).toContain("url = {https://example.com/articles/testing-ai},");
  });

  it("omits year when unavailable", () => {
    const result = buildBibTeX({ title: "No Date" });

    expect(result).not.toContain("year =");
  });
});

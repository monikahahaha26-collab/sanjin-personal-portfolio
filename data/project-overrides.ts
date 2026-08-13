export type ProjectCategory = "AI 应用" | "嵌入式" | "全栈" | "数据" | "创意";

export interface ProjectOverride {
  category: ProjectCategory;
  featured?: number;
  mdxSlug?: string;
  demo?: string;
  hidden?: boolean;
}

export const projectOverrides: Record<string, ProjectOverride> = {
  AegisGift: { category: "AI 应用", featured: 1, mdxSlug: "aegisgift-platform" },
  "ember-spire": { category: "创意", featured: 4, mdxSlug: "ember-spire", demo: "https://ember-spire.pages.dev" },
  "gout-diet-guide": { category: "AI 应用", featured: 3, mdxSlug: "gout-diet-guide" },
  "sanjin-personal-portfolio": { category: "全栈", featured: 2 },
  "seventeen-carat-archive": { category: "创意", mdxSlug: "seventeen-carat-archive", demo: "https://seventeen-carat-archive.pages.dev" },
};

export const portfolioConfig = {
  githubUser: "monikahahaha26-collab",
  excludedRepos: [] as string[],
};

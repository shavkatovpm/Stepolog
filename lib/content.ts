import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface FAQ {
  q: string;
  a: string;
}

export interface ArticleMeta {
  title: string;
  description: string;
  date: string;
  author: string;
  slug: string;
  category?: string;
  faqs?: FAQ[];
}

const contentDir = path.join(process.cwd(), "content");

// Blog: content/blog/{locale}/{slug}.mdx (flat)
// Learn: content/learn/{locale}/{category}/{slug}.mdx (nested)

export function getAllArticles(
  type: "blog" | "learn",
  locale: string = "uz"
): ArticleMeta[] {
  const dir = path.join(contentDir, type, locale);
  if (!fs.existsSync(dir)) return [];

  if (type === "blog") {
    return readMdxFiles(dir);
  }

  // Learn: read from all category subdirectories
  const articles: ArticleMeta[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const categoryDir = path.join(dir, entry.name);
      articles.push(...readMdxFiles(categoryDir));
    }
  }
  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getArticlesByCategory(
  category: string,
  locale: string = "uz"
): ArticleMeta[] {
  const dir = path.join(contentDir, "learn", locale, category);
  if (!fs.existsSync(dir)) return [];
  return readMdxFiles(dir);
}

export function getArticleBySlug(
  type: "blog" | "learn",
  slug: string,
  locale: string = "uz",
  category?: string
) {
  let filePath: string;

  if (type === "blog") {
    filePath = path.join(contentDir, type, locale, `${slug}.mdx`);
  } else if (category) {
    filePath = path.join(contentDir, type, locale, category, `${slug}.mdx`);
  } else {
    // Fallback: search all category dirs
    const dir = path.join(contentDir, type, locale);
    if (!fs.existsSync(dir)) return null;
    const found = findMdxInSubdirs(dir, slug);
    if (!found) return null;
    filePath = found;
  }

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    meta: {
      title: data.title || "",
      description: data.description || "",
      date: data.date || "",
      author: data.author || "Stepolog",
      slug,
      category: data.category || undefined,
      faqs: data.faqs || undefined,
    } satisfies ArticleMeta,
    content,
  };
}

export function getAllSlugs(
  type: "blog" | "learn",
  locale: string = "uz"
): string[] {
  const dir = path.join(contentDir, type, locale);
  if (!fs.existsSync(dir)) return [];

  if (type === "blog") {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(".mdx", ""));
  }

  // Learn: collect from all category subdirectories
  const slugs: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const categoryDir = path.join(dir, entry.name);
      const files = fs
        .readdirSync(categoryDir)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => f.replace(".mdx", ""));
      slugs.push(...files);
    }
  }
  return slugs;
}

export function getAllLearnSlugsWithCategory(
  locale: string = "uz"
): { category: string; slug: string }[] {
  const dir = path.join(contentDir, "learn", locale);
  if (!fs.existsSync(dir)) return [];

  const result: { category: string; slug: string }[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const categoryDir = path.join(dir, entry.name);
      const files = fs
        .readdirSync(categoryDir)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => f.replace(".mdx", ""));
      for (const slug of files) {
        result.push({ category: entry.name, slug });
      }
    }
  }
  return result;
}

// --- Helpers ---

function readMdxFiles(dir: string): ArticleMeta[] {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const articles = files.map((filename) => {
    const filePath = path.join(dir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    return {
      title: data.title || "",
      description: data.description || "",
      date: data.date || "",
      author: data.author || "Stepolog",
      slug: filename.replace(".mdx", ""),
      category: data.category || undefined,
      faqs: data.faqs || undefined,
    } satisfies ArticleMeta;
  });
  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function findMdxInSubdirs(dir: string, slug: string): string | null {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const filePath = path.join(dir, entry.name, `${slug}.mdx`);
      if (fs.existsSync(filePath)) return filePath;
    }
  }
  return null;
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ArticleMeta {
  title: string;
  description: string;
  date: string;
  author: string;
  slug: string;
}

const contentDir = path.join(process.cwd(), "content");

export function getAllArticles(type: "blog" | "learn"): ArticleMeta[] {
  const dir = path.join(contentDir, type);

  if (!fs.existsSync(dir)) return [];

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
    } satisfies ArticleMeta;
  });

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getArticleBySlug(type: "blog" | "learn", slug: string) {
  const filePath = path.join(contentDir, type, `${slug}.mdx`);

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
    } satisfies ArticleMeta,
    content,
  };
}

export function getAllSlugs(type: "blog" | "learn"): string[] {
  const dir = path.join(contentDir, type);

  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}

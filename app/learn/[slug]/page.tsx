import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticleBySlug, getAllSlugs } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs("learn").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug("learn", slug);
  if (!article) return {};

  return {
    title: article.meta.title,
    description: article.meta.description,
  };
}

export default async function LearnArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug("learn", slug);

  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/learn"
        className="mb-8 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-medium text-muted shadow-sm transition-all hover:-translate-y-0.5 hover:text-foreground hover:shadow-md"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        O&apos;rganishga qaytish
      </Link>

      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
            O&apos;rganish
          </span>
          <time className="text-sm text-muted">{article.meta.date}</time>
          <span className="text-sm text-muted">&middot; {article.meta.author}</span>
        </div>
        <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">
          {article.meta.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{article.meta.description}</p>
      </header>

      <div className="overflow-hidden rounded-2xl bg-surface shadow-sm">
        <div className="h-1 bg-gradient-to-r from-accent to-orange-300" />
        <div className="p-6 md:p-10 [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-foreground/80 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-foreground/80 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-foreground/80 [&_li]:mb-1.5 [&_li]:leading-relaxed [&_strong]:font-bold [&_strong]:text-foreground [&_a]:font-medium [&_a]:text-brand-dark [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:rounded-xl [&_blockquote]:bg-accent/10 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-foreground/80 [&_table]:mb-4 [&_table]:w-full [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:text-sm [&_th]:bg-foreground/5 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold [&_td]:border-t [&_td]:border-border [&_td]:px-4 [&_td]:py-2.5 [&_hr]:my-8 [&_hr]:border-border">
          <MDXRemote source={article.content} />
        </div>
      </div>
    </article>
  );
}

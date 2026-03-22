import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticleBySlug, getAllSlugs } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug("blog", slug);
  if (!article) return {};

  return {
    title: article.meta.title,
    description: article.meta.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: article.meta.title,
      description: article.meta.description,
      url: `/blog/${slug}`,
      type: "article",
      publishedTime: article.meta.date,
      authors: [article.meta.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.meta.title,
      description: article.meta.description,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug("blog", slug);

  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.meta.title,
    description: article.meta.description,
    datePublished: article.meta.date,
    author: {
      "@type": "Person",
      name: article.meta.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Stepolog",
      url: "https://stepolog.uz",
    },
    mainEntityOfPage: `https://stepolog.uz/blog/${slug}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-brand"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Bloglarga qaytish
      </Link>

      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-[.2em] text-brand">Blog</span>
          <span className="text-sm text-muted">{article.meta.date}</span>
          <span className="text-sm text-muted">&middot; {article.meta.author}</span>
        </div>
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-5xl">
          {article.meta.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{article.meta.description}</p>
      </header>

      <div className="[&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-foreground/80 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-foreground/80 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-foreground/80 [&_li]:mb-1.5 [&_li]:leading-relaxed [&_strong]:font-bold [&_strong]:text-foreground [&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:rounded-xl [&_blockquote]:border [&_blockquote]:border-border [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-foreground/80 [&_table]:mb-4 [&_table]:w-full [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:text-sm [&_th]:bg-foreground/5 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold [&_td]:border-t [&_td]:border-border [&_td]:px-4 [&_td]:py-2.5 [&_hr]:my-8 [&_hr]:border-border">
        <MDXRemote source={article.content} />
      </div>
    </article>
  );
}

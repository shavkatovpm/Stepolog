import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getArticleBySlug, getAllSlugs, type FAQ } from "@/lib/content";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const locales = ["uz", "ru"];
  return locales.flatMap((locale) =>
    getAllSlugs("blog", locale).map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticleBySlug("blog", slug, locale);
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
  const { locale, slug } = await params;
  const t = await getTranslations("blog");
  const article = getArticleBySlug("blog", slug, locale);

  if (!article) notFound();

  const prefix = locale === "uz" ? "" : "/ru";

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
    mainEntityOfPage: `https://stepolog.uz${prefix}/blog/${slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("label"), item: `https://stepolog.uz${prefix}` },
      { "@type": "ListItem", position: 2, name: t("title"), item: `https://stepolog.uz${prefix}/blog` },
      { "@type": "ListItem", position: 3, name: article.meta.title, item: `https://stepolog.uz${prefix}/blog/${slug}` },
    ],
  };

  const faqJsonLd = article.meta.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.meta.faqs.map((f: FAQ) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <article className="mx-auto max-w-3xl px-5 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-brand"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        {t("backToBlog")}
      </Link>

      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-[.2em] text-brand">{t("label")}</span>
          <span className="text-sm text-muted">{article.meta.date}</span>
          <span className="text-sm text-muted">&middot; {article.meta.author}</span>
        </div>
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-5xl">
          {article.meta.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{article.meta.description}</p>
      </header>

      <div className="[&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-foreground/80 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-foreground/80 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-foreground/80 [&_li]:mb-1.5 [&_li]:leading-relaxed [&_strong]:font-bold [&_strong]:text-foreground [&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:rounded-xl [&_blockquote]:border [&_blockquote]:border-border [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-foreground/80 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:border [&_table]:border-border [&_table]:text-sm [&_th]:border [&_th]:border-border [&_th]:bg-foreground/5 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-2.5 [&_hr]:my-8 [&_hr]:border-border">
        <MDXRemote source={article.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>
    </article>
  );
}

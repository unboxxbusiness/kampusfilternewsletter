import React from "react";
import { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import PortableTextRenderer from "@/components/article/PortableTextRenderer";
import TableOfContents from "@/components/article/TableOfContents";
import ReadingProgressBar from "@/components/article/ReadingProgressBar";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import BreadcrumbSchema from "@/components/navigation/BreadcrumbSchema";
import PostShareBar from "@/components/article/PostShareBar";
import RelatedArticles from "@/components/article/RelatedArticles";

export const revalidate = 60; // ISR cache validation interval

export async function generateStaticParams() {
  try {
    const articles = await client.fetch(
      `*[_type == "article"] { "slug": slug.current }`
    );
    return articles.map((art: any) => ({
      slug: art.slug || "",
    }));
  } catch (error) {
    console.error("Error in generateStaticParams for articles:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const article = await client.fetch(
      `*[_type == "article" && slug.current == $slug][0] {
        title,
        excerpt,
        seoTitle,
        seoDescription,
        featuredImage
      }`,
      { slug: resolvedParams.slug }
    );

    if (!article) {
      return {
        title: "Article Not Found",
      };
    }

    const metaTitle = article.seoTitle || article.title;
    const metaDescription = article.seoDescription || article.excerpt || "Read the latest updates on Kampus Filter.";
    const ogImage = article.featuredImage ? urlFor(article.featuredImage).width(1200).height(630).auto("format").url() : undefined;

    return {
      title: metaTitle,
      description: metaDescription,
      alternates: {
        canonical: `/articles/${resolvedParams.slug}`,
      },
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        type: "article",
        images: ogImage ? [{ url: ogImage }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch (error) {
    return {
      title: "Article",
    };
  }
}

async function getArticleData(slug: string) {
  const article = await client.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      _id,
      title,
      excerpt,
      content,
      publishedAt,
      readingTime,
      featuredImage,
      "author": author->{name, image, bio},
      "category": category->{_id, title, "slug": slug.current}
    }`,
    { slug }
  );

  if (!article) return { article: null, related: [], isBackfilled: false };

  const currentId = article._id;
  const categoryId = article.category?._id;

  let related = [];
  let isBackfilled = false;

  if (categoryId) {
    related = await client.fetch(
      `*[_type == "article" && category._ref == $categoryId && _id != $currentId] | order(publishedAt desc)[0...8] {
        title,
        slug,
        publishedAt,
        readingTime
      }`,
      { categoryId, currentId }
    );
  }

  if (related.length < 8) {
    const needed = 8 - related.length;
    const existingSlugs = related.map((r: any) => r.slug.current);

    const backfill = await client.fetch(
      `*[_type == "article" && _id != $currentId && !(slug.current in $existingSlugs)] | order(publishedAt desc)[0...$needed] {
        title,
        slug,
        publishedAt,
        readingTime
      }`,
      { currentId, needed, existingSlugs }
    );

    related = [...related, ...backfill];
    isBackfilled = true;
  }

  return { article, related, isBackfilled };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { article, related, isBackfilled } = await getArticleData(resolvedParams.slug);

  if (!article) return <div className="p-12 text-center">Article not found</div>;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";

  // JSON-LD structured data for AI search engines & search crawlers
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.excerpt || "Read the latest update on Kampus Filter.",
    "datePublished": article.publishedAt,
    "dateModified": article.publishedAt,
    "image": article.featuredImage ? [urlFor(article.featuredImage).width(1200).height(630).auto("format").url()] : [],
    "author": {
      "@type": "Person",
      "name": article.author?.name || "Kampus Filter Editorial",
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "Kampus Filter",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/articles/${resolvedParams.slug}`,
    },
  };

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Archive", item: "/archive" },
    ...(article.category ? [{ name: article.category.title, item: `/archive/${article.category.slug}` }] : []),
    { name: article.title, item: `/articles/${resolvedParams.slug}` },
  ];

  return (
    <main className="min-h-screen relative py-20 px-6">
      {/* Inject Structured Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <ReadingProgressBar />

      <div className="max-w-[1100px] mx-auto lg:flex lg:gap-12 lg:items-start lg:justify-center">
        <TableOfContents />

        <article className="max-w-[720px] w-full space-y-8 font-sans">
          <div className="space-y-4">
            {article.category && (
              <span className="text-xs font-semibold text-[#fca311] uppercase tracking-wider">
                {article.category.title}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#14213d] dark:text-[#ffffff]">
              {article.title}
            </h1>
            <p className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 text-lg leading-relaxed">{article.excerpt}</p>
   
            <div className="flex items-center gap-4 py-4 border-y border-[#e5e5e5] dark:border-[#14213d] text-sm text-[#14213d]/60 dark:text-[#e5e5e5]/60">
              {article.author?.image && (
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={urlFor(article.author.image).width(80).height(80).auto("format").url()}
                    alt={article.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-semibold text-[#14213d] dark:text-[#ffffff]">{article.author?.name || "Author"}</p>
                <p className="text-[#14213d]/50 dark:text-[#e5e5e5]/50">
                  {new Date(article.publishedAt).toLocaleDateString()} &bull; {article.readingTime} min read
                </p>
              </div>
            </div>
          </div>
   
          {article.featuredImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={urlFor(article.featuredImage).width(1200).auto("format").url()}
                alt={article.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}
   
          <div className="prose prose-neutral dark:prose-invert max-w-none text-[#14213d] dark:text-[#e5e5e5]">
            <PortableTextRenderer value={article.content} />
          </div>
   
          <PostShareBar slug={resolvedParams.slug} title={article.title} />
   
          <RelatedArticles
            articles={related}
            categoryTitle={article.category?.title || ""}
            isBackfilled={isBackfilled}
          />
   
          <div className="mt-20 p-8 border border-[#e5e5e5] dark:border-[#14213d] rounded-2xl text-center space-y-4 bg-[#e5e5e5]/10 dark:bg-[#14213d]/20 transition-all duration-300">
            <h3 className="text-xl font-bold text-[#14213d] dark:text-[#ffffff]">Join Kampus Filter</h3>
            <p className="text-[#14213d]/60 dark:text-[#e5e5e5]/60 text-sm">
              Discover opportunities, scholarships, and career updates sent straight to your browser.
            </p>
            <Link href="/" className="inline-block bg-[#fca311] text-[#000000] px-6 py-2.5 hover:bg-[#e6930f] transition rounded-lg text-sm font-bold uppercase tracking-wider shadow-sm">
              Join Free
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}

import React from "react";
import { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import Link from "next/link";
import BreadcrumbSchema from "@/components/navigation/BreadcrumbSchema";
import ShareButton from "@/components/common/ShareButton";
import Pagination from "@/components/navigation/Pagination";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const categories = await client.fetch(
      `*[_type == "category"] { "slug": slug.current }`
    );
    return categories.map((cat: any) => ({
      category: cat.slug || "",
    }));
  } catch (error) {
    console.error("Error in generateStaticParams for categories:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = resolvedParams.category.replace(/-/g, " ");
  const capitalized = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  const title = `${capitalized} Opportunities`;
  const description = `Explore curated student opportunities, scholarships, and career intelligence under the ${capitalized} category.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/archive/${resolvedParams.category}`,
    },
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

async function getArticlesByCategory(categorySlug: string, page: number) {
  const limit = 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const articlesQuery = `*[_type == "article" && category->slug.current == $categorySlug] | order(publishedAt desc)[$startIndex...$endIndex] {
    title,
    slug,
    "category": category->title,
    publishedAt,
    readingTime
  }`;

  const countQuery = `count(*[_type == "article" && category->slug.current == $categorySlug])`;

  const articles = await client.fetch(articlesQuery, { categorySlug, startIndex, endIndex });
  const totalCount = await client.fetch(countQuery, { categorySlug });
  const totalPages = Math.ceil(totalCount / limit);

  return { articles, totalPages, totalCount };
}

interface SearchParams {
  page?: string;
}

export default async function CategoryArchivePage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);

  const { articles, totalPages } = await getArticlesByCategory(resolvedParams.category, page);
  
  const categoryName = resolvedParams.category.replace(/-/g, " ");
  const capitalizedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Archive", item: "/archive" },
    { name: capitalizedCategory, item: `/archive/${resolvedParams.category}` },
  ];

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-12 space-y-8">
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="space-y-4">
        <h1 className="text-4xl font-sans font-bold capitalize text-[#14213d] dark:text-[#ffffff]">{resolvedParams.category}</h1>
        <p className="text-[#14213d]/60 dark:text-[#e5e5e5]/60">Explore opportunities listed under {resolvedParams.category}.</p>
      </div>

      {articles.length === 0 ? (
        <div className="text-[#14213d]/60 dark:text-[#e5e5e5]/60 text-sm">No articles in this category yet.</div>
      ) : (
        <div className="flex flex-col gap-10 max-w-3xl">
          <div className="flex flex-col gap-4">
            {articles.map((item: any) => (
              <article key={item.slug.current} className="flex items-center justify-between gap-4 border-b border-[#e5e5e5] dark:border-[#14213d] py-4">
                <h2 className="text-xl font-bold tracking-tight text-[#14213d] dark:text-[#ffffff] hover:text-[#fca311] dark:hover:text-[#fca311] transition-colors">
                  <Link href={`/articles/${item.slug.current}`}>{item.title}</Link>
                </h2>
                <ShareButton slug={item.slug.current} title={item.title} />
              </article>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl={`/archive/${resolvedParams.category}`}
            currentSearchParams={{ page: resolvedSearchParams.page }}
          />
        </div>
      )}
    </main>
  );
}

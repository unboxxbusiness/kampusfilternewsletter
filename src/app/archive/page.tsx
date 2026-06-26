import React from "react";
import { client } from "@/lib/sanity/client";
import ArchivePageClient from "./ArchivePageClient";
import { Metadata } from "next";
import BreadcrumbSchema from "@/components/navigation/BreadcrumbSchema";

export const revalidate = 60; // ISR cache validation interval

export const metadata: Metadata = {
  title: "Archive",
  description: "Explore curated student intelligence, scholarships, internships, fellowships, and education frameworks.",
  alternates: {
    canonical: "/archive",
  },
};

interface SearchParams {
  page?: string;
  category?: string;
  q?: string;
}

async function getArchiveData(page: number, category: string, q: string) {
  const limit = 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Build GROQ filter dynamically
  let filter = `*[_type == "article"`;
  if (category) filter += ` && category->title == $category`;
  if (q) filter += ` && (title match $q + "*" || excerpt match $q + "*" || category->title match $q + "*")`;
  filter += `]`;

  const articlesQuery = `${filter} | order(publishedAt desc)[$startIndex...$endIndex] {
    title,
    slug,
    "category": category->title,
    publishedAt,
    readingTime
  }`;

  const countQuery = `count(${filter})`;

  const articles = await client.fetch(articlesQuery, { category, q, startIndex, endIndex });
  const totalCount = await client.fetch(countQuery, { category, q });
  const categories = await client.fetch(`*[_type == "category"] { _id, title, "slug": slug.current }`);

  const totalPages = Math.ceil(totalCount / limit);

  return { articles, categories, totalPages, currentPage: page, totalCount };
}

export default async function ArchivePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const category = resolvedSearchParams.category || "";
  const q = resolvedSearchParams.q || "";

  const { articles, categories, totalPages, currentPage, totalCount } = await getArchiveData(page, category, q);
  
  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Archive", item: "/archive" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ArchivePageClient
        initialArticles={articles || []}
        initialCategories={categories || []}
        totalPages={totalPages}
        currentPage={currentPage}
        totalCount={totalCount}
        currentSearchParams={{ page: resolvedSearchParams.page, category: resolvedSearchParams.category, q: resolvedSearchParams.q }}
      />
    </>
  );
}

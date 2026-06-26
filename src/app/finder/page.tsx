import React from "react";
import { client } from "@/lib/sanity/client";
import FinderClient from "@/components/finder/FinderClient";
import BreadcrumbSchema from "@/components/navigation/BreadcrumbSchema";

export const revalidate = 60; // Fetch cache validation rate

interface SearchParams {
  type?: string;
  education?: string;
  funding?: string;
  status?: string;
  page?: string;
}

async function getFilteredOpportunities(params: SearchParams) {
  const limit = 9;
  const page = parseInt(params.page || "1", 10);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  let filters = `*[_type == "article" && isOpportunity == true`;

  if (params.type) {
    filters += ` && opportunityType == $type`;
  }
  if (params.education) {
    filters += ` && $education in educationLevel`;
  }
  if (params.funding) {
    filters += ` && fundingType == $funding`;
  }
  if (params.status === "active") {
    filters += ` && (dateTime(deadline) >= dateTime(now()) || !defined(deadline))`;
  }

  const countQuery = `count(${filters}])`;
  const query = `${filters}] | order(publishedAt desc) [$startIndex...$endIndex] {
    title,
    slug,
    excerpt,
    featuredImage,
    opportunityType,
    educationLevel,
    fundingType,
    deadline,
    "category": category->title
  }`;

  const queryParams = {
    type: params.type || null,
    education: params.education || null,
    funding: params.funding || null,
    startIndex,
    endIndex,
  };

  const articles = await client.fetch(query, queryParams);
  const totalCount = await client.fetch(countQuery, queryParams);
  const totalPages = Math.ceil(totalCount / limit);

  return { articles, totalPages, totalCount };
}

export default async function FinderPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);

  const { articles, totalPages, totalCount } = await getFilteredOpportunities(
    resolvedSearchParams
  );

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Opportunity Finder", item: "/finder" },
  ];

  const currentFilters = {
    type: resolvedSearchParams.type,
    education: resolvedSearchParams.education,
    funding: resolvedSearchParams.funding,
    status: resolvedSearchParams.status,
  };

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-6 py-12 space-y-12">
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="space-y-4">
        <h1 className="text-4xl font-sans font-extrabold tracking-tight text-[#14213d] dark:text-[#ffffff]">
          Opportunity Finder
        </h1>
        <p className="text-[#14213d]/60 dark:text-[#e5e5e5]/60 text-lg max-w-2xl leading-relaxed">
          Discover internships, scholarships, fellowships, and career development programs matched to your interests and education levels.
        </p>
      </div>

      <FinderClient
        articles={articles}
        totalPages={totalPages}
        currentPage={page}
        totalCount={totalCount}
        currentFilters={currentFilters}
      />
    </main>
  );
}

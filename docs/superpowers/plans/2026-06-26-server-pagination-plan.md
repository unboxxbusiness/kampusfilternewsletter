# Server-side Pagination & URL Parameters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement server-side pagination (10 items/page) and route parameters logic across Archive and Category pages.

**Architecture:** Parse `page`, `q`, and `category` query parameters from Next.js server page `searchParams`. Run paginated GROQ offset queries. Render list results and a custom `Pagination` component in the client router viewport.

**Tech Stack:** React, Next.js, Sanity CMS (GROQ).

## Global Constraints
- Preserve query parameters (like search string `q` and filter `category`) when navigating pages.
- Handle corner cases (e.g. invalid page numbers or pages exceeding total page count).

---

### Task 1: Create Reusable Pagination Component
Create a clean page-links index controller in `src/components/navigation/Pagination.tsx`.

**Files:**
- Create: `src/components/navigation/Pagination.tsx`

**Interfaces:**
- Consumes: `currentPage: number`, `totalPages: number`, `baseUrl: string`, `currentSearchParams: any`
- Produces: `<Pagination>` component

- [ ] **Step 1: Write Pagination.tsx code**
Write to `src/components/navigation/Pagination.tsx`:
```tsx
import React from "react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  currentSearchParams: { [key: string]: string | undefined };
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  currentSearchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    Object.entries(currentSearchParams).forEach(([key, val]) => {
      if (val && key !== "page") params.set(key, val);
    });
    params.set("page", pageNumber.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-900 pt-6 my-10" aria-label="Pagination">
      <div className="flex flex-1 justify-between sm:hidden">
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="relative inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-850 px-4 py-2 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-300"
          >
            Previous
          </Link>
        ) : (
          <span className="relative inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-850 px-4 py-2 text-xs font-semibold text-neutral-300 dark:text-neutral-700 cursor-not-allowed">
            Previous
          </span>
        )}
        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="relative ml-3 inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-850 px-4 py-2 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-300"
          >
            Next
          </Link>
        ) : (
          <span className="relative ml-3 inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-850 px-4 py-2 text-xs font-semibold text-neutral-300 dark:text-neutral-700 cursor-not-allowed">
            Next
          </span>
        )}
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Page <span className="font-semibold text-neutral-900 dark:text-white">{currentPage}</span> of{" "}
            <span className="font-semibold text-neutral-900 dark:text-white">{totalPages}</span>
          </p>
        </div>
        <div>
          <span className="relative inline-flex gap-1.5">
            {currentPage > 1 ? (
              <Link
                href={createPageUrl(currentPage - 1)}
                className="relative inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-850 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-300 transition"
              >
                &larr; Prev
              </Link>
            ) : (
              <span className="relative inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-850 px-3 py-1.5 text-xs font-semibold text-neutral-300 dark:text-neutral-700 cursor-not-allowed">
                &larr; Prev
              </span>
            )}
            
            {pages.map((p) => {
              const isCurrent = p === currentPage;
              return isCurrent ? (
                <span
                  key={p}
                  className="relative z-10 inline-flex items-center rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3.5 py-1.5 text-xs font-semibold"
                >
                  {p}
                </span>
              ) : (
                <Link
                  key={p}
                  href={createPageUrl(p)}
                  className="relative inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-850 px-3.5 py-1.5 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-300 transition"
                >
                  {p}
                </Link>
              );
            })}

            {currentPage < totalPages ? (
              <Link
                href={createPageUrl(currentPage + 1)}
                className="relative inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-850 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-300 transition"
              >
                Next &rarr;
              </Link>
            ) : (
              <span className="relative inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-850 px-3 py-1.5 text-xs font-semibold text-neutral-300 dark:text-neutral-700 cursor-not-allowed">
                Next &rarr;
              </span>
            )}
          </span>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Verify compilation**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/components/navigation/Pagination.tsx
git commit -m "feat: create reusable Pagination component"
```

---

### Task 2: Modify Server Page for Archive Index
Update `src/app/archive/page.tsx` to handle route params and perform dynamic paginated fetches.

**Files:**
- Modify: `src/app/archive/page.tsx`

**Interfaces:**
- Consumes: URL search parameters, Sanity client fetch
- Produces: Mapped page parameters, paginated array, page count metadata

- [ ] **Step 1: Rewrite page.tsx**
Overwrite `src/app/archive/page.tsx`:
```tsx
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
  const categories = await client.fetch(`*[_type == "category"]`);

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
```

- [ ] **Step 2: Verify compile**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/app/archive/page.tsx
git commit -m "feat: implement server-side pagination and filters in archive page"
```

---

### Task 3: Update Client component ArchivePageClient.tsx
Modify search/filters handlers inside the Client layout to route state via URL parameter triggers instead of React local states.

**Files:**
- Modify: `src/app/archive/ArchivePageClient.tsx`

**Interfaces:**
- Consumes: `<Pagination>` component
- Produces: Navigation routing events, search parameter queries

- [ ] **Step 1: Overwrite ArchivePageClient.tsx**
Overwrite `src/app/archive/ArchivePageClient.tsx`:
```tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ShareButton from "@/components/common/ShareButton";
import Pagination from "@/components/navigation/Pagination";

interface ArchivePageClientProps {
  initialArticles: any[];
  initialCategories: any[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  currentSearchParams: { page?: string; category?: string; q?: string };
}

export default function ArchivePageClient({
  initialArticles,
  initialCategories,
  totalPages,
  currentPage,
  totalCount,
  currentSearchParams,
}: ArchivePageClientProps) {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState(currentSearchParams.q || "");

  const handleCategoryClick = (categoryName: string | null) => {
    const params = new URLSearchParams();
    if (categoryName) params.set("category", categoryName);
    if (currentSearchParams.q) params.set("q", currentSearchParams.q);
    // Reset page to 1 when changing category filters
    params.set("page", "1");
    router.push(`/archive?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchVal) params.set("q", searchVal);
    if (currentSearchParams.category) params.set("category", currentSearchParams.category);
    params.set("page", "1");
    router.push(`/archive?${params.toString()}`);
  };

  // Keep local search value in sync with URL
  useEffect(() => {
    setSearchVal(currentSearchParams.q || "");
  }, [currentSearchParams.q]);

  const activeCategory = currentSearchParams.category || null;

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-sans font-bold">Archive</h1>
        <p className="text-gray-500">Explore past opportunities, articles, and intelligence reports.</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Simple inline Search form */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search articles..."
            className="w-full px-4 py-2 border rounded-full text-sm outline-none transition focus:border-black dark:focus:border-white dark:border-neutral-800 dark:bg-neutral-900 text-neutral-900 dark:text-white"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-xs font-semibold text-neutral-500 hover:text-black dark:hover:text-white">
            Search
          </button>
        </form>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`px-3 py-1 text-sm border rounded-full transition ${
              activeCategory === null 
                ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white" 
                : "border-gray-300 hover:border-black dark:border-neutral-850 dark:hover:border-white"
            }`}
          >
            All
          </button>
          {initialCategories.map((cat: any) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryClick(cat.title)}
              className={`px-3 py-1 text-sm border rounded-full transition ${
                activeCategory === cat.title 
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white" 
                  : "border-gray-300 hover:border-black dark:border-neutral-850 dark:hover:border-white"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {initialArticles.length === 0 ? (
        <div className="text-gray-500 text-sm">No articles matched your criteria.</div>
      ) : (
        <div className="flex flex-col gap-10 max-w-3xl">
          <div className="flex flex-col gap-4">
            {initialArticles.map((item: any) => (
              <article key={item.slug.current} className="flex items-center justify-between gap-4 border-b border-gray-100 dark:border-neutral-900 py-4">
                <h2 className="text-xl font-bold tracking-tight hover:underline text-neutral-900 dark:text-white">
                  <Link href={`/articles/${item.slug.current}`}>{item.title}</Link>
                </h2>
                <ShareButton slug={item.slug.current} title={item.title} />
              </article>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/archive"
            currentSearchParams={currentSearchParams}
          />
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Run linter checks**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/app/archive/ArchivePageClient.tsx
git commit -m "feat: convert ArchivePageClient to URL parameter routing and integrate Pagination"
```

---

### Task 4: Paginate Category Page
Modify `/archive/[category]/page.tsx` to handle the page query parameters and render the pagination links container.

**Files:**
- Modify: `src/app/archive/[category]/page.tsx`

**Interfaces:**
- Consumes: URL page parameters, client `<Pagination>` component
- Produces: Paginated dynamic category listing layout

- [ ] **Step 1: Rewrite page.tsx**
Overwrite `src/app/archive/[category]/page.tsx`:
```tsx
import React from "react";
import { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import Link from "next/link";
import BreadcrumbSchema from "@/components/navigation/BreadcrumbSchema";
import ShareButton from "@/components/common/ShareButton";
import Pagination from "@/components/navigation/Pagination";

export const revalidate = 60;

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

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryArchivePage({ params, searchParams }: CategoryPageProps) {
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
        <h1 className="text-4xl font-sans font-bold capitalize">{resolvedParams.category}</h1>
        <p className="text-gray-500">Explore opportunities listed under {resolvedParams.category}.</p>
      </div>

      {articles.length === 0 ? (
        <div className="text-gray-500 text-sm">No articles in this category yet.</div>
      ) : (
        <div className="flex flex-col gap-10 max-w-3xl">
          <div className="flex flex-col gap-4">
            {articles.map((item: any) => (
              <article key={item.slug.current} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold tracking-tight hover:underline text-neutral-900 dark:text-white">
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
```

- [ ] **Step 2: Run production compilation**
Run: `npm run build`
Expected: Successful production build compile.

- [ ] **Step 3: Commit**
```bash
git add src/app/archive/\[category\]/page.tsx
git commit -m "feat: implement server-side pagination on category archive page"
```

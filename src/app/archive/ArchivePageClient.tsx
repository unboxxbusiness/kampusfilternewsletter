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
        <h1 className="text-4xl font-sans font-bold text-[#14213d] dark:text-[#ffffff]">Archive</h1>
        <p className="text-[#14213d]/60 dark:text-[#e5e5e5]/60">Explore past opportunities, articles, and intelligence reports.</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Simple inline Search form */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search articles..."
            className="w-full px-4 py-2.5 border border-[#e5e5e5] dark:border-[#14213d] rounded-full text-sm outline-none transition focus:border-[#fca311] dark:focus:border-[#fca311] bg-[#ffffff] dark:bg-[#000000] text-[#14213d] dark:text-[#e5e5e5]"
          />
          <button type="submit" className="absolute right-4 top-3 text-xs font-bold text-[#14213d]/60 dark:text-[#e5e5e5]/60 hover:text-[#fca311] dark:hover:text-[#fca311] transition-colors">
            Search
          </button>
        </form>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border rounded-full transition duration-200 ${
              activeCategory === null 
                ? "bg-[#fca311] text-[#000000] border-[#fca311] font-bold shadow-sm" 
                : "border-[#e5e5e5] text-[#14213d]/70 hover:border-[#fca311] hover:text-[#fca311] dark:border-[#14213d] dark:text-[#e5e5e5]/70 dark:hover:border-[#fca311] dark:hover:text-[#fca311]"
            }`}
          >
            All
          </button>
          {initialCategories.map((cat: any) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryClick(cat.title)}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border rounded-full transition duration-200 ${
                activeCategory === cat.title 
                  ? "bg-[#fca311] text-[#000000] border-[#fca311] font-bold shadow-sm" 
                  : "border-[#e5e5e5] text-[#14213d]/70 hover:border-[#fca311] hover:text-[#fca311] dark:border-[#14213d] dark:text-[#e5e5e5]/70 dark:hover:border-[#fca311] dark:hover:text-[#fca311]"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {initialArticles.length === 0 ? (
        <div className="text-[#14213d]/60 dark:text-[#e5e5e5]/60 text-sm">No articles matched your criteria.</div>
      ) : (
        <div className="flex flex-col gap-10 max-w-3xl">
          <div className="flex flex-col gap-4">
            {initialArticles.map((item: any) => (
              <article key={item.slug.current} className="flex items-center justify-between gap-4 border-b border-[#e5e5e5] dark:border-[#14213d] py-4">
                <h2 className="text-xl font-bold tracking-tight text-[#14213d] dark:text-[#ffffff] hover:text-[#fca311] dark:hover:text-[#fca311] transition-colors">
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

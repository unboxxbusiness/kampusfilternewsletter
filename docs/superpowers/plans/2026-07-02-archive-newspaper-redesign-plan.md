# Archive Page Classic Newspaper Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Archive page to match a print-newspaper aesthetic with sharp rectlineal layouts (`rounded-none`, `shadow-none`), vertical border dividers between columns, and heavy serif typography for headlines (`font-serif font-black`).

**Architecture:** Rewrite the `ArchivePageClient.tsx` file to structure the grid layout using thin borders and columns instead of cards, and apply double border decorations to the category filter index.

**Tech Stack:** React, Next.js (App Router), Tailwind CSS.

## Global Constraints
- Apply `rounded-none` and `shadow-none` globally to the page layout components.
- Do not affect category routes or individual post article pages.

---

### Task 1: Rewrite ArchivePageClient.tsx to emulated Print News columns
Replace the client archive component file to build the classic editorial column layout.

**Files:**
- Modify: `src/app/archive/ArchivePageClient.tsx`

- [ ] **Step 1: Rewrite the ArchivePageClient.tsx component**
Replace the contents of `src/app/archive/ArchivePageClient.tsx` with:
```tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ShareButton from "@/components/common/ShareButton";
import Pagination from "@/components/navigation/Pagination";
import { urlFor } from "@/lib/sanity/image";

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

  useEffect(() => {
    setSearchVal(currentSearchParams.q || "");
  }, [currentSearchParams.q]);

  const activeCategory = currentSearchParams.category || null;

  // Extract the lead article (latest story) and secondary articles
  const leadArticle = initialArticles[0] || null;
  const secondaryArticles = initialArticles.slice(1);

  // Determine if we should show the prominent Cover Lead layout
  const showCoverLead = leadArticle && currentPage === 1 && !activeCategory && !currentSearchParams.q;

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Editorial Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight text-[#14213d] dark:text-[#ffffff]">
          The Archive
        </h1>
        <p className="text-xs font-bold tracking-widest uppercase text-[#fca311]">
          Student Intelligence & Opportunity Index
        </p>
      </div>

      {/* Newspaper Double-Border Index Section */}
      <div className="border-y-2 border-double border-[#e5e5e5] dark:border-[#14213d] py-3 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Category Filters Styled as text links */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeCategory === null 
                ? "text-[#fca311]" 
                : "text-[#14213d]/60 dark:text-[#e5e5e5]/60 hover:text-[#14213d] dark:hover:text-[#ffffff]"
            }`}
          >
            All Index
          </button>
          {initialCategories.map((cat: any) => (
            <React.Fragment key={cat._id}>
              <span className="text-[#14213d]/20 dark:text-[#e5e5e5]/20 text-xs select-none">|</span>
              <button
                onClick={() => handleCategoryClick(cat.title)}
                className={`text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeCategory === cat.title 
                    ? "text-[#fca311]" 
                    : "text-[#14213d]/60 dark:text-[#e5e5e5]/60 hover:text-[#14213d] dark:hover:text-[#ffffff]"
                }`}
              >
                {cat.title}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Minimal Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search index..."
            className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-none text-xs outline-none transition focus:border-[#fca311] bg-[#ffffff] dark:bg-[#0c1220] text-[#14213d] dark:text-[#e5e5e5]"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-[9px] font-bold uppercase tracking-wider text-[#14213d]/60 dark:text-[#e5e5e5]/60 hover:text-[#fca311] transition-colors">
            Find
          </button>
        </form>
      </div>

      {initialArticles.length === 0 ? (
        <div className="text-center py-12 text-[#14213d]/60 dark:text-[#e5e5e5]/60 text-sm">
          No records matched your query.
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* 1. Featured Cover Lead Story */}
          {showCoverLead && (
            <div className="border-b border-[#e5e5e5] dark:border-[#14213d] pb-12">
              <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Lead Image */}
                {leadArticle.featuredImage && (
                  <div className="lg:col-span-7">
                    <Link href={`/articles/${leadArticle.slug.current}`} className="block relative aspect-video w-full overflow-hidden rounded-none shadow-none border border-neutral-200/40 dark:border-neutral-800/40 bg-neutral-100 dark:bg-neutral-900">
                      <Image
                        src={urlFor(leadArticle.featuredImage).width(1000).auto("format").url()}
                        alt={leadArticle.title}
                        fill
                        priority
                        className="object-cover"
                      />
                    </Link>
                  </div>
                )}

                {/* Lead Meta/Headline */}
                <div className={`space-y-4 lg:col-span-5 ${!leadArticle.featuredImage ? "lg:col-span-12" : ""}`}>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-[#fca311]">
                    <span>{leadArticle.category}</span>
                    <span className="text-[#14213d]/30 dark:text-[#e5e5e5]/30">&bull;</span>
                    <span className="text-[#14213d]/50 dark:text-[#e5e5e5]/50 font-normal">
                      {new Date(leadArticle.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-[#14213d] dark:text-[#ffffff] hover:text-[#fca311] dark:hover:text-[#fca311] leading-tight transition-colors">
                    <Link href={`/articles/${leadArticle.slug.current}`}>{leadArticle.title}</Link>
                  </h2>
                  
                  <p className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 text-base leading-relaxed">
                    {leadArticle.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#e5e5e5] dark:border-[#14213d]">
                    <span className="text-xs font-semibold text-[#14213d]/50 dark:text-[#e5e5e5]/50">
                      {leadArticle.readingTime} min read
                    </span>
                    <ShareButton slug={leadArticle.slug.current} title={leadArticle.title} />
                  </div>
                </div>
              </article>
            </div>
          )}

          {/* 2. Secondary Articles Newspaper Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
            {(showCoverLead ? secondaryArticles : initialArticles).map((item: any, index: number) => {
              return (
                <article 
                  key={item.slug.current} 
                  className="flex flex-col justify-between rounded-none border-0 shadow-none bg-transparent lg:border-r lg:border-neutral-200 lg:dark:border-neutral-800/80 lg:pr-6 lg:last:border-r-0 lg:last:pr-0"
                >
                  <div className="space-y-4">
                    {/* Thumbnail Image */}
                    {item.featuredImage && (
                      <Link href={`/articles/${item.slug.current}`} className="block relative aspect-[16/10] w-full overflow-hidden rounded-none border border-neutral-200/40 dark:border-neutral-800/40 shadow-none bg-neutral-100 dark:bg-neutral-900">
                        <Image
                          src={urlFor(item.featuredImage).width(450).auto("format").url()}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </Link>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#fca311]">
                        <span>{item.category}</span>
                        <span className="text-[#14213d]/30 dark:text-[#e5e5e5]/30">&bull;</span>
                        <span className="text-[#14213d]/50 dark:text-[#e5e5e5]/50 font-normal">
                          {new Date(item.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </div>

                      <h3 className="text-xl font-serif font-black text-[#14213d] dark:text-[#ffffff] hover:text-[#fca311] dark:hover:text-[#fca311] leading-snug transition-colors line-clamp-3">
                        <Link href={`/articles/${item.slug.current}`}>{item.title}</Link>
                      </h3>

                      <p className="text-[#14213d]/60 dark:text-[#e5e5e5]/60 text-sm leading-relaxed line-clamp-3">
                        {item.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-6 border-t border-[#e5e5e5] dark:border-[#14213d]">
                    <span className="text-[10px] font-semibold text-[#14213d]/50 dark:text-[#e5e5e5]/50">
                      {item.readingTime} min read
                    </span>
                    <ShareButton slug={item.slug.current} title={item.title} />
                  </div>
                </article>
              );
            })}
          </div>

          {/* 3. Pagination Actions */}
          <div className="pt-8 border-t border-[#e5e5e5] dark:border-[#14213d]">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/archive"
              currentSearchParams={currentSearchParams}
            />
          </div>

        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Verify lint and build**
Run: `npm run lint` and `npm run build`
Expected: PASS

- [ ] **Step 3: Commit code updates**
```bash
git add src/app/archive/ArchivePageClient.tsx
git commit -m "style: implement classic editorial newspaper column layout on Archive page"
```

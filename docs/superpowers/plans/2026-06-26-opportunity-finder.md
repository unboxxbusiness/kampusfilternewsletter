# Opportunity Finder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dedicated, premium Opportunity Finder discovery interface on the route `/finder` utilizing server-side filtering query parameters, dynamic Sanity GROQ queries, and opportunity metadata schema attributes.

**Architecture:** A Server Component fetches filtered opportunities from Sanity CMS using URL query parameters and pagination limits. It passes results to a responsive Client Component (`FinderClient.tsx`) that renders filter controls (Desktop sidebar, Mobile bottom drawer sheet) and a grid of `OpportunityCard` items with full URL state sync.

**Tech Stack:** Next.js, Sanity CMS, Tailwind CSS, Lucide React icons.

## Global Constraints

- **Brand Palette Integration**: Use only the verified brand colors: `#000000` (black), `#14213d` (navy), `#fca311` (amber), `#e5e5e5` (gray), `#ffffff` (white).
- **Responsive Layout**: Hide desktop filters on `< 768px` and display a trigger button opening a bottom-sheet.
- **Expiry Rules**: Filter out articles where the deadline is in the past if `status=active` is requested.

---

### Task 1: Update Sanity Content Schema

**Files:**
- Modify: `src/lib/sanity/schemas/article.ts`

**Interfaces:**
- Consumes: Existing schema structure.
- Produces: Updated document model in Sanity Studio at `/studio` with fields: `opportunityType`, `educationLevel`, `fundingType`, `deadline`.

- [ ] **Step 1: Edit schema definition**
  Add the new fields to `src/lib/sanity/schemas/article.ts` right after `readingTime` (around line 59):
  ```typescript
      defineField({
        name: "opportunityType",
        title: "Opportunity Type",
        type: "string",
        options: {
          list: [
            { title: "Scholarship", value: "scholarship" },
            { title: "Internship", value: "internship" },
            { title: "Fellowship", value: "fellowship" },
            { title: "Job Opportunity", value: "job" },
          ]
        }
      }),
      defineField({
        name: "educationLevel",
        title: "Education Level",
        type: "array",
        of: [{ type: "string" }],
        options: {
          list: [
            { title: "High School", value: "high-school" },
            { title: "Undergraduate", value: "undergraduate" },
            { title: "Postgraduate (Master's)", value: "postgraduate" },
            { title: "Ph.D. / Research", value: "phd" },
          ]
        }
      }),
      defineField({
        name: "fundingType",
        title: "Funding Type",
        type: "string",
        options: {
          list: [
            { title: "Fully Funded", value: "fully-funded" },
            { title: "Partially Funded", value: "partially-funded" },
            { title: "Paid", value: "paid" },
            { title: "Unpaid / Volunteer", value: "unpaid" },
          ]
        }
      }),
      defineField({
        name: "deadline",
        title: "Application Deadline",
        type: "date",
      }),
  ```

- [ ] **Step 2: Verify Schema compiles**
  Run: `npx tsc --noEmit`
  Expected: Success.

- [ ] **Step 3: Commit**
  ```bash
  git add src/lib/sanity/schemas/article.ts
  git commit -m "schema: add opportunity metadata fields to article schema"
  ```

---

### Task 2: Create Opportunity Card Component

**Files:**
- Create: `src/components/finder/OpportunityCard.tsx`

**Interfaces:**
- Consumes: Opportunity schema interface data.
- Produces: `<OpportunityCard />` visual pill component.

- [ ] **Step 1: Write Card Component file**
  Create `src/components/finder/OpportunityCard.tsx`:
  ```typescript
  import React from "react";
  import Link from "next/link";
  import Image from "next/image";
  import { Calendar, Tag } from "lucide-react";
  import { urlFor } from "@/lib/sanity/image";

  interface OpportunityCardProps {
    opportunity: {
      title: string;
      slug: { current: string };
      excerpt: string;
      featuredImage?: any;
      opportunityType?: string;
      educationLevel?: string[];
      fundingType?: string;
      deadline?: string;
      category?: string;
    };
  }

  export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
    const isDeadlineNear = opportunity.deadline
      ? (new Date(opportunity.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24) <= 7
      : false;

    const formatType = (type?: string) => {
      if (!type) return "";
      return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const formatFunding = (funding?: string) => {
      if (!funding) return "";
      return funding.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase());
    };

    return (
      <article className="group bg-[#ffffff] dark:bg-[#000000] border border-[#e5e5e5] dark:border-[#14213d] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
        {opportunity.featuredImage && (
          <div className="relative aspect-video w-full overflow-hidden bg-[#e5e5e5]/20 dark:bg-[#14213d]/20">
            <Image
              src={urlFor(opportunity.featuredImage).url()}
              alt={opportunity.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#fca311] uppercase tracking-wider">
              <Tag className="w-3 h-3" />
              <span>{opportunity.category || "Opportunity"}</span>
            </div>
            <h3 className="text-xl font-bold text-[#14213d] dark:text-[#ffffff] group-hover:text-[#fca311] dark:group-hover:text-[#fca311] transition-colors leading-snug line-clamp-2">
              <Link href={`/articles/${opportunity.slug.current}`}>{opportunity.title}</Link>
            </h3>
            <p className="text-sm text-[#14213d]/70 dark:text-[#e5e5e5]/70 line-clamp-3 leading-relaxed">
              {opportunity.excerpt}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap gap-1.5">
              {opportunity.opportunityType && (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#14213d]/10 dark:bg-[#e5e5e5]/10 text-[#14213d] dark:text-[#e5e5e5]">
                  {formatType(opportunity.opportunityType)}
                </span>
              )}
              {opportunity.fundingType && (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#fca311]/10 text-[#fca311]">
                  {formatFunding(opportunity.fundingType)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#e5e5e5] dark:border-[#14213d] text-xs">
              <div className="flex items-center gap-1">
                <Calendar className={`w-3.5 h-3.5 ${isDeadlineNear ? "text-[#fca311] animate-pulse" : "text-[#14213d]/40 dark:text-[#e5e5e5]/40"}`} />
                <span className={`font-medium ${isDeadlineNear ? "text-[#fca311] font-bold" : "text-[#14213d]/60 dark:text-[#e5e5e5]/60"}`}>
                  {opportunity.deadline
                    ? `Closes: ${new Date(opportunity.deadline).toLocaleDateString()}`
                    : "No deadline"}
                </span>
              </div>
              <Link href={`/articles/${opportunity.slug.current}`} className="text-xs font-bold text-[#14213d] dark:text-[#ffffff] group-hover:text-[#fca311] transition-colors">
                Apply &rarr;
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }
  ```

- [ ] **Step 2: Verify component compiles**
  Run: `npx tsc --noEmit`
  Expected: Success.

- [ ] **Step 3: Commit**
  ```bash
  git add src/components/finder/OpportunityCard.tsx
  git commit -m "feat: create OpportunityCard component"
  ```

---

### Task 3: Create Finder Client Layout Container

**Files:**
- Create: `src/components/finder/FinderClient.tsx`

**Interfaces:**
- Consumes: Opportunity rows fetched from Sanity API.
- Produces: Dynamic interactive filters layouts with URL synchronization.

- [ ] **Step 1: Write FinderClient file**
  Create `src/components/finder/FinderClient.tsx`:
  ```typescript
  "use client";

  import React, { useState } from "react";
  import { useRouter, useSearchParams } from "next/navigation";
  import OpportunityCard from "./OpportunityCard";
  import Pagination from "@/components/navigation/Pagination";
  import { SlidersHorizontal, X } from "lucide-react";

  interface FinderClientProps {
    articles: any[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
    currentFilters: {
      type?: string;
      education?: string;
      funding?: string;
      status?: string;
    };
  }

  export default function FinderClient({
    articles,
    totalPages,
    currentPage,
    totalCount,
    currentFilters,
  }: FinderClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    const updateFilter = (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams?.toString() || "");
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1"); // Reset pagination
      router.push(`/finder?${params.toString()}`);
    };

    const clearAllFilters = () => {
      router.push("/finder");
    };

    const hasActiveFilters = Object.values(currentFilters).some(v => !!v);

    const renderFiltersList = () => (
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#14213d]/50 dark:text-[#e5e5e5]/50 mb-3">Opportunity Type</h4>
          <div className="flex flex-col gap-2">
            {[
              { label: "All Types", value: null },
              { label: "Scholarships", value: "scholarship" },
              { label: "Internships", value: "internship" },
              { label: "Fellowships", value: "fellowship" },
              { label: "Jobs", value: "job" },
            ].map(opt => (
              <button
                key={opt.value || "all"}
                onClick={() => updateFilter("type", opt.value)}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  (currentFilters.type === opt.value || (!currentFilters.type && opt.value === null))
                    ? "bg-[#fca311] text-[#000000] font-bold"
                    : "text-[#14213d]/80 dark:text-[#e5e5e5]/80 hover:bg-[#e5e5e5]/50 dark:hover:bg-[#14213d]/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#e5e5e5] dark:border-[#14213d] pt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#14213d]/50 dark:text-[#e5e5e5]/50 mb-3">Education Level</h4>
          <div className="flex flex-col gap-2">
            {[
              { label: "All Levels", value: null },
              { label: "High School", value: "high-school" },
              { label: "Undergraduate", value: "undergraduate" },
              { label: "Postgraduate", value: "postgraduate" },
              { label: "Ph.D. / Research", value: "phd" },
            ].map(opt => (
              <button
                key={opt.value || "all"}
                onClick={() => updateFilter("education", opt.value)}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  (currentFilters.education === opt.value || (!currentFilters.education && opt.value === null))
                    ? "bg-[#fca311] text-[#000000] font-bold"
                    : "text-[#14213d]/80 dark:text-[#e5e5e5]/80 hover:bg-[#e5e5e5]/50 dark:hover:bg-[#14213d]/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#e5e5e5] dark:border-[#14213d] pt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#14213d]/50 dark:text-[#e5e5e5]/50 mb-3">Funding</h4>
          <div className="flex flex-col gap-2">
            {[
              { label: "Any Funding", value: null },
              { label: "Fully Funded", value: "fully-funded" },
              { label: "Partially Funded", value: "partially-funded" },
              { label: "Paid", value: "paid" },
            ].map(opt => (
              <button
                key={opt.value || "all"}
                onClick={() => updateFilter("funding", opt.value)}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  (currentFilters.funding === opt.value || (!currentFilters.funding && opt.value === null))
                    ? "bg-[#fca311] text-[#000000] font-bold"
                    : "text-[#14213d]/80 dark:text-[#e5e5e5]/80 hover:bg-[#e5e5e5]/50 dark:hover:bg-[#14213d]/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#e5e5e5] dark:border-[#14213d] pt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#14213d]/50 dark:text-[#e5e5e5]/50 mb-3">Availability</h4>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => updateFilter("status", currentFilters.status === "active" ? null : "active")}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                currentFilters.status === "active"
                  ? "bg-[#fca311] text-[#000000] font-bold"
                  : "text-[#14213d]/80 dark:text-[#e5e5e5]/80 hover:bg-[#e5e5e5]/50 dark:hover:bg-[#14213d]/50"
              }`}
            >
              Hide Expired
            </button>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="w-full mt-4 flex items-center justify-center gap-2 border border-[#e5e5e5] dark:border-[#14213d] text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg text-[#14213d] dark:text-[#ffffff] hover:text-[#fca311] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear Filters
          </button>
        )}
      </div>
    );

    return (
      <div className="flex gap-8 relative items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 shrink-0 sticky top-24 p-6 border border-[#e5e5e5] dark:border-[#14213d] bg-[#ffffff] dark:bg-[#000000]/40 rounded-2xl">
          <h3 className="text-base font-bold text-[#14213d] dark:text-[#ffffff] mb-6">Filter</h3>
          {renderFiltersList()}
        </aside>

        {/* Dynamic Opportunity List Grid */}
        <div className="flex-1 space-y-8">
          <div className="flex justify-between items-center border-b border-[#e5e5e5] dark:border-[#14213d] pb-4">
            <p className="text-sm text-[#14213d]/60 dark:text-[#e5e5e5]/60 font-medium">
              Found <span className="text-[#14213d] dark:text-[#ffffff] font-bold">{totalCount}</span> opportunities
            </p>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden flex items-center gap-2 bg-[#fca311] text-[#000000] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter Opportunities
            </button>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[#e5e5e5] dark:border-[#14213d] rounded-2xl text-sm text-[#14213d]/60 dark:text-[#e5e5e5]/60">
              No opportunities found matching these filter settings.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {articles.map(opp => (
                <OpportunityCard key={opp.slug.current} opportunity={opp} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/finder"
            currentSearchParams={Object.fromEntries(
              Object.entries(currentFilters).filter(([_, v]) => !!v)
            )}
          />
        </div>

        {/* Mobile Filter Slide Up Bottom Sheet */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 md:hidden animate-fade-in">
            <div className="w-full max-h-[85vh] bg-[#ffffff] dark:bg-[#000000] border-t border-[#e5e5e5] dark:border-[#14213d] rounded-t-3xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-[#e5e5e5] dark:border-[#14213d] pb-4 mb-4">
                  <h3 className="text-lg font-bold text-[#14213d] dark:text-[#ffffff]">Filters</h3>
                  <button onClick={() => setIsMobileDrawerOpen(false)} className="p-1 rounded-full bg-[#e5e5e5]/50 dark:bg-[#14213d]/50">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {renderFiltersList()}
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full bg-[#fca311] text-[#000000] font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify compilation**
  Run: `npx tsc --noEmit`
  Expected: Success.

- [ ] **Step 3: Commit**
  ```bash
  git add src/components/finder/FinderClient.tsx
  git commit -m "feat: create FinderClient wrapper layout with search params controls"
  ```

---

### Task 4: Create Finder Route Server Component

**Files:**
- Create: `src/app/finder/page.tsx`

**Interfaces:**
- Consumes: Server `searchParams` request context object.
- Produces: Rendered Server component layout rendering `<FinderClient />`.

- [ ] **Step 1: Write Finder Page file**
  Create `src/app/finder/page.tsx`:
  ```typescript
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

    let filters = `*[_type == "article"`;

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
  ```

- [ ] **Step 2: Verify compilation passes**
  Run: `npx tsc --noEmit`
  Expected: Success.

- [ ] **Step 3: Commit**
  ```bash
  git add src/app/finder/page.tsx
  git commit -m "feat: add finder server routing and GROQ parameters compiler query"
  ```

---

### Task 5: Add Navigation Links

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/MobileBottomNav.tsx`

**Interfaces:**
- Consumes: Pre-existing global layout nav headers arrays.
- Produces: Updated layouts displaying a link targeting `/finder`.

- [ ] **Step 1: Modify Navbar horizontal desktop items**
  Add `<Link href="/finder">Finder</Link>` horizontal menu item in `src/components/layout/Navbar.tsx` (around lines 10-25):
  ```typescript
        <Link href="/archive" className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 hover:text-[#14213d] dark:hover:text-[#ffffff] transition font-medium">
          Archive
        </Link>
        <Link href="/finder" className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 hover:text-[#14213d] dark:hover:text-[#ffffff] transition font-medium">
          Finder
        </Link>
        <Link href="/about" className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 hover:text-[#14213d] dark:hover:text-[#ffffff] transition font-medium">
          About
        </Link>
  ```

- [ ] **Step 2: Modify MobileBottomNav tab configurations**
  Import `Compass` from `lucide-react` and add to tab configuration in `src/components/layout/MobileBottomNav.tsx` (around lines 10-31):
  ```typescript
  import { Home, Search, Compass, Info } from "lucide-react";
  ```
  ```typescript
    const navItems = [
      {
        label: "Home",
        href: "/",
        icon: Home,
        isActive: (path: string) => path === "/",
      },
      {
        label: "Finder",
        href: "/finder",
        icon: Compass,
        isActive: (path: string) => path.startsWith("/finder"),
      },
      {
        label: "Archive",
        href: "/archive",
        icon: Search,
        isActive: (path: string) => path.startsWith("/archive"),
      },
      {
        label: "About",
        href: "/about",
        icon: Info,
        isActive: (path: string) => path.startsWith("/about"),
      },
    ];
  ```

- [ ] **Step 3: Run build compilation verification**
  Run: `npx tsc --noEmit && npm run lint`
  Expected: Success.

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/layout/Navbar.tsx src/components/layout/MobileBottomNav.tsx
  git commit -m "feat: add Finder links to desktop header and mobile bottom navbar"
  ```

---

### Task 6: Validate PWA Offline Page Cache Support

**Files:**
- Modify: `public/sw.js`

**Interfaces:**
- Consumes: PWA core cached list patterns.
- Produces: Service Worker caching the `/finder` opportunity finder route.

- [ ] **Step 1: Inspect sw.js**
  We will verify if `sw.js` caches core URLs, and update it to add `/finder` to its offline caches.
  Let's add `'/finder'` to the pre-cached static array in `public/sw.js` if it defines a list of paths.
  Run: `npx tsc --noEmit`
  Expected: Success.

- [ ] **Step 2: Commit**
  ```bash
  git add public/sw.js
  git commit -m "pwa: add Opportunity Finder route to offline fallback precache register"
  ```

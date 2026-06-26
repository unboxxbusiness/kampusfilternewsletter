# Design Document: Server-side Pagination & URL-Based Filtering

This document details the architecture and implementation details for migrating Archive list search, filters, and page offsets entirely to server-side query parameters.

---

## 1. Objectives

- **SEO Indexability**: Move all page states (search query `q`, active filter `category`, and page index `page`) to URL query parameters. This allows search bots to crawl paginated index pages directly.
- **Dynamic Server-Side Fetching**:
  - Fetch only 10 articles per page from Sanity CMS based on `$startIndex` and `$endIndex`.
  - Fetch total count of filtered articles to compute dynamic page numbers.
- **Component Architecture**:
  - Reusable, server-side pagination controller (`src/components/navigation/Pagination.tsx`) displaying clean page links (`< Prev`, `Next >`, and numbered indices) that preserve other query states.
  - Simplify `ArchivePageClient.tsx` and `/archive/[category]/page.tsx` to display lists and push search/filter events to Next.js route navigation router hooks.

---

## 2. Technical Solution

### A. Reusable Pagination Component (`src/components/navigation/Pagination.tsx`)
Create a client/server component showing pagination controls:
- Consumes: `currentPage: number`, `totalPages: number`, `baseUrl: string`, `currentSearchParams: { [key: string]: string | undefined }`.
- Logic: Helper function to generate modified URL strings preserving other active parameters:
  ```typescript
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    Object.entries(currentSearchParams).forEach(([key, val]) => {
      if (val && key !== "page") params.set(key, val);
    });
    params.set("page", pageNumber.toString());
    return `${baseUrl}?${params.toString()}`;
  };
  ```

### B. Archive page database queries (`src/app/archive/page.tsx`)
Update `ArchivePage` to receive `searchParams`:
```typescript
interface SearchParams {
  page?: string;
  category?: string;
  q?: string;
}

export default async function ArchivePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const q = resolvedSearchParams.q || "";
  const category = resolvedSearchParams.category || "";

  const limit = 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Build GROQ filter clauses dynamically
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
  ...
```

### C. Client Actions (`src/app/archive/ArchivePageClient.tsx`)
Update the search bar and filter button components to push router navigation events rather than setting local state:
```typescript
const handleSearchChange = (query: string) => {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (selectedCategory) params.set("category", selectedCategory);
  router.push(`/archive?${params.toString()}`);
};
```

---

## 3. Verification Plan

### Automated Verification
- Run `npm run lint` to verify that there are no syntax or type validation issues.
- Run `npm run build` to confirm production build compiles successfully.

### Manual Verification
- Deploy locally and verify URL changes on categories selections (e.g. clicking "Opportunities" updates link to `?category=Opportunities`).
- Search for a query and verify page increments (`?q=term&page=2`) loads correct paginated offsets.

# Related Articles Interlinking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a server-rendered "Related Articles" section at the bottom of the article details page for consistent backlink distribution.

**Architecture:** Fetch related posts from Sanity CMS inside the server component loader. If category matching returns fewer than 3 posts, backfill from global latest posts. Render using a minimalist text list.

**Tech Stack:** React, Next.js, Sanity CMS (GROQ).

## Global Constraints
- Links must be server-rendered (no client-side fetching) to ensure they are visible to search crawlers.
- Ensure the current article itself is never listed in the recommendations list.

---

### Task 1: Create RelatedArticles Component
Create `src/components/article/RelatedArticles.tsx` to display the list of recommended links.

**Files:**
- Create: `src/components/article/RelatedArticles.tsx`

**Interfaces:**
- Consumes: `articles: any[]`, `categoryTitle: string`, `isBackfilled: boolean`
- Produces: `<RelatedArticles>` component

- [ ] **Step 1: Write RelatedArticles.tsx code**
Write to `src/components/article/RelatedArticles.tsx`:
```tsx
import React from "react";
import Link from "next/link";

interface RelatedArticlesProps {
  articles: any[];
  categoryTitle: string;
  isBackfilled: boolean;
}

export default function RelatedArticles({ articles, categoryTitle, isBackfilled }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="space-y-6 my-12 pt-8 border-t border-neutral-100 dark:border-neutral-900">
      <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">
        {isBackfilled ? "Recommended Articles" : `More in ${categoryTitle}`}
      </h3>
      <ul className="space-y-4">
        {articles.map((item) => (
          <li key={item.slug.current} className="group">
            <Link href={`/articles/${item.slug.current}`} className="block">
              <span className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 group-hover:underline group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </span>
              <span className="block text-xs text-neutral-400 mt-1">
                {new Date(item.publishedAt).toLocaleDateString()} &bull; {item.readingTime} min read
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Verify compilation**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/components/article/RelatedArticles.tsx
git commit -m "feat: create RelatedArticles list component for interlinking"
```

---

### Task 2: Implement Sanity Fetch and Render in Article details page
Modify `src/app/articles/[slug]/page.tsx` to load dynamic related content and inject the `<RelatedArticles>` component.

**Files:**
- Modify: `src/app/articles/[slug]/page.tsx`

**Interfaces:**
- Consumes: `<RelatedArticles>` component, Sanity dynamic database query
- Produces: Article detail view showing related list links

- [ ] **Step 1: Update page.tsx with related fetching and rendering**
Modify `src/app/articles/[slug]/page.tsx` to fetch related/backfill articles and render the component.
Replace `getArticle` and `ArticlePage` component content:
```tsx
// Helper to fetch details and related posts
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

  // 1. Fetch related articles in same category
  let related = [];
  let isBackfilled = false;

  if (categoryId) {
    related = await client.fetch(
      `*[_type == "article" && category._ref == $categoryId && _id != $currentId] | order(publishedAt desc)[0...3] {
        title,
        slug,
        publishedAt,
        readingTime
      }`,
      { categoryId, currentId }
    );
  }

  // 2. Fallback / Backfill from global latest if less than 3
  if (related.length < 3) {
    const needed = 3 - related.length;
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
```

And update the dynamic imports and components rendering:
```tsx
import RelatedArticles from "@/components/article/RelatedArticles";
```
And inside `ArticlePage`:
```tsx
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { article, related, isBackfilled } = await getArticleData(resolvedParams.slug);

  if (!article) return <div className="p-12 text-center">Article not found</div>;
  ...
```
And render:
```tsx
        <PostShareBar slug={resolvedParams.slug} title={article.title} />

        <RelatedArticles
          articles={related}
          categoryTitle={article.category?.title || ""}
          isBackfilled={isBackfilled}
        />

        <div className="mt-20 p-8 border border-black text-center space-y-4">
```

- [ ] **Step 2: Run linter and verify compile**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Run production build**
Run: `npm run build`
Expected: Successful compile and static route generation.

- [ ] **Step 4: Commit**
```bash
git add src/app/articles/\[slug\]/page.tsx
git commit -m "feat: query and display related articles at the bottom of dynamic post page"
```

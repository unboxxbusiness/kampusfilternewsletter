# Design Document: Related Articles Interlinking for Backlink Optimization

This document outlines the design and implementation details for adding a "Related Articles" interlinking section at the bottom of the article details page.

---

## 1. Objectives

- **SEO Backlinks Distribution**: Create crawlable, server-rendered links at the bottom of dynamic article pages. This ensures search engines and AI bots follow links and index the site's pages effectively.
- **Related Selection Logic**:
  - Retrieve the 3 latest articles from the *same category* as the current article, excluding the current article.
  - If fewer than 3 related articles exist, backfill with the latest global articles (still excluding the current article) to always guarantee exactly 3 links are present.
- **Aesthetics**:
  - Premium list-style layout labeled "More in [Category Name]" (or "Recommended Articles" if backfilled).
  - Clean text links with hover underlines, published dates, and reading times to match the minimalist typography design.

---

## 2. Technical Solution

### A. Sanity CMS Fetch Logic (`src/app/articles/[slug]/page.tsx`)
Modify the page data loader to run a combined GROQ query:
1. Fetch the current article.
2. Fetch related articles in the same category (excluding current article):
   ```groq
   *[_type == "article" && category._ref == $categoryId && _id != $currentId] | order(publishedAt desc)[0...3] {
     _id,
     title,
     slug,
     publishedAt,
     readingTime
   }
   ```
3. If the results are fewer than 3, run a fallback query to fetch global recent articles (excluding current article) to backfill the array up to size 3:
   ```groq
   *[_type == "article" && _id != $currentId] | order(publishedAt desc)[0...3] {
     _id,
     title,
     slug,
     publishedAt,
     readingTime
   }
   ```

### B. New Component (`src/components/article/RelatedArticles.tsx`)
Create a server component `RelatedArticles.tsx` which renders the list:
- Props: `articles: any[]`, `categoryTitle: string`, `isBackfilled: boolean`
- Markup:
  ```tsx
  <div className="space-y-6 my-12 pt-8 border-t border-neutral-100 dark:border-neutral-900">
    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
      {isBackfilled ? "Recommended Articles" : `More in ${categoryTitle}`}
    </h3>
    <ul className="space-y-4">
      {articles.map((item) => (
        <li key={item.slug.current} className="group">
          <Link href={`/articles/${item.slug.current}`} className="block">
            <span className="text-lg font-medium text-neutral-800 dark:text-neutral-200 group-hover:underline">
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
  ```

### C. Integration in page layout (`src/app/articles/[slug]/page.tsx`)
- Render `<RelatedArticles>` right below `<PostShareBar>` and above the newsletter banner.

---

## 3. Verification Plan

### Automated Verification
- Run `npm run lint` to verify that there are no syntax or type validation issues.
- Run `npm run build` to confirm production build compiles successfully.

### Manual Verification
- Navigate to an article page.
- Verify that a list of 3 related articles appears below the share bar.
- Inspect the source code of the page to verify that the links are server-rendered and fully visible in the HTML document.

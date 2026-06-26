# Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement comprehensive Next.js, Sanity, and image performance optimizations to improve page speed and bandwidth consumption.

**Architecture:** Switch dynamic/SSR routes to SSG/ISR, enforce GROQ projections to only retrieve required fields, resize/WebP-format Sanity images, and implement code splitting for heavy client components.

**Tech Stack:** Next.js, React, Sanity, GROQ

## Global Constraints
- Do not introduce unused npm packages.
- Keep components focused and reusable.
- Verify production build finishes cleanly without warning/error.

---

### Task 1: SSG & ISR Route Optimizations

**Files:**
- Modify: `src/app/(marketing)/page.tsx`
- Modify: `src/app/articles/[slug]/page.tsx`
- Modify: `src/app/archive/[category]/page.tsx`

- [ ] **Step 1: Enable ISR on the homepage**
  Modify `src/app/(marketing)/page.tsx`: Change line 8 `export const revalidate = 0;` to `export const revalidate = 60;`.
  
- [ ] **Step 2: Add generateStaticParams to articles/[slug]**
  Modify `src/app/articles/[slug]/page.tsx`: Import `client` and implement `generateStaticParams` function to pre-render articles.
  
- [ ] **Step 3: Add generateStaticParams to archive/[category]**
  Modify `src/app/archive/[category]/page.tsx`: Implement `generateStaticParams` function to pre-render category archives.

- [ ] **Step 4: Verify static params generation**
  Run: `npx next build` and check build outputs for `/articles/[slug]` and `/archive/[category]`.

---

### Task 2: Sanity GROQ Query Optimizations

**Files:**
- Modify: `src/app/archive/page.tsx`

- [ ] **Step 1: Optimize categories list query**
  Modify `src/app/archive/page.tsx`: Replace line 46:
  `const categories = await client.fetch(\`*[_type == "category"]\`);`
  with specific field selection:
  `const categories = await client.fetch(\`*[_type == "category"] { _id, title, "slug": slug.current }\`);`

- [ ] **Step 2: Run build to verify query compilation**
  Run: `npx next build`
  Expected: Success

---

### Task 3: Image Resizing & WebP Optimization

**Files:**
- Modify: `src/app/(marketing)/page.tsx`
- Modify: `src/app/articles/[slug]/page.tsx`
- Modify: `src/components/finder/OpportunityCard.tsx`
- Modify: `src/components/article/PortableTextRenderer.tsx`

- [ ] **Step 1: Optimize OG image in homepage metadata**
  Modify `src/app/(marketing)/page.tsx` line 32:
  Change `urlFor(settings.socialShareImage).url()` to `urlFor(settings.socialShareImage).width(1200).height(630).auto("format").url()`.

- [ ] **Step 2: Optimize images in article detail page**
  Modify `src/app/articles/[slug]/page.tsx`:
  - Line 38: Change `urlFor(article.featuredImage).url()` to `urlFor(article.featuredImage).width(1200).height(630).auto("format").url()`.
  - Line 139: Change `urlFor(article.featuredImage).url()` to `urlFor(article.featuredImage).width(1200).height(630).auto("format").url()`.
  - Line 196: Change `urlFor(article.author.image).url()` to `urlFor(article.author.image).width(80).height(80).auto("format").url()`.
  - Line 215: Change `urlFor(article.featuredImage).url()` to `urlFor(article.featuredImage).width(1200).auto("format").url()`.

- [ ] **Step 3: Optimize OpportunityCard preview image**
  Modify `src/components/finder/OpportunityCard.tsx` line 41:
  Change `urlFor(opportunity.featuredImage).url()` to `urlFor(opportunity.featuredImage).width(400).height(225).auto("format").url()`.

- [ ] **Step 4: Optimize PortableText body images**
  Modify `src/components/article/PortableTextRenderer.tsx` line 48:
  Change `urlFor(value).url()` to `urlFor(value).width(800).auto("format").url()`.

---

### Task 4: Dynamic Code Splitting for Client Components

**Files:**
- Modify: `src/app/articles/[slug]/page.tsx`

- [ ] **Step 1: Convert TableOfContents import to next/dynamic**
  Modify `src/app/articles/[slug]/page.tsx` line 5:
  Change `import TableOfContents from "@/components/article/TableOfContents";`
  to a dynamic import:
  ```typescript
  import dynamic from "next/dynamic";
  const TableOfContents = dynamic(() => import("@/components/article/TableOfContents"), { ssr: false });
  ```

- [ ] **Step 2: Run final production build and check outputs**
  Run: `npm run build`
  Expected: PASS

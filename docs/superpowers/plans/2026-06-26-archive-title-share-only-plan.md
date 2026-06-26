# Archive Title & Share Only Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify post card layouts in both Archive and Category archive pages to show only the Title on the left and the Share Button on the right (horizontal flex row).

**Architecture:** Remove category tags, excerpts, dates, and read times from post lists. Wrap title links and share buttons in a space-between flexbox.

**Tech Stack:** React, Tailwind CSS.

## Global Constraints
- Do not affect dynamic article details pages or sitemap structures.
- Keep the overall list container width restricted to `max-w-3xl`.

---

### Task 1: Simplify ArchivePageClient.tsx list layout
Simplify the rendering code for article items inside the client-side archive page.

**Files:**
- Modify: `src/app/archive/ArchivePageClient.tsx`

**Interfaces:**
- Consumes: `<ShareButton>` component
- Produces: Updated minimal horizontal archive row layout

- [ ] **Step 1: Simplify article card mapping block**
Modify lines 78-90 of `src/app/archive/ArchivePageClient.tsx`:
```tsx
          {displayArticles.map((item: any) => (
            <article key={item.slug.current} className="flex items-center justify-between gap-4 border-b border-gray-100 dark:border-neutral-900 py-4">
              <h2 className="text-xl font-bold tracking-tight hover:underline text-neutral-900 dark:text-white">
                <Link href={`/articles/${item.slug.current}`}>{item.title}</Link>
              </h2>
              <ShareButton slug={item.slug.current} title={item.title} />
            </article>
          ))}
```

- [ ] **Step 2: Verify compilation**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/app/archive/ArchivePageClient.tsx
git commit -m "layout: simplify main archive card to title and share button only"
```

---

### Task 2: Simplify Category [category]/page.tsx list layout
Simplify the rendering code for articles in category-specific views.

**Files:**
- Modify: `src/app/archive/[category]/page.tsx`

**Interfaces:**
- Consumes: `<ShareButton>` component
- Produces: Updated minimal horizontal category archive row layout

- [ ] **Step 1: Simplify category list item mapping**
Modify lines 75-88 of `src/app/archive/[category]/page.tsx`:
```tsx
          {articles.map((item: any) => (
            <article key={item.slug.current} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold tracking-tight hover:underline text-neutral-900 dark:text-white">
                <Link href={`/articles/${item.slug.current}`}>{item.title}</Link>
              </h2>
              <ShareButton slug={item.slug.current} title={item.title} />
            </article>
          ))}
```

- [ ] **Step 2: Run build checks**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/app/archive/\[category\]/page.tsx
git commit -m "layout: simplify category page archive cards to title and share only"
```

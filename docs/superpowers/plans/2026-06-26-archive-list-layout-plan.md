# Archive List Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify the 2-column article card grids into single-column vertical stacked lists on both the Archive and Category index pages.

**Architecture:** Replace the CSS class definitions (`grid md:grid-cols-2 gap-8`) with vertical flex container classes (`flex flex-col gap-10 max-w-3xl`) in the page component wrapper layouts.

**Tech Stack:** Tailwind CSS.

## Global Constraints
- Do not remove post metadata or excerpt strings.
- Container width for the list should be restricted cleanly to `max-w-3xl` for readability on desktop monitors.

---

### Task 1: Update ArchivePageClient.tsx layout
Modify the wrapper class on the articles list grid in the main archive component.

**Files:**
- Modify: `src/app/archive/ArchivePageClient.tsx`

**Interfaces:**
- Consumes: Tailwind classes
- Produces: Updated single-column Archive client layout

- [ ] **Step 1: Replace container tag**
Modify lines 76-78 of `src/app/archive/ArchivePageClient.tsx`:
```tsx
        <div className="flex flex-col gap-10 max-w-3xl">
          {displayArticles.map((item: any) => (
```

- [ ] **Step 2: Verify compilation**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/app/archive/ArchivePageClient.tsx
git commit -m "layout: convert main archive grid to single-column list"
```

---

### Task 2: Update Category [category]/page.tsx layout
Modify the wrapper class on the category archive page list grid.

**Files:**
- Modify: `src/app/archive/[category]/page.tsx`

**Interfaces:**
- Consumes: Tailwind classes
- Produces: Updated single-column Category Archive page layout

- [ ] **Step 1: Replace container tag**
Modify lines 73-75 of `src/app/archive/[category]/page.tsx`:
```tsx
        <div className="flex flex-col gap-10 max-w-3xl">
          {articles.map((item: any) => (
```

- [ ] **Step 2: Run build checks**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/app/archive/\[category\]/page.tsx
git commit -m "layout: convert category page archive grid to single-column list"
```

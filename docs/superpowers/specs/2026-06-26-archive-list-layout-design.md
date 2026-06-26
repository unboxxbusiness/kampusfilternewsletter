# Design Document: Archive Pages List Layout Redesign

This document outlines the design and implementation details for changing the article grid layout on the Archive page and Category archive pages to a single-column list layout.

---

## 1. Objectives

- **Visual Alignment**: Redesign the 2-column post card grid into a premium, single-column stacked list layout. This matches the minimalist, reading-focused design values of Kampus Filter.
- **Scope**:
  - Main Archive page ([`ArchivePageClient.tsx`](file:///e:/kampusfilter/src/app/archive/ArchivePageClient.tsx)).
  - Category archive pages ([`[category]/page.tsx`](file:///e:/kampusfilter/src/app/archive/[category]/page.tsx)).
- **Layout Structure**:
  - Keep the full card metadata: Category tag, Title link, Excerpt description, Date/Reading time, and the Share Article button.
  - Stack the items vertically with clean margins and borders: `flex flex-col gap-10` or a vertical list with borders.

---

## 2. Component Design & Changes

### A. Main Archive client (`src/app/archive/ArchivePageClient.tsx`)
- Replace the wrapper:
  ```diff
  - <div className="grid md:grid-cols-2 gap-8">
  + <div className="flex flex-col gap-10 max-w-3xl">
  ```
- Keep all other card elements (category, title, excerpt, footer meta, share button) intact.

### B. Category page (`src/app/archive/[category]/page.tsx`)
- Similarly, replace the dynamic category list wrapper:
  ```diff
  - <div className="grid md:grid-cols-2 gap-8">
  + <div className="flex flex-col gap-10 max-w-3xl">
  ```

---

## 3. Verification Plan

### Automated Verification
- Run `npm run lint` to check for code consistency.
- Run `npm run build` to confirm production compile succeeds.

### Manual Verification
- Deploy locally and verify the new list layout displays correctly on both Desktop and Mobile views.
- Confirm Category pages and Archive page lists look unified.

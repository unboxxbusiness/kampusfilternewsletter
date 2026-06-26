# Design Document: Archive Pages Title & Share Only Redesign

This document outlines the design and implementation details for simplifying the article items rendered on the Archive page and Category pages. All elements (Category tags, Excerpts, Dates, Reading times) are removed, leaving only the Article Title and its Share Button.

---

## 1. Objectives

- **Ultra-Minimalist List Layout**: Simplify the article list layout so that each item consists solely of a horizontal row showing:
  - **Article Title link** on the left.
  - **Share Button** on the right.
- **Scope**:
  - Main Archive page ([`ArchivePageClient.tsx`](file:///e:/kampusfilter/src/app/archive/ArchivePageClient.tsx)).
  - Category archive pages ([`[category]/page.tsx`](file:///e:/kampusfilter/src/app/archive/[category]/page.tsx)).
- **Layout Styling**:
  - Space-between horizontal alignment using a flex container (`flex items-center justify-between gap-4`).
  - Vertical border dividers between items (`border-b border-gray-100 dark:border-neutral-900 py-4`).

---

## 2. Technical Solution

### A. Main Archive page (`src/app/archive/ArchivePageClient.tsx`)
- Modify the item renderer to output only the `flex` wrapper, Title header, and `<ShareButton>`.
- Remove category tags, dates, reading times, excerpts, and inner container divisions.

### B. Category archive page (`src/app/archive/[category]/page.tsx`)
- Similarly, modify the cards mapped in the articles array to output only the Title link and `<ShareButton>` inside the horizontal flex row.

---

## 3. Verification Plan

### Automated Verification
- Run `npm run lint` to check for type-safety and syntax correctness.
- Run `npm run build` to confirm production build compiles successfully.

### Manual Verification
- Deploy locally and verify the list items on `/archive` and `/archive/scholarship` render only the title and share button side-by-side.

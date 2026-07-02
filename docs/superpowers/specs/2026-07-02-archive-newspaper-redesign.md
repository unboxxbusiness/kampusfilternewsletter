# Design Document: Classic Newspaper Archive Redesign

This document outlines the design and implementation details for upgrading the Kampus Filter Archive page into a classic, print-newspaper-style layout inspired by the structural and typographic signature of *The Washington Post*.

---

## 1. Objectives

- **Classic Editorial Columns**: Organize the archive page using clean column sheets divided by solid lines rather than modern floating "cards".
- **Zero Rounded Corners & Shadows**: Adopt flat, sharp-edged styling (`rounded-none`, `shadow-none`) for all layout wrapper elements, metadata containers, and image elements to emulate a real newsprint page.
- **Serif Typographic Hierarchy**: Use heavy, prominent serif headlines (`font-serif font-black`) to mimic print publication styling.
- **Index Header System**: Bounded by double borders (`border-y-2 border-double`), display categories as plain uppercase section text links separated by thin divider marks.

---

## 2. Technical Solution

### A. Sanity Query Update (`src/app/archive/page.tsx`)
Verify the query fetches all necessary visual fields (remains unchanged as it already retrieves `excerpt` and `featuredImage` from the previous commit).

### B. Archive Page Client Layout (`src/app/archive/ArchivePageClient.tsx`)
- **Header Section**: Bounded top and bottom by double lines (`border-y-2 border-double border-[#e5e5e5] dark:border-[#14213d]`).
  - Categories: Row of uppercase text filters separated by bullet points or pipes.
  - Search: Sharp rectangular input (`rounded-none border border-neutral-300 dark:border-neutral-800`).
- **Lead Cover Story**: A large 12-column grid container (`rounded-none`). Desktop shows split layout (image on left, header on right) with a bold title (`text-3xl md:text-5xl font-serif font-black text-neutral-900 dark:text-white`).
- **Editorial Grid**: Sitting underneath, separated by a thin horizontal border line.
  - Desktop: 3 columns (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`).
  - Columns are separated by thin vertical dividers on desktop (`border-r border-[#e5e5e5] dark:border-[#14213d] pr-6 last:border-r-0`).
  - Each item renders a sharp rectangular thumbnail (`rounded-none`), uppercase small metadata tag, serif headline, and excerpt snippet.

---

## 3. Verification Plan

### Automated Verification
- Run `npm run lint` and `npm run build` to confirm code completes successfully.

### Manual Verification
- Deploy locally and verify the archive layout. Ensure columns align cleanly and borders/sharp styling emulate the newsprint sheet.

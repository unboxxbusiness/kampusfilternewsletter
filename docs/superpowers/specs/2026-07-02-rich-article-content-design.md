# Design Document: Rich Article Content Rendering

This document outlines the design and implementation details for enabling and rendering rich text content—including custom headings, list items (bullets and numbers), tables, and YouTube video embeds—in the Kampus Filter article post pages.

---

## 1. Objectives

- **Rich Content Schema in Sanity**: Modify the article `content` field in Sanity to support rich blocks including:
  - Custom block styling (headings, lists, blockquotes).
  - Inline image blocks (with custom alt attributes).
  - Custom table structures (matrix of rows and cells).
  - YouTube video links.
- **Semantic and Stylized Rendering**: Update the frontend `PortableTextRenderer` component to parse and render these types:
  - **Headings**: Semantic `<h2>`, `<h3>`, `<h4>` headers with auto-generated anchor IDs for linking.
  - **Lists**: `<ul>` and `<ol>` HTML lists styled with Tailwind spacing and bullet markers.
  - **Blockquotes**: Stylized indentation and accent borders.
  - **Tables**: Responsive and accessible table rendering (`<table>`, `<thead>`, `<tbody>`).
  - **YouTube Video**: Autoplay-disabled responsive standard video embed with secure sandboxed iframes.

---

## 2. Technical Solution

### A. Sanity Schema Updates (`src/lib/sanity/schemas/article.ts`)
We will replace the simple `content` field configuration with a rich array schema that includes:
- Standard text `block` type.
- Built-in `image` type with `alt` string field.
- Custom `youtube` object type with a `url` field.
- Custom `table` object type with a nested `rows` object array.

### B. Block Component Mapping (`src/components/article/PortableTextRenderer.tsx`)
We will configure custom React rendering components in the `@portabletext/react` options:
- **`list` and `listItem`**: Customize list styles (bullets and numbers) to ensure they are visible and match the typography spacing.
- **`block` styles**: Map headings (`h2`, `h3`, `h4`) and `blockquote` to custom styled tags.
- **`types.youtube`**: Parse video ID from url using a regex and render an aspect-ratio-bound secure iframe player.
- **`types.table`**: Map rows and cells to a semantic `<table>` container. First row represents the header.

---

## 3. Verification Plan

### Automated Verification
- Run `npm run lint` to check for compilation/type-safety issues.
- Run `npm run build` to confirm the production build completes successfully.

### Manual Verification
- View test articles in Sanity Studio to verify that table and YouTube block options show up.
- Access an article page containing headings, bullets, tables, and YouTube embeds, and verify they match the styling system.

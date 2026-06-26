# Design Document: Share Article Option

This document outlines the design and implementation details for adding a "Share Article" option to article cards on the archive page and category pages.

---

## 1. Objectives

- **Visual Integration**: Add a small, premium, borderless sharing button on the bottom-right corner of each archive card (matching the site's typography-first aesthetic).
- **Core Functionality**:
  - Use the native browser Web Share API (`navigator.share`) to show a native mobile or desktop share sheet.
  - Provide a robust clipboard copy fallback for browsers that do not support the Web Share API.
- **Premium Micro-Interactions**:
  - When the link is copied to the clipboard, temporarily swap the share icon with a checkmark icon (`Check`) and display a subtle "Copied!" helper text for 2 seconds to provide immediate feedback.
- **Reusability**: Build this as a modular, client-side React component (`ShareButton`) that can be dropped onto the archive page, category index page, and the article details view.

---

## 2. Technical Solution

### A. Reusable Component (`src/components/common/ShareButton.tsx`)
Create a client-side component containing:
- State `copied: boolean` to handle the transition feedback.
- Web Share trigger:
  ```typescript
  const shareData = {
    title: articleTitle,
    url: `${window.location.origin}/articles/${slug}`,
  };
  ```
- Clipboard copy fallback using `navigator.clipboard.writeText(url)`.
- Use icons `Share2` (default) and `Check` (copied state) from `lucide-react`.

### B. Integration inside Archive client (`src/app/archive/ArchivePageClient.tsx`)
- Import `ShareButton`.
- Position it inside the footer flex row of each post:
  ```tsx
  <div className="text-xs text-gray-400 flex items-center justify-between gap-2 pt-2">
    <div className="flex items-center gap-2">
      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
      <span>&bull;</span>
      <span>{item.readingTime} min read</span>
    </div>
    <ShareButton slug={item.slug.current} title={item.title} />
  </div>
  ```

### C. Integration inside Category page (`src/app/archive/[category]/page.tsx`)
- Similarly, place the `<ShareButton>` component on the cards rendered inside the category search results list.

---

## 3. Verification Plan

### Automated Verification
- Run `npm run lint` to verify that there are no syntax or type validation issues.
- Run `npm run build` to confirm production compile works.

### Manual Verification
- Render the archive page locally and verify that the share button displays correctly.
- Test the button on Chrome/Safari to check if it opens the share dialog or copies the link with the checkmark transition.

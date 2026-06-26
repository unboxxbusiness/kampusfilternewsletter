# Design Document: Article Page Multi-channel Share Bar

This document outlines the design and implementation details for adding a multi-channel share widget to the footer of individual article pages.

---

## 1. Objectives

- **Visual Integration**: Place a clean, horizontal multi-channel share widget at the bottom of the article reading page, right before the "Join Kampus Filter" container box.
- **Supported Channels**:
  - **Twitter/X**: Intent URL mapping to `https://twitter.com/intent/tweet?url={url}&text={title}`.
  - **LinkedIn**: Share URL mapping to `https://www.linkedin.com/sharing/share-offsite/?url={url}`.
  - **WhatsApp**: Send text mapping to `https://api.whatsapp.com/send?text={text}`.
  - **Copy Link**: Clipboard action with dynamic state showing "Link Copied!" and a checkmark transition.
- **Aesthetics**: Sleek, borderless circular or pill-shaped icon buttons matching the typography-first layout of Kampus Filter. Supports both Light and Dark mode interfaces.

---

## 2. Component Design & Changes

### A. New Component (`src/components/article/PostShareBar.tsx`)
Create a client-side component containing:
- State `copied: boolean` for copy-link success animations.
- Icon integrations using `lucide-react` (`Twitter` is deprecated but `Twitter` or a custom SVG path for X logo can be used. Let's use `Twitter` or a simple custom SVG for X, `Linkedin`, `MessageSquare` or a custom SVG for WhatsApp, and `Link2` for copy link).
  Wait! Let's write custom inline SVGs for premium social logos (like X's new logo) and standard Lucide icons for LinkedIn/Copy Link to look extremely modern and premium!
- Clipboard copy handler.
- Rendering layout:
  ```tsx
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8 border-y border-neutral-100 dark:border-neutral-900 my-12">
    <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Share this article</span>
    <div className="flex flex-wrap gap-3">
      {/* Twitter/X, LinkedIn, WhatsApp, Copy Link Buttons */}
    </div>
  </div>
  ```

### B. Integration inside Article details page (`src/app/articles/[slug]/page.tsx`)
- Import `PostShareBar` and place it right before line 164 (above the "Join Kampus Filter" container):
  ```tsx
  <PostShareBar slug={resolvedParams.slug} title={article.title} />

  <div className="mt-20 p-8 border border-black text-center space-y-4">
    <h3 className="text-xl font-bold">Join Kampus Filter</h3>
    ...
  ```

---

## 3. Verification Plan

### Automated Verification
- Run `npm run lint` to verify that there are no syntax or type validation issues.
- Run `npm run build` to confirm production build succeeds.

### Manual Verification
- Navigate to an article page (e.g. `/articles/cuet-ug-result-2026-is-out-what-students-should-do-next`).
- Scroll to the bottom of the article and click the share buttons to verify that they trigger the expected intents or copy functionality.

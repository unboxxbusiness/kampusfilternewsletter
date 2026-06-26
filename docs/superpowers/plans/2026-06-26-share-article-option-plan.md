# Share Article Option Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a premium sharing option on post cards in both the Archive and Category index pages.

**Architecture:** Create a reusable client-side component `ShareButton.tsx` that supports the native Web Share API with clipboard copy fallbacks and interactive visual indicators. Integrate it into post cards.

**Tech Stack:** React, Lucide React (for icons), Tailwind CSS.

## Global Constraints
- Must resolve the absolute sharing URL dynamically using the client's current `window.location.origin` value.
- Style must be borderless and align with the existing typography-first aesthetic.

---

### Task 1: Create Reusable ShareButton Component
Create `src/components/common/ShareButton.tsx` implementing sharing logic and the temporary checkmark visual callback.

**Files:**
- Create: `src/components/common/ShareButton.tsx`

**Interfaces:**
- Consumes: `slug` (string), `title` (string)
- Produces: `<ShareButton>` component

- [ ] **Step 1: Write ShareButton.tsx code**
Write to `src/components/common/ShareButton.tsx`:
```tsx
"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  slug: string;
  title: string;
}

export default function ShareButton({ slug, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const baseUrl = window.location.origin;
    const url = `${baseUrl}/articles/${slug}`;

    // Try native Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share was cancelled/failed
        console.log("Native share cancelled or failed, falling back to clipboard copy.");
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-850"
      title={copied ? "Link Copied!" : "Share Article"}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-600 dark:text-green-400 animate-scale-in" />
          <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">Copied!</span>
        </>
      ) : (
        <Share2 className="h-4 w-4" />
      )}
    </button>
  );
}
```

- [ ] **Step 2: Verify compilation**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/components/common/ShareButton.tsx
git commit -m "feat: implement reusable ShareButton component with clipboard fallback"
```

---

### Task 2: Integrate Share Button into Archive page
Modify `src/app/archive/ArchivePageClient.tsx` to display the share button in the card footer layout.

**Files:**
- Modify: `src/app/archive/ArchivePageClient.tsx`

**Interfaces:**
- Consumes: `<ShareButton>` component
- Produces: Updated Archive Card rendering with share actions

- [ ] **Step 1: Update ArchivePageClient.tsx**
Import `ShareButton` and render it in the card's footer flexbox.
Modify lines 84-88 of `src/app/archive/ArchivePageClient.tsx`:
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

- [ ] **Step 2: Run build lint**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/app/archive/ArchivePageClient.tsx
git commit -m "feat: add share button option to archive card footer"
```

---

### Task 3: Integrate Share Button into Category Page
Modify `src/app/archive/[category]/page.tsx` to display the share button inside the category archive cards list.

**Files:**
- Modify: `src/app/archive/[category]/page.tsx`

**Interfaces:**
- Consumes: `<ShareButton>` component
- Produces: Updated Category Archive card rendering

- [ ] **Step 1: Update page.tsx**
Import `ShareButton` and render it in the category cards list footer flexbox.
Modify lines 43-47 of `src/app/archive/[category]/page.tsx`:
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

- [ ] **Step 2: Run build checks**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/app/archive/\[category\]/page.tsx
git commit -m "feat: add share button option to category page archive cards"
```

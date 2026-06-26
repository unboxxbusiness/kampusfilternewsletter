# Article Page Multi-channel Share Bar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a premium multi-channel share widget (Twitter/X, LinkedIn, WhatsApp, and Copy Link) at the bottom of the article reading page.

**Architecture:** Create a client-side React component `PostShareBar.tsx` containing the inline platform sharing intents and clipboard transitions. Inject it inside the dynamic article page component layout.

**Tech Stack:** React, Lucide React (for icons), Tailwind CSS.

## Global Constraints
- Absolute URLs must resolve dynamically on the client side using `window.location.origin`.
- Keep layout responsive and compatible with both light and dark backgrounds.

---

### Task 1: Create PostShareBar Component
Write the `PostShareBar.tsx` component managing direct social share intents and copied status timeouts.

**Files:**
- Create: `src/components/article/PostShareBar.tsx`

**Interfaces:**
- Consumes: `slug` (string), `title` (string)
- Produces: `<PostShareBar>` component

- [ ] **Step 1: Write PostShareBar.tsx code**
Write to `src/components/article/PostShareBar.tsx`:
```tsx
"use client";

import React, { useState } from "react";
import { Linkedin, Link2, Check } from "lucide-react";

interface PostShareBarProps {
  slug: string;
  title: string;
}

export default function PostShareBar({ slug, title }: PostShareBarProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/articles/${slug}`;
    }
    return "";
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareUrl = getShareUrl();
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + shareUrl)}`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-y border-neutral-100 dark:border-neutral-900 my-12">
      <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Share this article</span>
      
      <div className="flex flex-wrap gap-2">
        {/* Twitter / X Button */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-850 transition"
          title="Share on X"
        >
          <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Share</span>
        </a>

        {/* LinkedIn Button */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-850 transition"
          title="Share on LinkedIn"
        >
          <Linkedin className="h-3.5 w-3.5" />
          <span>Post</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-850 transition"
          title="Share on WhatsApp"
        >
          <svg className="h-3.5 w-3.5 fill-current text-green-600 dark:text-green-500" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.48 4.805 1.481 5.482 0 9.94-4.461 9.943-9.94.002-2.654-1.03-5.15-2.903-7.026C16.621 1.8 14.12 1.155 11.47 1.153 5.986 1.153 1.53 5.61 1.527 11.09c0 1.745.474 3.447 1.373 4.968L1.93 20.354l4.717-1.2z" />
          </svg>
          <span>Send</span>
        </a>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-850 transition"
          title="Copy Article URL"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400 animate-scale-in" />
              <span className="text-green-600 dark:text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="h-3.5 w-3.5" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify compilation**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/components/article/PostShareBar.tsx
git commit -m "feat: implement article page PostShareBar component"
```

---

### Task 2: Integrate PostShareBar into article details page
Render `<PostShareBar>` directly above the call-to-action newsletter container on the post page.

**Files:**
- Modify: `src/app/articles/[slug]/page.tsx`

**Interfaces:**
- Consumes: `<PostShareBar>` component
- Produces: Article detail layout with sharing panel in footer

- [ ] **Step 1: Update page.tsx**
Import `PostShareBar` and render it above the CTA card inside the page container.
Modify `src/app/articles/[slug]/page.tsx`:
```tsx
        <div className="prose prose-neutral max-w-none">
          <PortableTextRenderer value={article.content} />
        </div>

        <PostShareBar slug={resolvedParams.slug} title={article.title} />

        <div className="mt-20 p-8 border border-black text-center space-y-4">
          <h3 className="text-xl font-bold">Join Kampus Filter</h3>
```

- [ ] **Step 2: Verify build**
Run: `npm run build`
Expected: Success production build.

- [ ] **Step 3: Commit**
```bash
git add src/app/articles/\[slug\]/page.tsx
git commit -m "feat: add PostShareBar widget to article detail footer"
```

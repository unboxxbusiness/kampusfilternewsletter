# Rich Article Content Rendering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify the Sanity article content schema and frontend PortableText renderer to support rich content blocks (custom headings with anchors, bulleted/numbered lists, styled tables, and YouTube video embeds).

**Architecture:** Extend the `content` field block-array schema inside Sanity, and add corresponding React component renderers inside `PortableTextRenderer.tsx` using Tailwind classes.

**Tech Stack:** React, Next.js (App Router), Tailwind CSS.

## Global Constraints
- Avoid introducing any external npm dependencies (YAGNI).
- Support responsive aspect-ratio wrappers for YouTube video iframes.
- Ensure proper semantic markup for lists, quotes, tables, and headings.

---

### Task 1: Update Sanity Article Content Schema
Extend the Sanity schema array for the article `content` block field to support inline images, YouTube embed metadata, and custom rows/cells table structures.

**Files:**
- Modify: `src/lib/sanity/schemas/article.ts`

**Interfaces:**
- Consumes: Sanity schema structure
- Produces: Updated Sanity schema definition for the `article` document type

- [ ] **Step 1: Edit schemas/article.ts to add custom content type definitions**
Modify lines 133-138 of `src/lib/sanity/schemas/article.ts`:
```typescript
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
              validation: (Rule) => Rule.required(),
            }
          ]
        },
        {
          name: "youtube",
          type: "object",
          title: "YouTube Embed",
          fields: [
            {
              name: "url",
              type: "url",
              title: "YouTube Video URL",
              validation: (Rule) => Rule.required(),
            }
          ]
        },
        {
          name: "table",
          type: "object",
          title: "Table",
          fields: [
            {
              name: "rows",
              type: "array",
              title: "Table Rows",
              of: [
                {
                  type: "object",
                  name: "tableRow",
                  title: "Table Row",
                  fields: [
                    {
                      name: "cells",
                      type: "array",
                      title: "Row Cells",
                      of: [{ type: "string" }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      validation: (Rule) => Rule.required(),
    }),
```

- [ ] **Step 2: Run build lint checks to ensure schema syntax is correct**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit schema updates**
```bash
git add src/lib/sanity/schemas/article.ts
git commit -m "feat: add image, youtube, and table block definitions to article content schema"
```

---

### Task 2: Implement Component Renderers inside PortableTextRenderer.tsx
Configure the custom list, heading, table, and YouTube block renderers in the React components dictionary.

**Files:**
- Modify: `src/components/article/PortableTextRenderer.tsx`

**Interfaces:**
- Consumes: Sanity rich-text content payload
- Produces: Visual components with correct styling inside `PortableTextRenderer`

- [ ] **Step 1: Write video ID parser, lists, table, and YouTube embed components**
Replace the contents of `src/components/article/PortableTextRenderer.tsx` with:
```tsx
import React from "react";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";

// Helper to extract YouTube video ID from URL
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function extractText(node: any): string {
  if (typeof node === "string") {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }
  if (node && typeof node === "object" && node.props && node.props.children) {
    return extractText(node.props.children);
  }
  return "";
}

// ponytail: keep block renderers extremely clean, using native HTML elements styled with Tailwind utility classes.
const components = {
  block: {
    h2: ({ children }: any) => {
      const text = extractText(children);
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return (
        <h2 className="text-3xl font-sans font-bold mt-12 mb-4 tracking-tight text-[#14213d] dark:text-[#ffffff]" id={id}>
          {children}
        </h2>
      );
    },
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-sans font-semibold mt-8 mb-3 tracking-tight text-[#14213d] dark:text-[#ffffff]">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl font-sans font-semibold mt-6 mb-2 tracking-tight text-[#14213d] dark:text-[#ffffff]">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="leading-relaxed mb-6 text-[#14213d]/90 dark:text-[#e5e5e5]/90 text-lg">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-[#fca311] pl-4 italic my-6 text-[#14213d]/70 dark:text-[#e5e5e5]/70">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg text-[#14213d]/90 dark:text-[#e5e5e5]/90">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal pl-6 mb-6 space-y-2 text-lg text-[#14213d]/90 dark:text-[#e5e5e5]/90">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  },
  types: {
    image: ({ value }: any) => (
      <div className="relative my-8 aspect-video w-full overflow-hidden rounded-lg bg-[#e5e5e5]/30 dark:bg-[#14213d]/30">
        <Image
          src={urlFor(value).width(800).auto("format").url()}
          alt={value.alt || "Article graphic"}
          fill
          className="object-cover"
        />
      </div>
    ),
    youtube: ({ value }: any) => {
      const videoId = getYouTubeId(value.url);
      if (!videoId) return null;
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-md my-8 bg-neutral-100 dark:bg-neutral-900">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
      );
    },
    table: ({ value }: any) => {
      if (!value || !value.rows || value.rows.length === 0) return null;
      
      const [headerRow, ...bodyRows] = value.rows;

      return (
        <div className="overflow-x-auto my-8 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800 text-left border-collapse text-base">
            {headerRow && headerRow.cells && (
              <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                <tr>
                  {headerRow.cells.map((cell: string, idx: number) => (
                    <th key={idx} className="px-6 py-3.5 font-semibold text-[#14213d] dark:text-[#ffffff]">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {bodyRows.map((row: any, rIdx: number) => (
                <tr key={rIdx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors">
                  {row.cells && row.cells.map((cell: string, cIdx: number) => (
                    <td key={cIdx} className="px-6 py-4 text-[#14213d]/90 dark:text-[#e5e5e5]/90">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
};

export default function PortableTextRenderer({ value }: { value: any }) {
  return <PortableText value={value} components={components} />;
}
```

- [ ] **Step 2: Run build compile checks**
Run: `npm run lint` and `npm run build`
Expected: Both PASS successfully

- [ ] **Step 3: Commit code updates**
```bash
git add src/components/article/PortableTextRenderer.tsx
git commit -m "feat: add table, youtube video embed, blockquote, and list formatting renderers"
```

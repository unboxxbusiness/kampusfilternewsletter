# SEO & GEO Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement full on-page, off-page, technical, and Generative Engine Optimization (SEO & GEO) to rank Kampus Filter on search engines and AI assistants.

**Architecture:** Utilize Next.js App Router metadata API (`metadata` and `generateMetadata` exports) for HTML header optimization, inject custom server-side JSON-LD components for semantic data structure, configure robots.txt explicitly for AI crawlers, and dynamically generate the site map.

**Tech Stack:** Next.js (App Router), TypeScript, Sanity CMS (GROQ).

## Global Constraints
- Absolute URLs must resolve using the environment variable `NEXT_PUBLIC_SITE_URL` (fallback to `https://kampusfilter.com`).
- Do not use client-side metadata injections; leverage Next.js server-side features.
- Follow strict TypeScript type checking (`tsc --noEmit`).

---

### Task 1: Root Layout Metadata Update
Update `src/app/layout.tsx` to define base URL, title templates, metadata base, and alternates (canonical and RSS feed link).

**Files:**
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `process.env.NEXT_PUBLIC_SITE_URL`
- Produces: Updated global `metadata` object

- [ ] **Step 1: Replace metadata config in layout.tsx**

Replace the existing `metadata` definition:
```typescript
export const metadata: Metadata = {
  title: "Kampus Filter - Student Intelligence Platform",
  description: "Discover opportunities, scholarships, career frameworks, and future-skills intelligence for ambitious students.",
};
```
With:
```typescript
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Kampus Filter - Student Intelligence Platform",
    template: "%s | Kampus Filter",
  },
  description: "Discover opportunities, scholarships, career frameworks, and future-skills intelligence for ambitious students.",
  alternates: {
    canonical: "./",
    types: {
      "application/rss+xml": `${baseUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Kampus Filter - Student Intelligence Platform",
    description: "Discover opportunities, scholarships, career frameworks, and future-skills intelligence for ambitious students.",
    url: baseUrl,
    siteName: "Kampus Filter",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kampus Filter - Student Intelligence Platform",
    description: "Discover opportunities, scholarships, career frameworks, and future-skills intelligence for ambitious students.",
  },
};
```

- [ ] **Step 2: Verify code compiling**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/app/layout.tsx
git commit -m "seo: configure root layout metadata and rss alternates"
```

---

### Task 2: Reusable Breadcrumb Schema Component
Create a reusable JSON-LD component to inject BreadcrumbList schemas.

**Files:**
- Create: `src/components/navigation/BreadcrumbSchema.tsx`

**Interfaces:**
- Consumes: Breadcrumb item array `{ name: string; item: string; }[]`
- Produces: `<script type="application/ld+json">` DOM element

- [ ] **Step 1: Write BreadcrumbSchema component**
Write to `src/components/navigation/BreadcrumbSchema.tsx`:
```tsx
import React from "react";

interface BreadcrumbItem {
  name: string;
  item: string;
}

export default function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item.startsWith("http") ? item.item : `${baseUrl}${item.item}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

- [ ] **Step 2: Verify compilation**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/components/navigation/BreadcrumbSchema.tsx
git commit -m "seo: create reusable breadcrumb schema component"
```

---

### Task 3: Homepage SEO & JSON-LD
Configure homepage metadata dynamically from Sanity and inject `Organization` and `WebSite` JSON-LD schemas.

**Files:**
- Modify: `src/app/(marketing)/page.tsx`

**Interfaces:**
- Consumes: `siteSettings` dynamic data from Sanity
- Produces: Dynamic metadata export, homepage structured markup

- [ ] **Step 1: Update page.tsx with generateMetadata and JSON-LD**
Modify `src/app/(marketing)/page.tsx` to match:
```tsx
import React from "react";
import { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import HomePageClient from "./HomePageClient";

// Force dynamic fetch to ensure latest site settings are loaded
export const revalidate = 0;

async function getSiteSettings() {
  try {
    return await client.fetch(
      `*[_type == "siteSettings"][0] {
        siteName,
        homepageHeroTitle,
        homepageHeroDescription,
        defaultSeoTitle,
        defaultSeoDescription,
        socialShareImage
      }`
    );
  } catch (error) {
    console.error("Error fetching siteSettings from Sanity:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings?.defaultSeoTitle || "Kampus Filter - Student Intelligence Platform";
  const description = settings?.defaultSeoDescription || "Discover opportunities, scholarships, career frameworks, and future-skills intelligence for ambitious students.";
  const ogImage = settings?.socialShareImage ? urlFor(settings.socialShareImage).url() : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";

  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "url": baseUrl,
    "name": settings?.siteName || "Kampus Filter",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/archive?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": settings?.siteName || "Kampus Filter",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "sameAs": [
      "https://twitter.com/kampusfilter",
      "https://linkedin.com/company/kampusfilter"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />
      <HomePageClient
        siteName={settings?.siteName || "Kampus Filter"}
        heroTitle={settings?.homepageHeroTitle || "Build Your Future in 5 Minutes a Day."}
        heroDescription={
          settings?.homepageHeroDescription ||
          "Discover opportunities, career intelligence, scholarships, internships, and education insights that help ambitious students make smarter decisions."
        }
      />
    </>
  );
}
```

- [ ] **Step 2: Verify compilation and local render**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/app/\(marketing\)/page.tsx
git commit -m "seo: configure homepage dynamic metadata and structured data"
```

---

### Task 4: Dynamic Category Archive SEO & Breadcrumbs
Define category details in `/archive/[category]/page.tsx` with dynamic page metadata and breadcrumb list schemas.

**Files:**
- Modify: `src/app/archive/[category]/page.tsx`

**Interfaces:**
- Consumes: `category` path parameters
- Produces: Dynamic metadata export, BreadcrumbList script injection

- [ ] **Step 1: Update category page.tsx**
Modify `src/app/archive/[category]/page.tsx`:
```tsx
import React from "react";
import { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import Link from "next/link";
import BreadcrumbSchema from "@/components/navigation/BreadcrumbSchema";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = resolvedParams.category.replace(/-/g, " ");
  const capitalized = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  const title = `${capitalized} Opportunities`;
  const description = `Explore curated student opportunities, scholarships, and career intelligence under the ${capitalized} category.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/archive/${resolvedParams.category}`,
    },
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

async function getArticlesByCategory(categorySlug: string) {
  return client.fetch(
    `*[_type == "article" && category->slug.current == $categorySlug] | order(publishedAt desc) {
      title,
      slug,
      excerpt,
      "category": category->title,
      publishedAt,
      readingTime
    }`,
    { categorySlug }
  );
}

export default async function CategoryArchivePage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const articles = await getArticlesByCategory(resolvedParams.category);
  
  const categoryName = resolvedParams.category.replace(/-/g, " ");
  const capitalizedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Archive", item: "/archive" },
    { name: capitalizedCategory, item: `/archive/${resolvedParams.category}` },
  ];

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-12 space-y-8">
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="space-y-4">
        <h1 className="text-4xl font-sans font-bold capitalize">{resolvedParams.category}</h1>
        <p className="text-gray-500">Explore opportunities listed under {resolvedParams.category}.</p>
      </div>

      {articles.length === 0 ? (
        <div className="text-gray-500 text-sm">No articles in this category yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {articles.map((item: any) => (
            <article key={item.slug.current} className="space-y-2 border-b border-gray-100 pb-6">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{item.category}</span>
              <h2 className="text-2xl font-bold tracking-tight hover:underline">
                <Link href={`/articles/${item.slug.current}`}>{item.title}</Link>
              </h2>
              <p className="text-gray-600 text-sm line-clamp-2">{item.excerpt}</p>
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                <span>&bull;</span>
                <span>{item.readingTime} min read</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Run linter**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/app/archive/\[category\]/page.tsx
git commit -m "seo: configure category archive dynamic metadata and breadcrumbs schema"
```

---

### Task 5: Static Page Metadata & Breadcrumbs
Inject static metadata and BreadcrumbList schemas into About, Contact, Privacy, and Terms pages.

**Files:**
- Modify:
  - `src/app/(marketing)/about/page.tsx`
  - `src/app/(marketing)/contact/page.tsx`
  - `src/app/(marketing)/privacy/page.tsx`
  - `src/app/(marketing)/terms/page.tsx`

- [ ] **Step 1: Update About page**
Modify `src/app/(marketing)/about/page.tsx`:
```tsx
import React from "react";
import { Metadata } from "next";
import BreadcrumbSchema from "@/components/navigation/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "About",
  description: "Kampus Filter is a student intelligence platform that helps students discover opportunities, understand career trends, and make better education decisions.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "About", item: "/about" },
  ];

  return (
    <main className="max-w-2xl mx-auto px-6 py-20 space-y-8 text-neutral-800 dark:text-neutral-300">
      <BreadcrumbSchema items={breadcrumbs} />
      <h1 className="text-4xl font-sans font-extrabold tracking-tight text-neutral-900 dark:text-white">
        About Kampus Filter
      </h1>
      
      <p className="text-lg leading-relaxed">
        Kampus Filter is a student intelligence platform that helps students discover opportunities, understand career trends, and make better education decisions.
      </p>
      
      <p className="text-lg leading-relaxed">
        Instead of overwhelming students with endless news, notifications, and announcements, Kampus Filter filters what matters most—from scholarships and internships to admissions, careers, and future opportunities.
      </p>

      <div className="space-y-4 pt-4 border-t border-neutral-150 dark:border-neutral-900">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          Every article is designed to answer three simple questions:
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>What happened?</li>
          <li>Why does it matter?</li>
          <li>What should you do next?</li>
        </ul>
      </div>

      <p className="text-lg leading-relaxed pt-4">
        Our goal is simple: help students stay ahead and make smarter decisions about their future.
      </p>
    </main>
  );
}
```

- [ ] **Step 2: Update Contact page**
Modify `src/app/(marketing)/contact/page.tsx`:
```tsx
import React from "react";
import { Metadata } from "next";
import BreadcrumbSchema from "@/components/navigation/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Have a question, feedback, or want to share an opportunity? Contact the Kampus Filter team.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Contact", item: "/contact" },
  ];

  return (
    <main className="max-w-2xl mx-auto px-6 py-20 space-y-8 text-neutral-800 dark:text-neutral-300">
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="space-y-4">
        <h1 className="text-4xl font-sans font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Contact Us
        </h1>
      </div>

      <p className="text-lg leading-relaxed">
        Have a question, found an error, or want to share an opportunity that could benefit students? We'd love to hear from you.
      </p>

      <p className="text-lg leading-relaxed">
        At <strong>Kampus Filter</strong>, we're committed to delivering accurate, actionable, and trustworthy education and career intelligence. Your feedback helps us improve and keep our content relevant.
      </p>

      <hr className="border-neutral-200 dark:border-neutral-800 my-8" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Get in Touch</h2>
        <p className="text-lg leading-relaxed">
          You can contact us for:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>Questions about our articles</li>
          <li>Reporting incorrect or outdated information</li>
          <li>Sharing scholarships, internships, or student opportunities</li>
          <li>Partnership and collaboration inquiries</li>
          <li>Feedback, suggestions, or feature requests</li>
          <li>General support</li>
        </ul>
        <p className="text-lg leading-relaxed pt-2">
          <strong>Email:</strong>{" "}
          <a
            href="mailto:help@kampusfilter.com"
            className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
          >
            help@kampusfilter.com
          </a>
        </p>
        <p className="text-lg leading-relaxed">
          We aim to respond to all genuine inquiries within <strong>1–3 business days</strong>.
        </p>
      </section>

      <hr className="border-neutral-200 dark:border-neutral-800 my-8" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Before You Contact Us</h2>
        <p className="text-lg leading-relaxed italic">
          Please note:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>We do <strong>not</strong> process university admissions or scholarship applications.</li>
          <li>We cannot guarantee admission, scholarships, internships, or job placements.</li>
          <li>For official deadlines, eligibility, and application status, always refer to the official website of the respective university, organization, or government authority.</li>
        </ul>
      </section>

      <hr className="border-neutral-200 dark:border-neutral-800 my-8" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Our Mission</h2>
        <p className="text-lg leading-relaxed">
          Kampus Filter exists to help students cut through the noise and focus on what truly matters.
        </p>
        <div className="space-y-2 pt-2">
          <p className="font-semibold text-neutral-900 dark:text-white">
            Every article is designed to answer three simple questions:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
            <li><strong>What happened?</strong></li>
            <li><strong>Why does it matter?</strong></li>
            <li><strong>What should you do next?</strong></li>
          </ul>
        </div>
        <p className="text-lg leading-relaxed pt-4">
          If you have valuable feedback or an opportunity that could help students make better decisions, we'd be happy to hear from you.
        </p>
      </section>

      <hr className="border-neutral-200 dark:border-neutral-800 my-8" />

      <p className="text-lg leading-relaxed italic text-neutral-600 dark:text-neutral-450">
        Thank you for being part of the Kampus Filter community.
      </p>
    </main>
  );
}
```

- [ ] **Step 3: Update Privacy page**
Modify `src/app/(marketing)/privacy/page.tsx`:
(Inject metadata and breadcrumbs similar to Task 5 Step 1 & 2).
```tsx
import React from "react";
import { Metadata } from "next";
import BreadcrumbSchema from "@/components/navigation/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy of Kampus Filter. Learn how we handle your data.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Privacy Policy", item: "/privacy" },
  ];

  return (
    <main className="max-w-2xl mx-auto px-6 py-20 space-y-8 text-neutral-800 dark:text-neutral-300 font-sans">
      <BreadcrumbSchema items={breadcrumbs} />
      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Privacy Policy</h1>
      <p className="text-lg leading-relaxed">This privacy policy governs how Kampus Filter handles subscriber data...</p>
    </main>
  );
}
```

- [ ] **Step 4: Update Terms page**
Modify `src/app/(marketing)/terms/page.tsx`:
```tsx
import React from "react";
import { Metadata } from "next";
import BreadcrumbSchema from "@/components/navigation/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service of Kampus Filter. Learn about your rights and responsibilities.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Terms of Service", item: "/terms" },
  ];

  return (
    <main className="max-w-2xl mx-auto px-6 py-20 space-y-8 text-neutral-800 dark:text-neutral-300 font-sans">
      <BreadcrumbSchema items={breadcrumbs} />
      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Terms of Service</h1>
      <p className="text-lg leading-relaxed">By accessing Kampus Filter, you agree to these terms of service...</p>
    </main>
  );
}
```

- [ ] **Step 5: Run compilation check**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 6: Commit**
```bash
git add src/app/\(marketing\)/about/page.tsx src/app/\(marketing\)/contact/page.tsx src/app/\(marketing\)/privacy/page.tsx src/app/\(marketing\)/terms/page.tsx
git commit -m "seo: add metadata and breadcrumbs to static pages"
```

---

### Task 6: Archive Page & Article Page Enhancements
Ensure `/archive` page and `/articles/[slug]` pages have correct breadcrumbs, canonical links, and enhanced Article JSON-LD configurations.

**Files:**
- Modify: `src/app/archive/page.tsx`
- Modify: `src/app/articles/[slug]/page.tsx`

- [ ] **Step 1: Update Archive page**
Modify `src/app/archive/page.tsx` to add custom BreadcrumbSchema and metadata:
```tsx
import React from "react";
import { client } from "@/lib/sanity/client";
import ArchivePageClient from "./ArchivePageClient";
import { Metadata } from "next";
import BreadcrumbSchema from "@/components/navigation/BreadcrumbSchema";

export const revalidate = 60; // ISR cache validation interval

export const metadata: Metadata = {
  title: "Archive",
  description: "Explore curated student intelligence, scholarships, internships, fellowships, and education frameworks.",
  alternates: {
    canonical: "/archive",
  },
};

async function getArchiveData() {
  const articles = await client.fetch(
    `*[_type == "article"] | order(publishedAt desc) {
      title,
      slug,
      excerpt,
      "category": category->title,
      publishedAt,
      readingTime
    }`
  );
  const categories = await client.fetch(`*[_type == "category"]`);
  return { articles, categories };
}

export default async function ArchivePage() {
  const { articles, categories } = await getArchiveData();
  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Archive", item: "/archive" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ArchivePageClient
        initialArticles={articles || []}
        initialCategories={categories || []}
      />
    </>
  );
}
```

- [ ] **Step 2: Update Article page.tsx**
Modify `src/app/articles/[slug]/page.tsx` to improve metadata parameters, fetch category slug in queries, add self-referencing canonical settings, and inject the customized `BreadcrumbSchema`.
```tsx
import React from "react";
import { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import PortableTextRenderer from "@/components/article/PortableTextRenderer";
import TableOfContents from "@/components/article/TableOfContents";
import ReadingProgressBar from "@/components/article/ReadingProgressBar";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import BreadcrumbSchema from "@/components/navigation/BreadcrumbSchema";

export const revalidate = 60; // ISR cache validation interval

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const article = await client.fetch(
      `*[_type == "article" && slug.current == $slug][0] {
        title,
        excerpt,
        seoTitle,
        seoDescription,
        featuredImage
      }`,
      { slug: resolvedParams.slug }
    );

    if (!article) {
      return {
        title: "Article Not Found",
      };
    }

    const metaTitle = article.seoTitle || article.title;
    const metaDescription = article.seoDescription || article.excerpt || "Read the latest updates on Kampus Filter.";
    const ogImage = article.featuredImage ? urlFor(article.featuredImage).url() : undefined;

    return {
      title: metaTitle,
      description: metaDescription,
      alternates: {
        canonical: `/articles/${resolvedParams.slug}`,
      },
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        type: "article",
        images: ogImage ? [{ url: ogImage }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch (error) {
    return {
      title: "Article",
    };
  }
}

async function getArticle(slug: string) {
  return client.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      title,
      excerpt,
      content,
      publishedAt,
      readingTime,
      featuredImage,
      "author": author->{name, image, bio},
      "category": category->{title, "slug": slug.current}
    }`,
    { slug }
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.slug);

  if (!article) return <div className="p-12 text-center">Article not found</div>;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";

  // JSON-LD structured data for AI search engines & search crawlers
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.excerpt || "Read the latest update on Kampus Filter.",
    "datePublished": article.publishedAt,
    "dateModified": article.publishedAt,
    "image": article.featuredImage ? [urlFor(article.featuredImage).url()] : [],
    "author": {
      "@type": "Person",
      "name": article.author?.name || "Kampus Filter Editorial",
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "Kampus Filter",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/articles/${resolvedParams.slug}`,
    },
  };

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Archive", item: "/archive" },
    ...(article.category ? [{ name: article.category.title, item: `/archive/${article.category.slug}` }] : []),
    { name: article.title, item: `/articles/${resolvedParams.slug}` },
  ];

  return (
    <main className="min-h-screen relative py-20 px-6">
      {/* Inject Structured Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <ReadingProgressBar />
      <TableOfContents />

      <article className="max-w-[720px] mx-auto space-y-8 font-sans">
        <div className="space-y-4">
          {article.category && (
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {article.category.title}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {article.title}
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">{article.excerpt}</p>

          <div className="flex items-center gap-4 py-4 border-y border-gray-100 text-sm text-gray-500">
            {article.author?.image && (
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={urlFor(article.author.image).url()}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-semibold text-black">{article.author?.name || "Author"}</p>
              <p>
                {new Date(article.publishedAt).toLocaleDateString()} &bull; {article.readingTime} min read
              </p>
            </div>
          </div>
        </div>

        {article.featuredImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={urlFor(article.featuredImage).url()}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        <div className="prose prose-neutral max-w-none">
          <PortableTextRenderer value={article.content} />
        </div>

        <div className="mt-20 p-8 border border-black text-center space-y-4">
          <h3 className="text-xl font-bold">Join Kampus Filter</h3>
          <p className="text-gray-500 text-sm">
            Discover opportunities, scholarships, and career updates sent straight to your browser.
          </p>
          <Link href="/" className="inline-block bg-black text-white px-6 py-2 hover:bg-gray-800 transition">
            Join Free
          </Link>
        </div>
      </article>
    </main>
  );
}
```

- [ ] **Step 3: Verify build checks**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: Commit**
```bash
git add src/app/archive/page.tsx src/app/articles/\[slug\]/page.tsx
git commit -m "seo: add breadcrumbs and optimize schema structures on archive and articles"
```

---

### Task 7: Robots.txt & Sitemap.ts Configuration
Configure Robots.txt rules for AI and search crawler agents and expand Sitemap.ts to dynamically index category routes.

**Files:**
- Modify: `src/app/robots.ts`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Rewrite robots.ts**
Modify `src/app/robots.ts` to matching rules:
```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio/"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "YouBot",
          "Google-Extended",
          "Applebot-Extended",
          "facebookexternalhit",
        ],
        allow: "/",
        disallow: ["/studio/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 2: Rewrite sitemap.ts**
Modify `src/app/sitemap.ts` to include dynamic categories:
```typescript
import { MetadataRoute } from "next";
import { client } from "@/lib/sanity/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";

  const staticPaths: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/archive`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    const articles = await client.fetch(
      `*[_type == "article"] {
        "slug": slug.current,
        publishedAt
      }`
    );

    const articlePaths = articles.map((article: any) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

    const categories = await client.fetch(
      `*[_type == "category"] {
        "slug": slug.current
      }`
    );

    const categoryPaths = categories.map((cat: any) => ({
      url: `${baseUrl}/archive/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    return [...staticPaths, ...categoryPaths, ...articlePaths];
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
    return staticPaths;
  }
}
```

- [ ] **Step 3: Validate Sitemap and Robots formats**
Run: `npm run build`
Expected: Successful compile and static optimization output.

- [ ] **Step 4: Commit**
```bash
git add src/app/robots.ts src/app/sitemap.ts
git commit -m "seo: optimize robots crawling permissions and dynamic sitemaps"
```

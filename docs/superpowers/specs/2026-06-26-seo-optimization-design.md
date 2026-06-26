# Design Document: SEO & GEO (Generative Engine Optimization) Enhancements

This document outlines the architecture, layout, schemas, and configurations required to optimize Kampus Filter for traditional search engines (Google, Bing) and AI search assistants (ChatGPT Search, Gemini, Perplexity, Claude).

---

## 1. Objectives

- **On-Page SEO**: Set up meta tags, Open Graph (OG), and Twitter Cards for social media and link previews. Ensure semantic HTML layout hierarchy on pages.
- **Technical SEO**: Specify canonical links to avoid duplicate page indexing penalties, enable RSS feed auto-discovery in headers, and configure dynamic site map generation.
- **Generative Engine Optimization (GEO)**: Inject JSON-LD semantic data (`WebSite`, `Organization`, `BreadcrumbList`, and optimized `NewsArticle`) and configure `robots.txt` to explicitly allow crawling by AI agents for indexing and chats.

---

## 2. Component Design & Changes

### A. Core Site Meta Headers (`src/app/layout.tsx`)
- Set `metadataBase` to `process.env.NEXT_PUBLIC_SITE_URL` (with a fallback to `https://kampusfilter.com`) to generate absolute resource URLs.
- Implement title templates: `default: "Kampus Filter - Student Intelligence Platform"` and `template: "%s | Kampus Filter"`.
- Define default meta descriptions, keywords, robots properties, and canonical settings.
- Add RSS feed link under `alternates.types["application/rss+xml"]` for automated RSS parser feed discovery.

### B. Dynamic Homepage Meta Settings (`src/app/(marketing)/page.tsx`)
- Implement `generateMetadata` fetching custom `defaultSeoTitle`, `defaultSeoDescription`, and `socialShareImage` fields from Sanity CMS `siteSettings`.
- Provide sensible defaults if CMS configurations are omitted.

### C. Dynamic Category Metadata (`src/app/archive/[category]/page.tsx`)
- Implement dynamic `generateMetadata` reading category slug route params, transforming it to clean capitalized title representation, and adding dynamic canonical URLs.

### D. Static Pages (About, Contact, Privacy, Terms)
- Update code metadata blocks to include custom descriptions and canonical self-referencing links:
  - `/about`: Title `"About"`, Description `"Learn about our mission to filter student intelligence..."`
  - `/contact`: Title `"Contact Us"`, Description `"Get in touch with the Kampus Filter team..."`
  - `/privacy`: Title `"Privacy Policy"`, Description `"Privacy Policy for Kampus Filter..."`
  - `/terms`: Title `"Terms of Service"`, Description `"Terms of Service for Kampus Filter..."`

### E. Semantic Schema.org Markup (JSON-LD)
- **Homepage (`/`)**: Inject `Organization` and `WebSite` schemas (with search query parameters mapping to `/archive?q={search_term_string}`).
- **Static & Category Pages**: Inject a dynamic `BreadcrumbList` schema showing the user's path.
- **Articles (`/articles/[slug]`)**: Enhance `NewsArticle` schema with `dateModified`, absolute image array, author type link, and publisher referencing the organization.

### F. Robots config (`src/app/robots.ts`)
- Explicitly configure rule arrays to allow search engine user-agents and AI bot agents (`GPTBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-Web`, `PerplexityBot`, `YouBot`, `Google-Extended`, `Applebot-Extended`) to parse public folders, while disallowing the `/studio/` path.

### G. Dynamic Sitemap (`src/app/sitemap.ts`)
- Add queries fetching categories from Sanity CMS.
- Combine static paths, article paths, and category archive paths with specific `changeFrequency` and `priority` weight tags.

---

## 3. Verification Plan

### Automated Verification
1. Build the production application via `npm run build` to confirm sitemaps, robots.ts, and page routing compile correctly.
2. Run `tsc --noEmit` to verify type safety in metadata definitions.

### Manual Verification
1. Inspect rendering page outputs on local browser for correct metadata header injections (e.g. using browser inspect tools).
2. Validate robots output on `http://localhost:3000/robots.txt`.
3. Validate sitemap layout on `http://localhost:3000/sitemap.xml`.

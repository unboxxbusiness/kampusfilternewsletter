# Dynamic Newsletter Categories from Sanity CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retrieve the "Course Interests" categories dynamically from Sanity CMS (based on categories of published articles) and display them in the homepage subscription form with fallback to hardcoded options.

**Architecture:** Fetch categories in the marketing page server component using GROQ, then pass them down via props to the client homepage and newsletter form components. Implement a robust fallback in the newsletter form to the current hardcoded list if the prop is empty or missing.

**Tech Stack:** Next.js (App Router), React, Sanity CMS (next-sanity / GROQ)

## Global Constraints

- Fallback to current hardcoded categories if CMS returns empty or fails.
- Categories should be sorted alphabetically by title.
- Only show categories that are associated with at least one published article.

---

### Task 1: Update Server Page to Fetch Categories

**Files:**
- Modify: `src/app/(marketing)/page.tsx`

**Interfaces:**
- Consumes: Sanity client from `@/lib/sanity/client`
- Produces: An array of category titles `categories: string[]` passed as a prop to `HomePageClient`

- [ ] **Step 1: Modify page.tsx to fetch active categories**
  Add the fetch query and update `HomePage` component to fetch the categories and pass them to `HomePageClient`.

  Update `src/app/(marketing)/page.tsx`:
  ```typescript
  // Fetch active categories (linked to at least one published article)
  async function getActiveCategories(): Promise<string[]> {
    try {
      const categories = await client.fetch(
        `*[_type == "category" && count(*[_type == "article" && category._ref == ^._id]) > 0] | order(title asc) {
          title
        }`
      );
      return categories.map((cat: any) => cat.title);
    } catch (error) {
      console.error("Error fetching active categories from Sanity:", error);
      return [];
    }
  }
  ```

- [ ] **Step 2: Update HomePage component to execute query and pass prop**
  Update `HomePage` to run `getActiveCategories()` and pass it to `HomePageClient`:
  ```typescript
  export default async function HomePage() {
    const [settings, categories] = await Promise.all([
      getSiteSettings(),
      getActiveCategories(),
    ]);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";
    // ...
    return (
      <>
        {/* ... */}
        <HomePageClient
          siteName={settings?.siteName || "Kampus Filter"}
          heroTitle={settings?.homepageHeroTitle || "Build Your Future in 5 Minutes a Day."}
          heroDescription={
            settings?.homepageHeroDescription ||
            "Discover opportunities, career intelligence, scholarships, internships, and education insights that help ambitious students make smarter decisions."
          }
          categories={categories}
        />
      </>
    );
  }
  ```

---

### Task 2: Pass Categories Through HomePageClient

**Files:**
- Modify: `src/app/(marketing)/HomePageClient.tsx`

**Interfaces:**
- Consumes: `categories` prop from `page.tsx`
- Produces: Passes `categories` prop to `NewsletterForm`

- [ ] **Step 1: Modify HomePageClient.tsx interface**
  Add `categories` to `HomePageClientProps`:
  ```typescript
  interface HomePageClientProps {
    siteName: string;
    heroTitle: string;
    heroDescription: string;
    categories?: string[];
  }
  ```

- [ ] **Step 2: Destructure and pass to NewsletterForm**
  Update the rendering of `NewsletterForm` to pass the categories:
  ```typescript
  <NewsletterForm onSubscribeSuccess={handleSubscribeSuccess} categories={categories} />
  ```

---

### Task 3: Update NewsletterForm to Support Dynamic Categories and Fallback

**Files:**
- Modify: `src/components/newsletter/NewsletterForm.tsx`

**Interfaces:**
- Consumes: `categories` prop from `HomePageClient`
- Produces: Dynamic buttons in the "Course Interests" UI section

- [ ] **Step 1: Modify NewsletterForm.tsx interface**
  Add `categories` to `NewsletterFormProps`:
  ```typescript
  interface NewsletterFormProps {
    onSubscribeSuccess: (email: string, enableNotifications: boolean) => void;
    categories?: string[];
  }
  ```

- [ ] **Step 2: Render dynamic categories with fallback**
  Update the list of options inside the component. Resolve options using the prop if provided and non-empty, otherwise fallback to the hardcoded list:
  ```typescript
  const interestOptions = categories && categories.length > 0 ? categories : INTEREST_OPTIONS;
  ```
  Replace references to `INTEREST_OPTIONS` in the rendering map with `interestOptions`.

---

### Task 4: Verify Implementation

**Files:**
- Test: Build and lint validation

- [ ] **Step 1: Verify TypeScript & ESLint**
  Run compilation and lint checks to verify clean build.

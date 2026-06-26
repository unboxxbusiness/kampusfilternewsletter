# Design Document: Dynamic Newsletter Categories from Sanity CMS

This document outlines the design for fetching the "Course Interests" categories dynamically from Sanity CMS, replacing the hardcoded list in the homepage subscription form.

---

## 1. Objectives

- **Dynamic Source**: Fetch the interest category list dynamically from Sanity CMS.
- **Resiliency & Fallbacks**: Fallback to the current hardcoded categories if the Sanity fetch fails or returns empty.
- **Performance**: Fetch the categories on the server side in the marketing main page (`page.tsx`) to avoid client-side API requests, layout shifts, or bundle size increases.
- **Category Query Scope**: 
  - Retrieve all categories that are currently referenced by at least one published article. This matches the user's requirement ("based category which I am publishing content").

---

## 2. Proposed Changes

### A. Marketing Page Server Component (`src/app/(marketing)/page.tsx`)
- Fetch categories from Sanity using GROQ:
  ```groq
  *[_type == "category" && count(*[_type == "article" && references(^._id)]) > 0] | order(title asc) {
    title
  }
  ```
- Pass the retrieved category titles as a string array (`categories`) to `<HomePageClient />`.

### B. Homepage Client Component (`src/app/(marketing)/HomePageClient.tsx`)
- Update the component props to accept `categories?: string[]`.
- Pass `categories` to the `<NewsletterForm />` component.

### C. Newsletter Form Component (`src/components/newsletter/NewsletterForm.tsx`)
- Update `NewsletterFormProps` to include `categories?: string[]`.
- Inside the component, use the passed `categories` if provided; otherwise, fallback to the hardcoded `INTEREST_OPTIONS`.

---

## 3. Verification Plan

### Automated Verification
- Run `npm run lint` to check for TypeScript and ESLint errors.
- Run `npm run build` to verify the production build completes successfully.

### Manual Verification
- Deploy locally and check that the categories shown under "Course Interests" match the active categories in the CMS (or fallback to the hardcoded ones if no articles exist).

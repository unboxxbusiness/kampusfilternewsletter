# Design Spec: Opportunity Finder Page (`/finder`)

Build a dedicated, premium Opportunity Finder discovery interface on the route `/finder` utilizing server-side filtering query parameters, dynamic Sanity GROQ queries, and opportunity metadata schema attributes.

## User Review Required

> [!IMPORTANT]
> - **Schema Upgrades**: We will expand the Sanity `article` document schema type, adding four new metadata fields (`opportunityType`, `educationLevel`, `fundingType`, `deadline`) to enable precise database filtering.
> - **Server-Side URL-Query State**: Filter selections dynamically reload the page by updating URL query parameters (`/finder?type=fellowship&funding=fully-funded`).
> - **Collapsible Mobile Sheet**: Filters slide up inside a native-looking bottom sheet on mobile screens (`< 768px`) to keep layouts uncluttered and mobile-first.

## Proposed Changes

### 1. Content Schema Updates

#### [MODIFY] [article.ts](file:///e:/kampusfilter/src/lib/sanity/schemas/article.ts)
- Add new fields:
  - `opportunityType` (string): `scholarship`, `internship`, `fellowship`, `job`.
  - `educationLevel` (array of strings): `high-school`, `undergraduate`, `postgraduate`, `phd`.
  - `fundingType` (string): `fully-funded`, `partially-funded`, `paid`, `unpaid`.
  - `deadline` (date).

---

### 2. Finder Routing & Database Fetch

#### [NEW] [page.tsx](file:///e:/kampusfilter/src/app/finder/page.tsx)
- Create a server page component at `src/app/finder/page.tsx`.
- Parse URL query parameter inputs: `type`, `education`, `funding`, `status` (active/all), `page`.
- Construct dynamic Sanity GROQ filters based on parameters.
- Query active opportunities using pagination limits (10 items per page).
- Pass query results to client layout renderer.

---

### 3. User Interface Components

#### [NEW] [FinderClient.tsx](file:///e:/kampusfilter/src/components/finder/FinderClient.tsx)
- Main client-side container layout that orchestrates filtering, URL parameter updates, and results display.
- Layout splits:
  - **Desktop**: Left vertical sticky sidebar filter controls, right opportunity grid.
  - **Mobile**: Top search header, sticky filter action button opening a bottom-sliding sheet drawer.
- Filter buttons reset pagination to `page=1` on selection changes.

#### [NEW] [OpportunityCard.tsx](file:///e:/kampusfilter/src/components/finder/OpportunityCard.tsx)
- Design and render individual opportunity matches:
  - Rounded borders, brand shadows, hover lift animations.
  - Display category tag, title (hovering to brand-amber), excerpt.
  - Render colored brand badges for metadata parameters: Type, Funding, and Education levels.
  - Deadline indicator in card footer (highlighted in warning amber if deadline is within 7 days).
  - CTA button linked to article detail route.

#### [MODIFY] [Navbar.tsx](file:///e:/kampusfilter/src/components/layout/Navbar.tsx)
- Add "Finder" link in the global desktop navigation items and mobile bottom nav configuration so users can easily navigate to `/finder`.

---

## Verification Plan

### Automated Verification
- Run `npm run lint` and `npx tsc --noEmit` to verify type safety and compiler compliance.
- Confirm production build succeeds.

### Manual Verification
- Test all filter dropdown options and verify that query params update in the browser URL.
- Verify expiration filter: set deadline of an opportunity to yesterday and confirm it hides when "Hide Expired" filter is toggled active.
- Verify mobile drawer layout transitions and safe area padding on device emulators.

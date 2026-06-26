# Design Document: Kampus Filter (Student Intelligence Platform)

Kampus Filter is a premium, typography-first, reading-focused student intelligence platform designed to help students discover scholarships, internships, fellowships, competitions, career opportunities, and future skills. 

This document details the complete system architecture, data models, UI design system, subscription flow, search implementation, and automatic push notification pipeline.

---

## 1. Tech Stack & Prerequisites

*   **Framework**: Next.js Latest Stable App Router (with `src/` directory)
*   **Language**: TypeScript (strict mode enabled)
*   **Styling**: Tailwind CSS & shadcn/ui
*   **Content Management**: Sanity CMS (Studio embedded at `/studio` using `next-sanity`)
*   **Database & Subscriptions**: Firebase Firestore
*   **Push Notifications**: Firebase Cloud Messaging (FCM) Client SDK & Firebase Admin SDK
*   **Deployment**: Vercel

### Required Environment Variables (`.env.local`)
```bash
# Sanity Config
NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2026-06-25"
SANITY_WEBHOOK_SECRET="your_webhook_signature_secret"

# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_auth_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your_measurement_id"
NEXT_PUBLIC_FIREBASE_VAPID_KEY="your_fcm_vapid_public_key"

# Firebase Admin Config (Server-side)
FIREBASE_ADMIN_PROJECT_ID="your_project_id"
FIREBASE_ADMIN_CLIENT_EMAIL="your_admin_client_email"
FIREBASE_ADMIN_PRIVATE_KEY="your_admin_private_key_escaped_newlines"
```

---

## 2. Directory Structure

The project follows a feature-based modular architecture under the `src/` folder:

```text
src/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx               # Conversion-focused landing page
│   │   ├── about/
│   │   │   └── page.tsx           # Mission & philosophy
│   │   ├── contact/
│   │   │   └── page.tsx           # Premium minimal contact form
│   │   └── privacy/
│   │       └── page.tsx           # Privacy policies
│   │   ├── archive/
│   │   │   ├── page.tsx           # Content discovery grid with filters & search
│   │   │   └── [category]/
│   │   │       └── page.tsx       # Category archive index
│   │   ├── articles/
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # Typography-focused reading page
│   │   ├── studio/
│   │   │   └── [[...index]]/
│   │   │       └── page.tsx       # Embedded Sanity Studio
│   │   ├── api/
│   │   │   ├── subscribe/
│   │   │   │   └── route.ts       # Firestore subscriber ingestion route
│   │   │   ├── search/
│   │   │   │   └── route.ts       # Debounced GROQ-based search handler
│   │   │   └── webhook/
│   │   │       └── route.ts       # Sanity publish webhook listener -> sends FCM broadcasts
│   │   ├── globals.css            # Typography setup and base tailwind imports
│   │   ├── layout.tsx             # Root layout with theme provider & header/footer
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│
├── components/
│   ├── ui/                        # Radix-based shadcn components
│   ├── layout/                    # Global Navbar and Footer
│   ├── navigation/                # Breadcrumbs, category pill menus
│   ├── newsletter/                # Homepage newsletter form + notification modal
│   ├── archive/                   # Archive cards, filter panels
│   ├── article/                   # TOC, progress bar, portable text renderer, author card
│   └── common/                    # Theme toggle, skeletons, state indicators
│
├── features/                      # Redux slices or decoupled feature components
│   ├── newsletter/
│   ├── articles/
│   ├── archive/
│   ├── search/
│   └── notifications/
│
├── actions/                       # Next.js Server Actions for Firestore interactions
├── hooks/                         # useDebounce, useFCM, useReadingProgress, useScrollSpy
├── providers/                     # Dark/Light theme providers
├── services/                      # Firebase and Sanity API class services
├── lib/
│   ├── firebase/
│   │   ├── config.ts              # Client Firebase SDK setup
│   │   └── admin.ts               # Server Firebase Admin SDK setup
│   ├── sanity/
│   │   ├── client.ts              # Sanity CDN read client
│   │   ├── image.ts               # Image optimization helper
│   │   └── schemas.ts             # Schema exports for studio
│   └── utils/
│
├── types/                         # TypeScript interfaces (Subscriber, Article, Author)
└── styles/
```

---

## 3. Database & CMS Schemas

### A. Firebase Firestore (`subscribers` Collection)
Each subscriber is mapped by their email as document ID:
*   `name` (`string`): Full Name
*   `email` (`string`): Unique Email Address
*   `mobile` (`string`, optional): Optional phone contact
*   `courseInterests` (`string[]`): Multi-select array of interests (e.g., `["Scholarships", "Internships"]`)
*   `notificationEnabled` (`boolean`): True if user approved browser notifications
*   `fcmToken` (`string`, optional): FCM device token used to send notifications
*   `createdAt` (`timestamp`)
*   `updatedAt` (`timestamp`)

### B. Sanity CMS Schemas

#### 1. Category Schema (`category`)
*   `title` (`string`): Title of the category (e.g., "Opportunities").
*   `slug` (`slug`): URL path key (source: `title`).
*   `description` (`text`): Short header description.

#### 2. Author Schema (`author`)
*   `name` (`string`): Full name.
*   `image` (`image`): Square avatar image.
*   `bio` (`array` of blocks): Brief profile content.

#### 3. Article Schema (`article`)
*   `title` (`string`): Main title of the article.
*   `slug` (`slug`): Custom reading route.
*   `excerpt` (`text`): 2-sentence card summary.
*   `featuredImage` (`image`): Editorial header asset.
*   `category` (`reference` to `category` schema).
*   `author` (`reference` to `author` schema).
*   `publishedAt` (`datetime`): Publication date.
*   `readingTime` (`number`): Integer representation of reading length.
*   `featured` (`boolean`): If highlighted on archive.
*   `seoTitle` (`string`): Meta title tag.
*   `seoDescription` (`text`): Meta description tag.
*   `content` (`array` of blocks): Rich portable text block containing headings mapping to mandatory sections:
    *   **TL;DR**
    *   **What's Happening**
    *   **Why It Matters**
    *   **The Opportunity**
    *   **What Students Should Do Next**
    *   **Key Takeaways**
    *   **Final Take**

#### 4. Site Settings (Singleton `siteSettings`)
*   `siteName` (`string`): Global site name.
*   `homepageHeroTitle` (`string`): Headline text.
*   `homepageHeroDescription` (`text`): Supporting copy.
*   `defaultSeoTitle` (`string`): General route title.
*   `defaultSeoDescription` (`text`): General route description.
*   `socialShareImage` (`image`): Default fallback og:image.

---

## 4. Feature Flow Implementations

### A. Homepage Newsletter & FCM Registration Flow
1.  **Form Input**: User enters Name, Email, optional Mobile, selects interests, and checks "Enable push notifications".
2.  **Account Creation**: React Client component executes a server action/API post to `/api/subscribe` saving the data to Firestore (`notificationEnabled: false`).
3.  **Notification Authorization**:
    *   If "Enable push notifications" is checked, the browser requests permissions via `Notification.requestPermission()`.
    *   If granted, register `/firebase-messaging-sw.js` and acquire the FCM device token via the browser Firebase client SDK.
    *   Call `/api/notifications` posting the token and subscriber email.
    *   The route handler uses Firebase Admin SDK to subscribe the token to the `news` FCM Topic and updates the Firestore subscriber document with the token and `notificationEnabled: true`.
4.  **Fallback**: If unsupported or denied, the subscriber is saved to Firestore but no FCM token is generated and `notificationEnabled` remains `false`. The UI renders a success confirmation with a gentle fallback message.

### B. Sanity Publishing Webhook Handler (`/api/webhook`)
1.  **Trigger**: When an article is published, Sanity invokes Next.js route `/api/webhook`.
2.  **Signature Verification**: The handler verifies request headers using `isValidSignature` against `SANITY_WEBHOOK_SECRET`.
3.  **Broadcasting**:
    *   Parse article title, category title, excerpt, and slug from payload.
    *   Execute Firebase Admin command `admin.messaging().send({ topic: 'news', ... })` targeting the `news` subscriber topic.
    *   The notification payload includes:
        *   `title`: `New in ${category}: ${title}`
        *   `body`: `${excerpt}`
        *   `data`: `{ url: "/articles/${slug}" }`
4.  **Background Reception**: Client browser worker (`firebase-messaging-sw.js`) intercepts the message in the background, displays a native browser popup notification, and links click event directly to `data.url`.

### C. Fast Archive Search
The Archive Page search uses client debouncing querying `/api/search?q=[query]`. The handler queries Sanity:
```groq
*[_type == "article" && (title match $q + "*" || excerpt match $q + "*" || category->title match $q + "*")] {
  title,
  slug,
  excerpt,
  "category": category->title,
  publishedAt,
  readingTime
}
```
This GROQ query uses prefix wildcards to ensure snappy autocomplete while staying highly optimized.

---

## 5. UI/UX design System

The styling is custom-tailored to convey high-end, calm reading:
*   **Colors**:
    *   **Light**: Off-white background (`#FCFBF9`), dark charcoal text (`#1A1A1A`), minimal grey borders, rich blue accents.
    *   **Dark**: Black background (`#0B0B0B`), light grey text (`#E5E5E5`), charcoal borders, vibrant blue accents.
*   **Typography**:
    *   Headers: `Geist Sans`
    *   Body text: `Inter`
    *   Large, generous margins (`leading-relaxed`, line-height 1.625 for reading elements, paragraphs split by `mb-8`).
*   **Article Page Details**:
    *   A sticky top progress bar dynamically indicates scroll reading depth.
    *   An outline-based Table of Contents highlights current viewing header using an IntersectionObserver scroll spy hook.
    *   No sidebars or distracting grids surrounding the primary reading sheet.

---

## 6. Verification Plan

### Automated Verification
*   **Types Check**: Run `tsc --noEmit` to verify type-safe client, actions, and API interfaces.
*   **Linting & Prettier**: Validate styling consistency via `npm run lint`.
*   **Compile Build**: Execute `npm run build` to confirm static generation routes compile correctly.

### Manual Verification
*   **Subscribe Actions**: Input mock fields to homepage and confirm subscriber document appears in Firebase Emulator/Console.
*   **Notification Popups**: Trigger a mock publish and verify that a browser alert displays in the foreground/background linking to `/articles/[slug]`.
*   **Responsive Review**: Confirm max-width 720px reading pages flow cleanly on mobile viewports.

# Kampus Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Kampus Filter, a premium typography-first student intelligence platform using Next.js (Latest Stable), Tailwind CSS, Sanity CMS, and Firebase.

**Architecture:** App Router hybrid structure where articles are statically generated with dynamic ISR revalidation, search runs GROQ via Route Handlers, subscriptions save to Firestore, and Sanity webhook triggers broadcast notifications to FCM Topics.

**Tech Stack:** Next.js (Latest Stable), TypeScript, Tailwind CSS, shadcn/ui, Sanity CMS (next-sanity), Firebase (Client & Admin SDKs).

## Global Constraints

*   Use Next.js Latest Stable App Router.
*   Use src/ directory structure.
*   Embed Sanity Studio at `/studio` using `next-sanity`.
*   Store subscribers in Firebase Firestore and NEVER in Sanity.
*   Enable push notifications using FCM Topics.
*   Lighthouse score above 90.

---

### Task 1: Project Scaffolding & Next.js Setup

**Files:**
- Create: `package.json`
- Create: `tailwind.config.ts`
- Create: `src/app/globals.css`
- Create: `components.json`

**Interfaces:**
- Produces: Base project structure, package configuration, and custom tailwind styles.

- [ ] **Step 1: Scaffolding the Next.js App**
  Run: `npx -y create-next-app@latest ./ --typescript --tailwind --eslint --src-dir --app --import-alias "@/*" --use-npm`
  Expected: Scaffold Next.js in workspace root.

- [ ] **Step 2: Install Latest Stable Next.js and React**
  Run: `npm install next@latest react@latest react-dom@latest`
  Expected: Install Next.js latest stable and matching React packages.

- [ ] **Step 3: Install Project Dependencies**
  Run: `npm install lucide-react clsx tailwind-merge next-themes next-sanity @sanity/client @sanity/image-url @portabletext/react firebase firebase-admin @sanity/webhook`
  Expected: Successfully install all essential project packages.

- [ ] **Step 4: Initialize shadcn/ui**
  Run: `npx -y shadcn@latest init -d`
  Expected: Creates `components.json` and configures base tailwind/shadcn styles.

- [ ] **Step 5: Write the base Tailwind styling configuration**
  Create: `tailwind.config.ts` with custom colors: off-white (`#FCFBF9`), dark charcoal (`#1A1A1A`), dark background (`#0B0B0B`), light text (`#E5E5E5`), and accent blue (`#0066CC` / `#3399FF`).
  Content:
  ```typescript
  import type { Config } from "tailwindcss";

  const config: Config = {
    darkMode: ["class"],
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          background: "var(--background)",
          foreground: "var(--foreground)",
          brand: {
            light: "#0066CC",
            dark: "#3399FF",
          },
          editorial: {
            offwhite: "#FCFBF9",
            charcoal: "#1A1A1A",
            darkblack: "#0B0B0B",
            lightgrey: "#E5E5E5",
          }
        },
        fontFamily: {
          sans: ["var(--font-geist-sans)", "Inter", "sans-serif"],
          mono: ["var(--font-geist-mono)", "monospace"],
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  };
  export default config;
  ```

- [ ] **Step 6: Write globals.css for custom scroll progress and layout variables**
  Modify: `src/app/globals.css`
  Content:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :root {
    --background: #FCFBF9;
    --foreground: #1A1A1A;
  }

  .dark {
    --background: #0B0B0B;
    --foreground: #E5E5E5;
  }

  body {
    background-color: var(--background);
    color: var(--foreground);
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  }
  ```

- [ ] **Step 7: Verify compilation**
  Run: `npm run build`
  Expected: Compile successfully without errors.

- [ ] **Step 8: Commit changes**
  Run: `git add -A && git commit -m "feat: scaffold project with nextjs 16 and tailwind"`

---

### Task 2: Embedded Sanity Studio & Schemas Configuration

**Files:**
- Create: `sanity.config.ts`
- Create: `sanity.cli.ts`
- Create: `src/lib/sanity/schemas/category.ts`
- Create: `src/lib/sanity/schemas/author.ts`
- Create: `src/lib/sanity/schemas/article.ts`
- Create: `src/lib/sanity/schemas/siteSettings.ts`
- Create: `src/lib/sanity/schemas/index.ts`
- Create: `src/app/studio/[[...index]]/page.tsx`
- Create: `src/lib/sanity/client.ts`
- Create: `src/lib/sanity/image.ts`

**Interfaces:**
- Produces: Embedded CMS Studio at `/studio` and GROQ data fetch client.

- [ ] **Step 1: Write Category Schema**
  Create: `src/lib/sanity/schemas/category.ts`
  Content:
  ```typescript
  import { defineType, defineField } from "sanity";

  export default defineType({
    name: "category",
    title: "Category",
    type: "document",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: Rule => Rule.required() }),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" } }),
      defineField({ name: "description", title: "Description", type: "text" }),
    ],
  });
  ```

- [ ] **Step 2: Write Author Schema**
  Create: `src/lib/sanity/schemas/author.ts`
  Content:
  ```typescript
  import { defineType, defineField } from "sanity";

  export default defineType({
    name: "author",
    title: "Author",
    type: "document",
    fields: [
      defineField({ name: "name", title: "Name", type: "string", validation: Rule => Rule.required() }),
      defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
      defineField({ name: "bio", title: "Bio", type: "array", of: [{ type: "block" }] }),
    ],
  });
  ```

- [ ] **Step 3: Write Article Schema**
  Create: `src/lib/sanity/schemas/article.ts`
  Content:
  ```typescript
  import { defineType, defineField } from "sanity";

  export default defineType({
    name: "article",
    title: "Article",
    type: "document",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: Rule => Rule.required() }),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: Rule => Rule.required() }),
      defineField({ name: "excerpt", title: "Excerpt", type: "text" }),
      defineField({ name: "featuredImage", title: "Featured Image", type: "image", options: { hotspot: true } }),
      defineField({ name: "category", title: "Category", type: "reference", to: [{ type: "category" }], validation: Rule => Rule.required() }),
      defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "author" }], validation: Rule => Rule.required() }),
      defineField({ name: "publishedAt", title: "Published At", type: "datetime", initialValue: () => new Date().toISOString() }),
      defineField({ name: "readingTime", title: "Reading Time (min)", type: "number" }),
      defineField({ name: "featured", title: "Featured Article", type: "boolean", initialValue: false }),
      defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
      defineField({ name: "seoDescription", title: "SEO Description", type: "text" }),
      defineField({ name: "content", title: "Content (Portable Text)", type: "array", of: [{ type: "block" }] }),
    ],
  });
  ```

- [ ] **Step 4: Write Site Settings Schema (Singleton)**
  Create: `src/lib/sanity/schemas/siteSettings.ts`
  Content:
  ```typescript
  import { defineType, defineField } from "sanity";

  export default defineType({
    name: "siteSettings",
    title: "Site Settings",
    type: "document",
    fields: [
      defineField({ name: "siteName", title: "Site Name", type: "string", validation: Rule => Rule.required() }),
      defineField({ name: "homepageHeroTitle", title: "Homepage Hero Title", type: "string" }),
      defineField({ name: "homepageHeroDescription", title: "Homepage Hero Description", type: "text" }),
      defineField({ name: "defaultSeoTitle", title: "Default SEO Title", type: "string" }),
      defineField({ name: "defaultSeoDescription", title: "Default SEO Description", type: "text" }),
      defineField({ name: "socialShareImage", title: "Social Share Image", type: "image" }),
    ],
  });
  ```

- [ ] **Step 5: Write Schema Index**
  Create: `src/lib/sanity/schemas/index.ts`
  Content:
  ```typescript
  import category from "./category";
  import author from "./author";
  import article from "./article";
  import siteSettings from "./siteSettings";

  export const schemaTypes = [category, author, article, siteSettings];
  ```

- [ ] **Step 6: Write sanity.config.ts**
  Create: `sanity.config.ts`
  Content:
  ```typescript
  import { defineConfig } from "sanity";
  import { deskTool } from "sanity/desk";
  import { schemaTypes } from "./src/lib/sanity/schemas";

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

  export default defineConfig({
    name: "default",
    title: "Kampus Filter Studio",
    projectId,
    dataset,
    basePath: "/studio",
    plugins: [
      deskTool({
        structure: (S) =>
          S.list()
            .title("Content")
            .items([
              S.listItem()
                .title("Site Settings")
                .child(
                  S.document()
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                ),
              S.divider(),
              ...S.documentTypeListItems().filter(
                (item) => item.getId() !== "siteSettings"
              ),
            ]),
      }),
    ],
    schema: {
      types: schemaTypes,
    },
  });
  ```

- [ ] **Step 7: Create Sanity Client Utilities**
  Create: `src/lib/sanity/client.ts`
  Content:
  ```typescript
  import { createClient } from "next-sanity";

  export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-25",
    useCdn: true,
  });
  ```

- [ ] **Step 8: Create Image Builder**
  Create: `src/lib/sanity/image.ts`
  Content:
  ```typescript
  import imageUrlBuilder from "@sanity/image-url";
  import { client } from "./client";

  const builder = imageUrlBuilder(client);

  export function urlFor(source: any) {
    return builder.image(source);
  }
  ```

- [ ] **Step 9: Create Embedded Studio Page Route**
  Create: `src/app/studio/[[...index]]/page.tsx`
  Content:
  ```typescript
  "use client";

  import { NextStudio } from "next-sanity/studio";
  import config from "../../../../sanity.config";

  export default function StudioPage() {
    return <NextStudio config={config} />;
  }
  ```

- [ ] **Step 10: Commit changes**
  Run: `git add -A && git commit -m "feat: setup sanity schemas and embedded studio"`

---

### Task 3: Firebase Integration & Newsletter Signups

**Files:**
- Create: `src/lib/firebase/config.ts`
- Create: `src/lib/firebase/admin.ts`
- Create: `src/app/api/subscribe/route.ts`
- Create: `src/components/newsletter/NewsletterForm.tsx`

**Interfaces:**
- Produces: Client Firebase App, Server Admin App instance, and subscriber submission API endpoint.

- [ ] **Step 1: Write client Firebase initialization**
  Create: `src/lib/firebase/config.ts`
  Content:
  ```typescript
  import { initializeApp, getApps, getApp } from "firebase/app";
  import { getFirestore } from "firebase/firestore";
  import { getMessaging, isSupported } from "firebase/messaging";

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export { app, db };
  export const getFcmMessaging = async () => {
    const supported = await isSupported();
    return supported ? getMessaging(app) : null;
  };
  ```

- [ ] **Step 2: Write Admin Firebase initialization**
  Create: `src/lib/firebase/admin.ts`
  Content:
  ```typescript
  import admin from "firebase-admin";

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      }),
    });
  }

  export const adminDb = admin.firestore();
  export const adminMessaging = admin.messaging();
  export default admin;
  ```

- [ ] **Step 3: Create Firestore Subscriber API Route**
  Create: `src/app/api/subscribe/route.ts`
  Content:
  ```typescript
  import { NextResponse } from "next/server";
  import { adminDb } from "@/lib/firebase/admin";

  export async function POST(request: Request) {
    try {
      const { name, email, mobile, courseInterests } = await request.json();

      if (!name || !email) {
        return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
      }

      const subscriberRef = adminDb.collection("subscribers").doc(email);
      const now = new Date();

      await subscriberRef.set({
        name,
        email,
        mobile: mobile || "",
        courseInterests: courseInterests || [],
        notificationEnabled: false,
        createdAt: now,
        updatedAt: now,
      }, { merge: true });

      return NextResponse.json({ success: true });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  ```

- [ ] **Step 4: Create Newsletter Form Component**
  Create: `src/components/newsletter/NewsletterForm.tsx`
  Content:
  ```typescript
  "use client";

  import React, { useState } from "react";

  const INTEREST_OPTIONS = [
    "Scholarships", "Careers", "Coding", "Internships", "Government Jobs", "Study Abroad", "MBA", "Placements"
  ];

  interface NewsletterFormProps {
    onSubscribeSuccess: (email: string) => void;
  }

  export default function NewsletterForm({ onSubscribeSuccess }: NewsletterFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [enableNotifications, setEnableNotifications] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const toggleInterest = (interest: string) => {
      setSelectedInterests(prev =>
        prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
      );
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, mobile, courseInterests: selectedInterests }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Something went wrong");

        onSubscribeSuccess(email);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border-b border-gray-300 bg-transparent py-2 focus:border-black outline-none transition"
          />
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border-b border-gray-300 bg-transparent py-2 focus:border-black outline-none transition"
          />
          <input
            type="tel"
            placeholder="Mobile Number (Optional)"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            className="w-full border-b border-gray-300 bg-transparent py-2 focus:border-black outline-none transition"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">Course Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map(interest => {
              const active = selectedInterests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1 text-sm border rounded-full transition ${
                    active ? "bg-black text-white border-black" : "border-gray-300 hover:border-black"
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="notif-check"
            checked={enableNotifications}
            onChange={e => setEnableNotifications(e.target.checked)}
            className="h-4 w-4 accent-black cursor-pointer"
          />
          <label htmlFor="notif-check" className="text-sm text-gray-600 cursor-pointer">
            Enable browser notifications to receive future opportunities instantly.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 hover:bg-gray-800 transition font-medium"
        >
          {loading ? "Joining..." : "Join Free"}
        </button>
      </form>
    );
  }
  ```

- [ ] **Step 5: Commit changes**
  Run: `git add -A && git commit -m "feat: add firebase core connection and subscription forms"`

---

### Task 4: Client FCM Service Worker & Registration

**Files:**
- Create: `public/firebase-messaging-sw.js`
- Create: `src/hooks/useFCM.ts`
- Create: `src/app/api/notifications/route.ts`

**Interfaces:**
- Consumes: `getFcmMessaging` from `src/lib/firebase/config.ts`
- Produces: Service Worker script file, client-side browser notifications trigger, and topic subscription webhook.

- [ ] **Step 1: Write Firebase messaging service worker**
  Create: `public/firebase-messaging-sw.js`
  Content:
  ```javascript
  importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

  firebase.initializeApp({
    apiKey: true, // Swallowed/filled by client build configurations dynamically
    messagingSenderId: "DYNAMIC_MESSAGING_SENDER_ID"
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/icon.png',
      data: { url: payload.data.url }
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  });
  ```

- [ ] **Step 2: Create Server-side Notification Registration Endpoint**
  Create: `src/app/api/notifications/route.ts`
  Content:
  ```typescript
  import { NextResponse } from "next/server";
  import { adminDb, adminMessaging } from "@/lib/firebase/admin";

  export async function POST(request: Request) {
    try {
      const { email, token } = await request.json();

      if (!email || !token) {
        return NextResponse.json({ error: "Email and Token are required" }, { status: 400 });
      }

      // Subscribe token to FCM Topic "news"
      await adminMessaging.subscribeToTopic(token, "news");

      // Save token to subscriber profile in Firestore
      const subscriberRef = adminDb.collection("subscribers").doc(email);
      await subscriberRef.update({
        fcmToken: token,
        notificationEnabled: true,
        updatedAt: new Date(),
      });

      return NextResponse.json({ success: true });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  ```

- [ ] **Step 3: Create useFCM React hook for client-side registration**
  Create: `src/hooks/useFCM.ts`
  Content:
  ```typescript
  import { getFcmMessaging } from "@/lib/firebase/config";
  import { getToken } from "firebase/messaging";

  export function useFCM() {
    const registerPushNotifications = async (email: string) => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("Notification permission denied");
          return false;
        }

        const messaging = await getFcmMessaging();
        if (!messaging) {
          console.warn("FCM messaging not supported on this client");
          return false;
        }

        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (token) {
          const response = await fetch("/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, token }),
          });

          if (!response.ok) {
            throw new Error("Failed to subscribe token on backend");
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error setting up FCM:", error);
        return false;
      }
    };

    return { registerPushNotifications };
  }
  ```

- [ ] **Step 4: Commit changes**
  Run: `git add -A && git commit -m "feat: add FCM browser client hook and notification registration route"`

---

### Task 5: Dynamic Editorial Page Layouts & Search API

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/app/api/search/route.ts`
- Create: `src/components/archive/SearchBar.tsx`
- Create: `src/app/archive/page.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: Sanity Client from `src/lib/sanity/client.ts`
- Produces: Search response JSON arrays, filterable categories index view.

- [ ] **Step 1: Write Search API endpoint using Sanity GROQ**
  Create: `src/app/api/search/route.ts`
  Content:
  ```typescript
  import { NextResponse } from "next/server";
  import { client } from "@/lib/sanity/client";

  export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    try {
      const results = await client.fetch(
        `*[_type == "article" && (title match $q || excerpt match $q || category->title match $q)] {
          title,
          slug,
          excerpt,
          "category": category->title,
          "authorName": author->name,
          publishedAt,
          readingTime
        }`,
        { q: `${query}*` }
      );

      return NextResponse.json(results);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  ```

- [ ] **Step 2: Create Search Bar component**
  Create: `src/components/archive/SearchBar.tsx`
  Content:
  ```typescript
  "use client";

  import React, { useState, useEffect } from "react";

  interface SearchBarProps {
    onSearch: (results: any[]) => void;
    setLoading: (loading: boolean) => void;
  }

  export default function SearchBar({ onSearch, setLoading }: SearchBarProps) {
    const [query, setQuery] = useState("");

    useEffect(() => {
      if (!query.trim()) {
        onSearch([]);
        return;
      }

      const delayDebounce = setTimeout(async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          onSearch(data);
        } catch (error) {
          console.error("Search fetch error:", error);
        } finally {
          setLoading(false);
        }
      }, 300);

      return () => clearTimeout(delayDebounce);
    }, [query]);

    return (
      <input
        type="text"
        placeholder="Search opportunities, careers, decisions..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full max-w-xl border-b border-gray-300 bg-transparent py-3 focus:border-black outline-none transition text-lg"
      />
    );
  }
  ```

- [ ] **Step 3: Create Navbar Layout**
  Create: `src/components/layout/Navbar.tsx`
  Content:
  ```typescript
  import Link from "next/link";

  export default function Navbar() {
    return (
      <header className="sticky top-0 bg-background/80 backdrop-blur z-40 border-b border-gray-200 py-4 px-6 md:px-12 flex justify-between items-center transition">
        <Link href="/" className="font-sans text-xl font-bold tracking-tight">
          Kampus Filter
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/archive" className="hover:text-gray-500">Archive</Link>
          <Link href="/about" className="hover:text-gray-500">About</Link>
          <Link href="/" className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition">
            Join Free
          </Link>
        </nav>
      </header>
    );
  }
  ```

- [ ] **Step 4: Create Footer Layout**
  Create: `src/components/layout/Footer.tsx`
  Content:
  ```typescript
  import Link from "next/link";

  export default function Footer() {
    return (
      <footer className="border-t border-gray-200 py-8 px-6 md:px-12 text-center text-sm text-gray-500">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/archive" className="hover:underline">Archive</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Kampus Filter. All rights reserved.</p>
      </footer>
    );
  }
  ```

- [ ] **Step 5: Write the Archive Discovery Page**
  Create: `src/app/archive/page.tsx`
  Content:
  ```typescript
  "use client";

  import React, { useState } from "react";
  import SearchBar from "@/components/archive/SearchBar";
  import Link from "next/link";

  export default function ArchivePage() {
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = (results: any[]) => {
      setSearchResults(results);
      setSearched(results.length > 0);
    };

    return (
      <main className="min-h-screen max-w-5xl mx-auto px-6 py-12 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-sans font-bold">Archive</h1>
          <p className="text-gray-500">Explore past opportunities, articles, and updates.</p>
        </div>

        <SearchBar onSearch={handleSearch} setLoading={setLoading} />

        {loading ? (
          <div className="text-gray-500 text-sm">Searching index...</div>
        ) : searched && searchResults.length === 0 ? (
          <div className="text-gray-500 text-sm">No articles matched your criteria.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {searchResults.map((item: any) => (
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

- [ ] **Step 6: Commit changes**
  Run: `git add -A && git commit -m "feat: add nav footer archive layouts and groq search api"`

---

### Task 6: Premium Editorial Article Detail View

**Files:**
- Create: `src/components/article/PortableTextRenderer.tsx`
- Create: `src/components/article/TableOfContents.tsx`
- Create: `src/components/article/ReadingProgressBar.tsx`
- Create: `src/app/articles/[slug]/page.tsx`

**Interfaces:**
- Consumes: Sanity Article objects and Image utilities.
- Produces: Rich text PortableText rendering layer, dynamic active TOC scroll indicators, top viewport reading-width tracking bar.

- [ ] **Step 1: Write Portable Text Typography Renderer**
  Create: `src/components/article/PortableTextRenderer.tsx`
  Content:
  ```typescript
  import React from "react";
  import { PortableText } from "@portabletext/react";
  import { urlFor } from "@/lib/sanity/image";
  import Image from "next/image";

  const components = {
    block: {
      h2: ({ children }: any) => <h2 className="text-3xl font-bold mt-12 mb-4 tracking-tight" id={children.toString().toLowerCase().replace(/\s+/g, '-')}>{children}</h2>,
      h3: ({ children }: any) => <h3 className="text-2xl font-semibold mt-8 mb-3 tracking-tight">{children}</h3>,
      normal: ({ children }: any) => <p className="leading-relaxed mb-6 text-gray-800 dark:text-gray-200 text-lg">{children}</p>,
    },
    types: {
      image: ({ value }: any) => (
        <div className="relative my-8 aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || "Article graphic"}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
  };

  export default function PortableTextRenderer({ value }: { value: any }) {
    return <PortableText value={value} components={components} />;
  }
  ```

- [ ] **Step 2: Create Reading Progress Component**
  Create: `src/components/article/ReadingProgressBar.tsx`
  Content:
  ```typescript
  "use client";

  import React, { useEffect, useState } from "react";

  export default function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const handleScroll = () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          setProgress((window.scrollY / totalHeight) * 100);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
      <div className="fixed top-0 left-0 w-full h-[3px] bg-gray-200 z-50">
        <div
          className="h-full bg-blue-600 transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  }
  ```

- [ ] **Step 3: Create Table of Contents Sidebar Component**
  Create: `src/components/article/TableOfContents.tsx`
  Content:
  ```typescript
  "use client";

  import React, { useEffect, useState } from "react";

  interface TocItem {
    id: string;
    text: string;
  }

  export default function TableOfContents() {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState("");

    useEffect(() => {
      const elements = Array.from(document.querySelectorAll("h2")).map((elem) => ({
        id: elem.id,
        text: elem.textContent || "",
      }));
      setHeadings(elements);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: "0px 0px -60% 0px" }
      );

      document.querySelectorAll("h2").forEach((elem) => observer.observe(elem));
      return () => observer.disconnect();
    }, []);

    if (headings.length === 0) return null;

    return (
      <aside className="hidden lg:block fixed left-12 top-32 w-64 text-sm space-y-4">
        <p className="font-bold uppercase tracking-wider text-xs text-gray-400">On this page</p>
        <ul className="space-y-2 border-l border-gray-200 pl-4">
          {headings.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block transition hover:text-black ${
                  activeId === item.id ? "text-blue-600 font-medium" : "text-gray-500"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    );
  }
  ```

- [ ] **Step 4: Create Article Detail View Route**
  Create: `src/app/articles/[slug]/page.tsx`
  Content:
  ```typescript
  import React from "react";
  import { client } from "@/lib/sanity/client";
  import PortableTextRenderer from "@/components/article/PortableTextRenderer";
  import TableOfContents from "@/components/article/TableOfContents";
  import ReadingProgressBar from "@/components/article/ReadingProgressBar";
  import Link from "next/link";
  import Image from "next/image";
  import { urlFor } from "@/lib/sanity/image";

  export const revalidate = 60; // ISR validation cache window

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
        "category": category->title
      }`,
      { slug }
    );
  }

  export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const article = await getArticle(resolvedParams.slug);

    if (!article) return <div className="p-12 text-center">Article not found</div>;

    return (
      <main className="min-h-screen relative py-20 px-6">
        <ReadingProgressBar />
        <TableOfContents />

        <article className="max-w-[720px] mx-auto space-y-8 font-sans">
          <div className="space-y-4">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {article.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {article.title}
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">{article.excerpt}</p>

            <div className="flex items-center gap-4 py-4 border-y border-gray-100 text-sm text-gray-500">
              {article.author.image && (
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
                <p className="font-semibold text-black">{article.author.name}</p>
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

- [ ] **Step 5: Commit changes**
  Run: `git add -A && git commit -m "feat: implement article detail page with reading progress and TOC"`

---

### Task 7: Automatic Publishing Webhook

**Files:**
- Create: `src/app/api/webhook/route.ts`

**Interfaces:**
- Consumes: `@sanity/webhook` signature validation.
- Produces: FCM notification broadcasts to topic `news`.

- [ ] **Step 1: Write Sanity Webhook listener API route**
  Create: `src/app/api/webhook/route.ts`
  Content:
  ```typescript
  import { NextResponse } from "next/server";
  import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
  import { adminMessaging } from "@/lib/firebase/admin";

  const secret = process.env.SANITY_WEBHOOK_SECRET || "";

  export async function POST(request: Request) {
    try {
      const signature = request.headers.get(SIGNATURE_HEADER_NAME) || "";
      const rawBody = await request.text();

      // Validate webhook request signature
      const valid = await isValidSignature(rawBody, signature, secret);
      if (!valid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }

      const body = JSON.parse(rawBody);
      const { title, excerpt, slug, category } = body;

      // Publish FCM Broadcast Message to Topic "news"
      const payload = {
        notification: {
          title: `New in ${category}: ${title}`,
          body: excerpt || "Read the latest update on Kampus Filter.",
        },
        data: {
          url: `/articles/${slug}`,
        },
        topic: "news",
      };

      await adminMessaging.send(payload);

      return NextResponse.json({ success: true, message: "Broadcast sent successfully" });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  ```

- [ ] **Step 2: Commit changes**
  Run: `git add -A && git commit -m "feat: add automatic push publishing webhook route handler"`

---

### Task 8: Landing Page, Marketing Routes & SEO

**Files:**
- Create: `src/app/(marketing)/page.tsx`
- Create: `src/app/(marketing)/about/page.tsx`
- Create: `src/app/(marketing)/contact/page.tsx`
- Create: `src/app/(marketing)/privacy/page.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

**Interfaces:**
- Consumes: Firebase hooks and client-side triggers.
- Produces: Landing Page layout and SEO static assets mapping.

- [ ] **Step 1: Create conversion-focused landing page**
  Create: `src/app/(marketing)/page.tsx`
  Content:
  ```typescript
  "use client";

  import React, { useState } from "react";
  import NewsletterForm from "@/components/newsletter/NewsletterForm";
  import Link from "next/link";
  import { useFCM } from "@/hooks/useFCM";

  export default function HomePage() {
    const { registerPushNotifications } = useFCM();
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState("");
    const [notifStatus, setNotifStatus] = useState<"idle" | "requesting" | "success" | "failed">("idle");

    const handleSubscribeSuccess = async (subEmail: string) => {
      setEmail(subEmail);
      setSubscribed(true);
      setNotifStatus("requesting");

      const success = await registerPushNotifications(subEmail);
      if (success) {
        setNotifStatus("success");
      } else {
        setNotifStatus("failed");
      }
    };

    return (
      <main className="min-h-[80vh] flex flex-col justify-center items-center px-6 py-16 space-y-12">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none text-editorial-charcoal dark:text-editorial-lightgrey font-sans">
            Build Your Future in 5 Minutes a Day.
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-sans leading-relaxed">
            Discover opportunities, career intelligence, scholarships, internships, and education insights that help ambitious students make smarter decisions.
          </p>
        </div>

        {!subscribed ? (
          <NewsletterForm onSubscribeSuccess={handleSubscribeSuccess} />
        ) : (
          <div className="max-w-md p-8 border border-black text-center space-y-4">
            <h2 className="text-2xl font-bold">You're Joined!</h2>
            <p className="text-gray-600">
              Thank you for subscribing. We will send regular intelligence reports straight to your inbox.
            </p>
            {notifStatus === "requesting" && (
              <p className="text-sm text-gray-400">Requesting push notifications permission...</p>
            )}
            {notifStatus === "success" && (
              <p className="text-sm text-green-600">✓ Push notifications enabled successfully!</p>
            )}
            {notifStatus === "failed" && (
              <p className="text-sm text-amber-600">Push notifications could not be enabled, but your email subscription is active.</p>
            )}
          </div>
        )}

        <div className="pt-4">
          <Link href="/archive" className="text-gray-500 hover:text-black font-semibold flex items-center gap-1">
            Browse Archive &rarr;
          </Link>
        </div>
      </main>
    );
  }
  ```

- [ ] **Step 2: Create Sitemap Configuration**
  Create: `src/app/sitemap.ts`
  Content:
  ```typescript
  import { MetadataRoute } from "next";

  export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";
    return [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/archive`, lastModified: new Date() },
      { url: `${baseUrl}/about`, lastModified: new Date() },
    ];
  }
  ```

- [ ] **Step 3: Create Robots Configuration**
  Create: `src/app/robots.ts`
  Content:
  ```typescript
  import { MetadataRoute } from "next";

  export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";
    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: "/studio/",
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }
  ```

- [ ] **Step 4: Create about page**
  Create: `src/app/(marketing)/about/page.tsx`
  Content:
  ```typescript
  export default function AboutPage() {
    return (
      <main className="max-w-2xl mx-auto px-6 py-20 space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Our Mission</h1>
        <p className="text-lg leading-relaxed text-gray-700">
          Kampus Filter exists to help students make smarter decisions using curated intelligence instead of overwhelming information. We filter out the noise and deliver high-impact scholarships, career frameworks, and future-skills resources straight to you.
        </p>
      </main>
    );
  }
  ```

- [ ] **Step 5: Create contact page**
  Create: `src/app/(marketing)/contact/page.tsx`
  Content:
  ```typescript
  export default function ContactPage() {
    return (
      <main className="max-w-2xl mx-auto px-6 py-20 space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Contact Us</h1>
        <p className="text-gray-500">Reach out at contact@kampusfilter.com for partnerships, queries, or updates.</p>
      </main>
    );
  }
  ```

- [ ] **Step 6: Create privacy page**
  Create: `src/app/(marketing)/privacy/page.tsx`
  Content:
  ```typescript
  export default function PrivacyPage() {
    return (
      <main className="max-w-2xl mx-auto px-6 py-20 space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-gray-500">We respect your data privacy. Your contact details are stored securely on Firebase and are never sold or shared.</p>
      </main>
    );
  }
  ```

- [ ] **Step 7: Verify final builds**
  Run: `npm run build`
  Expected: Builds static pages and APIs successfully.

- [ ] **Step 8: Commit changes**
  Run: `git add -A && git commit -m "feat: complete marketing pages and seo files configurations"`

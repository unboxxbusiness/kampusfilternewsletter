# PWA App Installation Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a PWA installation link to the navbar and footer, enabling native installation prompts on supported devices/browsers and providing a clean instructions guide for iOS/Safari.

**Architecture:** A global React context provider (`InstallProvider`) manages installation state (tracking `beforeinstallprompt` event and standalone display mode check) and controls the instruction guide modal. Navbar and Footer links conditionally render and trigger the prompt.

**Tech Stack:** React, Next.js (App Router), Tailwind CSS, Lucide icons.

## Global Constraints
- Avoid hydration mismatch errors by performing environment and installation state checks inside `useEffect`.
- Ensure clean modal styles with Tailwind CSS backdrop blurring and subtle animations.

---

### Task 1: Create Global Install Provider Context
Create `InstallProvider` to track whether the app is installable/installed and wrap the application layout.

**Files:**
- Create: `src/providers/InstallProvider.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: Standard React Context
- Produces: `InstallProvider` wrapper and `useInstall` hook for install states and triggers

- [ ] **Step 1: Implement InstallProvider context and hook**
Create `src/providers/InstallProvider.tsx`:
```tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface InstallContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  showInstallGuide: boolean;
  setShowInstallGuide: (show: boolean) => void;
  triggerInstall: () => Promise<void>;
}

const InstallContext = createContext<InstallContextType | undefined>(undefined);

export function InstallProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    const checkIsInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      // @ts-ignore
      const isNavStandalone = window.navigator.standalone === true;
      setIsInstalled(isStandalone || isNavStandalone);
    };

    checkIsInstalled();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsInstalled(true);
      console.log("PWA was installed successfully");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Dynamic detection for iOS/Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // @ts-ignore
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    // @ts-ignore
    const isIOSStandalone = window.navigator.standalone === true;

    if (isIOS && isSafari && !isIOSStandalone) {
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const triggerInstall = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // @ts-ignore
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS && isSafari) {
      setShowInstallGuide(true);
      return;
    }

    if (!deferredPrompt) {
      setShowInstallGuide(true);
      return;
    }

    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    if (outcome === "accepted") {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    
    setDeferredPrompt(null);
  };

  return (
    <InstallContext.Provider
      value={{
        isInstallable,
        isInstalled,
        showInstallGuide,
        setShowInstallGuide,
        triggerInstall,
      }}
    >
      {children}
    </InstallContext.Provider>
  );
}

export function useInstall() {
  const context = useContext(InstallContext);
  if (context === undefined) {
    throw new Error("useInstall must be used within an InstallProvider");
  }
  return context;
}
```

- [ ] **Step 2: Add InstallProvider to layout**
Modify `src/app/layout.tsx` to wrap contents with `InstallProvider`:
```tsx
import { InstallProvider } from "@/providers/InstallProvider";
// ... (existing imports)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col justify-between">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <InstallProvider>
            <ServiceWorkerRegister />
            <ConditionalLayout>{children}</ConditionalLayout>
          </InstallProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify TypeScript Compilation**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: Commit Context Setup**
```bash
git add src/providers/InstallProvider.tsx src/app/layout.tsx
git commit -m "feat: add InstallProvider context and hook for PWA installation"
```

---

### Task 2: Create Install Guide Modal Component
Build a modern modal component that displays instructions for iOS Safari and other browsers.

**Files:**
- Create: `src/components/common/InstallGuideModal.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `useInstall` state
- Produces: Visual modal dialog overlay

- [ ] **Step 1: Implement InstallGuideModal component**
Create `src/components/common/InstallGuideModal.tsx`:
```tsx
"use client";

import React from "react";
import { X, Share, PlusSquare, Download } from "lucide-react";
import { useInstall } from "@/providers/InstallProvider";

export default function InstallGuideModal() {
  const { showInstallGuide, setShowInstallGuide } = useInstall();

  if (!showInstallGuide) return null;

  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0c1220] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 transition-all">
        
        <button
          onClick={() => setShowInstallGuide(false)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#fca311]/10 p-2.5 rounded-xl text-[#fca311]">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Install Kampus Filter</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Add to your home screen for quick offline access.</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
          {isIOS ? (
            <div className="space-y-3">
              <p className="font-medium text-neutral-800 dark:text-neutral-200">To install on iOS/Safari:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Tap the <span className="inline-flex items-center gap-1 font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700"><Share className="w-3.5 h-3.5" /> Share</span> button in Safari.
                </li>
                <li>
                  Scroll down the sharing menu and select <span className="inline-flex items-center gap-1 font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700"><PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen</span>.
                </li>
                <li>
                  Tap <span className="font-bold text-[#fca311]">Add</span> in the top-right corner to complete the installation.
                </li>
              </ol>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-medium text-neutral-800 dark:text-neutral-200">How to install standard version:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Look for the <span className="font-semibold text-neutral-900 dark:text-white">Install Icon</span> in your browser's address bar (usually on the right side).
                </li>
                <li>
                  Or open your browser menu (three dots <span className="font-bold">···</span> or <span className="font-bold">⋮</span>) and select <span className="font-semibold text-neutral-900 dark:text-white">"Install app"</span> or <span className="font-semibold text-neutral-900 dark:text-white">"Add to Home screen"</span>.
                </li>
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowInstallGuide(false)}
          className="mt-6 w-full bg-[#fca311] text-[#000000] hover:bg-[#e6930f] py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition duration-200"
        >
          Got it
        </button>

      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add modal component to main layout file**
Modify `src/app/layout.tsx` to render the `<InstallGuideModal />`:
```tsx
import { InstallProvider } from "@/providers/InstallProvider";
import InstallGuideModal from "@/components/common/InstallGuideModal";
// ... other imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col justify-between">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <InstallProvider>
            <ServiceWorkerRegister />
            <ConditionalLayout>{children}</ConditionalLayout>
            <InstallGuideModal />
          </InstallProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify build**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: Commit Modal component**
```bash
git add src/components/common/InstallGuideModal.tsx src/app/layout.tsx
git commit -m "feat: add InstallGuideModal component for manual installation guide"
```

---

### Task 3: Integrate Install Triggers into Navbar & Footer
Add installation links to Navbar (desktop navigation and mobile action header) and Footer.

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `useInstall` states and `triggerInstall` function

- [ ] **Step 1: Integrate install links into Navbar**
Convert `src/components/layout/Navbar.tsx` to a client component and integrate the install buttons:
```tsx
"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";
import NavbarLogo from "@/components/layout/NavbarLogo";
import { useInstall } from "@/providers/InstallProvider";

export default function Navbar() {
  const { isInstallable, isInstalled, triggerInstall } = useInstall();

  return (
    <header className="sticky top-0 bg-[#ffffff]/90 dark:bg-[#000000]/90 backdrop-blur-md z-40 border-b border-[#e5e5e5] dark:border-[#14213d] py-3 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
      <NavbarLogo />

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link href="/archive" className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 hover:text-[#14213d] dark:hover:text-[#ffffff] transition font-medium">
          Archive
        </Link>
        <Link href="/finder" className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 hover:text-[#14213d] dark:hover:text-[#ffffff] transition font-medium">
          Opportunity
        </Link>
        <Link href="/about" className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 hover:text-[#14213d] dark:hover:text-[#ffffff] transition font-medium">
          About
        </Link>
        {isInstallable && !isInstalled && (
          <button
            onClick={triggerInstall}
            className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 hover:text-[#14213d] dark:hover:text-[#ffffff] transition font-medium text-left"
          >
            Install App
          </button>
        )}
        <ThemeToggle />
        <Link
          href="/"
          className="bg-[#fca311] text-[#000000] px-4 py-2 hover:bg-[#e6930f] transition-all duration-200 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm"
        >
          Join Free
        </Link>
      </nav>

      {/* Mobile Top Actions */}
      <div className="flex md:hidden items-center gap-3">
        {isInstallable && !isInstalled && (
          <button
            onClick={triggerInstall}
            className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 hover:text-[#14213d] dark:hover:text-[#ffffff] p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            title="Install App"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
        <ThemeToggle />
        <Link
          href="/"
          className="bg-[#fca311] text-[#000000] px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase hover:bg-[#e6930f] transition-all duration-200"
        >
          Join Free
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Integrate install link into Footer**
Convert `src/components/layout/Footer.tsx` to a client component and add the install link:
```tsx
"use client";

import Link from "next/link";
import { useInstall } from "@/providers/InstallProvider";

export default function Footer() {
  const { isInstallable, isInstalled, triggerInstall } = useInstall();

  return (
    <footer className="border-t border-[#e5e5e5] dark:border-[#14213d] py-8 px-6 md:px-12 text-center text-sm text-[#14213d]/60 dark:text-[#e5e5e5]/60 transition-colors">
      <div className="flex justify-center gap-6 mb-4 flex-wrap">
        <Link href="/archive" className="hover:text-[#fca311] transition-colors hover:underline">Archive</Link>
        <Link href="/about" className="hover:text-[#fca311] transition-colors hover:underline">About</Link>
        {isInstallable && !isInstalled && (
          <button onClick={triggerInstall} className="hover:text-[#fca311] transition-colors hover:underline">
            Install App
          </button>
        )}
        <Link href="/terms" className="hover:text-[#fca311] transition-colors hover:underline">Terms</Link>
        <Link href="/privacy" className="hover:text-[#fca311] transition-colors hover:underline">Privacy</Link>
        <Link href="/contact" className="hover:text-[#fca311] transition-colors hover:underline">Contact</Link>
      </div>
      <p>&copy; {new Date().getFullYear()} Kampus Filter. All rights reserved.</p>
    </footer>
  );
}
```

- [ ] **Step 3: Run final linting and compilation builds**
Run: `npm run lint` and `npm run build`
Expected: Both PASS successfully

- [ ] **Step 4: Commit integrated components**
```bash
git add src/components/layout/Navbar.tsx src/components/layout/Footer.tsx
git commit -m "feat: integrate app installation links into Navbar and Footer"
```

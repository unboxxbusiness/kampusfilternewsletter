"use client";

import React, { useState } from "react";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import ThemeToggle from "@/components/common/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { useFCM } from "@/hooks/useFCM";
import NavbarLogo from "@/components/layout/NavbarLogo";
import { User, Download } from "lucide-react";
import { useInstall } from "@/providers/InstallProvider";


const STUDENT_AVATARS = [
  // 1. Male with curly hair and glasses
  (
    <svg key="av1" viewBox="0 0 36 36" fill="none" className="w-8 h-8 rounded-full border-2 border-[#ffffff] dark:border-[#000000] shadow-sm relative z-50">
      <defs>
        <linearGradient id="avatarGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fca311" />
          <stop offset="100%" stopColor="#e6930f" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="18" fill="url(#avatarGrad1)" />
      <path d="M7 32c0-5 5-8 11-8s11 3 11 8" fill="#14213d" />
      <circle cx="18" cy="17" r="7" fill="#ffd1ac" />
      <path d="M12 14c-1-2 0-5 3-6s5 0 6 2 2-3 4-2 3 3 2 5" fill="#4a3728" />
      <rect x="13" y="15" width="4" height="3" rx="1.5" stroke="#000" strokeWidth="0.8" />
      <rect x="19" y="15" width="4" height="3" rx="1.5" stroke="#000" strokeWidth="0.8" />
      <line x1="17" y1="16.5" x2="19" y2="16.5" stroke="#000" strokeWidth="0.8" />
      <path d="M16 21a2 2 0 004 0" stroke="#000" strokeWidth="0.8" fill="none" />
    </svg>
  ),
  // 2. Female with long brown hair
  (
    <svg key="av2" viewBox="0 0 36 36" fill="none" className="w-8 h-8 rounded-full border-2 border-[#ffffff] dark:border-[#000000] shadow-sm relative z-40">
      <defs>
        <linearGradient id="avatarGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="18" fill="url(#avatarGrad2)" />
      <path d="M10 16c-2 4-1 12-1 12h18s1-8-1-12" fill="#653818" />
      <path d="M8 32c0-4 4-7 10-7s10 3 10 7" fill="#e11d48" />
      <circle cx="18" cy="17" r="7" fill="#fcd5b5" />
      <path d="M11 15c1-4 4-6 7-6s6 2 7 6c0-2-3-4-7-4s-7 2-7 4z" fill="#653818" />
      <path d="M22 13c3 1 3 6 3 6s-1-4-3-6z" fill="#653818" />
      <circle cx="15.5" cy="16.5" r="0.8" fill="#000" />
      <circle cx="20.5" cy="16.5" r="0.8" fill="#000" />
      <path d="M16 20.5c.8.5 1.6.5 2.4 0" stroke="#000" strokeWidth="0.8" strokeLinecap="round" fill="none" />
    </svg>
  ),
  // 3. Male with cap
  (
    <svg key="av3" viewBox="0 0 36 36" fill="none" className="w-8 h-8 rounded-full border-2 border-[#ffffff] dark:border-[#000000] shadow-sm relative z-30">
      <defs>
        <linearGradient id="avatarGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="18" fill="url(#avatarGrad3)" />
      <path d="M7 32c0-5 5-8 11-8s11 3 11 8" fill="#4b5563" />
      <circle cx="18" cy="17" r="7" fill="#e0a98c" />
      <circle cx="15.5" cy="17" r="0.8" fill="#000" />
      <circle cx="20.5" cy="17" r="0.8" fill="#000" />
      <path d="M16 20.5a2 2 0 004 0" stroke="#000" strokeWidth="0.8" fill="none" />
      <path d="M11 14a7 7 0 0114 0H11z" fill="#d97706" />
      <path d="M17 10h8v2h-8z" fill="#fbbf24" />
    </svg>
  ),
  // 4. Female with glasses and bun
  (
    <svg key="av4" viewBox="0 0 36 36" fill="none" className="w-8 h-8 rounded-full border-2 border-[#ffffff] dark:border-[#000000] shadow-sm relative z-20">
      <defs>
        <linearGradient id="avatarGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#be185d" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="18" fill="url(#avatarGrad4)" />
      <circle cx="18" cy="7" r="4.5" fill="#1f2937" />
      <path d="M8 32c0-4 4-7 10-7s10 3 10 7" fill="#059669" />
      <circle cx="18" cy="17" r="7" fill="#a16207" />
      <path d="M11 15c0-4 3-6 7-6s7 2 7 6v2h-14v-2z" fill="#1f2937" />
      <circle cx="15.5" cy="16.5" r="2.2" stroke="#fff" strokeWidth="0.8" />
      <circle cx="20.5" cy="16.5" r="2.2" stroke="#fff" strokeWidth="0.8" />
      <line x1="17.7" y1="16.5" x2="18.3" y2="16.5" stroke="#fff" strokeWidth="0.8" />
      <path d="M16 21c.5.5 1.5.5 2 0" stroke="#000" strokeWidth="0.8" strokeLinecap="round" fill="none" />
    </svg>
  ),
  // 5. Male with blonde hair
  (
    <svg key="av5" viewBox="0 0 36 36" fill="none" className="w-8 h-8 rounded-full border-2 border-[#ffffff] dark:border-[#000000] shadow-sm relative z-10">
      <defs>
        <linearGradient id="avatarGrad5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="18" fill="url(#avatarGrad5)" />
      <path d="M7 32c0-5 5-8 11-8s11 3 11 8" fill="#d97706" />
      <circle cx="18" cy="17" r="7" fill="#ffd1ac" />
      <path d="M11 14c1-3 4-5 7-5s6 2 7 5c0 0-2-2-4-2s-4 1-5 2-3 0-5 0z" fill="#f59e0b" />
      <circle cx="15.5" cy="16.5" r="0.8" fill="#000" />
      <circle cx="20.5" cy="16.5" r="0.8" fill="#000" />
      <path d="M15.5 20.5s1 1 2.5 0" stroke="#000" strokeWidth="0.8" strokeLinecap="round" fill="none" />
    </svg>
  )
];

// Vector SVG logo definitions
interface GridLogo {
  name: string;
  short: string;
  category: "Worldwide" | "Indian Private" | "Company";
  color: string;
  svg: React.ReactNode;
}

const COLLAGE_ITEMS: GridLogo[] = [
  // 1. Worldwide popular
  {
    name: "Stanford University",
    short: "Stanford",
    category: "Worldwide",
    color: "hover:text-[#8C1515] dark:hover:text-[#FF4D4D]",
    svg: (
      <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 5.5l-3 6.5h6z M12 12v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 16c0-2.5 3-4.5 3-4.5s3 2 3 4.5" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    )
  },
  {
    name: "Harvard University",
    short: "Harvard",
    category: "Worldwide",
    color: "hover:text-[#A51C30] dark:hover:text-[#FF4E64]",
    svg: (
      <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
        <path d="M6 4h12v11c0 3.3-2.7 6-6 6s-6-2.7-6-6V4z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 9h6v3H9z M9 13h6v2.5H9z" fill="none" stroke="currentColor" strokeWidth="1" />
        <text x="12" y="7.8" textAnchor="middle" fontSize="4" fontWeight="bold" fontFamily="serif" fill="currentColor">VE RI TAS</text>
      </svg>
    )
  },
  {
    name: "Massachusetts Institute of Technology",
    short: "MIT",
    category: "Worldwide",
    color: "hover:text-[#A31F34] dark:hover:text-[#FF4E64]",
    svg: (
      <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
        <rect x="5" y="5" width="3" height="14" fill="currentColor" />
        <rect x="10" y="5" width="3" height="9" fill="currentColor" />
        <rect x="15" y="5" width="4" height="14" fill="currentColor" />
        <line x1="10" y1="19" x2="13" y2="19" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  },

  // 2. Top Indian Private
  {
    name: "BITS Pilani",
    short: "BITS Pilani",
    category: "Indian Private",
    color: "hover:text-[#003366] dark:hover:text-[#3399FF]",
    svg: (
      <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <text x="12" y="14.5" textAnchor="middle" fontSize="6.5" fontWeight="extrabold" fontFamily="sans-serif" fill="currentColor">BITS</text>
      </svg>
    )
  },
  {
    name: "Vellore Institute of Technology",
    short: "VIT",
    category: "Indian Private",
    color: "hover:text-[#0055A5] dark:hover:text-[#3399FF]",
    svg: (
      <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
        <path d="M4 6h4l2 8 2-8h4 M4 18h16" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <text x="12" y="16.5" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="currentColor">VIT</text>
      </svg>
    )
  },
  {
    name: "Ashoka University",
    short: "Ashoka",
    category: "Indian Private",
    color: "hover:text-[#6A1B29] dark:hover:text-[#FF5C75]",
    svg: (
      <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1"/>
        <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6" stroke="currentColor" strokeWidth="0.8"/>
      </svg>
    )
  },

  // 3. Top Companies
  {
    name: "Google",
    short: "Google",
    category: "Company",
    color: "hover:text-[#4285F4]",
    svg: (
      <svg className="w-11 h-11" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
      </svg>
    )
  },
  {
    name: "Microsoft",
    short: "Microsoft",
    category: "Company",
    color: "hover:text-[#F25022]",
    svg: (
      <svg className="w-10 h-10" viewBox="0 0 23 23">
        <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
        <rect x="12" y="1" width="10" height="10" fill="#7FBA00"/>
        <rect x="1" y="12" width="10" height="10" fill="#00A4EF"/>
        <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
      </svg>
    )
  },
  {
    name: "Apple",
    short: "Apple",
    category: "Company",
    color: "hover:text-black dark:hover:text-white",
    svg: (
      <svg className="w-11 h-11 fill-current" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.84-.98 2.94 1.07.08 2.15-.52 2.81-1.33z" fill="currentColor"/>
      </svg>
    )
  }
];

interface HomePageClientProps {
  siteName: string;
  heroTitle: string;
  heroDescription: string;
  categories?: string[];
}

export default function HomePageClient({
  siteName,
  heroTitle,
  heroDescription,
  categories
}: HomePageClientProps) {
  const { isInstalled, triggerInstall } = useInstall();
  const { registerPushNotifications } = useFCM();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [notifStatus, setNotifStatus] = useState<"idle" | "requesting" | "success" | "failed">("idle");

  const handleSubscribeSuccess = async (subEmail: string, enableNotifications: boolean) => {
    setEmail(subEmail);
    setSubscribed(true);

    if (enableNotifications) {
      setNotifStatus("requesting");
      const success = await registerPushNotifications(subEmail);
      if (success) {
        setNotifStatus("success");
      } else {
        setNotifStatus("failed");
      }
    } else {
      setNotifStatus("idle");
    }
  };

  return (
    <main className="min-h-screen bg-[#ffffff] dark:bg-[#000000] text-[#14213d] dark:text-[#e5e5e5] flex flex-col justify-between relative overflow-hidden transition-colors duration-300">
      
      {/* Sticky Navigation Header */}
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center py-4 px-6 md:px-16 border-b border-[#e5e5e5] dark:border-[#14213d] z-20">
        <NavbarLogo />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <Link href="/archive" className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 hover:text-[#14213d] dark:hover:text-[#ffffff] transition font-medium">Archive</Link>
          <Link href="/about" className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 hover:text-[#14213d] dark:hover:text-[#ffffff] transition font-medium">About</Link>
          {!isInstalled && (
            <button
              onClick={triggerInstall}
              className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 hover:text-[#14213d] dark:hover:text-[#ffffff] transition font-medium text-left font-semibold"
            >
              Install App
            </button>
          )}
          <ThemeToggle />
          <Link href="/" className="bg-[#fca311] text-[#000000] px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase hover:bg-[#e6930f] transition-all duration-200 shadow-sm">
            Join Free
          </Link>
        </nav>

        {/* Mobile Top Actions */}
        <div className="flex md:hidden items-center gap-3">
          {!isInstalled && (
            <button
              onClick={triggerInstall}
              className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 hover:text-[#14213d] dark:hover:text-[#ffffff] p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors animate-pulse"
              title="Install App"
            >
              <Download className="w-4 h-4 text-[#fca311]" />
            </button>
          )}
          <ThemeToggle />
          <Link href="/" className="bg-[#fca311] text-[#000000] px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase hover:bg-[#e6930f] transition-all duration-200">
            Join Free
          </Link>
        </div>
      </header>

      {/* Hero & Visual Split Content Grid */}
      <div className="flex-grow max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between z-10 px-6 md:px-16 py-12 md:py-20 gap-16">
        
        {/* Left Column (Hero Content & Subscription Form) */}
        <div className="w-full lg:w-[55%] space-y-8 flex flex-col justify-center">
          
          {/* Product Hunt Style Badge */}
          <div className="self-start">
            <div className="inline-flex items-center gap-2 bg-[#fca311]/10 border border-[#fca311]/30 rounded-full px-3 py-1.5 text-[11px] font-bold text-[#14213d] dark:text-[#fca311] shadow-sm">
              <span>🏆</span>
              <span>STUDENT INTELLIGENCE #1 PRODUCT OF THE MONTH</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {heroTitle || "Build Your Future in 5 Minutes a Day."}
            </h1>
            <p className="text-base md:text-lg text-[#14213d]/60 dark:text-[#e5e5e5]/60 leading-relaxed">
              {heroDescription || "Discover opportunities, career intelligence, scholarships, internships, and education insights that help ambitious students make smarter decisions."}
            </p>
          </div>

          {/* Subscription Input Box */}
          {!subscribed ? (
            <NewsletterForm onSubscribeSuccess={handleSubscribeSuccess} categories={categories} />
          ) : (
            <div className="p-8 border border-[#fca311]/30 bg-[#fca311]/5 dark:bg-[#14213d] rounded-lg text-center space-y-4 max-w-md shadow-sm">
              <h2 className="text-2xl font-bold text-[#14213d] dark:text-[#ffffff]">You're Joined! 🎉</h2>
              <p className="text-[#14213d]/60 dark:text-[#e5e5e5]/60 text-sm">
                Thank you for subscribing. We will send regular intelligence reports straight to your inbox.
              </p>
              {notifStatus === "requesting" && (
                <p className="text-xs text-[#14213d]/50 dark:text-[#e5e5e5]/50 animate-pulse">Requesting push notifications permission...</p>
              )}
              {notifStatus === "success" && (
                <p className="text-xs text-green-600 dark:text-green-500">✓ Push notifications enabled successfully!</p>
              )}
              {notifStatus === "failed" && (
                <p className="text-xs text-[#fca311]">Push notifications could not be enabled, but your email subscription is active.</p>
              )}
            </div>
          )}

          {/* Social proof avatars count */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6 border-t border-[#e5e5e5] dark:border-[#14213d] max-w-md">
            <div className="flex -space-x-2.5">
              {STUDENT_AVATARS}
            </div>
            <p className="text-xs text-[#14213d]/60 dark:text-[#e5e5e5]/60 leading-relaxed">
              Join <span className="text-[#14213d] dark:text-[#ffffff] font-semibold">12,482+ ambitious students</span> from top global institutions.
            </p>
          </div>

          {/* Secondary CTA */}
          <div className="pt-2">
            <Link href="/archive" className="inline-flex items-center gap-1 text-[#fca311] hover:text-[#e6930f] font-semibold text-lg group transition-all duration-200">
              Browse Archive 
              <span className="transform group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Right Column (University & Companies Collages) */}
        <div className="w-full lg:w-[45%] bg-[#e5e5e5]/30 dark:bg-[#14213d]/20 border border-[#e5e5e5] dark:border-[#14213d] p-4 rounded-[2rem] shadow-inner self-center">
          <div className="grid grid-cols-3 gap-4">
            {COLLAGE_ITEMS.map((item, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col items-center justify-between p-5 bg-gradient-to-b from-[#ffffff] to-[#e5e5e5]/30 dark:from-[#14213d] dark:to-[#000000] border border-[#e5e5e5] dark:border-[#14213d]/60 rounded-[1.5rem] hover:scale-[1.03] hover:border-[#fca311]/40 dark:hover:border-[#fca311]/40 hover:shadow-lg text-[#14213d]/40 dark:text-[#e5e5e5]/40 transition-all duration-300 group aspect-[3/4] ${item.color}`}
              >
                <div className="flex-grow flex items-center justify-center transition-all duration-300 grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 w-full">
                  {item.svg}
                </div>
                <span className="text-[9px] md:text-[10px] font-bold tracking-widest text-[#14213d]/40 dark:text-[#e5e5e5]/40 group-hover:text-[#14213d] dark:group-hover:text-[#e5e5e5] transition-colors duration-300 uppercase text-center mt-3 leading-none truncate w-full">
                  {item.short}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-[#e5e5e5] dark:border-[#14213d] py-8 px-6 md:px-16 text-center text-xs text-[#14213d]/50 dark:text-[#e5e5e5]/50 z-20">
        <div className="flex justify-center gap-6 mb-4 font-medium flex-wrap">
          <Link href="/archive" className="hover:text-[#fca311] transition-colors duration-200">Archive</Link>
          <Link href="/about" className="hover:text-[#fca311] transition-colors duration-200">About</Link>
          {!isInstalled && (
            <button onClick={triggerInstall} className="hover:text-[#fca311] transition-colors duration-200 hover:underline">
              Install App
            </button>
          )}
          <Link href="/terms" className="hover:text-[#fca311] transition-colors duration-200">Terms</Link>
          <Link href="/privacy" className="hover:text-[#fca311] transition-colors duration-200">Privacy</Link>
          <Link href="/contact" className="hover:text-[#fca311] transition-colors duration-200">Contact</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} {siteName || "Kampus Filter"}. All rights reserved.</p>
      </footer>
    </main>
  );
}

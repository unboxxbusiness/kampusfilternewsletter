"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Compass, Info } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: (path: string) => path === "/",
    },
    {
      label: "Opportunity",
      href: "/finder",
      icon: Compass,
      isActive: (path: string) => path.startsWith("/finder"),
    },
    {
      label: "Archive",
      href: "/archive",
      icon: Search,
      isActive: (path: string) => path.startsWith("/archive"),
    },
    {
      label: "About",
      href: "/about",
      icon: Info,
      isActive: (path: string) => path.startsWith("/about"),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/95 dark:bg-[#000000]/95 backdrop-blur-lg border-t border-[#e5e5e5] dark:border-[#14213d] md:hidden transition-colors duration-300"
      style={{
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        paddingTop: "8px",
      }}
      aria-label="Mobile Navigation"
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive(pathname || "");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 gap-1 text-center py-1 transition-all duration-200 ${
                active
                  ? "text-[#fca311] font-semibold"
                  : "text-[#14213d]/50 dark:text-[#e5e5e5]/50 hover:text-[#14213d] dark:hover:text-[#ffffff]"
              }`}
            >
              <Icon className={`w-5 h-5 transition-all duration-200 ${active ? "scale-110 drop-shadow-[0_0_6px_#fca311]" : ""}`} />
              <span className="text-[10px] tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

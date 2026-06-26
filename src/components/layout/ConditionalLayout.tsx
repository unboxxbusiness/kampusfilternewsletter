"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");
  const isHome = pathname === "/";

  // Hide global elements on Sanity Studio
  if (isStudio) {
    return <div className="min-h-screen w-full flex flex-col">{children}</div>;
  }

  // Homepage: render custom landing page layout but include MobileBottomNav for unified app feel
  if (isHome) {
    return (
      <div className="min-h-screen w-full flex flex-col pb-[72px] md:pb-0">
        {children}
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col pb-[72px] md:pb-0">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <MobileBottomNav />
      <Footer />
    </div>
  );
}

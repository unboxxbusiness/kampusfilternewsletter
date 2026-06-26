"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

const LOGO_LIGHT =
  "https://res.cloudinary.com/dhrigocvd/image/upload/v1770054378/logo_Kampus_Filter_cb5ari.webp";
const LOGO_DARK =
  "https://res.cloudinary.com/dhrigocvd/image/upload/v1770054375/dark_bg_kampus_filter_go0qg5.png";

interface NavbarLogoProps {
  className?: string;
}

export default function NavbarLogo({ className = "h-8 w-auto object-contain" }: NavbarLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only read theme client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // While not yet mounted (SSR), render a transparent placeholder with the
  // same dimensions so the layout doesn't shift once mounted.
  if (!mounted) {
    return (
      <Link href="/" className="flex items-center" aria-label="Kampus Filter Home">
        <div className="h-8 w-[140px] bg-transparent" aria-hidden="true" />
      </Link>
    );
  }

  const logoSrc = resolvedTheme === "dark" ? LOGO_DARK : LOGO_LIGHT;

  return (
    <Link href="/" className="flex items-center" aria-label="Kampus Filter Home">
      <Image
        src={logoSrc}
        alt="Kampus Filter"
        width={140}
        height={36}
        className={className}
        priority
      />
    </Link>
  );
}

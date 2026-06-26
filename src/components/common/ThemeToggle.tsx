"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#e5e5e5] dark:bg-[#14213d] border border-[#e5e5e5] dark:border-[#14213d]" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-lg border border-[#e5e5e5] dark:border-[#14213d] hover:bg-[#e5e5e5] dark:hover:bg-[#14213d] hover:border-[#fca311] dark:hover:border-[#fca311] transition-all duration-200 flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-[#fca311]" />
      ) : (
        <Moon className="h-4 w-4 text-[#14213d]" />
      )}
    </button>
  );
}

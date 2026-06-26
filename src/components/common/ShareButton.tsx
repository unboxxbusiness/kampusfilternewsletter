"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  slug: string;
  title: string;
}

export default function ShareButton({ slug, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const baseUrl = window.location.origin;
    const url = `${baseUrl}/articles/${slug}`;

    // Try native Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share was cancelled/failed
        console.log("Native share cancelled or failed, falling back to clipboard copy.");
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 text-[#14213d]/50 dark:text-[#e5e5e5]/50 hover:text-[#fca311] dark:hover:text-[#fca311] transition-all duration-200 p-1.5 rounded-full hover:bg-[#e5e5e5]/40 dark:hover:bg-[#14213d]/40"
      title={copied ? "Link Copied!" : "Share Article"}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-[#fca311] animate-scale-in" />
          <span className="text-[10px] font-bold text-[#fca311]">Copied!</span>
        </>
      ) : (
        <Share2 className="h-4 w-4" />
      )}
    </button>
  );
}

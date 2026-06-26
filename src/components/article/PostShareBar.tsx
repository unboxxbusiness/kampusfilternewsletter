"use client";

import React, { useState, useEffect } from "react";
import { Linkedin, Link2, Check } from "lucide-react";

interface PostShareBarProps {
  slug: string;
  title: string;
}

export default function PostShareBar({ slug, title }: PostShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(`${window.location.origin}/articles/${slug}`);
  }, [slug]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + shareUrl)}`;

  const btnClass = "flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border border-[#e5e5e5] dark:border-[#14213d] text-[#14213d] dark:text-[#e5e5e5] hover:bg-[#fca311] hover:text-[#000000] hover:border-[#fca311] transition-all duration-200";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-y border-[#e5e5e5] dark:border-[#14213d] my-12">
      <span className="text-xs font-bold text-[#14213d]/50 dark:text-[#e5e5e5]/50 uppercase tracking-widest">Share this article</span>
      
      <div className="flex flex-wrap gap-2">
        {/* Twitter / X Button */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
          title="Share on X"
        >
          <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Share</span>
        </a>

        {/* LinkedIn Button */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
          title="Share on LinkedIn"
        >
          <Linkedin className="h-3.5 w-3.5" />
          <span>Post</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
          title="Share on WhatsApp"
        >
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.48 4.805 1.481 5.482 0 9.94-4.461 9.943-9.94.002-2.654-1.03-5.15-2.903-7.026C16.621 1.8 14.12 1.155 11.47 1.153 5.986 1.153 1.53 5.61 1.527 11.09c0 1.745.474 3.447 1.373 4.968L1.93 20.354l4.717-1.2z" />
          </svg>
          <span>Send</span>
        </a>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className={btnClass}
          title="Copy Article URL"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400 animate-scale-in" />
              <span className="text-green-600 dark:text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="h-3.5 w-3.5" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

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
    const elements = Array.from(document.querySelectorAll("article h2[id]")).map((elem) => ({
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

    document.querySelectorAll("article h2[id]").forEach((elem) => observer.observe(elem));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden lg:block sticky top-32 w-64 text-sm space-y-4 self-start">
      <p className="font-bold uppercase tracking-wider text-xs text-[#14213d]/50 dark:text-[#e5e5e5]/50">On this page</p>
      <ul className="space-y-2 border-l border-[#e5e5e5] dark:border-[#14213d] pl-4">
        {headings.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block transition hover:text-[#14213d] dark:hover:text-[#ffffff] ${
                activeId === item.id ? "text-[#fca311] font-medium" : "text-[#14213d]/60 dark:text-[#e5e5e5]/60"
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

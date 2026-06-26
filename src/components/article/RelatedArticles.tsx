import React from "react";
import Link from "next/link";

interface RelatedArticlesProps {
  articles: any[];
  categoryTitle: string;
  isBackfilled: boolean;
}

export default function RelatedArticles({ articles, categoryTitle, isBackfilled }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="space-y-6 my-12 pt-8 border-t border-[#e5e5e5] dark:border-[#14213d]">
      <h3 className="text-sm font-bold text-[#14213d]/60 dark:text-[#e5e5e5]/60 uppercase tracking-widest">
        {isBackfilled ? "Recommended Articles" : `More in ${categoryTitle}`}
      </h3>
      <ul className="space-y-4">
        {articles.map((item) => (
          <li key={item.slug.current} className="group">
            <Link href={`/articles/${item.slug.current}`} className="block">
              <span className="text-lg font-semibold text-[#14213d] dark:text-[#e5e5e5] group-hover:underline group-hover:text-[#fca311] transition-colors">
                {item.title}
              </span>
              <span className="block text-xs text-[#14213d]/40 dark:text-[#e5e5e5]/40 mt-1">
                {new Date(item.publishedAt).toLocaleDateString()} &bull; {item.readingTime} min read
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

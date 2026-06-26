import React from "react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  currentSearchParams: { [key: string]: string | undefined };
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  currentSearchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    Object.entries(currentSearchParams).forEach(([key, val]) => {
      if (val && key !== "page") params.set(key, val);
    });
    params.set("page", pageNumber.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-between border-t border-[#e5e5e5] dark:border-[#14213d] pt-6 my-10" aria-label="Pagination">
      <div className="flex flex-1 justify-between sm:hidden">
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="relative inline-flex items-center rounded-full border border-[#e5e5e5] dark:border-[#14213d] px-4 py-2 text-xs font-semibold hover:bg-[#e5e5e5]/20 dark:hover:bg-[#14213d]/50 text-[#14213d]/80 dark:text-[#e5e5e5]/80 transition-colors"
          >
            Previous
          </Link>
        ) : (
          <span className="relative inline-flex items-center rounded-full border border-[#e5e5e5]/50 dark:border-[#14213d]/50 px-4 py-2 text-xs font-semibold text-[#14213d]/30 dark:text-[#e5e5e5]/30 cursor-not-allowed">
            Previous
          </span>
        )}
        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="relative ml-3 inline-flex items-center rounded-full border border-[#e5e5e5] dark:border-[#14213d] px-4 py-2 text-xs font-semibold hover:bg-[#e5e5e5]/20 dark:hover:bg-[#14213d]/50 text-[#14213d]/80 dark:text-[#e5e5e5]/80 transition-colors"
          >
            Next
          </Link>
        ) : (
          <span className="relative ml-3 inline-flex items-center rounded-full border border-[#e5e5e5]/50 dark:border-[#14213d]/50 px-4 py-2 text-xs font-semibold text-[#14213d]/30 dark:text-[#e5e5e5]/30 cursor-not-allowed">
            Next
          </span>
        )}
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-[#14213d]/60 dark:text-[#e5e5e5]/60">
            Page <span className="font-semibold text-[#14213d] dark:text-[#ffffff]">{currentPage}</span> of{" "}
            <span className="font-semibold text-[#14213d] dark:text-[#ffffff]">{totalPages}</span>
          </p>
        </div>
        <div>
          <span className="relative inline-flex gap-1.5">
            {currentPage > 1 ? (
              <Link
                href={createPageUrl(currentPage - 1)}
                className="relative inline-flex items-center rounded-full border border-[#e5e5e5] dark:border-[#14213d] px-3 py-1.5 text-xs font-semibold hover:bg-[#e5e5e5]/20 dark:hover:bg-[#14213d]/50 text-[#14213d]/80 dark:text-[#e5e5e5]/80 transition"
              >
                &larr; Prev
              </Link>
            ) : (
              <span className="relative inline-flex items-center rounded-full border border-[#e5e5e5]/50 dark:border-[#14213d]/50 px-3 py-1.5 text-xs font-semibold text-[#14213d]/30 dark:text-[#e5e5e5]/30 cursor-not-allowed">
                &larr; Prev
              </span>
            )}
            
            {pages.map((p) => {
              const isCurrent = p === currentPage;
              return isCurrent ? (
                <span
                  key={p}
                  className="relative z-10 inline-flex items-center rounded-full bg-[#fca311] text-[#000000] px-3.5 py-1.5 text-xs font-bold shadow-sm"
                >
                  {p}
                </span>
              ) : (
                <Link
                  key={p}
                  href={createPageUrl(p)}
                  className="relative inline-flex items-center rounded-full border border-[#e5e5e5] dark:border-[#14213d] px-3.5 py-1.5 text-xs font-semibold hover:bg-[#e5e5e5]/20 dark:hover:bg-[#14213d]/50 text-[#14213d]/80 dark:text-[#e5e5e5]/80 transition"
                >
                  {p}
                </Link>
              );
            })}

            {currentPage < totalPages ? (
              <Link
                href={createPageUrl(currentPage + 1)}
                className="relative inline-flex items-center rounded-full border border-[#e5e5e5] dark:border-[#14213d] px-3 py-1.5 text-xs font-semibold hover:bg-[#e5e5e5]/20 dark:hover:bg-[#14213d]/50 text-[#14213d]/80 dark:text-[#e5e5e5]/80 transition"
              >
                Next &rarr;
              </Link>
            ) : (
              <span className="relative inline-flex items-center rounded-full border border-[#e5e5e5]/50 dark:border-[#14213d]/50 px-3 py-1.5 text-xs font-semibold text-[#14213d]/30 dark:text-[#e5e5e5]/30 cursor-not-allowed">
                Next &rarr;
              </span>
            )}
          </span>
        </div>
      </div>
    </nav>
  );
}

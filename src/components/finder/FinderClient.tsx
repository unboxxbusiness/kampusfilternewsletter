"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OpportunityCard from "./OpportunityCard";
import Pagination from "@/components/navigation/Pagination";
import { SlidersHorizontal, X } from "lucide-react";

interface FinderClientProps {
  articles: any[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  currentFilters: {
    type?: string;
    education?: string;
    funding?: string;
    status?: string;
  };
}

export default function FinderClient({
  articles,
  totalPages,
  currentPage,
  totalCount,
  currentFilters,
}: FinderClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset pagination
    router.push(`/finder?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/finder");
  };

  const hasActiveFilters = Object.values(currentFilters).some(v => !!v);

  const renderFiltersList = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#14213d]/50 dark:text-[#e5e5e5]/50 mb-3">Opportunity Type</h4>
        <div className="flex flex-col gap-2">
          {[
            { label: "All Types", value: null },
            { label: "Scholarships", value: "scholarship" },
            { label: "Internships", value: "internship" },
            { label: "Fellowships", value: "fellowship" },
            { label: "Jobs", value: "job" },
          ].map(opt => (
            <button
              type="button"
              key={opt.value || "all"}
              onClick={() => updateFilter("type", opt.value)}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                (currentFilters.type === opt.value || (!currentFilters.type && opt.value === null))
                  ? "bg-[#fca311] text-[#000000] font-bold shadow-sm"
                  : "text-[#14213d]/80 dark:text-[#e5e5e5]/80 hover:bg-[#e5e5e5]/50 dark:hover:bg-[#14213d]/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#e5e5e5] dark:border-[#14213d] pt-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#14213d]/50 dark:text-[#e5e5e5]/50 mb-3">Education Level</h4>
        <div className="flex flex-col gap-2">
          {[
            { label: "All Levels", value: null },
            { label: "High School", value: "high-school" },
            { label: "Undergraduate", value: "undergraduate" },
            { label: "Postgraduate", value: "postgraduate" },
            { label: "Ph.D. / Research", value: "phd" },
          ].map(opt => (
            <button
              type="button"
              key={opt.value || "all"}
              onClick={() => updateFilter("education", opt.value)}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                (currentFilters.education === opt.value || (!currentFilters.education && opt.value === null))
                  ? "bg-[#fca311] text-[#000000] font-bold shadow-sm"
                  : "text-[#14213d]/80 dark:text-[#e5e5e5]/80 hover:bg-[#e5e5e5]/50 dark:hover:bg-[#14213d]/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#e5e5e5] dark:border-[#14213d] pt-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#14213d]/50 dark:text-[#e5e5e5]/50 mb-3">Funding</h4>
        <div className="flex flex-col gap-2">
          {[
            { label: "Any Funding", value: null },
            { label: "Fully Funded", value: "fully-funded" },
            { label: "Partially Funded", value: "partially-funded" },
            { label: "Paid", value: "paid" },
          ].map(opt => (
            <button
              type="button"
              key={opt.value || "all"}
              onClick={() => updateFilter("funding", opt.value)}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                (currentFilters.funding === opt.value || (!currentFilters.funding && opt.value === null))
                  ? "bg-[#fca311] text-[#000000] font-bold shadow-sm"
                  : "text-[#14213d]/80 dark:text-[#e5e5e5]/80 hover:bg-[#e5e5e5]/50 dark:hover:bg-[#14213d]/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#e5e5e5] dark:border-[#14213d] pt-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#14213d]/50 dark:text-[#e5e5e5]/50 mb-3">Availability</h4>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => updateFilter("status", currentFilters.status === "active" ? null : "active")}
            className={`text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
              currentFilters.status === "active"
                ? "bg-[#fca311] text-[#000000] font-bold shadow-sm"
                : "text-[#14213d]/80 dark:text-[#e5e5e5]/80 hover:bg-[#e5e5e5]/50 dark:hover:bg-[#14213d]/50"
            }`}
          >
            Hide Expired
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="w-full mt-4 flex items-center justify-center gap-2 border border-[#e5e5e5] dark:border-[#14213d] text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg text-[#14213d] dark:text-[#ffffff] hover:text-[#fca311] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="flex gap-8 relative items-start">
      {/* Desktop Sidebar Filters */}
      <aside className="hidden md:block w-64 shrink-0 sticky top-24 p-6 border border-[#e5e5e5] dark:border-[#14213d] bg-[#ffffff] dark:bg-[#000000]/40 rounded-2xl">
        <h3 className="text-base font-bold text-[#14213d] dark:text-[#ffffff] mb-6">Filter</h3>
        {renderFiltersList()}
      </aside>

      {/* Dynamic Opportunity List Grid */}
      <div className="flex-1 space-y-8">
        <div className="flex justify-between items-center border-b border-[#e5e5e5] dark:border-[#14213d] pb-4">
          <p className="text-sm text-[#14213d]/60 dark:text-[#e5e5e5]/60 font-medium">
            Found <span className="text-[#14213d] dark:text-[#ffffff] font-bold">{totalCount}</span> opportunities
          </p>
          
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="md:hidden flex items-center gap-2 bg-[#fca311] text-[#000000] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter Opportunities
          </button>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#e5e5e5] dark:border-[#14213d] rounded-2xl text-sm text-[#14213d]/60 dark:text-[#e5e5e5]/60">
            No opportunities found matching these filter settings.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {articles.map(opp => (
              <OpportunityCard key={opp.slug.current} opportunity={opp} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/finder"
          currentSearchParams={Object.fromEntries(
            Object.entries(currentFilters).filter(([_, v]) => !!v)
          )}
        />
      </div>

      {/* Mobile Filter Slide Up Bottom Sheet */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 md:hidden animate-fade-in">
          <div className="w-full max-h-[85vh] bg-[#ffffff] dark:bg-[#000000] border-t border-[#e5e5e5] dark:border-[#14213d] rounded-t-3xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-[#e5e5e5] dark:border-[#14213d] pb-4 mb-4">
                <h3 className="text-lg font-bold text-[#14213d] dark:text-[#ffffff]">Filters</h3>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded-full bg-[#e5e5e5]/50 dark:bg-[#14213d]/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {renderFiltersList()}
            </div>
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(false)}
              className="w-full bg-[#fca311] text-[#000000] font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

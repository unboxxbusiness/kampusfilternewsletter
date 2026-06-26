import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Tag } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";

interface OpportunityCardProps {
  opportunity: {
    title: string;
    slug: { current: string };
    excerpt: string;
    featuredImage?: any;
    opportunityType?: string;
    educationLevel?: string[];
    fundingType?: string;
    deadline?: string;
    category?: string;
  };
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const isDeadlineNear = opportunity.deadline
    ? (new Date(opportunity.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24) <= 7
    : false;

  const formatType = (type?: string) => {
    if (!type) return "";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatFunding = (funding?: string) => {
    if (!funding) return "";
    return funding.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <article className="group bg-[#ffffff] dark:bg-[#000000] border border-[#e5e5e5] dark:border-[#14213d] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {opportunity.featuredImage && (
        <div className="relative aspect-video w-full overflow-hidden bg-[#e5e5e5]/20 dark:bg-[#14213d]/20">
          <Image
            src={urlFor(opportunity.featuredImage).width(400).height(225).auto("format").url()}
            alt={opportunity.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#fca311] uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>{opportunity.category || "Opportunity"}</span>
          </div>
          <h3 className="text-xl font-bold text-[#14213d] dark:text-[#ffffff] group-hover:text-[#fca311] dark:group-hover:text-[#fca311] transition-colors leading-snug line-clamp-2">
            <Link href={`/articles/${opportunity.slug.current}`}>{opportunity.title}</Link>
          </h3>
          <p className="text-sm text-[#14213d]/70 dark:text-[#e5e5e5]/70 line-clamp-3 leading-relaxed">
            {opportunity.excerpt}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {opportunity.opportunityType && (
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#14213d]/10 dark:bg-[#e5e5e5]/10 text-[#14213d] dark:text-[#e5e5e5]">
                {formatType(opportunity.opportunityType)}
              </span>
            )}
            {opportunity.fundingType && (
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#fca311]/10 text-[#fca311]">
                {formatFunding(opportunity.fundingType)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#e5e5e5] dark:border-[#14213d] text-xs">
            <div className="flex items-center gap-1.5">
              <Calendar className={`w-3.5 h-3.5 ${isDeadlineNear ? "text-[#fca311] animate-pulse" : "text-[#14213d]/40 dark:text-[#e5e5e5]/40"}`} />
              <span className={`font-medium ${isDeadlineNear ? "text-[#fca311] font-bold" : "text-[#14213d]/60 dark:text-[#e5e5e5]/60"}`}>
                {opportunity.deadline
                  ? `Closes: ${new Date(opportunity.deadline).toLocaleDateString()}`
                  : "No deadline"}
              </span>
            </div>
            <Link href={`/articles/${opportunity.slug.current}`} className="text-xs font-bold text-[#14213d] dark:text-[#ffffff] group-hover:text-[#fca311] transition-colors">
              Read More &rarr;
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

import React from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";

interface AuthorCardProps {
  author: {
    name: string;
    image?: any;
    bio?: any[];
  };
}

const bioComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
        {children}
      </p>
    ),
  },
};

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 my-10 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/20 transition-all duration-300">
      {author.image && (
        <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 overflow-hidden rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <Image
            src={urlFor(author.image).width(160).height(160).auto("format").url()}
            alt={author.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="space-y-2 text-center sm:text-left flex-grow">
        <span className="text-[10px] font-bold text-[#fca311] uppercase tracking-widest leading-none">
          Written By
        </span>
        <h3 className="text-xl font-bold text-[#14213d] dark:text-[#ffffff] leading-snug">
          {author.name}
        </h3>
        {author.bio && author.bio.length > 0 ? (
          <div className="prose prose-sm dark:prose-invert">
            <PortableText value={author.bio} components={bioComponents} />
          </div>
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400 text-sm italic">
            Editorial contributor at Kampus Filter.
          </p>
        )}
      </div>
    </div>
  );
}

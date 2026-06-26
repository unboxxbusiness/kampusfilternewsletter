import React from "react";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";

function extractText(node: any): string {
  if (typeof node === "string") {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }
  if (node && typeof node === "object" && node.props && node.props.children) {
    return extractText(node.props.children);
  }
  return "";
}

const components = {
  block: {
    h2: ({ children }: any) => {
      const text = extractText(children);
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return (
        <h2 className="text-3xl font-sans font-bold mt-12 mb-4 tracking-tight text-[#14213d] dark:text-[#ffffff]" id={id}>
          {children}
        </h2>
      );
    },
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-sans font-semibold mt-8 mb-3 tracking-tight text-[#14213d] dark:text-[#ffffff]">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="leading-relaxed mb-6 text-[#14213d]/90 dark:text-[#e5e5e5]/90 text-lg">
        {children}
      </p>
    ),
  },
  types: {
    image: ({ value }: any) => (
      <div className="relative my-8 aspect-video w-full overflow-hidden rounded-lg bg-[#e5e5e5]/30 dark:bg-[#14213d]/30">
        <Image
          src={urlFor(value).width(800).auto("format").url()}
          alt={value.alt || "Article graphic"}
          fill
          className="object-cover"
        />
      </div>
    ),
  },
};

export default function PortableTextRenderer({ value }: { value: any }) {
  return <PortableText value={value} components={components} />;
}

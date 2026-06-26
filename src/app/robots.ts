import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio/"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "YouBot",
          "Google-Extended",
          "Applebot-Extended",
          "facebookexternalhit",
        ],
        allow: "/",
        disallow: ["/studio/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

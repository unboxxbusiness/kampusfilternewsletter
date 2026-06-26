import { MetadataRoute } from "next";
import { client } from "@/lib/sanity/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";

  const staticPaths: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/archive`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    const articles = await client.fetch(
      `*[_type == "article"] {
        "slug": slug.current,
        publishedAt
      }`
    );

    const articlePaths = articles.map((article: any) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

    const categories = await client.fetch(
      `*[_type == "category"] {
        "slug": slug.current
      }`
    );

    const categoryPaths = categories.map((cat: any) => ({
      url: `${baseUrl}/archive/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    return [...staticPaths, ...categoryPaths, ...articlePaths];
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
    return staticPaths;
  }
}

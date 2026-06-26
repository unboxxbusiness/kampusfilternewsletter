import React from "react";
import { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import HomePageClient from "./HomePageClient";

// Force dynamic fetch to ensure latest site settings are loaded
export const revalidate = 60;

async function getSiteSettings() {
  try {
    return await client.fetch(
      `*[_type == "siteSettings"][0] {
        siteName,
        homepageHeroTitle,
        homepageHeroDescription,
        defaultSeoTitle,
        defaultSeoDescription,
        socialShareImage
      }`
    );
  } catch (error) {
    console.error("Error fetching siteSettings from Sanity:", error);
    return null;
  }
}

async function getActiveCategories(): Promise<string[]> {
  try {
    const categories = await client.fetch(
      `*[_type == "category" && count(*[_type == "article" && category._ref == ^._id]) > 0] | order(title asc) {
        title
      }`
    );
    return categories.map((cat: any) => cat.title);
  } catch (error) {
    console.error("Error fetching active categories from Sanity:", error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings?.defaultSeoTitle || "Kampus Filter - Student Intelligence Platform";
  const description = settings?.defaultSeoDescription || "Discover opportunities, scholarships, career frameworks, and future-skills intelligence for ambitious students.";
  const ogImage = settings?.socialShareImage ? urlFor(settings.socialShareImage).width(1200).height(630).auto("format").url() : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function HomePage() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getActiveCategories(),
  ]);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";

  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "url": baseUrl,
    "name": settings?.siteName || "Kampus Filter",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/archive?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": settings?.siteName || "Kampus Filter",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "sameAs": [
      "https://twitter.com/kampusfilter",
      "https://linkedin.com/company/kampusfilter"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />
      <HomePageClient
        siteName={settings?.siteName || "Kampus Filter"}
        heroTitle={settings?.homepageHeroTitle || "Build Your Future in 5 Minutes a Day."}
        heroDescription={
          settings?.homepageHeroDescription ||
          "Discover opportunities, career intelligence, scholarships, internships, and education insights that help ambitious students make smarter decisions."
        }
        categories={categories}
      />
    </>
  );
}

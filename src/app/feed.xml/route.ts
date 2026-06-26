import { NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";

export async function GET() {
  try {
    const articles = await client.fetch(
      `*[_type == "article"] | order(publishedAt desc)[0...20] {
        title,
        excerpt,
        "slug": slug.current,
        publishedAt
      }`
    );

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";

    const rssItems = articles
      .map((item: any) => `
        <item>
          <title>${escapeXml(item.title)}</title>
          <link>${siteUrl}/articles/${item.slug}</link>
          <guid>${siteUrl}/articles/${item.slug}</guid>
          <description>${escapeXml(item.excerpt)}</description>
          <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
        </item>
      `)
      .join("");

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
          <title>Kampus Filter - Student Intelligence Feed</title>
          <link>${siteUrl}</link>
          <description>Scholarships, career intelligence, and insights for ambitious students.</description>
          <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
          ${rssItems}
        </channel>
      </rss>
    `;

    return new NextResponse(rssFeed.trim(), {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case "\"": return "&quot;";
      default: return c;
    }
  });
}

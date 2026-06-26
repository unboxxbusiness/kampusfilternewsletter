import { NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  try {
    const results = await client.fetch(
      `*[_type == "article" && (title match $q || excerpt match $q || category->title match $q)] {
        title,
        slug,
        excerpt,
        "category": category->title,
        "authorName": author->name,
        publishedAt,
        readingTime
      }`,
      { q: `${query}*` }
    );

    return NextResponse.json(results);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

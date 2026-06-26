import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { adminMessaging } from "@/lib/firebase/admin";

const secret = process.env.SANITY_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get(SIGNATURE_HEADER_NAME) || "";
    const rawBody = await request.text();

    // Verify Sanity signature to ensure authentic origin
    const valid = await isValidSignature(rawBody, signature, secret);
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const { _type, title, excerpt, slug, category } = body;

    // Safely extract string values (handles both raw Sanity documents and projected documents)
    const resolvedSlug = typeof slug === "object" && slug?.current ? slug.current : (slug || "");
    const resolvedCategory = typeof category === "object" && category?.title ? category.title : (typeof category === "string" ? category : "Updates");

    // Revalidate paths in Next.js Cache so updates reflect instantly on the frontend
    revalidatePath("/");
    revalidatePath("/archive");
    if (resolvedSlug) {
      revalidatePath(`/articles/${resolvedSlug}`);
    }

    // Only dispatch FCM broadcast if this is an article publication/update
    const isArticle = _type === "article" || (title && (resolvedSlug || category));
    if (isArticle) {
      const payload = {
        notification: {
          title: `New in ${resolvedCategory}: ${title || "New Article"}`,
          body: excerpt || "Read the latest update on Kampus Filter.",
        },
        data: {
          url: `/articles/${resolvedSlug}`,
        },
        topic: "news",
      };

      await adminMessaging.send(payload);
      return NextResponse.json({ success: true, message: "Broadcast sent and cache revalidated" });
    }

    return NextResponse.json({ success: true, message: "Cache revalidated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const { name, email, mobile, courseInterests } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const subscriberRef = adminDb.collection("subscribers").doc(email);
    const now = new Date();

    await subscriberRef.set(
      {
        name,
        email,
        mobile: mobile || "",
        courseInterests: courseInterests || [],
        notificationEnabled: false,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[/api/subscribe] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

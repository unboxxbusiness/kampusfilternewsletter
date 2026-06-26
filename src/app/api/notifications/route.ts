import { NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Email and Token are required" }, { status: 400 });
    }

    // Subscribe token to FCM Topic "news"
    await adminMessaging.subscribeToTopic(token, "news");

    // Save token to subscriber profile in Firestore
    const subscriberRef = adminDb.collection("subscribers").doc(email);
    await subscriberRef.update({
      fcmToken: token,
      notificationEnabled: true,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

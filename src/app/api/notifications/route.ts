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

    // Dispatch a welcome push notification to confirm it works instantly
    try {
      await adminMessaging.send({
        token: token,
        notification: {
          title: "Welcome to Kampus Filter! 🚀",
          body: "You will now receive daily student updates and career insights straight to your screen.",
        },
        data: {
          url: "/",
        },
      });
    } catch (sendError: any) {
      console.warn("Welcome push notification failed to send:", sendError.message);
      // Do not fail the endpoint since the token registration itself succeeded
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

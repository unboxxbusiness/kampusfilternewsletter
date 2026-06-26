import { getFcmMessaging } from "@/lib/firebase/config";
import { getToken } from "firebase/messaging";

export function useFCM() {
  const registerPushNotifications = async (email: string) => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("Notification permission denied");
        return false;
      }

      const messaging = await getFcmMessaging();
      if (!messaging) {
        console.warn("FCM messaging not supported on this client");
        return false;
      }

      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "BIZzSfEFVf_kPIbNPA_bcKwyDX65SEuUS7ZdY5UmvUROLPpYr9OjmsyI0R1-4d-_hyjVti0SUypNbej_W11IkXs",
      });

      if (token) {
        const response = await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token }),
        });

        if (!response.ok) {
          throw new Error("Failed to subscribe token on backend");
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error setting up FCM:", error);
      return false;
    }
  };

  return { registerPushNotifications };
}

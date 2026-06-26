"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        // Register the main app service worker (offline support + caching)
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Service Worker registered successfully with scope:", registration.scope);
          })
          .catch((error) => {
            console.warn("Service Worker registration failed:", error);
          });

        // Register the Firebase messaging service worker served dynamically
        // via /api/firebase-messaging-sw to avoid hardcoding credentials
        navigator.serviceWorker
          .register("/api/firebase-messaging-sw", { scope: "/" })
          .then((registration) => {
            console.log("Firebase Messaging SW registered with scope:", registration.scope);
          })
          .catch((error) => {
            console.warn("Firebase Messaging SW registration failed:", error);
          });
      });
    }
  }, []);

  return null;
}

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBzRngBbi5_Vz6-agGqGA_vRhU6-KNVdH4",
  authDomain: "kampusfilterapp.firebaseapp.com",
  projectId: "kampusfilterapp",
  storageBucket: "kampusfilterapp.firebasestorage.app",
  messagingSenderId: "939023631977",
  appId: "1:939023631977:web:79e79f1fdc1d6d89a504f8"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png',
    data: { url: payload.data.url }
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

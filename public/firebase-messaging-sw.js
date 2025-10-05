importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAb1k_HPBmNSkscXiAjxk5Uw_Oi6ZwlcLQ',
  projectId: 'novo-freedom',
  messagingSenderId: '323037324621',
  appId: '1:323037324621:web:c16d8b7c453112c8d182fa'
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title || 'Novo Reminder';
  const notificationOptions = {
    body: payload.notification.body || "Don't forget to complete today's reflection.",
    icon: '/icon-192x192.png',
    badge: '/favicon-32x32.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('push', function(event) {
  const data = event.data?.json?.() || {};
  const title = data.notification?.title || 'Novo Reminder';
  const options = {
    body: data.notification?.body || "Don't forget to complete today's reflection.",
    icon: '/icon-192x192.png',
    badge: '/favicon-32x32.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

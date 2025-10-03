/*
  Minimal Firebase Messaging Service Worker placeholder.
  If you enable FCM on the client, replace this with your Firebase messaging SW
  code that initializes firebase-messaging and handles background messages.
*/

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

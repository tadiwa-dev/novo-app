importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase app will be initialized when config is received from main thread
let firebaseApp = null;
let messaging = null;

// Listen for Firebase config from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    try {
      // Initialize Firebase with the config from main thread
      if (!firebaseApp) {
        firebaseApp = firebase.initializeApp(event.data.config);
        messaging = firebase.messaging();
        
        // Set up background message handler after initialization
        messaging.onBackgroundMessage(function(payload) {
          const notificationTitle = payload.notification.title || 'Novo Reminder';
          const notificationOptions = {
            body: payload.notification.body || "Don't forget to complete today's reflection.",
            icon: '/icon-192x192.png',
            badge: '/favicon-32x32.png'
          };

          return self.registration.showNotification(notificationTitle, notificationOptions);
        });
        
        console.log('Firebase initialized in service worker');
      }
    } catch (error) {
      console.error('Failed to initialize Firebase in service worker:', error);
    }
  }
});

// Fallback push event handler
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

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
            badge: '/favicon-32x32.png',
            requireInteraction: true, // Keep notification visible until user interacts
            vibrate: [200, 100, 200], // Vibration pattern for mobile
            data: payload.data || {}
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

// Handle notification click events
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Focus or open the app window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // If app is already open, focus it
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If app is not open, open it
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Fallback push event handler
self.addEventListener('push', function(event) {
  const data = event.data?.json?.() || {};
  const title = data.notification?.title || 'Novo Reminder';
  const options = {
    body: data.notification?.body || "Don't forget to complete today's reflection.",
    icon: '/icon-192x192.png',
    badge: '/favicon-32x32.png',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: data.data || {}
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

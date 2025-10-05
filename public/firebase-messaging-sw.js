importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker with a default config
// The actual config will be sent from the main thread
let firebaseInitialized = false;

const firebaseConfig = {
  apiKey: "AIzaSyCEzm8VI8evCyxspS688-zNxUk0Mdme6XY",
  authDomain: "novo-freedom-webapp.firebaseapp.com",
  projectId: "novo-freedom-webapp",
  storageBucket: "novo-freedom-webapp.firebasestorage.app",
  messagingSenderId: "323037324621",
  appId: "1:323037324621:web:c6faac24c65eb59f114304"
};

// Initialize Firebase app in service worker
if (!firebaseInitialized) {
  firebase.initializeApp(firebaseConfig);
  firebaseInitialized = true;
}

// Firebase config will be injected by the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    // Config already initialized above, but acknowledge the message
    console.log('Firebase config received in service worker');
  }
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

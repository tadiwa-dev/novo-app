/*
  sendDailyNotifications.ts

  A small Node script demonstrating how to send daily notifications to users via
  Firebase Admin SDK. Intended to be deployed as a Cloud Function (scheduled) or
  run from a small server/Cloud Run instance triggered by Cloud Scheduler.

  Usage (locally):
    1. Set GOOGLE_APPLICATION_CREDENTIALS to point at your service account JSON.
    2. npm install firebase-admin
    3. node scripts/sendDailyNotifications.ts

  Note: This script scans `users` collection for users who have push tokens
  (e.g., stored on user doc as `fcmToken`) and sends a simple notification.
*/

import admin from 'firebase-admin';

async function main() {
  if (!admin.apps.length) {
    admin.initializeApp();
  }

  const db = admin.firestore();

  // Query users with an fcmToken field
  const usersSnap = await db.collection('users').where('fcmToken', '!=', null).get();
  const tokens: string[] = [];

  usersSnap.forEach(doc => {
    const data = doc.data();
    if (data && data.fcmToken) tokens.push(data.fcmToken);
  });

  if (tokens.length === 0) {
    console.log('No tokens to send to');
    return;
  }

  const message = {
    notification: {
      title: 'Your daily Novo reminder',
      body: "Don't forget to complete today's reflection — one small step.",
    },
    tokens,
    android: {
      priority: 'high'
    }
  } as admin.messaging.MulticastMessage;

  const res = await admin.messaging().sendMulticast(message);
  console.log('Sent notifications:', res.successCount, 'success,', res.failureCount, 'failure');
  if (res.failureCount > 0) console.log('Responses:', res.responses);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

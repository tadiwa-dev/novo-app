import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize the admin SDK (the SDK will use the service account configured for the Cloud Functions runtime)
admin.initializeApp();
const db = admin.firestore();

// Sends a daily notification to all users that have fcmToken on their user doc
export const sendDailyReminders = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    console.log('sendDailyReminders running at', new Date().toISOString());

    // Query users with an fcmToken
    const usersSnap = await db.collection('users').where('fcmToken', '!=', null).get();
    const tokens: string[] = [];

    usersSnap.forEach(doc => {
      const data = doc.data();
      if (data && data.fcmToken) tokens.push(data.fcmToken as string);
    });

    if (tokens.length === 0) {
      console.log('No tokens to send to');
      return null;
    }

    // Compose the message
    const message: admin.messaging.MulticastMessage = {
      notification: {
        title: "Your daily Novo reminder",
        body: "Don't forget to complete today's reflection — one small step.",
      },
      tokens,
      android: { priority: 'high' }
    };

    const res = await admin.messaging().sendMulticast(message);
    console.log('Sent notifications:', res.successCount, 'success,', res.failureCount, 'failure');

    // Remove invalid tokens from user docs
    res.responses.forEach((response, idx) => {
      if (!response.success) {
        const err = response.error;
        console.warn('Send failed for token', tokens[idx], err?.code, err?.message);
        // If token is invalid, try to remove it from any user doc that had it
        if (err && (err.code === 'messaging/registration-token-not-registered' || err.code === 'messaging/invalid-registration-token')) {
          // Find user doc with this token
          // Note: This can be expensive; consider storing mapping token -> uid in future.
          db.collection('users').where('fcmToken', '==', tokens[idx]).get().then(snapshot => {
            snapshot.forEach(d => {
              d.ref.update({ fcmToken: admin.firestore.FieldValue.delete() });
            });
          }).catch(e => console.warn('Error cleaning invalid token:', e));
        }
      }
    });

    return null;
  });

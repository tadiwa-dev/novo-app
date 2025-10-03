# Firebase Notifications (Daily Reminder)

This project can send daily push notifications to users using Firebase Cloud Messaging (FCM). Below are simple instructions and options for implementing scheduled notifications.

## Overview

1. Collect FCM tokens from clients and store them on the user's Firestore document (field: `fcmToken`).
2. Use a scheduled job (Cloud Scheduler) to trigger a server-side script that sends a multicast message via the Firebase Admin SDK to all tokens.
3. Optionally, handle invalid tokens (remove them from user docs on failures).

## Client (already implemented partially)

- The client `AuthContext` calls `registerPushToken()` after sign-in. That helper attempts to obtain an FCM token (using `getToken(messaging, { vapidKey })`) and writes it to `users/{uid}.fcmToken`.
- To enable this in the browser, set the `NEXT_PUBLIC_FCM_VAPID_KEY` environment variable with your project's public VAPID key.
- You must also include a `firebase-messaging-sw.js` file at the root of `public/` so the browser can handle background messages.

## Server (sending daily reminders)

Two recommended deployment options:

A) Cloud Function (recommended for Firebase projects):
- Create a scheduled Cloud Function (cron) using `functions.pubsub.schedule('every 24 hours').onRun(...)` that runs the logic in `scripts/sendDailyNotifications.ts`.
- Use the Firebase Admin SDK to query Firestore for users with `fcmToken` and send a multicast message.

B) Cloud Run / external server + Cloud Scheduler:
- Deploy `scripts/sendDailyNotifications.ts` as part of a small Node service on Cloud Run.
- Use Cloud Scheduler to call the endpoint daily.

## Example: fields and sending logic

- Store token on user doc: `users/{uid}.fcmToken = '<token>'`.
- Sending script queries `users` where `fcmToken` exists, collects tokens, and calls `admin.messaging().sendMulticast({ tokens, notification: { title, body } })`.
- After response, remove tokens that are invalid (check `responses[i].error`).

## Security

- Use server credentials (service account) to run the Admin SDK.
- Do not expose Admin SDK keys to the client.

## Next steps for you

- Create a Firebase Cloud Function or Cloud Run service and wire `scripts/sendDailyNotifications.ts` logic into it.
- Add your `firebase-messaging-sw.js` to `public/` and `NEXT_PUBLIC_FCM_VAPID_KEY` to your environment.
- Optionally, add user settings to opt-in/opt-out of daily reminders.

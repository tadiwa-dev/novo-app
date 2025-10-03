# Firebase Functions for Novo App

This folder contains a scheduled Cloud Function `sendDailyReminders` that sends daily push notifications to all users with an `fcmToken` stored on their Firestore `users` document.

Quick deploy steps (requires Firebase CLI):

1. Install Firebase CLI: https://firebase.google.com/docs/cli
   ```powershell
   npm install -g firebase-tools
   firebase login
   ```

2. Initialize functions (if not already initialized) or deploy the ones in this folder:
   ```powershell
   cd functions
   npm install
   cd ..
   firebase deploy --only functions:sendDailyReminders
   ```

Notes:
- The Cloud Functions runtime uses the service account configured for your Firebase project so you don't need to set `GOOGLE_APPLICATION_CREDENTIALS` when deploying via Firebase.
- If you prefer Cloud Run + Cloud Scheduler, you can adapt the logic from `functions/index.ts` into a small Express app and deploy to Cloud Run.

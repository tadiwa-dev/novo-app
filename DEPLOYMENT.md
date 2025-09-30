# Deployment Guide for Novo

## Quick Deploy to Vercel

### 1. Prepare Your Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Anonymous" provider
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see README.md)

### 2. Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**:
   In Vercel dashboard, go to Settings > Environment Variables and add:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-app.vercel.app`

### 3. Firebase Security Rules

Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /journal/{entryId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    match /prayers/{prayerId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null;
    }
  }
}
```

## Alternative Deployment Options

### Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `out` folder to Netlify
3. Add environment variables in Netlify dashboard

### AWS Amplify

1. Connect your GitHub repository
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```
3. Add environment variables

## Post-Deployment Checklist

- [ ] Test anonymous authentication
- [ ] Verify Firestore security rules
- [ ] Test all major features:
  - [ ] Onboarding flow
  - [ ] Journey progression
  - [ ] Journal entries
  - [ ] Prayer wall
  - [ ] Progress tracking
  - [ ] Urge rescue
- [ ] Check mobile responsiveness
- [ ] Verify all external links work

## Monitoring

Consider setting up:
- Vercel Analytics (free)
- Firebase Analytics
- Error monitoring (Sentry)
- Performance monitoring

## Custom Domain (Optional)

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Enable SSL certificate

Your app will be accessible at your custom domain!

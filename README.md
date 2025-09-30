# Novo - Freedom Journey

A Christ-centered web app that helps people find freedom from addiction through a 12-week discipleship journey.

## Features

- **Anonymous Authentication**: Secure, private access using Firebase Anonymous Auth
- **12-Week Journey**: Structured daily content with Scripture, devotionals, and challenges
- **Personal Journal**: Private reflection entries stored securely
- **Prayer Wall**: Anonymous prayer requests with community support
- **Progress Tracker**: Visual progress tracking with badges and milestones
- **Urge Rescue**: Emergency support with Scripture, prayers, and worship resources

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Anonymous Auth)
- **State Management**: React Context API + TanStack Query
- **Hosting**: Vercel (ready for deployment)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd novo-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Anonymous Authentication
   - Create a Firestore database
   - Copy your Firebase config

4. Create environment variables:
```bash
cp .env.local.example .env.local
```

5. Add your Firebase configuration to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── onboarding/        # User onboarding flow
│   ├── journey/           # Daily journey content
│   ├── journal/           # Personal journal
│   ├── prayer/            # Prayer wall
│   ├── tracker/           # Progress tracking
│   └── urge-rescue/       # Emergency support
├── components/            # Reusable UI components
├── contexts/              # React Context providers
├── data/                  # JSON data files
└── lib/                   # Utility functions and Firebase config
```

## Firebase Setup

### Authentication
1. Go to Authentication > Sign-in method
2. Enable "Anonymous" provider
3. Configure any additional settings as needed

### Firestore Database
1. Create a Firestore database
2. Set up the following collections:
   - `users` - User profiles and progress
   - `journal` - Personal reflection entries
   - `prayers` - Prayer requests and responses

### Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Journal entries are private to each user
    match /journal/{entryId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Prayer requests are public for reading, but only the creator can update prayer count
    match /prayers/{prayerId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null;
    }
  }
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## Features Overview

### Onboarding
- Simple nickname input
- Anonymous authentication
- Unique handle generation (e.g., "BravePilgrim#1234")

### Journey
- 12-week structured content (Stage 1 implemented)
- Daily Scripture, devotional, reflection, and challenge
- Progress tracking with locked/unlocked days
- Completion tracking

### Journal
- Private reflection entries
- CRUD operations for journal entries
- Chronological display

### Prayer Wall
- Anonymous prayer requests
- Community prayer counter
- Real-time updates

### Tracker
- Visual progress bars
- Badge system for milestones
- Streak tracking
- Activity history

### Urge Rescue
- Random Scripture verses
- Prayer prompts
- Worship playlist links
- Emergency action steps

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

**Note**: This app is designed to provide spiritual support and should not replace professional counseling or medical treatment. If you're struggling with addiction, please seek professional help.
# Deploy to GitHub and Vercel

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" button in the top right corner
3. Select "New repository"
4. Name it: `novo-app`
5. Make it **Public** (required for free Vercel deployment)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

```bash
# Navigate to your project directory
cd C:\Users\tadiw\novo-app

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/novo-app.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository `novo-app`
4. Vercel will automatically detect it's a Next.js project
5. Add your environment variables:
   - Copy the contents of your `.env.local` file
   - Add each variable in the Vercel dashboard under "Environment Variables"
6. Click "Deploy"

## Step 4: Test the Deployed App

Once deployed, Vercel will give you a URL like `https://novo-app-xxx.vercel.app`
Visit this URL and test if the input fields work properly.

## Environment Variables to Add in Vercel:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Troubleshooting:

- If you get authentication errors, make sure your Firebase project allows the Vercel domain
- If inputs still don't work, it might be a browser-specific issue
- Check the browser console for any JavaScript errors

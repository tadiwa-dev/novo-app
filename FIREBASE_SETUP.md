# Firebase Domain Authorization Fix

## Issue
Your app is getting `auth/unauthorized-domain` errors because your Vercel domain is not authorized in Firebase.

## Solution
You need to add your Vercel domain to Firebase's authorized domains list.

### Steps to Fix:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `novo-freedom-webapp`

2. **Navigate to Authentication Settings**
   - Click on "Authentication" in the left sidebar
   - Click on the "Settings" tab
   - Click on "Authorized domains" tab

3. **Add Your Vercel Domain**
   - Click "Add domain"
   - Add: `novo-app-sflx.vercel.app`
   - Click "Done"

4. **Also Add Local Development Domain (Optional)**
   - Add: `localhost` (if not already there)
   - Add: `127.0.0.1` (if not already there)

### Your Current Domains Should Include:
- `localhost` (for local development)
- `127.0.0.1` (for local development)
- `novo-app-sflx.vercel.app` (your Vercel domain)

### After Adding the Domain:
- The changes take effect immediately
- No need to redeploy your app
- Google Sign-in should work on your Vercel deployment

## Alternative: Use Firebase CLI
If you prefer command line:

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Add domain to authorized domains
firebase auth:domains:add novo-app-sflx.vercel.app
```

## Testing
After adding the domain:
1. Visit your Vercel app: https://novo-app-sflx.vercel.app
2. Try Google Sign-in
3. It should work without the unauthorized domain error

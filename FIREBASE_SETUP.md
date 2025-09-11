# Firebase Setup Instructions

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `google-calendar-clone` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and add your project's support email

## 3. Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose the closest to your users)
5. Click "Done"

## 4. Get Firebase Configuration

1. Go to "Project settings" (gear icon in left sidebar)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (`</>`)
4. Enter app nickname: `google-calendar-clone`
5. Click "Register app"
6. Copy the Firebase configuration object

## 5. Update Your App Configuration

Replace the placeholder configuration in `src/firebase/config.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

## 6. Set Up Firestore Security Rules

In the Firestore Database section, go to "Rules" tab and replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow access to user's tasks
      match /tasks/{taskId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Allow access to user's settings
      match /settings/{settingId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Allow access to user's recurring data
      match /recurringData/{dataId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## 7. Deploy Your App

### For Development:
```bash
npm run dev
```

### For Production:
1. Build your app:
```bash
npm run build
```

2. Deploy to Firebase Hosting:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 8. Environment Variables (Optional)

For better security, you can use environment variables:

1. Create a `.env.local` file in your project root:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

2. Update `src/firebase/config.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## 9. Testing

1. Start your development server: `npm run dev`
2. Try creating an account with email/password
3. Try signing in with Google
4. Create some tasks and verify they're saved to Firestore
5. Check the Firebase Console to see your data

## Troubleshooting

- **Authentication not working**: Check that the sign-in methods are enabled in Firebase Console
- **Database permission denied**: Verify your Firestore security rules
- **CORS errors**: Make sure your domain is added to authorized domains in Firebase Console
- **Build errors**: Ensure all Firebase imports are correct and the config is properly set

## Next Steps

Once everything is working:
1. Set up proper Firestore security rules for production
2. Configure Firebase Hosting for deployment
3. Set up monitoring and analytics
4. Consider implementing offline support with Firebase offline persistence

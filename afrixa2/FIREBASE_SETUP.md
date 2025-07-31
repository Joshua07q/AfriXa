# Firebase Setup Guide

## Fixing the "Missing or insufficient permissions" Error

The chat loading issue is caused by missing Firebase security rules. Follow these steps to fix it:

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase in your project
```bash
cd afrixa2
firebase init
```

When prompted:
- Select "Firestore" and "Storage"
- Choose your Firebase project
- Use the default file names for rules

### 4. Deploy the security rules
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### 5. Verify the rules are deployed
The security rules will allow:
- Users to read/write their own user data
- Users to search other users (for chat creation)
- Users to read/write chats they are members of
- Users to read/write messages in their chats
- Users to upload images to chat and status folders

### Alternative: Manual Setup
If you prefer to set up rules manually in the Firebase Console:

1. Go to Firebase Console > Firestore Database > Rules
2. Replace the rules with the content from `firestore.rules`
3. Go to Firebase Console > Storage > Rules
4. Replace the rules with the content from `storage.rules`

After deploying the rules, the chat loading should work properly and you should see your chats appear in the sidebar. 
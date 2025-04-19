# Firebase Setup Guide

This guide walks you through creating a Firebase project and configuring it for the RideShare PWA.

## 1. Create a Firebase Project

- Go to the Firebase Console: https://console.firebase.google.com/
- Click **Add project** and enter a project name (e.g., `rideshare-app`).
- Follow the prompts and accept the terms.

## 2. Enable Essential Services

### Authentication
- In the Firebase console sidebar, select **Authentication** > **Sign-in method**.
- Enable **Email/Password** authentication.

### Firestore Database
- Select **Firestore Database** in the sidebar.
- Click **Create database**, choose **Start in test mode** (for development), and select a region.

### Storage
- Select **Storage** in the sidebar.
- Click **Get started**, choose **Start in test mode**, and select a region.

## 3. Add a Web App and Retrieve Config

- In the project overview, click the **Web** icon (</>).  
- Register an app nickname (e.g., `rideshare-web`) and click **Register app**.  
- Copy the Firebase config object shown (contains apiKey, authDomain, etc.).

## 4. Configure Environment Variables

1. At the project root, copy the example file:  
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and paste in your Firebase config values:
   ```ini
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

> Note: Never commit your `.env` file or secrets to version control.

## 5. Install Firebase SDK

Install the Firebase JavaScript SDK in your project:
```bash
npm install firebase
```

## 6. Verify Initialization

- Ensure `src/firebase/firebase.js` imports and initializes Firebase using the above variables.  
- Run the development server:
  ```bash
  npm start
  ```
- Check the browser console for any initialization errors.

You are now ready to use Firebase services (`auth`, `db`, and `storage`) in your application.
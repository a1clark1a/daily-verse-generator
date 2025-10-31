// Import the functions you need from the SDKs you need
import { getAnalytics, Analytics } from "firebase/analytics";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  AppCheck,
} from "@firebase/app-check";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app
const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Initialize analytics only on client side
let analytics: Analytics | undefined;

// Initialize App Check
let appCheckInstance: AppCheck | null = null;

if (typeof window !== "undefined") {
  if (window.location.hostname === "localhost") {
    const debugToken = "25606d2e-6860-4165-96a2-4102087f3ba7";
    if (debugToken) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
      console.warn("App Check debug token set for localhost:", debugToken);
    } else {
      console.error(
        "NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN is not set in .env.local!"
      );
    }
  }

  // Only run on the client
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (siteKey) {
    try {
      // initializeAppCheck is idempotent; it won't re-init if already done
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      appCheckInstance = initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
      console.log("Firebase App Check Initialized successfully.");
    } catch (error) {
      console.error("Failed to initialize App Check:", error);
    }
  } else {
    console.warn(
      "App Check Site Key not found. App Check will not be enabled."
    );
  }
}
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn("Firebase Analytics initialization failed:", error);
  }
}

export { app, analytics, appCheckInstance };

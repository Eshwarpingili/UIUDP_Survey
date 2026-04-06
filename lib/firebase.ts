import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

function requireValue(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing Firebase environment variable: ${name}. Set it in your deployment provider and local .env.local file.`
    );
  }

  return value;
}

function getFirebaseConfig(): FirebaseConfig {
  return {
    apiKey: requireValue(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, "NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: requireValue(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: requireValue(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, "NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: requireValue(
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    ),
    messagingSenderId: requireValue(
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    ),
    appId: requireValue(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, "NEXT_PUBLIC_FIREBASE_APP_ID"),
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(getFirebaseConfig());
}

export function getFirebaseMeasurementId(): string | undefined {
  return process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
}

export function getFirebaseDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

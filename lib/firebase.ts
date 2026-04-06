import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const requiredEnv = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

type RequiredFirebaseEnv = (typeof requiredEnv)[number];

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

let hasLoggedEnvCheck = false;

function getFirebaseEnvValues(): Record<RequiredFirebaseEnv, string | undefined> {
  return {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

function getMissingFirebaseEnvironmentVariablesInternal(): RequiredFirebaseEnv[] {
  const values = getFirebaseEnvValues();
  return requiredEnv.filter((key) => !values[key]);
}

function logFirebaseEnvCheck() {
  if (hasLoggedEnvCheck) {
    return;
  }

  hasLoggedEnvCheck = true;

  console.log("Firebase ENV CHECK:", {
    apiKey: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    projectId: Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  });

  const missing = getMissingFirebaseEnvironmentVariablesInternal();
  if (missing.length > 0) {
    console.warn(`Firebase not configured. Missing env vars: ${missing.join(", ")}`);
  }
}

function getFirebaseConfig(): FirebaseConfig {
  logFirebaseEnvCheck();

  const values = getFirebaseEnvValues();

  requiredEnv.forEach((key) => {
    if (!values[key]) {
      throw new Error(
        `Missing Firebase environment variable: ${key}. Set it in your deployment provider and local .env.local file.`
      );
    }
  });

  return {
    apiKey: values.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: values.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: values.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: values.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: values.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: values.NEXT_PUBLIC_FIREBASE_APP_ID!,
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

export function getMissingFirebaseEnvironmentVariables(): string[] {
  return getMissingFirebaseEnvironmentVariablesInternal();
}

export function isFirebaseConfigured(): boolean {
  return getMissingFirebaseEnvironmentVariablesInternal().length === 0;
}

export function getFirebaseDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

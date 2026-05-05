// services/firebase.ts
// Firebase configuration and service functions for FieldReportX
// Handles Authentication and Firestore operations

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialise Firebase app
const app = initializeApp(firebaseConfig);

// Initialise Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// ─────────────────────────────────────────
// AUTH FUNCTIONS
// ─────────────────────────────────────────

// Register new user with email and password
export const registerUser = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// Login existing user with email and password
export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// Logout current user
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

// ─────────────────────────────────────────
// FIRESTORE FUNCTIONS
// ─────────────────────────────────────────

// Report data structure
export interface Report {
  id?: string;
  title: string;
  location: string;
  notes: string;
  status: 'draft' | 'submitted';
  photoUrl?: string;
  userId: string;
  latitude?: number;
  longitude?: number;
  createdAt?: Timestamp;
}

// Add a new report to Firestore
export const addReport = async (report: Report): Promise<string> => {
  const docRef = await addDoc(collection(db, 'reports'), {
    ...report,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

// Get all reports for current user from Firestore
export const getUserReports = async (userId: string): Promise<Report[]> => {
  const q = query(
    collection(db, 'reports'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const reports: Report[] = [];
  querySnapshot.forEach((doc) => {
    reports.push({ id: doc.id, ...doc.data() } as Report);
  });
  return reports;
};
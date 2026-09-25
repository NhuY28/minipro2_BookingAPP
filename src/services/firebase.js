import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyCDTwQfMF_AZw4CpUSSoclRd8jpaDUke90",
  authDomain: "study-room-booking-a9fc9.firebaseapp.com",
  projectId: "study-room-booking-a9fc9",
  storageBucket: "study-room-booking-a9fc9.firebasestorage.app",
  messagingSenderId: "417051803462",
  appId: "1:417051803462:web:cdd41424e62548afe26f47",
};

const app = initializeApp(firebaseConfig);

// Firebase Realtime Database
export const db = getDatabase(app);

// Firebase Authentication
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
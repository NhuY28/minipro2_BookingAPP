
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithCredential,
  updatePassword,
  updateProfile,
  type User,
} from "firebase/auth";

import { auth } from "./firebase";
import { saveUserProfile } from "./userService";

async function syncUserProfileToRealtimeDb(
  user: User,
  customName?: string,
  customPhotoUrl?: string
): Promise<void> {
  const finalName =
    customName?.trim() ||
    user.displayName?.trim() ||
    user.email?.split("@")[0] ||
    "Student";

  const data = {
    userId: user.uid,
    uid: user.uid,
    displayName: finalName,
    email: user.email ?? "",
    avatarUrl: customPhotoUrl ?? user.photoURL ?? "",
    role: "student",
    provider: "email-password",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await saveUserProfile(user.uid, data);
}

/**
 * Register a new user with email and password.
 */
export async function registerWithEmail(
  email: string,
  password: string,
  fullName?: string
): Promise<User> {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    const user = credential.user;

    await updateProfile(user, {
      displayName: fullName?.trim() || user.displayName || "Student",
    });

    await syncUserProfileToRealtimeDb(user, fullName);
    await signOut(auth);

    return user;
  } catch (error: any) {
    if (
      error?.code === "auth/operation-not-allowed" ||
      error?.code === "auth/configuration-not-found"
    ) {
      throw new Error(
        "Firebase Email/Password sign-in is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method."
      );
    }

    throw error;
  }
}

/**
 * Login with email and password.
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<User> {
  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    const user = credential.user;
    await syncUserProfileToRealtimeDb(user);

    return user;
  } catch (error: any) {
    if (
      error?.code === "auth/operation-not-allowed" ||
      error?.code === "auth/configuration-not-found"
    ) {
      throw new Error(
        "Firebase Email/Password sign-in is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method."
      );
    }

    throw error;
  }
}

/**
 * Login with Google ID token.
 */
export async function loginWithGoogle(
  idToken: string
): Promise<User> {
  const googleCredential = GoogleAuthProvider.credential(idToken);

  const credential = await signInWithCredential(
    auth,
    googleCredential
  );

  const user = credential.user;
  await syncUserProfileToRealtimeDb(user);

  return user;
}

export async function loginWithFacebook(
  accessToken: string
): Promise<User> {
  const facebookCredential = FacebookAuthProvider.credential(accessToken);
  const credential = await signInWithCredential(auth, facebookCredential);

  const user = credential.user;
  await syncUserProfileToRealtimeDb(user);

  return user;
}

export async function updateUserProfile(
  profile: { displayName?: string; photoURL?: string }
): Promise<User> {
  const user = auth.currentUser;
  if (!user) throw new Error("No signed-in user.");

  await updateProfile(user, profile);

  await saveUserProfile(user.uid, {
    userId: user.uid,
    uid: user.uid,
    displayName: profile.displayName || user.displayName || user.email?.split("@")[0] || "Student",
    email: user.email ?? "",
    avatarUrl: profile.photoURL || user.photoURL || "",
    role: "student",
    provider: "email-password",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return user;
}

export async function changeUserPassword(password: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("No signed-in user.");

  await updatePassword(user, password);
}

/**
 * Logout current Firebase user.
 */
export async function logout(): Promise<void> {
  await signOut(auth);
}

/**
 * Get the currently signed-in Firebase user.
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Listen for Firebase authentication state changes.
 */
export function subscribeToAuthState(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callback);
}


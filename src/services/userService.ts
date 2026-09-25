import { ref, get, set, update } from "firebase/database";
import { db } from "./firebase";

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  role?: string;
  provider?: string;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Lấy thông tin user
 */
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const userRef = ref(db, `users/${userId}`);

  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  const profile = snapshot.val() as Partial<UserProfile>;

  return {
    userId,
    displayName: profile.displayName ?? profile.userId ?? "Student",
    email: profile.email ?? "",
    avatarUrl: profile.avatarUrl ?? "",
    role: profile.role ?? "student",
    provider: profile.provider ?? "email-password",
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

/**
 * Tạo hoặc ghi đè profile
 */
export async function saveUserProfile(
  userId: string,
  data: Record<string, any>
): Promise<void> {
  const userRef = ref(db, `users/${userId}`);
  const snapshot = await get(userRef);
  const existing = snapshot.exists() ? snapshot.val() ?? {} : {};

  const finalData: Record<string, any> = {
    ...existing,
    ...data,
    uid: userId,
    userId,
    email: data.email ?? existing.email ?? "",
    displayName: data.displayName ?? existing.displayName ?? "Student",
    avatarUrl: data.avatarUrl ?? existing.avatarUrl ?? "",
    role: data.role ?? existing.role ?? "student",
    provider: data.provider ?? existing.provider ?? "email-password",
    updatedAt: Date.now(),
    createdAt: existing.createdAt ?? Date.now(),
  };

  await set(userRef, finalData);
}

/**
 * Cập nhật một phần profile
 */
export async function updateUserProfile(
  userId: string,
  data: Record<string, any>
): Promise<void> {
  const userRef = ref(db, `users/${userId}`);
  const snapshot = await get(userRef);
  const existing = snapshot.exists() ? snapshot.val() ?? {} : {};

  const finalData: Record<string, any> = {
    ...existing,
    ...data,
    uid: userId,
    userId,
    email: data.email ?? existing.email ?? "",
    displayName: data.displayName ?? existing.displayName ?? "Student",
    avatarUrl: data.avatarUrl ?? existing.avatarUrl ?? "",
    role: data.role ?? existing.role ?? "student",
    provider: data.provider ?? existing.provider ?? "email-password",
    updatedAt: Date.now(),
    createdAt: existing.createdAt ?? Date.now(),
  };

  await set(userRef, finalData);
}
import {
  ref,
  get,
  push,
  set,
  update,
  onValue,
} from "firebase/database";

import { db } from "./firebase";

export interface Booking {
  bookingId: string;
  userId: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "cancelled" | "completed";
}

/**
 * Lấy tất cả booking
 */
export async function getBookings(): Promise<Booking[]> {
  const bookingsRef = ref(db, "bookings");

  const snapshot = await get(bookingsRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  return Object.entries(data).map(
    ([bookingId, booking]) => ({
      bookingId,
      ...(booking as Omit<Booking, "bookingId">),
    })
  );
}

/**
 * Lấy booking của một user
 */
export async function getBookingsByUser(
  userId: string
): Promise<Booking[]> {
  const bookings = await getBookings();

  return bookings.filter(
    (booking) => booking.userId === userId
  );
}

/**
 * Lấy booking của một phòng trong một ngày
 */
export async function getBookingsByRoomAndDate(
  roomId: string,
  date: string
): Promise<Booking[]> {
  const bookings = await getBookings();

  return bookings.filter(
    (booking) =>
      booking.roomId === roomId &&
      booking.date === date &&
      booking.status !== "cancelled"
  );
}

/**
 * Kiểm tra conflict thời gian
 */
export function hasBookingConflict(
  bookings: Booking[],
  startTime: string,
  endTime: string
): boolean {
  return bookings.some((booking) => {
    return (
      startTime < booking.endTime &&
      endTime > booking.startTime
    );
  });
}

/**
 * Tạo booking mới
 */
export async function createBooking(
  data: Omit<Booking, "bookingId">
): Promise<string> {
  const bookingsRef = ref(db, "bookings");

  const newBookingRef = push(bookingsRef);

  const bookingId = newBookingRef.key;

  if (!bookingId) {
    throw new Error("Cannot generate booking ID");
  }

  await set(newBookingRef, data);

  return bookingId;
}

/**
 * Hủy booking
 */
export async function cancelBooking(
  bookingId: string
): Promise<void> {
  const bookingRef = ref(
    db,
    `bookings/${bookingId}`
  );

  await update(bookingRef, {
    status: "cancelled",
  });
}

/**
 * Realtime listener cho bookings
 */
export function subscribeToBookings(
  callback: (bookings: Booking[]) => void
) {
  const bookingsRef = ref(db, "bookings");

  return onValue(bookingsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const data = snapshot.val();

    const bookings: Booking[] = Object.entries(data).map(
      ([bookingId, booking]) => ({
        bookingId,
        ...(booking as Omit<Booking, "bookingId">),
      })
    );

    callback(bookings);
  });
}
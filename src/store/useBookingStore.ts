import { create } from "zustand";
import { getRooms } from "../services/roomService";

export type RoomType = "Study Room" | "Computer Lab";
export type RoomStatus = "Available" | "Busy";

export type Room = {
  id: string;
  name: string;
  building: "Building A" | "Building B";
  floor: string;
  type: RoomType;
  capacity: number;
  facilities: string[];
  status: RoomStatus;
  nextSlot: string;
  description: string;
  images?: string[];
};

export type Booking = {
  id: string;
  roomId: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  userId?: string;
};

type BookingState = {
  rooms: Room[];
  bookings: Booking[];
  selectedRoomId: string | null;
  selectedDate: string;
  selectedSlot: string | null;
  loading: boolean;
  error: string | null;

  loadRooms: () => Promise<void>;
  loadBookings: (userId: string) => Promise<void>;
  setSelectedRoom: (roomId: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedSlot: (slot: string) => void;
  addBooking: (room: Room, date: string, slot: string) => void;
  cancelBooking: (bookingId: string) => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  rooms: [],
  bookings: [],
  selectedRoomId: null,
  selectedDate: "Today",
  selectedSlot: null,
  loading: false,
  error: null,

  loadRooms: async () => {
    try {
      set({ loading: true, error: null });

      const rooms = await getRooms();

      set((state) => ({
        rooms: rooms.map((room) =>
          state.bookings.some(
            (booking) =>
              booking.roomId === room.id &&
              booking.status === "Upcoming",
          )
            ? { ...room, status: "Busy" }
            : room,
        ),
        loading: false,
      }));

      console.log(`Loaded ${rooms.length} rooms from Firebase`);
    } catch (error) {
      console.error("Failed to load rooms from Firebase:", error);

      set({
        loading: false,
        error: "Failed to load rooms from Firebase.",
      });
    }
  },

  loadBookings: async (_userId: string) => {
    set((state) => ({ bookings: state.bookings }));
  },

  setSelectedRoom: (roomId) =>
    set({
      selectedRoomId: roomId,
    }),

  setSelectedDate: (date) =>
    set({
      selectedDate: date,
    }),

  setSelectedSlot: (slot) =>
    set({
      selectedSlot: slot,
    }),

  addBooking: (room, date, slot) => {
    const [startTime, endTime] = slot.split(" - ");

    set((state) => ({
      rooms: state.rooms.map((item) =>
        item.id === room.id ? { ...item, status: "Busy" } : item,
      ),
      bookings: [
        ...state.bookings,
        {
          id: `${room.id}-${Date.now()}`,
          roomId: room.id,
          roomName: room.name,
          date,
          startTime,
          endTime,
          status: "Upcoming",
          userId: "local-user",
        },
      ],
      selectedRoomId: room.id,
      selectedDate: date,
      selectedSlot: slot,
      error: null,
    }));
  },

  cancelBooking: (bookingId) =>
    set((state) => {
      const booking = state.bookings.find((item) => item.id === bookingId);
      const bookings = state.bookings.map((item) =>
        item.id === bookingId
          ? { ...item, status: "Cancelled" as const }
          : item,
      );
      const stillBooked = booking
        ? bookings.some(
            (item) =>
              item.roomId === booking.roomId &&
              item.status === "Upcoming",
          )
        : true;

      return {
        bookings,
        rooms: booking && !stillBooked
          ? state.rooms.map((room) =>
              room.id === booking.roomId
                ? { ...room, status: "Available" as const }
                : room,
            )
          : state.rooms,
      };
    }),
}));

import { ref, get, onValue } from "firebase/database";
import { db } from "./firebase";

export type RoomType = "Study Room" | "Computer Lab";
export type RoomStatus = "Available" | "Busy";

export interface Room {
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
}

const fallbackRooms: Room[] = [
  {
    id: "a-101",
    name: "A101",
    building: "Building A",
    floor: "1st floor",
    type: "Study Room",
    capacity: 6,
    facilities: ["Whiteboard", "Power outlets"],
    status: "Available",
    nextSlot: "Available until 12:00",
    description: "A quiet study room for small group discussions.",
    images: [],
  },
  {
    id: "a-103",
    name: "A103",
    building: "Building A",
    floor: "1st floor",
    type: "Computer Lab",
    capacity: 30,
    facilities: ["30 PCs", "Projector"],
    status: "Busy",
    nextSlot: "Available at 14:00",
    description: "Computer lab for programming and practical classes.",
    images: [],
  },
  {
    id: "b-102",
    name: "B102",
    building: "Building B",
    floor: "1st floor",
    type: "Computer Lab",
    capacity: 24,
    facilities: ["24 PCs", "Projector"],
    status: "Available",
    nextSlot: "Available until 18:00",
    description: "Computer lab for programming and research activities.",
    images: [],
  },
  {
    id: "b-301",
    name: "B301",
    building: "Building B",
    floor: "3rd floor",
    type: "Study Room",
    capacity: 12,
    facilities: ["Whiteboard", "Quiet zone"],
    status: "Available",
    nextSlot: "Available until 19:00",
    description: "A spacious room for group study and exam preparation.",
    images: [],
  },
];

const additionalFallbackRooms: Room[] = Array.from({ length: 50 }, (_, index) => {
  const building = index < 25 ? "Building A" : "Building B";
  const roomNumber = 401 + index;
  const isComputerLab = index % 3 === 0;

  return {
    id: `${building === "Building A" ? "a" : "b"}-extra-${index + 1}`,
    name: `${building === "Building A" ? "A" : "B"}${roomNumber}`,
    building,
    floor: `${Math.floor(roomNumber / 100)}th floor`,
    type: isComputerLab ? "Computer Lab" : "Study Room",
    capacity: isComputerLab ? 20 + (index % 4) * 4 : 4 + (index % 4) * 2,
    facilities: isComputerLab
      ? ["Computers", "Projector", "Air conditioning"]
      : ["Whiteboard", "Power outlets", "Quiet zone"],
    status: index % 5 === 0 ? "Busy" : "Available",
    nextSlot: index % 5 === 0 ? "Available at 15:00" : "Available until 18:00",
    description: isComputerLab
      ? "A fully equipped lab for coding, research, and practical classes."
      : "A polished study room for focused individual and group work.",
    images: [],
  };
});

const allFallbackRooms = [...fallbackRooms, ...additionalFallbackRooms];

function normalizeRoom(roomId: string, value: any): Room {
  const roomType = value?.type;
  const normalizedType: RoomType =
    roomType === "Study Room" || roomType === "study_room"
      ? "Study Room"
      : roomType === "Computer Lab" || roomType === "computer_lab"
        ? "Computer Lab"
        : "Study Room";

  return {
    id: roomId,
    name: value?.name ?? value?.roomName ?? roomId,
    building: value?.building ?? "Building A",
    floor: value?.floor ?? value?.location ?? "1st floor",
    type: normalizedType,
    capacity: Number(value?.capacity ?? 0),
    facilities: Array.isArray(value?.facilities)
      ? value.facilities
      : Array.isArray(value?.amenities)
        ? value.amenities
        : [],
    status: value?.status === "Busy" ? "Busy" : "Available",
    nextSlot: value?.nextSlot ?? "Available now",
    description: value?.description ?? "",
    images: Array.isArray(value?.images)
      ? value.images
      : value?.imageUrl
        ? [value.imageUrl]
        : [],
  };
}

/**
 * Lấy tất cả phòng
 */
export async function getRooms(): Promise<Room[]> {
  try {
    const roomsRef = ref(db, "rooms");

    const snapshot = await get(roomsRef);

    if (!snapshot.exists()) {
      return allFallbackRooms;
    }

    const data = snapshot.val();

    return Object.entries(data).map(([roomId, room]) =>
      normalizeRoom(roomId, room)
    );
  } catch (error: any) {
    const message = String(error?.message ?? "");

    if (
      message.includes("Permission denied") ||
      error?.code === "PERMISSION_DENIED"
    ) {
      console.warn("Realtime Database permission denied; using fallback room data.");
      return allFallbackRooms;
    }

    throw error;
  }
}

/**
 * Lấy một phòng theo ID
 */
export async function getRoomById(
  roomId: string
): Promise<Room | null> {
  try {
    const roomRef = ref(db, `rooms/${roomId}`);

    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      return allFallbackRooms.find((room) => room.id === roomId) ?? null;
    }

    return normalizeRoom(roomId, snapshot.val());
  } catch (error: any) {
    const message = String(error?.message ?? "");

    if (
      message.includes("Permission denied") ||
      error?.code === "PERMISSION_DENIED"
    ) {
      return allFallbackRooms.find((room) => room.id === roomId) ?? null;
    }

    throw error;
  }
}

/**
 * Lắng nghe thay đổi realtime của rooms
 */
export function subscribeToRooms(
  callback: (rooms: Room[]) => void
) {
  const roomsRef = ref(db, "rooms");

  return onValue(roomsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(allFallbackRooms);
      return;
    }

    try {
      const data = snapshot.val();

      const rooms: Room[] = Object.entries(data).map(
        ([roomId, room]) => normalizeRoom(roomId, room)
      );

      callback(rooms);
    } catch (error: any) {
      const message = String(error?.message ?? "");

      if (
        message.includes("Permission denied") ||
        error?.code === "PERMISSION_DENIED"
      ) {
        callback(allFallbackRooms);
        return;
      }

      callback(allFallbackRooms);
    }
  });
}

import { ref, set } from "firebase/database";
import { db } from "../src/services/firebase";

type Room = {
  id: string;
  name: string;
  building: "Building A" | "Building B";
  floor: string;
  type: "Study Room" | "Computer Lab";
  capacity: number;
  facilities: string[];
  status: "Available" | "Busy";
  nextSlot: string;
  description: string;
  images: string[];
};

const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/mainhuy/image/upload";

const roomImage = (roomNumber: number): string => {
  return `${CLOUDINARY_BASE_URL}/room_${roomNumber}`;
};

const rooms: Room[] = [
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
    images: [roomImage(1)],
  },
  {
    id: "a-102",
    name: "A102",
    building: "Building A",
    floor: "1st floor",
    type: "Study Room",
    capacity: 8,
    facilities: ["Whiteboard", "Projector"],
    status: "Available",
    nextSlot: "Available until 13:00",
    description:
      "A comfortable room for group study and presentations.",
    images: [roomImage(2)],
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
    description:
      "Computer lab for programming and practical classes.",
    images: [roomImage(3)],
  },
  {
    id: "a-201",
    name: "A201",
    building: "Building A",
    floor: "2nd floor",
    type: "Study Room",
    capacity: 4,
    facilities: ["Whiteboard", "Window view"],
    status: "Available",
    nextSlot: "Available until 15:00",
    description:
      "A small quiet room for individual or group study.",
    images: [roomImage(4)],
  },
  {
    id: "a-202",
    name: "A202",
    building: "Building A",
    floor: "2nd floor",
    type: "Study Room",
    capacity: 10,
    facilities: [
      "Whiteboard",
      "Power outlets",
      "Air conditioning",
    ],
    status: "Available",
    nextSlot: "Available until 16:00",
    description:
      "A spacious room suitable for larger study groups.",
    images: [roomImage(5)],
  },
  {
    id: "a-203",
    name: "A203",
    building: "Building A",
    floor: "2nd floor",
    type: "Computer Lab",
    capacity: 32,
    facilities: [
      "32 PCs",
      "Projector",
      "Air conditioning",
    ],
    status: "Busy",
    nextSlot: "Available at 15:30",
    description:
      "Fully equipped computer lab for coding and coursework.",
    images: [roomImage(6)],
  },
  {
    id: "a-204",
    name: "A204",
    building: "Building A",
    floor: "2nd floor",
    type: "Computer Lab",
    capacity: 32,
    facilities: ["32 PCs", "Projector"],
    status: "Busy",
    nextSlot: "Available at 14:30",
    description:
      "Computer lab for programming classes and project work.",
    images: [roomImage(7)],
  },
  {
    id: "a-301",
    name: "A301",
    building: "Building A",
    floor: "3rd floor",
    type: "Study Room",
    capacity: 6,
    facilities: ["Whiteboard", "Power outlets"],
    status: "Available",
    nextSlot: "Available until 12:00",
    description:
      "A quiet room with natural light for group study.",
    images: [roomImage(8)],
  },
  {
    id: "a-302",
    name: "A302",
    building: "Building A",
    floor: "3rd floor",
    type: "Study Room",
    capacity: 8,
    facilities: ["Whiteboard", "Display"],
    status: "Available",
    nextSlot: "Available until 17:00",
    description:
      "A flexible collaboration room with a large display.",
    images: [roomImage(9)],
  },
  {
    id: "a-305",
    name: "A305",
    building: "Building A",
    floor: "3rd floor",
    type: "Study Room",
    capacity: 8,
    facilities: ["Display", "Power outlets"],
    status: "Busy",
    nextSlot: "Available at 15:00",
    description:
      "A collaboration room for group projects and discussions.",
    images: [roomImage(10)],
  },
  {
    id: "b-101",
    name: "B101",
    building: "Building B",
    floor: "1st floor",
    type: "Study Room",
    capacity: 6,
    facilities: ["Whiteboard", "Quiet zone"],
    status: "Available",
    nextSlot: "Available until 16:00",
    description:
      "A quiet room designed for focused study.",
    images: [roomImage(11)],
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
    description:
      "Computer lab for programming and research activities.",
    images: [roomImage(12)],
  },
  {
    id: "b-105",
    name: "B105",
    building: "Building B",
    floor: "1st floor",
    type: "Study Room",
    capacity: 10,
    facilities: ["Whiteboard", "Quiet zone"],
    status: "Available",
    nextSlot: "Available until 16:00",
    description:
      "A spacious quiet room for individual and group study.",
    images: [roomImage(13)],
  },
  {
    id: "b-201",
    name: "B201",
    building: "Building B",
    floor: "2nd floor",
    type: "Study Room",
    capacity: 8,
    facilities: ["Whiteboard", "Power outlets"],
    status: "Busy",
    nextSlot: "Available at 13:30",
    description:
      "A comfortable study room for small teams.",
    images: [roomImage(14)],
  },
  {
    id: "b-202",
    name: "B202",
    building: "Building B",
    floor: "2nd floor",
    type: "Computer Lab",
    capacity: 20,
    facilities: ["20 PCs", "Air conditioning"],
    status: "Available",
    nextSlot: "Available until 17:30",
    description:
      "Modern computer lab for coding and research.",
    images: [roomImage(15)],
  },
  {
    id: "b-210",
    name: "B210",
    building: "Building B",
    floor: "2nd floor",
    type: "Computer Lab",
    capacity: 20,
    facilities: ["20 PCs", "Projector"],
    status: "Available",
    nextSlot: "Available until 17:30",
    description:
      "Computer lab suitable for programming and team assignments.",
    images: [roomImage(16)],
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
    description:
      "A spacious room for group study and exam preparation.",
    images: [roomImage(17)],
  },
  {
    id: "b-316",
    name: "B316",
    building: "Building B",
    floor: "3rd floor",
    type: "Study Room",
    capacity: 12,
    facilities: ["Whiteboard", "Quiet zone"],
    status: "Available",
    nextSlot: "Available until 19:00",
    description:
      "A spacious room designed for quiet group study.",
    images: [roomImage(18)],
  },
  {
    id: "b-401",
    name: "B401",
    building: "Building B",
    floor: "4th floor",
    type: "Computer Lab",
    capacity: 28,
    facilities: [
      "28 PCs",
      "Projector",
      "Air conditioning",
    ],
    status: "Busy",
    nextSlot: "Available at 16:00",
    description:
      "High-capacity computer lab for classes and workshops.",
    images: [roomImage(19)],
  },
  {
    id: "b-402",
    name: "B402",
    building: "Building B",
    floor: "4th floor",
    type: "Computer Lab",
    capacity: 24,
    facilities: ["24 PCs", "Air conditioning"],
    status: "Available",
    nextSlot: "Available until 18:00",
    description:
      "A bright computer lab with reliable workstations.",
    images: [roomImage(20)],
  },
];

const additionalRooms: Room[] = Array.from({ length: 50 }, (_, index) => {
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
    images: [roomImage(21 + index)],
  };
});

const allRooms = [...rooms, ...additionalRooms];

async function seedRooms() {
  for (const room of allRooms) {
    const roomRef = ref(db, `rooms/${room.id}`);
    await set(roomRef, room);
  }

  console.log(`Successfully updated ${allRooms.length} rooms.`);
}

seedRooms().catch((error) => {
  console.error("Failed to seed rooms:", error);
});


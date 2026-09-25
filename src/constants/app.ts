export const FILTERS = [
  "All",
  "Available",
  "Study Room",
  "Computer Lab",
  "Building A",
  "Building B",
] as const;

export type Filter = (typeof FILTERS)[number];

export const TIME_SLOTS = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
] as const;

export const ROOM_IMAGES = {
  "a-101": require("../../assets/room1.jpg"),
  "a-102": require("../../assets/room2.jpg"),
  "a-103": require("../../assets/room3.jpg"),
  "a-201": require("../../assets/room4.jpg"),
  "a-202": require("../../assets/room5.jpg"),
  "a-203": require("../../assets/room6.jpg"),
  "a-204": require("../../assets/room7.jpg"),
  "a-301": require("../../assets/room8.jpg"),
  "a-302": require("../../assets/room9.jpg"),
  "a-305": require("../../assets/room10.jpg"),
} as const;

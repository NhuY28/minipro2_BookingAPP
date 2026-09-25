import type { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  RoomDetail: { roomId: string };
  Booking: { roomId: string };
};

export type TabParamList = {
  Explore: undefined;
  "My Bookings": undefined;
  Profile: undefined;
};

import { Text, View } from "react-native";
import type { RoomStatus } from "../store/useBookingStore";
import { styles } from "../styles";

export function StatusPill({ status }: { status: RoomStatus }) {
  const isAvailable = status === "Available";
  return (
    <View
      style={[
        styles.statusPill,
        isAvailable ? styles.availablePill : styles.busyPill,
      ]}
    >
      <View
        style={[
          styles.statusDot,
          isAvailable ? styles.availableDot : styles.busyDot,
        ]}
      />
      <Text
        style={[
          styles.statusText,
          isAvailable ? styles.availableText : styles.busyText,
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { Room } from "../store/useBookingStore";
import type { RootStackParamList } from "../types/navigation";
import { ROOM_IMAGES } from "../constants/app";
import { styles } from "../styles";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function RoomCard({ room }: { room: Room }) {
  const navigation = useNavigation<Navigation>();
  const isAvailable = room.status === "Available";
  const imageSource = room.images && room.images[0]
    ? { uri: room.images[0] }
    : ROOM_IMAGES[room.id as keyof typeof ROOM_IMAGES];

  return (
    <Pressable
      onPress={() => navigation.navigate("RoomDetail", { roomId: room.id })}
      style={({ pressed }) => [styles.roomCard, pressed && styles.pressed]}
    >
      <Image
        source={imageSource}
        style={styles.roomImage}
        resizeMode="cover"
      />

      <View style={styles.cardTopRow}>
        <View style={styles.roomIcon}>
          <Ionicons
            name={room.type === "Computer Lab" ? "desktop-outline" : "book-outline"}
            size={21}
            color="#B8A46A"
          />
        </View>
        <View style={styles.roomTitleWrap}>
          <Text style={styles.roomName}>{room.name}</Text>
          <Text style={styles.roomMeta}>
            {room.building} / {room.floor}
          </Text>
        </View>
      </View>
      <View style={styles.cardStatusRow}>
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
            {room.status}
          </Text>
        </View>
        <View style={styles.capacityWrap}>
          <Ionicons name="people-outline" size={13} color="#87949D" />
          <Text style={styles.capacityText}>{room.capacity} seats</Text>
        </View>
      </View>
      <Text style={styles.roomType}>{room.type}</Text>
      <View style={styles.facilityRow}>
        {room.facilities.map((facility) => (
          <View key={facility} style={styles.facilityTag}>
            <Text style={styles.facilityText}>{facility}</Text>
          </View>
        ))}
      </View>
      <Text style={[styles.nextSlot, !isAvailable && styles.nextSlotBusy]}>
        {room.nextSlot}
      </Text>
    </Pressable>
  );
}

import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { ROOM_IMAGES } from "../constants/app";
import { useBookingStore } from "../store/useBookingStore";
import { styles } from "../styles";
import { InfoItem } from "../components/InfoItem";
import { StatusPill } from "../components/StatusPill";

type Props = NativeStackScreenProps<RootStackParamList, "RoomDetail">;
export function RoomDetailScreen({ route, navigation }: Props) {
  const rooms = useBookingStore((state) => state.rooms);
  const room =
    rooms.find((item) => item.id === route.params.roomId) ?? rooms[0];
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={[]}
        renderItem={null}
        contentContainerStyle={styles.detailContent}
        ListHeaderComponent={
          <View>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.backLink}>‹ Back to rooms</Text>
            </Pressable>
            <View style={styles.detailHero}>
            <Image
            source={
                room.images?.[0]
                ? { uri: room.images[0] }
                : ROOM_IMAGES[room.id as keyof typeof ROOM_IMAGES]
            }
            style={styles.detailRoomImage}
            resizeMode="cover"
            />
                        <Text style={styles.detailRoomName}>{room.name}</Text>
              <Text style={styles.roomMeta}>
                {room.building} / {room.floor}
              </Text>
              <View style={styles.detailStatus}>
                <StatusPill status={room.status} />
              </View>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Room details</Text>
              <View style={styles.infoGrid}>
                <InfoItem label="Type" value={room.type} />
                <InfoItem label="Capacity" value={`${room.capacity} seats`} />
                <InfoItem label="Floor" value={room.floor} />
                <InfoItem label="Status" value={room.status} />
              </View>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Facilities</Text>
              <View style={styles.facilityRow}>
                {room.facilities.map((facility) => (
                  <View key={facility} style={styles.facilityTag}>
                    <Text style={styles.facilityText}>{facility}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>About this room</Text>
              <Text style={styles.description}>{room.description}</Text>
            </View>
            <Pressable
              disabled={room.status !== "Available"}
              onPress={() =>
                navigation.navigate("Booking", { roomId: room.id })
              }
              style={({ pressed }) => [
                styles.primaryButton,
                room.status !== "Available" && styles.disabledButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {room.status === "Available"
                  ? "Book this room"
                  : "Currently unavailable"}
              </Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

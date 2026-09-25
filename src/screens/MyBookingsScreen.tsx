import { useEffect } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from "react-native";
import type { User } from "firebase/auth";
import { useBookingStore } from "../store/useBookingStore";
import { styles } from "../styles";

export function MyBookingsScreen({ user }: { user: User }) {
  const bookings = useBookingStore((state) => state.bookings);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);
  const loadBookings = useBookingStore((state) => state.loadBookings);

  useEffect(() => {
    loadBookings(user.uid);
  }, [loadBookings, user.uid]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={bookings}
        keyExtractor={(booking) => booking.id}
        contentContainerStyle={styles.bookingList}
        ListHeaderComponent={
          <View>
            <Text style={styles.bookingListTitle}>My bookings</Text>
            <Text style={styles.subheading}>
              Keep track of your study sessions.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.bookingCard}>
            <View style={styles.bookingCardHeader}>
              <Text style={styles.bookingCardRoom}>{item.roomName}</Text>
              <Text
                style={[
                  styles.bookingStatus,
                  item.status === "Cancelled" && styles.cancelledStatus,
                ]}
              >
                {item.status}
              </Text>
            </View>
            <Text style={styles.bookingCardDate}>{item.date}</Text>
            <Text style={styles.bookingCardTime}>
              {item.startTime} - {item.endTime}
            </Text>
            {item.status === "Upcoming" && (
              <Pressable
                onPress={() => cancelBooking(item.id)}
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.cancelButtonText}>Cancel booking</Text>
              </Pressable>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBooking}>
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptyText}>
              Choose a room from Explore to make your first booking.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

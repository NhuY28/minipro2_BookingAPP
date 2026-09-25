import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CalendarPicker } from "../components/CalendarPicker";
import { TIME_SLOTS } from "../constants/app";
import { useBookingStore } from "../store/useBookingStore";
import type { RootStackParamList } from "../types/navigation";
import { styles } from "../styles";

type Props = NativeStackScreenProps<RootStackParamList, "Booking">;
export function BookingScreen({ route, navigation }: Props) {
  const rooms = useBookingStore((state) => state.rooms);
  const bookings = useBookingStore((state) => state.bookings);
  const addBooking = useBookingStore((state) => state.addBooking);
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedSlotFromStore = useBookingStore((state) => state.selectedSlot);
  const setSelectedDate = useBookingStore((state) => state.setSelectedDate);
  const setSelectedSlot = useBookingStore((state) => state.setSelectedSlot);
  const room =
    rooms.find((item) => item.id === route.params.roomId) ?? rooms[0];
  const selectedSlot = selectedSlotFromStore ?? "10:00 - 11:00";
  const bookedSlots = new Set(
    bookings
      .filter(
        (booking) =>
          booking.roomId === room.id &&
          booking.date === selectedDate &&
          booking.status === "Upcoming",
      )
      .map((booking) => `${booking.startTime} - ${booking.endTime}`),
  );
  const canConfirm = !bookedSlots.has(selectedSlot);
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={[]}
        renderItem={null}
        contentContainerStyle={styles.bookingContent}
        ListHeaderComponent={
          <View>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.backLink}>‹ Back to {room.name}</Text>
            </Pressable>
            <Text style={styles.bookingTitle}>Book {room.name}</Text>
            <Text style={styles.subheading}>
              Choose a date and time for your session.
            </Text>
            <Text style={styles.detailLabel}>Choose a date</Text>
            <CalendarPicker value={selectedDate} onChange={setSelectedDate} />
            <Text style={styles.detailLabel}>Time slot</Text>
            <View style={styles.slotGrid}>
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedSlots.has(slot);
                return (
                  <Pressable
                    key={slot}
                    disabled={isBooked}
                    onPress={() => setSelectedSlot(slot)}
                    style={({ pressed }) => [
                      styles.slotOption,
                      selectedSlot === slot &&
                        !isBooked &&
                        styles.selectedOption,
                      isBooked && styles.bookedSlot,
                      pressed && !isBooked && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedSlot === slot &&
                          !isBooked &&
                          styles.selectedOptionText,
                        isBooked && styles.bookedSlotText,
                      ]}
                    >
                      {slot}
                    </Text>
                    <Text
                      style={[
                        styles.slotStatus,
                        selectedSlot === slot &&
                          !isBooked &&
                          styles.selectedOptionText,
                        isBooked && styles.bookedSlotText,
                      ]}
                    >
                      {isBooked ? "Booked" : "Available"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.bookingSummary}>
              <Text style={styles.summaryLabel}>Your booking</Text>
              <Text style={styles.summaryRoom}>
                {room.name} / {selectedDate}
              </Text>
              <Text style={styles.summarySlot}>{selectedSlot}</Text>
            </View>
            <Pressable
              disabled={!canConfirm}
              onPress={() => {
                addBooking(room, selectedDate, selectedSlot);
                navigation.navigate("MainTabs");
              }}
              style={({ pressed }) => [
                styles.primaryButton,
                !canConfirm && styles.disabledButton,
                pressed && canConfirm && styles.buttonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {canConfirm ? "Confirm booking" : "Choose an available slot"}
              </Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

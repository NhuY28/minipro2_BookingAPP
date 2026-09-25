import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";

type Props = { value: string; onChange: (date: string) => void };

export function CalendarPicker({ value, onChange }: Props) {
  const now = new Date();
  const [month, setMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const monthLabel = month.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const formatDate = (day: number) =>
    new Date(month.getFullYear(), month.getMonth(), day).toLocaleDateString(
      "en-US",
      { weekday: "short", month: "short", day: "numeric" },
    );

  return (
    <View style={styles.calendarCard}>
      <View style={styles.calendarHeader}>
        <Pressable
          onPress={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
          }
          style={styles.calendarArrow}
        >
          <Text style={styles.calendarArrowText}>‹</Text>
        </Pressable>
        <Text style={styles.calendarTitle}>{monthLabel}</Text>
        <Pressable
          onPress={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
          }
          style={styles.calendarArrow}
        >
          <Text style={styles.calendarArrowText}>›</Text>
        </Pressable>
      </View>
      <View style={styles.weekRow}>
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <Text key={`${day}-${index}`} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.calendarGrid}>
        {cells.map((day, index) => {
          const dateLabel = day ? formatDate(day) : "";
          const isToday =
            day === now.getDate() &&
            month.getMonth() === now.getMonth() &&
            month.getFullYear() === now.getFullYear();
          const selected =
            dateLabel === value || (value === "Today" && isToday);
          return (
            <Pressable
              key={`${dateLabel}-${index}`}
              disabled={!day}
              onPress={() => day && onChange(dateLabel)}
              style={[
                styles.calendarDay,
                selected && styles.calendarDaySelected,
              ]}
            >
              <Text
                style={[
                  styles.calendarDayText,
                  selected && styles.calendarDaySelectedText,
                ]}
              >
                {day ?? ""}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

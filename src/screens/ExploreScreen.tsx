import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { FILTERS, type Filter } from "../constants/app";
import { useBookingStore } from "../store/useBookingStore";
import { styles } from "../styles";
import { RoomCard } from "../components/RoomCard";
import { RoomSkeleton } from "../components/RoomSkeleton";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ExploreScreen({
  userName,
}: {
  userName: string;
}) {
  const rooms = useBookingStore((state) => state.rooms);
  const loadRooms = useBookingStore((state) => state.loadRooms);

  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] =
    useState<Filter[]>(["All"]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        await loadRooms();
      } catch (error) {
        console.error("Failed to load rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [loadRooms]);

  const filteredRooms = useMemo(
    () =>
      rooms.filter((room) => {
        const query = search.trim().toLowerCase();

        const matchesSearch = [
          room.name,
          room.building,
          room.type,
        ].some((value) => value.toLowerCase().includes(query));

        const matchesFilter =
          activeFilters.includes("All") ||
          activeFilters.every((filter) => {
            if (filter === "Available") {
              return room.status.toLowerCase() === "available";
            }

            if (
              filter === "Study Room" ||
              filter === "Computer Lab"
            ) {
              return room.type === filter;
            }

            return room.building === filter;
          });

        return matchesSearch && matchesFilter;
      }),
    [activeFilters, rooms, search],
  );

  const toggleFilter = (filter: Filter) => {
    if (filter === "All") {
      return setActiveFilters(["All"]);
    }

    setActiveFilters((current) => {
      const next = current
        .filter((item) => item !== "All")
        .includes(filter)
        ? current.filter(
            (item) =>
              item !== filter && item !== "All",
          )
        : [
            ...current.filter(
              (item) => item !== "All",
            ),
            filter,
          ];

      return next.length ? next : ["All"];
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={isLoading ? [] : filteredRooms}
        renderItem={({ item }) => (
          <RoomCard room={item} />
        )}
        numColumns={2}
        columnWrapperStyle={styles.roomGridRow}
        keyExtractor={(room) => room.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View>
                <Text style={styles.eyebrow}>
                  CAMPUS SPACES
                </Text>

                <Text style={styles.heading}>
                  Find your focus.
                </Text>

                <Text style={styles.subheading}>
                  Book a room, get things done.
                </Text>
              </View>

              <View style={styles.profileCircle}>
                <Text style={styles.profileText}>
                  {getInitials(userName)}
                </Text>
              </View>
            </View>

            <Image
              source={require("../../assets/campus.png")}
              style={styles.homeBanner}
              resizeMode="cover"
            />

            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={20} color="#0F6B72" style={styles.searchIcon} />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search rooms, buildings..."
                placeholderTextColor="#9A9FA8"
                style={styles.searchInput}
                returnKeyType="search"
              />
            </View>

            <FlatList
              data={FILTERS}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(filter) => filter}
              contentContainerStyle={
                styles.filtersContent
              }
              renderItem={({ item: filter }) => {
                const selected =
                  activeFilters.includes(filter);

                return (
                  <Pressable
                    onPress={() =>
                      toggleFilter(filter)
                    }
                    style={({ pressed }) => [
                      styles.filterChip,
                      selected &&
                        styles.selectedFilterChip,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selected &&
                          styles.selectedFilterText,
                      ]}
                    >
                      {filter}
                    </Text>
                  </Pressable>
                );
              }}
            />

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  Explore rooms
                </Text>

                <Text style={styles.sectionCaption}>
                  Live availability across campus
                </Text>
              </View>

              <Text style={styles.resultCount}>
                {filteredRooms.length} spaces
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View>
              <RoomSkeleton />
              <RoomSkeleton />
              <RoomSkeleton />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                No rooms found
              </Text>

              <Text style={styles.emptyText}>
                Try another search or remove a filter.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
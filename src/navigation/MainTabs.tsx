import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { User } from "firebase/auth";
import { ExploreScreen } from "../screens/ExploreScreen";
import { MyBookingsScreen } from "../screens/MyBookingsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import type { TabParamList } from "../types/navigation";
import { styles } from "../styles";

const Tabs = createBottomTabNavigator<TabParamList>();

export function MainTabs({
  onLogout,
  user,
}: {
  onLogout: () => void;
  user: User;
}) {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0F6B72",
        tabBarInactiveTintColor: "#87949D",
        tabBarStyle: {
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopColor: "#D8E2E1",
          backgroundColor: "#FDFEFE",
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="Explore"
        children={() => <ExploreScreen userName={user.displayName ?? user.email ?? "Student"} />}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons color={color} size={size} name="home-outline" />,
        }}
      />
      <Tabs.Screen
        name="My Bookings"
        children={() => <MyBookingsScreen user={user} />}
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, size }) => <Ionicons color={color} size={size} name="calendar-outline" />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        children={() => (
            <ProfileScreen onLogout={onLogout} user={user} />
        )}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons color={color} size={size} name="person-circle-outline" />,
        }}
      />
    </Tabs.Navigator>
  );
}


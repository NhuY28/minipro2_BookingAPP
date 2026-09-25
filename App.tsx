import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { MainTabs } from "./src/navigation/MainTabs";
import { AuthScreen } from "./src/screens/AuthScreen";
import { BookingScreen } from "./src/screens/BookingScreen";
import { RoomDetailScreen } from "./src/screens/RoomDetailScreen";
import type { RootStackParamList } from "./src/types/navigation";
import { styles } from "./src/styles";
import { auth } from "./src/services/firebase";
import { logout, subscribeToAuthState } from "./src/services/authService";
import type { User } from "firebase/auth";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  useEffect(() => {
    return subscribeToAuthState((nextUser) => {
      setUser(nextUser);
      setIsRestoringSession(false);
    });
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  if (isRestoringSession)
    return (
      <SafeAreaView style={styles.authSafeArea}>
        <StatusBar style="dark" />
        <View style={styles.sessionLoading}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>SR</Text>
          </View>
          <Text style={styles.sessionLoadingText}>
            Preparing your study space...
          </Text>
        </View>
      </SafeAreaView>
    );
  if (!user) return <AuthScreen onAuthenticated={() => setUser(auth.currentUser)} />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="MainTabs"
          children={() => (
            <MainTabs onLogout={handleLogout} user={user} />
          )}
        />
        <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

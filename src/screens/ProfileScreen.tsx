import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
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
import type { User } from "firebase/auth";
import { InfoItem } from "../components/InfoItem";
import {
  changeUserPassword,
  updateUserProfile,
} from "../services/authService";
import {
  getUserProfile,
  saveUserProfile,
} from "../services/userService";
import { styles } from "../styles";

export function ProfileScreen({ onLogout, user }: { onLogout: () => void; user: User }) {
  const [name, setName] = useState(user.displayName ?? user.email ?? "Student");
  const [avatarUri, setAvatarUri] = useState(user.photoURL);
  const [newPassword, setNewPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const savedAvatar = await AsyncStorage.getItem(
        `study-room-booking.avatar.${user.uid}`
      );

      if (savedAvatar) {
        setAvatarUri(savedAvatar);
      }

      const profile = await getUserProfile(user.uid);
      if (profile?.displayName) {
        setName(profile.displayName);
      }
      if (profile?.avatarUrl) {
        setAvatarUri(profile.avatarUrl);
      }
    };

    loadProfile();
  }, [user.uid]);

  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (result.canceled) return;
    const uri = result.assets[0].uri;
    setAvatarUri(uri);
    await AsyncStorage.setItem(`study-room-booking.avatar.${user.uid}`, uri);
    await updateUserProfile({ photoURL: uri });
  };

  const saveProfile = async () => {
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      Alert.alert("Invalid name", "Please enter at least 2 characters.");
      return;
    }

    await updateUserProfile({ displayName: cleanName });
    await saveUserProfile(user.uid, {
      displayName: cleanName,
      email: user.email ?? "",
      avatarUrl: avatarUri ?? user.photoURL ?? "",
      role: "student",
      provider: "email-password",
      updatedAt: Date.now(),
    });
    setName(cleanName);
    setIsEditing(false);
    Alert.alert("Profile updated", "Your profile has been saved.");
  };

  const savePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert("Invalid password", "Use at least 6 characters.");
      return;
    }
    try {
      await changeUserPassword(newPassword);
      setNewPassword("");
      Alert.alert("Password updated", "Your new password is active.");
    } catch (error: any) {
      Alert.alert("Password update failed", error?.code === "auth/requires-recent-login" ? "Please sign in again before changing your password." : "Could not update your password.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={[]}
        renderItem={null}
        contentContainerStyle={styles.profileContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.profilePageTitle}>Profile</Text>
            <Text style={styles.subheading}>Your study space preferences.</Text>
            <View style={styles.profileHero}>
              <Pressable onPress={pickAvatar} style={styles.profileAvatarButton}>
                {avatarUri ? <Image source={{ uri: avatarUri }} style={styles.profileAvatarImage} /> : <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>{initials}</Text></View>}
                <View style={styles.avatarEditBadge}>
                  <Ionicons name="camera-outline" size={13} color="#082238" />
                </View>
                <Text style={styles.avatarEditText}>Edit</Text>
              </Pressable>
              <View style={styles.profileIdentity}>
                <Text style={styles.profileName}>{name}</Text>
                <Text style={styles.profileEmail}>{user.email ?? "No email"}</Text>
              </View>
            </View>
            <View style={styles.profileSection}>
              <View style={styles.profileSectionHeading}>
                <Ionicons name="person-outline" size={18} color="#B8A46A" />
                <Text style={styles.detailLabel}>Account</Text>
              </View>
              <InfoItem label="Student ID" value="2024-01842" />
              <InfoItem label="Faculty" value="Computer Science" />
              {isEditing && <TextInput value={name} onChangeText={setName} placeholder="Full name" style={styles.profileInput} />}
              <Pressable onPress={isEditing ? saveProfile : () => setIsEditing(true)} style={styles.profileActionButton}>
                <Text style={styles.profileActionText}>{isEditing ? "Save profile" : "Update profile"}</Text>
              </Pressable>
            </View>
            <View style={styles.profileSection}>
              <View style={styles.profileSectionHeading}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#B8A46A" />
                <Text style={styles.detailLabel}>Security</Text>
              </View>
              <TextInput value={newPassword} onChangeText={setNewPassword} placeholder="New password" placeholderTextColor="#9CA3AF" secureTextEntry style={styles.profileInput} />
              <Pressable onPress={savePassword} style={styles.profileActionButton}><Text style={styles.profileActionText}>Update password</Text></Pressable>
            </View>
            <Pressable onPress={onLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={18} color="#0F6B72" />
              <Text style={styles.logoutText}>Log out</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

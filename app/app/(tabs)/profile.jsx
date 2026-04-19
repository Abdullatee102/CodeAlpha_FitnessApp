import React, { useState } from "react";
import { 
  StyleSheet, Text, View, Image, 
  TouchableOpacity, ScrollView, Alert, Dimensions, ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Correct Import
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from "../../firebaseConfig"; 
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useAuthStore } from "../../store/store"; 
import { useFitnessStore } from "../../store/fitness";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { waterIntake, caloriesBurnt } = useFitnessStore();
  const [uploading, setUploading] = useState(false);

  // Fallback values
  const fullName = user?.displayName || "Fitness Enthusiast";
  const email = user?.email || "user@example.com";
  const avatarUrl = user?.photoURL;

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive", 
          onPress: async () => {
            try {
              await logout();
              router.replace("/sign-in"); 
            } catch (error) {
              Alert.alert("Error", "Failed to sign out.");
            }
          } 
        }
      ]
    );
  };

  const pickAndUploadImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Needed", "Please allow gallery access in settings.");
        return;
      }

      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6, 
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        setUploading(false);
        return;
      }

      const selectedUri = result.assets[0].uri;

      // Update Firebase Auth & Firestore
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: selectedUri });
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDocRef, { photoURL: selectedUri });
        
        Alert.alert("Success", "Profile picture updated!");
      }
    } catch (error) {
      console.error("Image Picking Error:", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity onPress={handleLogout}>
            <MaterialCommunityIcons name="logout-variant" size={24} color="#FF4444" />
          </TouchableOpacity>
        </View>

        {/* USER INFO */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.placeholderAvatar]}>
                <Ionicons name="person" size={60} color="#FFF" />
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.cameraBtn} 
              onPress={pickAndUploadImage}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons name="camera" size={18} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="water" size={24} color="#7E0054" />
            <Text style={styles.statVal}>{waterIntake?.toFixed(1) || 0}L</Text>
            <Text style={styles.statLabel}>Water</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="fire" size={24} color="#7E0054" />
            <Text style={styles.statVal}>{caloriesBurnt || 0}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="calendar-check" size={24} color="#7E0054" />
            <Text style={styles.statVal}>Active</Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
        </View>

        {/* MENU */}
        <View style={styles.menuContainer}>
          {[
            { id: 1, label: 'Edit Personal Details', icon: 'account-outline', route: '/edit' },
            { id: 2, label: 'Workout Statistics', icon: 'chart-bell-curve-cumulative', route: '/stats' },
            { id: 3, label: 'Privacy & Security', icon: 'shield-lock-outline', route: '/privacy' },
            { id: 4, label: 'Support Center', icon: 'information-outline', route: '/support' },
          ].map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={() => item.route && router.push(item.route)}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={item.icon} size={22} color="#7E0054" />
              </View>
              <Text style={styles.menuText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#DDD" />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  headerTitle: { fontWeight: "bold", fontSize: 20, color: "#333" },
  profileSection: { alignItems: "center", marginTop: 10 },
  avatarWrapper: { 
    position: "relative",
    elevation: 8,
    shadowColor: "#7E0054",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatar: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
  },
  placeholderAvatar: {
    backgroundColor: "#7E0054", 
    justifyContent: "center",
    alignItems: "center",
  },
  cameraBtn: { 
    position: "absolute", bottom: 0, right: 0, 
    backgroundColor: "#7E0054", width: 40, height: 40, borderRadius: 20, 
    justifyContent: "center", alignItems: "center", borderWidth: 4, borderColor: "#FFF" 
  },
  userName: { fontWeight: "bold", fontSize: 24, color: "#333", marginTop: 15 },
  userEmail: { fontSize: 14, color: "#999" },
  statsRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    paddingHorizontal: 20, 
    marginTop: 35 
  },
  statCard: { 
    backgroundColor: "#FFF", width: width * 0.28, paddingVertical: 20, 
    borderRadius: 25, alignItems: "center", borderWidth: 1, borderColor: "#F2F2F2",
    elevation: 2
  },
  statVal: { fontWeight: "bold", fontSize: 18, color: "#333", marginTop: 5 },
  statLabel: { fontSize: 11, color: "#BBB" },
  menuContainer: { marginTop: 30, paddingHorizontal: 20, paddingBottom: 40, },
  menuItem: { 
    flexDirection: "row", alignItems: "center",
    padding: 16, borderRadius: 22, marginBottom: 12, borderWidth: 1, borderColor: "#F9F9F9", backgroundColor: '#7e0034'
  },
  iconContainer: { 
    width: 44, height: 44, borderRadius: 14, backgroundColor: "#FDF0F9", 
    justifyContent: "center", alignItems: "center" 
  },
  menuText: { flex: 1, marginLeft: 15, fontWeight: "bold", fontSize: 15, color: "#fff" },
});
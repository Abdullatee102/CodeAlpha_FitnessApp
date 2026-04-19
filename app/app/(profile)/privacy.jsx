import React, { useState } from "react";
import { 
  StyleSheet, Text, View, Switch, 
  TouchableOpacity, ScrollView, Alert 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { auth } from "../../firebaseConfig";
import { sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { useAuthStore } from "../../store/store"; 
import { useFitnessStore } from "../../store/fitness";

export default function PrivacyScreen() {
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);

  // Get reset functions from your stores to clear local data
  const logout = useAuthStore((state) => state.logout);
  const resetDailyStats = useFitnessStore((state) => state.resetDailyStats);

  const handlePasswordReset = async () => {
    if (auth.currentUser?.email) {
      try {
        await sendPasswordResetEmail(auth, auth.currentUser.email);
        router.push('/reset-password');
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account?",
      "This action is permanent and cannot be undone. All your fitness progress and personal data will be wiped.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Permanently", 
          style: "destructive", 
          onPress: async () => {
            const user = auth.currentUser;
            if (user) {
              try {
                await deleteUser(user);
                resetDailyStats(); 
                logout(); 
                Alert.alert("Account Deleted", "Your information has been removed from our systems.");
                router.replace("/sign-up"); 
              } catch (error) {
                console.error(error);
                if (error.code === 'auth/requires-recent-login') {
                  Alert.alert(
                    "Security Re-authentication",
                    "For your security, please log out and log back in before deleting your account."
                  );
                } else {
                  Alert.alert("Error", "Could not delete account. Please try again later.");
                }
              }
            }
          } 
        }
      ]
    );
  };

  const openSystemSettings = () => {
    Alert.alert(
      "App Permissions",
      "To manage Camera or Gallery access, please visit your phone's system settings.",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <Text style={styles.sectionLabel}>App Permissions</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="location-outline" size={22} color="#7E0054" />
              <Text style={styles.settingText}>Location Access</Text>
            </View>
            <Switch 
              value={isLocationEnabled} 
              onValueChange={setIsLocationEnabled}
              trackColor={{ false: "#EEE", true: "#FDF0F9" }}
              thumbColor={isLocationEnabled ? "#7E0054" : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity style={styles.settingRow} onPress={openSystemSettings}>
            <View style={styles.settingInfo}>
              <Ionicons name="camera-outline" size={22} color="#7E0054" />
              <Text style={styles.settingText}>Camera & Gallery</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CCC" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Account Security</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="fingerprint" size={22} color="#7E0054" />
              <Text style={styles.settingText}>Biometric Login</Text>
            </View>
            <Switch 
              value={isBiometricEnabled} 
              onValueChange={setIsBiometricEnabled}
              trackColor={{ false: "#EEE", true: "#FDF0F9" }}
              thumbColor={isBiometricEnabled ? "#7E0054" : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity style={styles.settingRow} onPress={handlePasswordReset}>
            <View style={styles.settingInfo}>
              <Ionicons name="lock-closed-outline" size={22} color="#7E0054" />
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CCC" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Data Management</Text>
        <TouchableOpacity 
          style={[styles.card, styles.dangerCard]} 
          onPress={handleDeleteAccount}
        >
          <View style={styles.settingInfo}>
            <Ionicons name="trash-outline" size={22} color="#FF4444" />
            <Text style={[styles.settingText, { color: "#FF4444" }]}>Delete Account</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.footerNote}>
          Deleting your account will permanently remove all fitness data and personal information.
        </Text>

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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5"
  },
  headerTitle: { fontWeight: "bold", fontSize: 18, color: "#333" },
  content: { padding: 20 },
  sectionLabel: { 
    fontSize: 13, 
    fontWeight: "bold", 
    color: "#999", 
    textTransform: "uppercase", 
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 20
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    overflow: "hidden"
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F9F9F9"
  },
  settingInfo: { flexDirection: "row", alignItems: "center" },
  settingText: { 
    marginLeft: 15,
    fontSize: 16, 
    color: "#333", 
    fontWeight: "500",
    padding: 15
  },
  dangerCard: { borderColor: "#FFEBEB", backgroundColor: "#FFF5F5" },
  footerNote: {
    marginTop: 15,
    fontSize: 12,
    color: "#BBB",
    paddingHorizontal: 5,
    lineHeight: 18
  }
});
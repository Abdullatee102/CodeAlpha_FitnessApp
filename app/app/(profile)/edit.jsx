import React, { useState } from "react";
import { 
  StyleSheet, Text, View, TextInput, 
  TouchableOpacity, ScrollView, Alert, ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { auth } from "../../firebaseConfig";
import { updateProfile } from "firebase/auth";
import { useAuthStore } from "../../store/store";

export default function EditProfileScreen() {
  const authStore = useAuthStore();
  
  // Local state for inputs
  const [fullName, setFullName] = useState(authStore.user?.displayName || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: fullName,
        });

        authStore.setUser({
          ...auth.currentUser,
          displayName: fullName,
        });

        Alert.alert("Success", "Profile updated successfully!");
        router.back();
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Update Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleUpdate} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#7E0054" />
          ) : (
            <Text style={styles.saveBtn}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={authStore.user?.email}
          editable={false} // Email changes usually require re-authentication
        />
        <Text style={styles.infoText}>Email cannot be changed here.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0"
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  saveBtn: { color: "#7E0054", fontWeight: "bold", fontSize: 16 },
  form: { padding: 20 },
  label: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#666", 
    marginBottom: 8,
    marginTop: 20 
  },
  input: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#EEE"
  },
  disabledInput: {
    backgroundColor: "#F0F0F0",
    color: "#999",
  },
  infoText: {
    fontSize: 12,
    color: "#BBB",
    marginTop: 5,
    marginLeft: 5
  }
});
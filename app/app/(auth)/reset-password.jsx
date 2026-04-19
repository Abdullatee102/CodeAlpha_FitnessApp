import React, { useState } from "react";
import { 
  StyleSheet, Text, View, TextInput, 
  TouchableOpacity, Alert, ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      
      Alert.alert(
        "Reset Email Sent",
        "A password reset link has been sent to your email.",
        [
          { 
            text: "OK", 
            onPress: () => router.push("/email-success") 
          }
        ]
      );
    } catch (error) {
      console.error(error);
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No user found with this email.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      }
      
      Alert.alert("Reset Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-open-outline" size={80} color="#7E0054" />
        </View>

        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Please enter your email address"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity 
          style={styles.resetBtn} 
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.resetBtnText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backToLogin} 
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>Suddenly remembered? <Text style={styles.boldText}>Go Back</Text></Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: 15 
  },
  headerTitle: { fontWeight: "bold", fontSize: 18, color: "#333" },
  content: { padding: 30, alignItems: "center" },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#FDF0F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 10 },
  subtitle: { fontSize: 14, color: "#777", textAlign: "center", lineHeight: 20, marginBottom: 40 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    width: '100%',
    borderWidth: 1,
    borderColor: "#EEE",
    marginBottom: 25
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: "#333", fontSize: 16 },
  resetBtn: {
    backgroundColor: "#7E0054",
    width: '100%',
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  resetBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  backToLogin: { marginTop: 25 },
  backText: { color: "#999", fontSize: 14 },
  boldText: { color: "#7E0054", fontWeight: "bold" }
});
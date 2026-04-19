import React from "react";
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  Dimensions 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function EmailSuccessScreen() {
  
  const handleContinue = () => {
    router.replace("/privacy");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* SUCCESS ICON ANIMATION AREA */}
        <View style={styles.illustrationContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <MaterialCommunityIcons name="email-check" size={70} color="#7E0054" />
            </View>
          </View>
          
          {/* Decorative floating dots */}
          <View style={[styles.dot, { top: 10, left: 40, backgroundColor: '#7E0054' }]} />
          <View style={[styles.dot, { bottom: 20, right: 30, backgroundColor: '#0284C7' }]} />
        </View>

        {/* TEXT CONTENT */}
        <Text style={styles.title}>Check Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a password recovery link to your inbox. Please follow the instructions to set a new password.
        </Text>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            Didn't receive it? Check your <Text style={styles.boldText}>Spam</Text> folder or wait a few minutes.
          </Text>
        </View>

        {/* ACTION BUTTON */}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleContinue}>
          <Text style={styles.btnText}>Back to Security</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 10 }} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.resendBtn} 
          onPress={() => router.back()}
        >
          <Text style={styles.resendText}>Try another email address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFFFFF" 
  },
  content: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    paddingHorizontal: 30 
  },
  illustrationContainer: {
    marginBottom: 40,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#FDF0F9",
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#7E0054",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  dot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    color: "#333", 
    marginBottom: 15,
    textAlign: "center" 
  },
  subtitle: { 
    fontSize: 15, 
    color: "#777", 
    textAlign: "center", 
    lineHeight: 22,
    marginBottom: 30 
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 40,
    width: '100%',
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 10,
    flex: 1,
  },
  boldText: {
    fontWeight: "bold",
    color: "#333",
  },
  primaryBtn: {
    backgroundColor: "#7E0054",
    width: '100%',
    height: 58,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#7E0054",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  btnText: { 
    color: "#FFF", 
    fontSize: 17, 
    fontWeight: "bold" 
  },
  resendBtn: { 
    marginTop: 25 
  },
  resendText: { 
    color: "#7E0054", 
    fontSize: 14, 
    fontWeight: "600" 
  },
});
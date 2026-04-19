import React from "react";
import { 
  StyleSheet, Text, View, ScrollView, 
  TouchableOpacity, Linking, Alert 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function SupportScreen() {
  
  const handleContactEmail = () => {
    Linking.openURL('mailto:popoolaabdullateef40@gmail.com?subject=App Support Request');
  };

  const handleLiveChat = () => {
    Alert.alert("Live Chat", "This feature is not available for now...");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Center</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* CONTACT CARDS */}
        <Text style={styles.sectionLabel}>Contact Us</Text>
        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactCard} onPress={handleContactEmail}>
            <View style={[styles.iconCircle, { backgroundColor: '#FDF0F9' }]}>
              <Ionicons name="mail" size={24} color="#7E0054" />
            </View>
            <Text style={styles.contactMethod}>Email Support</Text>
            <Text style={styles.contactSub}>24h Response</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={handleLiveChat}>
            <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="chatbubbles" size={24} color="#0284C7" />
            </View>
            <Text style={styles.contactMethod}>Live Chat</Text>
            <Text style={styles.contactSub}>Fastest way</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ SECTION */}
        <Text style={styles.sectionLabel}>Common Questions</Text>
        <View style={styles.faqContainer}>
          {[
            { q: "How do I track my daily water?", a: "Go to the Home tab and use the '+' button on the water card." },
            { q: "Can I sync with other apps?", a: "Currently, we support manual logging, but sync features are coming soon!" },
            { q: "How to update profile photo?", a: "Go to 'My Profile' and click the camera icon on your avatar." },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.faqItem}>
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{item.q}</Text>
                <Ionicons name="chevron-down" size={18} color="#CCC" />
              </View>
              <Text style={styles.faqAnswer}>{item.a}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FOOTER INFO */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.4 (Build 22)</Text>
          <Text style={styles.madeWith}>Made with ❤️ for Fitness</Text>
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
    marginBottom: 15,
    marginTop: 10
  },
  contactRow: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    marginBottom: 30
  },
  contactCard: {
    width: '47%',
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 2,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12
  },
  contactMethod: { fontWeight: "bold", fontSize: 15, color: "#333" },
  contactSub: { fontSize: 12, color: "#999", marginTop: 4 },
  
  faqContainer: { backgroundColor: "#F9F9F9", borderRadius: 22, padding: 10 },
  faqItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#EEE" },
  faqHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  faqQuestion: { fontWeight: "600", color: "#333", fontSize: 15, flex: 1, paddingRight: 10 },
  faqAnswer: { color: "#777", fontSize: 13, marginTop: 8, lineHeight: 18 },
  
  footer: { marginTop: 40, alignItems: "center", paddingBottom: 20 },
  versionText: { color: "#BBB", fontSize: 12 },
  madeWith: { color: "#DDD", fontSize: 11, marginTop: 5 }
});
import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, 
  TouchableOpacity, Alert 
} from 'react-native';
import { router } from 'expo-router';
import { auth } from '../../firebaseConfig';
import { sendPasswordResetEmail } from "firebase/auth";
import Button from "../../components/ui/button";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async () => {
    if (!email) {
      Alert.alert("Input Required", "Please enter your email address to receive a reset link.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Link Sent 📧", 
        "If an account exists for this email, you will receive a password reset link shortly.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER SECTION */}
      <View style={styles.headerSection}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="lock-reset" size={40} color="#7E0054" />
        </View>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your email address below and we'll send you a link to reset your password.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.modernInput}>
          <Ionicons name="mail-outline" size={20} color="#7E0054" style={styles.icon} />
          <TextInput
            style={styles.field}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
        </View>

        <Button
          text={loading ? "SENDING LINK..." : "SEND RESET LINK"}
          onPress={handleResetRequest}
          disabled={loading}
        />
      </View>

      {/* FOOTER NAVIGATION */}
      <View style={styles.footerLink}>
        <Text style={styles.footerText}>Remember your password? </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    padding: 25, 
    justifyContent: 'center' 
  },
  headerSection: { 
    marginBottom: 40, 
    alignItems: 'center' 
  },
  iconCircle: { 
    width: 75, 
    height: 75, 
    borderRadius: 38, 
    backgroundColor: '#FDF0F9', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#7E0054',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  subtitle: { 
    fontSize: 15, 
    color: '#666', 
    marginTop: 10, 
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10
  },
  form: { 
    marginBottom: 20 
  },
  modernInput: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F9F9F9', 
    borderRadius: 15, 
    paddingHorizontal: 15, 
    marginBottom: 25, 
    borderWidth: 1, 
    borderColor: '#F0F0F0' 
  },
  icon: { 
    marginRight: 10 
  },
  field: { 
    flex: 1, 
    paddingVertical: 15, 
    fontSize: 16, 
    color: '#333' 
  },
  footerLink: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 30 
  },
  footerText: { 
    color: '#777', 
    fontSize: 14 
  },
  link: { 
    color: '#7E0054', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
});
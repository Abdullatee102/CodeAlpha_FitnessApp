import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, 
  TouchableOpacity, Alert 
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../store/store';
import Button from "../components/ui/button";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const authStore = useAuthStore();

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Registration Error", "Please fill in all required details");
      return;
    }
    setLoading(true);
    try {
      await authStore.signup(email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: fullName });
      }
      Alert.alert("Success ✨", "Account created successfully!");
      router.replace('./sign-in');
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        // This fails silently if no user is signed in
      }
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;

      if (!idToken) throw new Error("No ID Token found");

      await authStore.googleAuth(idToken);
      router.replace('/(tabs)')
    } catch (error) {
      Alert.alert("Google Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER SECTION */}
      <View style={styles.headerSection}>
        <View style={styles.welcomeCircle}>
          <MaterialCommunityIcons name="hand-wave" size={40} color="#7E0054" />
        </View>
        <Text style={styles.header}>Create Account</Text>
        <Text style={styles.subHeader}>We're excited to have you join us!</Text>
      </View>

      <View style={styles.inputContainer}>
        {/* NAME INPUT */}
        <View style={styles.modernInput}>
          <Ionicons name="person-outline" size={20} color="#7E0054" style={styles.icon} />
          <TextInput
            style={styles.field}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor="#999"
          />
        </View>

        {/* EMAIL INPUT */}
        <View style={styles.modernInput}>
          <Ionicons name="mail-outline" size={20} color="#7E0054" style={styles.icon} />
          <TextInput
            style={styles.field}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
        </View>

        {/* PASSWORD INPUT */}
        <View style={styles.modernInput}>
          <Ionicons name="lock-closed-outline" size={20} color="#7E0054" style={styles.icon} />
          <TextInput
            style={styles.field}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#CCC" />
          </TouchableOpacity>
        </View>
      </View>

      <Button
        text={loading ? "CREATING ACCOUNT..." : "GET STARTED"}
        onPress={handleSignUp}
        disabled={loading}
      />

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* GOOGLE SIGN UP BUTTON */}
      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={handleGoogleSignUp}
        disabled={loading}
      >
        <Ionicons name="logo-google" size={20} color="#DB4437" style={{ marginRight: 10 }} />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* REFINED FOOTER NAVIGATION */}
      <View style={styles.footerLink}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/sign-in')}>
          <Text style={styles.link}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#FFFFFF', justifyContent: 'center' },
  headerSection: { alignItems: 'center', marginBottom: 30 },
  welcomeCircle: { 
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
  header: { fontSize: 30, fontWeight: 'bold', color: '#333' },
  subHeader: { fontSize: 15, color: '#666', marginTop: 5, textAlign: 'center' },
  inputContainer: { marginBottom: 20 },
  modernInput: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F9F9F9', 
    borderRadius: 15, 
    paddingHorizontal: 15, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#F0F0F0' 
  },
  icon: { marginRight: 10 },
  field: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#333' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  line: { flex: 1, height: 1, backgroundColor: '#F0F0F0' },
  dividerText: { marginHorizontal: 10, color: '#BBB', fontSize: 12 },
  googleButton: { 
    flexDirection: 'row', 
    borderWidth: 1, 
    borderColor: '#EEE', 
    padding: 15, 
    borderRadius: 15, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#FAFAFA' 
  },
  googleButtonText: { fontWeight: 'bold', color: '#444' },
  footerLink: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 30 
  },
  footerText: { color: '#777', fontSize: 14 },
  link: { color: '#7E0054', fontWeight: 'bold', fontSize: 14 },
});
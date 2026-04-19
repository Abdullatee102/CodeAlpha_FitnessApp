import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, 
  TouchableOpacity, Alert 
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../store/store';
import Button from "../components/ui/button"; 
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from '../firebaseConfig';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const googleAuth = useAuthStore((state) => state.googleAuth);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.replace('./(tabs)');
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;

      if (!idToken) throw new Error("No ID Token found");
      await googleAuth(idToken);
      router.replace('./(tabs)');
    } catch (error) {
      if (error.code !== 'ASYNC_OP_IN_PROGRESS') {
        Alert.alert("Google Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER SECTION */}
      <View style={styles.headerSection}>
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons name="arm-flex" size={40} color="#7E0054" />
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to continue your progress</Text>
      </View>

      <View style={styles.form}>
        {/* EMAIL INPUT - MODERN BOX STYLE */}
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

        {/* PASSWORD INPUT - MODERN BOX STYLE */}
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
        
        <TouchableOpacity style={styles.forgotPass} onPress={() => router.push('/forgot-password')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          text={loading ? "AUTHENTICATING..." : "SIGN IN"}
          onPress={handleSignIn}
          disabled={loading}
        />
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={handleGoogleSignIn}
        disabled={loading}
      >
        <Ionicons name="logo-google" size={20} color="#DB4437" style={{ marginRight: 10 }} />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* REFINED FOOTER - ONLY "CREATE ACCOUNT" IS PRESSABLE */}
      <View style={styles.footerLink}>
        <Text style={styles.footerText}>New to the platform? </Text>
        <TouchableOpacity onPress={() => router.push('/sign-up')}>
          <Text style={styles.link}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 25, justifyContent: 'center' },
  headerSection: { marginBottom: 40, alignItems: 'center' },
  logoCircle: { 
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
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 15, color: '#666', marginTop: 5 },
  form: { marginBottom: 20 },
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
  forgotPass: { alignSelf: 'flex-end', marginBottom: 30 },
  forgotText: { color: '#7E0054', fontWeight: 'bold', fontSize: 13 },
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
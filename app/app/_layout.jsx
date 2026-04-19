import { useEffect } from 'react';
import { Stack } from 'expo-router'; 
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useAuthStore } from '../store/store';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const listenToAuthChanges = useAuthStore((state) => state.listenToAuthChanges);

  // Configuring the Google Auth
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '256725246229-hrnkbvgaugaka3b4ks6b4nrcei3mmpsi.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    'OpenSans-Regular': require('../assets/fonts/Open_Sans/static/OpenSans-Regular.ttf'),
    'OpenSans-Italic': require('../assets/fonts/Open_Sans/static/OpenSans-Italic.ttf'),
    'OpenSans-Bold': require('../assets/fonts/Open_Sans/static/OpenSans-Bold.ttf'),
    'OpenSans-BoldItalic': require('../assets/fonts/Open_Sans/static/OpenSans-BoldItalic.ttf'),
    
    'RobotoCondensed-Regular': require('../assets/fonts/Roboto_Condensed/static/RobotoCondensed-Regular.ttf'),
    'RobotoCondensed-Italic': require('../assets/fonts/Roboto_Condensed/static/RobotoCondensed-Italic.ttf'),
    'RobotoCondensed-Bold': require('../assets/fonts/Roboto_Condensed/static/RobotoCondensed-Bold.ttf'),
    'RobotoCondensed-BoldItalic': require('../assets/fonts/Roboto_Condensed/static/RobotoCondensed-BoldItalic.ttf'),
  });

  useEffect(() => {
    const unsubscribe = listenToAuthChanges();
    return () => unsubscribe(); 
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && !isLoading) {
      SplashScreen.hideAsync().catch((err) => {
        console.warn("Error hiding splash screen:", err);
      });
    }
  }, [fontsLoaded, fontError, isLoading]);

  if (!fontsLoaded && !fontError) {
    return null; 
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="(home)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}
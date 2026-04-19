import { useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/store'; 

export default function Index() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hasFinishedOnboarding = useAuthStore((state) => state.hasFinishedOnboarding);

  useEffect(() => {
    const isNavigationReady = rootNavigationState?.key;

    if (isNavigationReady && !isLoading) {
      if (user) {
        router.replace('/(tabs)'); 
      } else if (!hasFinishedOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/sign-in');
      }
    }
  }, [rootNavigationState?.key, isLoading, user, hasFinishedOnboarding]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
      <ActivityIndicator size="large" color="#7e0054" />
    </View>
  );
}
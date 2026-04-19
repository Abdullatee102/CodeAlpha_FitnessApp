import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebaseConfig'; 
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  GoogleAuthProvider, 
  signInWithCredential 
} from 'firebase/auth';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore'; 
import { useFitnessStore } from '../store/fitness'; 

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null, 
      isLoading: true,
      profileImage: null, 
      hasFinishedOnboarding: false,

      listenToAuthChanges: () => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            set({ 
              user: firebaseUser, 
              isLoading: false, 
              profileImage: firebaseUser.photoURL 
            });

            try {
              const docRef = doc(db, "users", firebaseUser.uid, "activity", "daily");
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                useFitnessStore.getState().setSyncData(docSnap.data());
              } else {
                const initialStats = {
                  steps: 0,
                  waterIntake: 0,
                  caloriesBurnt: 0,
                  recentWorkouts: []
                };
                await setDoc(docRef, initialStats);
                useFitnessStore.getState().resetDailyStats();
              }
            } catch (error) {
              console.error("Error syncing user data from Firestore:", error);
            }
          } else {
            set({ user: null, isLoading: false, profileImage: null });
          }
        });
        return unsubscribe;
      },

      setHasFinishedOnboarding: (value) => set({ hasFinishedOnboarding: value }),
      setUser: (userData) => set({ user: userData, isLoading: false }),
      
      setProfileImage: async (uri) => {
        if (auth.currentUser) {
          try {
            await updateProfile(auth.currentUser, { photoURL: uri });
            set({ profileImage: uri });
          } catch (error) {
            console.error("Error updating profile image:", error);
          }
        }
      },

      googleLogin: async (idToken) => {
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
      },

      googleAuth: async (idToken) => {
        try {
          const credential = GoogleAuthProvider.credential(idToken);
          const userCredential = await signInWithCredential(auth, credential);
          return userCredential.user;
        } catch (error) {
          throw error;
        }
      },

      login: async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
      },

      signup: async (email, password) => {
        await createUserWithEmailAndPassword(auth, email, password);
      },

      logout: async () => {
        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            const stats = useFitnessStore.getState();
            const docRef = doc(db, "users", currentUser.uid, "activity", "daily");

            await updateDoc(docRef, {
              steps: stats.steps,
              waterIntake: stats.waterIntake,
              caloriesBurnt: stats.caloriesBurnt,
              recentWorkouts: stats.recentWorkouts,
            }).catch(err => console.log("Final sync skipped:", err.message));
          }
          
          await auth.signOut();
          
          useFitnessStore.getState().resetDailyStats();
          set({ user: null, isLoading: false, profileImage: null });

        } catch (error) {
          console.error("Logout error:", error);
          await auth.signOut().catch(() => {}); 
          useFitnessStore.getState().resetDailyStats();
          set({ user: null, isLoading: false, profileImage: null });
        }
      },
    }),
    {
      name: "auth-storage", 
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        hasFinishedOnboarding: state.hasFinishedOnboarding,
      }),
    }
  )
);
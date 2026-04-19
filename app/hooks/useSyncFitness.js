import { useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useFitnessStore } from '../store/fitness'; 

export const useSyncFitness = () => {
  const { steps, waterIntake, caloriesBurnt, recentWorkouts } = useFitnessStore();

  useEffect(() => {
    const syncData = async () => {
      if (auth.currentUser) {
        try {
          const docRef = doc(db, "users", auth.currentUser.uid, "activity", "daily");
          
          await updateDoc(docRef, {
            steps: steps,
            waterIntake: waterIntake,
            caloriesBurnt: caloriesBurnt,
            recentWorkouts: recentWorkouts,
          });
          
          console.log("Cloud Sync Successful");
        } catch (error) {
          console.error("Cloud Sync Error:", error);
        }
      }
    };

    syncData();
  }, [steps, waterIntake, caloriesBurnt, recentWorkouts]);
};
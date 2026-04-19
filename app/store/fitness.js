import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useFitnessStore = create(
  persist(
    (set) => ({
      steps: 0,
      waterIntake: 0, 
      caloriesBurnt: 0,
      currentWorkoutTimer: 0,
      isTimerActive: false,
      activeTask: null,
      recentWorkouts: [], 

      addWater: (amount) => set((state) => ({ waterIntake: state.waterIntake + amount })),
      updateCalories: (kcal) => set((state) => ({ caloriesBurnt: state.caloriesBurnt + kcal })),
      setSteps: (count) => set({ steps: count }),
      setActiveTask: (task) => set({ activeTask: task }),
      startTimer: () => set({ isTimerActive: true }),
      stopTimer: () => set({ isTimerActive: false }),
      tickTimer: () => set((state) => ({ currentWorkoutTimer: state.currentWorkoutTimer + 1 })),
      
      addWorkout: (workout) => set((state) => ({ 
        recentWorkouts: [workout, ...state.recentWorkouts].slice(0, 10) 
      })),

      resetTimer: () => set({ 
        currentWorkoutTimer: 0, 
        isTimerActive: false,
        activeTask: null 
      }),

      resetDailyStats: () => set({
        steps: 0,
        waterIntake: 0,
        caloriesBurnt: 0,
        currentWorkoutTimer: 0,
        isTimerActive: false,
        activeTask: null,
        recentWorkouts: [], 
      }),

      setSyncData: (data) => set({
        steps: data.steps ?? 0,
        waterIntake: data.waterIntake ?? 0,
        caloriesBurnt: data.caloriesBurnt ?? 0,
        recentWorkouts: data.recentWorkouts ?? [],
      }),
    }),
    {
      name: 'fitness-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        steps: state.steps, 
        waterIntake: state.waterIntake, 
        caloriesBurnt: state.caloriesBurnt,
        recentWorkouts: state.recentWorkouts 
      }), 
    }
  )
);
import React, { useEffect } from "react";
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  Alert, ScrollView 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFitnessStore } from "../../store/fitness";

const ScheduleScreen = () => {
  const { 
    currentWorkoutTimer, isTimerActive, activeTask,
    startTimer, stopTimer, tickTimer, resetTimer, 
    updateCalories, setActiveTask, addWorkout
  } = useFitnessStore();

  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => tickTimer(), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  const targetSeconds = activeTask ? activeTask.duration * 60 : 1;
  const progress = Math.min(currentWorkoutTimer / targetSeconds, 1);
  
  const rotateVal = `${progress * 360}deg`;

  useEffect(() => {
    if (activeTask && isTimerActive && currentWorkoutTimer >= targetSeconds) {
      stopTimer();
      Alert.alert("Goal Reached! 🏆", `Finished ${activeTask.task}!`, [
        { text: "Log Activity", onPress: () => handleSaveWorkout() }
      ]);
    }
  }, [currentWorkoutTimer]);

  const routines = [
    { id: '1', task: 'Morning Yoga', duration: 20, icon: 'yoga', cals: 150 },
    { id: '2', task: 'HIIT Cardio', duration: 45, icon: 'run', cals: 400 },
    { id: '3', task: 'Weight Lifting', duration: 60, icon: 'weight-lifter', cals: 300 },
    { id: '4', task: 'Evening Walk', duration: 15, icon: 'walk', cals: 100 },
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveWorkout = () => {
    const minutes = Math.floor(currentWorkoutTimer / 60);
    const seconds = currentWorkoutTimer % 60;
    const timeDisplay = minutes > 0 ? `${minutes} mins` : `${seconds} secs`;

    const workoutCalories = activeTask ? Math.round((currentWorkoutTimer / 60) * (activeTask.cals / activeTask.duration)) : 0;
    const earnedSteps = Math.round((currentWorkoutTimer / 60) * 100);

    if (activeTask) {
      const newLog = {
        id: Date.now().toString(),
        type: activeTask.task,
        time: timeDisplay, 
        cal: `${workoutCalories} kcal`,
        icon: activeTask.icon,
        date: new Date().toLocaleDateString(),
      };

      updateCalories(workoutCalories);
      addWorkout(newLog);
      
      const currentSteps = useFitnessStore.getState().steps;
      useFitnessStore.getState().setSteps(currentSteps + earnedSteps);
      
      stopTimer();
      Alert.alert(
        "Workout Saved! 🏆", 
        `You burnt ${workoutCalories} kcal and gained ${earnedSteps} energy steps.`, 
        [{ text: "Done", onPress: () => resetTimer() }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.glassCard}>
          <Text style={styles.activeTaskName}>{activeTask ? activeTask.task : "Select Exercise"}</Text>
          
          {/* THE DYNAMIC CIRCLE */}
          <View style={styles.timerCircle}>
            <View style={[
              styles.progressRing, 
              { transform: [{ rotate: rotateVal }], borderTopColor: progress > 0 ? '#7E0054' : '#F0E6EE' }
            ]} />
            
            <Text style={styles.timerDigits}>{formatTime(currentWorkoutTimer)}</Text>
            <Text style={styles.subText}>Active Time</Text>
          </View>

          <View style={styles.mainControls}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => resetTimer()}>
              <MaterialCommunityIcons name="refresh" size={28} color="#7E0054" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.playBtn, isTimerActive && styles.pauseBtn]} 
              onPress={() => activeTask ? (isTimerActive ? stopTimer() : startTimer()) : Alert.alert("Select a routine", "Please, kindly select a routine to save your current progress.")}
            >
              <Ionicons name={isTimerActive ? "pause" : "play"} size={36} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleSaveWorkout}>
              <MaterialCommunityIcons name="check-all" size={28} color="#00875A" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Daily Routine</Text>
        {routines.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.routineCard, activeTask?.id === item.id && styles.activeCard]}
            onPress={() => { resetTimer(); setActiveTask(item); }}
          >
            <View style={[styles.iconCircle, activeTask?.id === item.id && styles.activeIconCircle]}>
              <MaterialCommunityIcons name={item.icon} size={24} color={activeTask?.id === item.id ? "#FFF" : "#7E0054"} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.taskTitle}>{item.task}</Text>
              <Text style={styles.taskSub}>{item.duration} mins • Approx {item.cals} kcal</Text>
            </View>
            {activeTask?.id === item.id && (
              <Ionicons name="stats-chart" size={20} color="#7E0054" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FDFDFD" },
  container: { padding: 20 },
  glassCard: { backgroundColor: '#FFF', borderRadius: 35, padding: 25, alignItems: 'center', elevation: 5, marginBottom: 30 },
  activeTaskName: { fontFamily: 'RobotoCondensed-Bold', fontSize: 20, color: '#7E0054', marginBottom: 20 },
  timerCircle: { 
    width: 180, 
    height: 180, 
    borderRadius: 90, 
    borderWidth: 8, 
    borderColor: '#F0E6EE', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 25,
    position: 'relative'
  },
  progressRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    borderColor: 'transparent',
    borderTopColor: '#7E0054', 
  },

  timerDigits: { fontFamily: 'RobotoCondensed-Bold', fontSize: 42, color: '#333' },
  subText: { fontFamily: 'OpenSans-Regular', fontSize: 12, color: '#999' },
  mainControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%' },
  playBtn: { backgroundColor: '#7E0054', width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  pauseBtn: { backgroundColor: '#333' },
  secondaryBtn: { width: 55, height: 55, borderRadius: 20, backgroundColor: '#F9F9F9', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  sectionTitle: { fontFamily: 'RobotoCondensed-Bold', fontSize: 22, color: '#333', marginBottom: 15 },
  routineCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 22, marginBottom: 12, borderWidth: 1, borderColor: '#F5F5F5' },
  activeCard: { borderColor: '#7E0054', backgroundColor: '#FFF9FD' },
  iconCircle: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#FDF0F9', justifyContent: 'center', alignItems: 'center' },
  activeIconCircle: { backgroundColor: '#7E0054' },
  cardText: { flex: 1, marginLeft: 15 },
  taskTitle: { fontFamily: 'RobotoCondensed-Bold', fontSize: 17, color: '#333' },
  taskSub: { fontFamily: 'OpenSans-Regular', fontSize: 12, color: '#777' },
});

export default ScheduleScreen;
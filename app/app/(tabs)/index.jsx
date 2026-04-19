import React, { useState, useEffect, useRef } from "react";
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  ScrollView, Image, Dimensions, Alert, Platform, ImageBackground
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications'; 
import Constants from 'expo-constants';
import { useAuthStore } from "../../store/store"; 
import { useFitnessStore } from "../../store/fitness";
import { fitnessGuidelines } from "../../data/guidelinesData";
import { getDayTime } from "../../lib/time";
import { useSyncFitness } from '../../hooks/useSyncFitness';

const { width } = Dimensions.get('window');

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const HomeScreen = () => {
  
  useSyncFitness();

  const { user } = useAuthStore();
  const { waterIntake, caloriesBurnt, isTimerActive, currentWorkoutTimer, activeTask } = useFitnessStore();
  const [time, setTime] = useState(getDayTime());
  
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const timer = setInterval(() => setTime(getDayTime()), 60000);

    const setupNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
        await scheduleDailyReminders();
      }
    };

    setupNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification Received:", notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const route = response.notification.request.content.data?.route;
      if (route) router.push(route);
    });

    return () => {
      clearInterval(timer);
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return;
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } catch (e) {
      console.log("Error fetching push token:", e);
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7E0054',
      });
    }
    return token;
  }

  const scheduleDailyReminders = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Morning Motivation (8:00 AM)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Morning Routine! 🌅",
          body: "Time to log your morning water intake and start your daily goal!",
          data: { route: '/(tabs)' },
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DAILY,
          hour: 8,
          minute: 0,
          android: {
            channelId: 'default',
          },
        },
      });

      // Afternoon Check-in (2:00 PM)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Stay Hydrated! 💧",
          body: "You're doing great! Don't forget to drink water and check your nutrition plan.",
          data: { route: '/food' },
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DAILY,
          hour: 14,
          minute: 0,
          android: {
            channelId: 'default',
          },
        },
      });

      // Evening Wrap-up (8:00 PM)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Daily Review 🌙",
          body: "Check your progress! Did you hit your calorie burn target today?",
          data: { route: '/time' },
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DAILY,
          hour: 20,
          minute: 0,
          android: {
            channelId: 'default',
          },
        },
      });

    } catch (err) {
      console.log("Scheduling Error:", err);
    }
  };

  const sendLocalNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Fitness Goal Update! 🏃‍♂️",
        body: `You've reached ${Math.round(progressPercent)}% of your daily goal.`,
        data: { route: '/(tabs)' },
      },
      trigger: null, 
    });
  };

  const waterGoal = 3;
  const calGoal = 2000;
  const workoutProgress = activeTask ? (currentWorkoutTimer / (activeTask.duration * 60)) : 0;
  const progressPercent = Math.min(
    (((waterIntake / waterGoal) + (caloriesBurnt / calGoal) + workoutProgress) / 3) * 100, 
    100
  );

  const fullName = user?.displayName || "User";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.timeText}>{time}</Text>
            <Text style={styles.greetingText}>Hello, {fullName.split(' ')[0]}</Text>
          </View>
          <TouchableOpacity style={styles.notifButton} onPress={sendLocalNotification}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* TIMER ALERT */}
        {isTimerActive && (
          <TouchableOpacity style={styles.activeTimerBar} onPress={() => router.push('/time')}>
            <MaterialCommunityIcons name="timer-play" size={20} color="#FFF" />
            <Text style={styles.timerBarText}>
              {activeTask?.task || "Workout"}: {Math.floor(currentWorkoutTimer / 60)}m {currentWorkoutTimer % 60}s
            </Text>
          </TouchableOpacity>
        )}

        {/* MAIN PROGRESS CARD - FANCY VERSION */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Daily Summary</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Pro Level</Text>
            </View>
          </View>
          
          <View style={styles.progressRow}>
            <View style={styles.statBox}>
              <Ionicons name="water" size={18} color="#4FC3F7" />
              <Text style={styles.statValue}>{waterIntake.toFixed(1)}L</Text>
              <Text style={styles.statUnit}>Water</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.statBox}>
              <Ionicons name="flame" size={18} color="#FF7043" />
              <Text style={styles.statValue}>{caloriesBurnt}</Text>
              <Text style={styles.statUnit}>Kcal</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.statBox}>
              <Ionicons name="fitness" size={18} color="#66BB6A" />
              <Text style={styles.statValue}>{activeTask ? '1' : '0'}</Text>
              <Text style={styles.statUnit}>Workout</Text>
            </View>
          </View>

          <View style={styles.fullProgressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* FANCY GUIDELINES CAROUSEL */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fitness Guidelines</Text>
          <TouchableOpacity onPress={() => router.push('/guidelines/1')}>
             <Text style={styles.viewAll}>Learn More</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.guideContainer}>
          {fitnessGuidelines.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.guideCard}
              onPress={() => router.push(`/guidelines/${item.id}`)}
            >
              <ImageBackground source={{ uri: item.img }} style={styles.guideImg} imageStyle={{ borderRadius: 20 }}>
                <View style={styles.guideOverlay}>
                  <Text style={styles.guideTitle}>{item.title}</Text>
                  <Text style={styles.guideSub}>{item.sub}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* QUICK NAVIGATION GRID */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.gridContainer}>
          {[
            { id: '1', title: 'Nutrition', icon: 'food-apple', color: '#FFF3E0', text: '#E65100', route: '/food' },
            { id: '2', title: 'Schedule', icon: 'calendar-check', color: '#E8F5E9', text: '#2E7D32', route: '/time' },
            { id: '3', title: 'Market', icon: 'cart-outline', color: '#E3F2FD', text: '#1565C0', route: '/cart' },
            { id: '4', title: 'Analytics', icon: 'chart-line', color: '#F3E5F5', text: '#7B1FA2', route: '/stats' },
          ].map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.gridItem, { backgroundColor: item.color }]}
              onPress={() => router.push(item.route)}
            >
              <MaterialCommunityIcons name={item.icon} size={28} color={item.text} />
              <Text style={[styles.gridText, { color: item.text }]}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* NUTRITION PREVIEW */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Next Meal</Text>
          <TouchableOpacity onPress={() => router.push('/food')}>
            <Text style={styles.viewAll}>Full Plan</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.mealCard} onPress={() => router.push('/food')}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500' }} style={styles.mealImage} />
          <View style={styles.mealInfo}>
            <Text style={styles.mealTime}>LUNCH • 12:30 PM</Text>
            <Text style={styles.mealName}>Salmon & Avocado Salad</Text>
            <Text style={styles.mealCals}>450 kcal • High Protein</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#BBB" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 15 },
  timeText: { fontSize: 13, color: "#999", fontWeight: '600' },
  greetingText: { fontSize: 26, fontWeight: "bold", color: "#333" },
  notifButton: { padding: 10, backgroundColor: "#F9F9F9", borderRadius: 12 },
  notifDot: { position: "absolute", top: 12, right: 12, width: 8, height: 8, backgroundColor: "#7E0054", borderRadius: 4, borderWidth: 1.5, borderColor: "#FFF" },
  activeTimerBar: { backgroundColor: '#7E0054', flexDirection: 'row', alignItems: 'center', padding: 12, marginHorizontal: 20, borderRadius: 15, marginBottom: 15 },
  timerBarText: { color: '#FFF', fontWeight: '700', fontSize: 14, marginLeft: 10 },
  
  mainCard: { backgroundColor: "#1A1A1A", marginHorizontal: 20, padding: 20, borderRadius: 25, marginBottom: 25, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  levelBadge: { backgroundColor: '#7E0054', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  levelText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  statUnit: { color: '#777', fontSize: 11, fontWeight: '600' },
  verticalDivider: { width: 1, height: '80%', backgroundColor: '#333' },
  fullProgressBar: { height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#7E0054', borderRadius: 4 },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 15, marginTop: 10 },
  sectionTitle: { fontSize: 19, fontWeight: "bold", color: "#333" },
  viewAll: { fontSize: 13, color: "#7E0054", fontWeight: '700' },

  guideContainer: { paddingLeft: 20, marginBottom: 20 },
  guideCard: { width: width * 0.7, height: 160, marginRight: 15 },
  guideImg: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  guideOverlay: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 15, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  guideTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  guideSub: { color: '#EEE', fontSize: 12 },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  gridItem: { width: '47%', padding: 20, borderRadius: 20, marginBottom: 15, alignItems: 'center', justifyContent: 'center' },
  gridText: { marginTop: 10, fontWeight: 'bold', fontSize: 14 },

  mealCard: { marginHorizontal: 20, backgroundColor: '#FFF', borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  mealImage: { width: 70, height: 70, borderRadius: 15 },
  mealInfo: { flex: 1, marginLeft: 15 },
  mealTime: { fontSize: 10, color: '#7E0054', fontWeight: 'bold' },
  mealName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  mealCals: { fontSize: 12, color: '#777' },
});

export default HomeScreen;
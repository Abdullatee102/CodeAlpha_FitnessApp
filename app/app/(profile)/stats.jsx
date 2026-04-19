import React from "react";
import { 
  StyleSheet, Text, View, ScrollView, 
  Dimensions, TouchableOpacity 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFitnessStore } from "../../store/fitness"; 

const { width } = Dimensions.get("window");

export default function StatsScreen() {
  const fitnessStore = useFitnessStore();
  const water = fitnessStore.waterIntake || 0;
  const calories = fitnessStore.caloriesBurnt || 0;
  const steps = fitnessStore.steps || 0; 
  const recentWorkouts = fitnessStore.recentWorkouts || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workout Statistics</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>Total Calories Burnt</Text>
            <Text style={styles.summaryValue}>{calories} kcal</Text>
          </View>
          <MaterialCommunityIcons name="fire" size={40} color="#FFF" />
        </View>

        {/* GRID STATS */}
        <View style={styles.grid}>
          <View style={styles.statBox}>
            <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
              <MaterialCommunityIcons name="water" size={24} color="#0284C7" />
            </View>
            <Text style={styles.boxValue}>{water.toFixed(1)}L</Text>
            <Text style={styles.boxLabel}>Water Intake</Text>
          </View>

          <View style={styles.statBox}>
            <View style={[styles.iconCircle, { backgroundColor: '#FDF0F9' }]}>
              <MaterialCommunityIcons name="lightning-bolt" size={24} color="#7E0054" />
            </View>
            {/* Formatting large step counts */}
            <Text style={styles.boxValue}>{steps > 999 ? (steps/1000).toFixed(1) + 'k' : steps}</Text>
            <Text style={styles.boxLabel}>Energy / Steps</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <TouchableOpacity onPress={() => router.push('/time')}>
            <Text style={styles.viewAll}>Track New</Text>
          </TouchableOpacity>
        </View>

        {/* DYNAMIC WORKOUT LOG */}
        {recentWorkouts.length > 0 ? (
          recentWorkouts.map((item) => (
            <View key={item.id} style={styles.logCard}>
              <View style={styles.logIcon}>
                <MaterialCommunityIcons name={item.icon || 'run'} size={24} color="#7E0054" />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.logType}>{item.type}</Text>
                <Text style={styles.logTime}>{item.time} • {item.date}</Text>
              </View>
              <Text style={styles.logCal}>+{item.cal}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={40} color="#EEE" />
            <Text style={styles.emptyText}>No recent workouts logged yet.</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  headerTitle: { fontWeight: "bold", fontSize: 18, color: "#333" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  summaryCard: {
    backgroundColor: "#7E0054",
    borderRadius: 25,
    padding: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    elevation: 5,
  },
  summaryLabel: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  summaryValue: { color: "#FFF", fontSize: 28, fontWeight: "bold", marginTop: 5 },
  grid: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  statBox: {
    width: width * 0.43,
    backgroundColor: "#FFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    alignItems: "center"
  },
  iconCircle: { width: 45, height: 45, borderRadius: 15, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  boxValue: { fontSize: 20, fontWeight: "bold", color: "#333" },
  boxLabel: { fontSize: 12, color: "#999", marginTop: 2 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 30, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  viewAll: { color: "#7E0054", fontWeight: "600" },
  logCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#F9F9F9", padding: 15, borderRadius: 18, marginBottom: 12 },
  logIcon: { width: 48, height: 48, backgroundColor: "#FFF", borderRadius: 14, justifyContent: "center", alignItems: "center" },
  logType: { fontWeight: "bold", fontSize: 16, color: "#333" },
  logTime: { fontSize: 13, color: "#999" },
  logCal: { fontWeight: "bold", color: "#7E0054" },
  emptyState: { alignItems: 'center', marginTop: 20 },
  emptyText: { color: '#CCC', marginTop: 10 }
});
import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Dimensions,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFitnessStore } from "../../store/fitness";

const { width } = Dimensions.get("window");

const FoodScreen = () => {
  const { waterIntake, addWater, caloriesBurnt, updateCalories } = useFitnessStore();
  const [selectedCategory, setSelectedCategory] = useState("Breakfast");

  const meals = [
    // Breakfast
    { id: '1', name: 'Oatmeal w/ Berries', cals: 320, prot: '12g', type: 'Breakfast', img: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400' },
    { id: '2', name: 'Avocado Toast', cals: 280, prot: '8g', type: 'Breakfast', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400' },
    { id: '3', name: 'Greek Yogurt Parfait', cals: 250, prot: '15g', type: 'Breakfast', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' },
    
    // Lunch
    { id: '4', name: 'Grilled Chicken Salad', cals: 450, prot: '35g', type: 'Lunch', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
    { id: '5', name: 'Quinoa Veggie Bowl', cals: 380, prot: '14g', type: 'Lunch', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
    { id: '6', name: 'Turkey Wrap', cals: 410, prot: '28g', type: 'Lunch', img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' },

    // Snack
    { id: '7', name: 'Protein Shake', cals: 180, prot: '25g', type: 'Snack', img: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400' },
    { id: '8', name: 'Mixed Nuts', cals: 200, prot: '6g', type: 'Snack', img: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400' },
    { id: '9', name: 'Apple w/ Peanut Butter', cals: 190, prot: '4g', type: 'Snack', img: 'https://images.unsplash.com/photo-1610397648930-477b8c7f0943?w=400' },

    // Dinner
    { id: '10', name: 'Baked Salmon & Broccoli', cals: 550, prot: '42g', type: 'Dinner', img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' },
    { id: '11', name: 'Steak & Sweet Potato', cals: 620, prot: '45g', type: 'Dinner', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400' },
    { id: '12', name: 'Pasta Carbonara', cals: 700, prot: '20g', type: 'Dinner', img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400' },
  ];

  const handleLogWater = () => {
    addWater(0.25); 
    Alert.alert("Hydrated!", "250ml added to your daily progress.");
  };

  const handleAddMeal = (meal) => {
    updateCalories(meal.cals);
    Alert.alert("Logged!", `${meal.name} (+${meal.cals} kcal) has been added.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* --- WATER SECTION --- */}
        <View style={styles.waterCard}>
          <View>
            <Text style={styles.waterTitle}>Water Intake</Text>
            <Text style={styles.waterSub}>{waterIntake.toFixed(2)} / 3.0 Litres</Text>
          </View>
          <TouchableOpacity style={styles.waterAddBtn} onPress={handleLogWater}>
            <Ionicons name="add" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* --- CALORIE SUMMARY --- */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryVal}>{caloriesBurnt}</Text>
            <Text style={styles.summaryLab}>Eaten</Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: '#7E0054' }]}>
            <Text style={[styles.summaryVal, { color: '#FFF' }]}>{Math.max(0, 2000 - caloriesBurnt)}</Text>
            <Text style={[styles.summaryLab, { color: 'rgba(255,255,255,0.7)' }]}>Remaining</Text>
          </View>
        </View>

        {/* --- DYNAMIC CATEGORIES --- */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {["Breakfast", "Lunch", "Snack", "Dinner"].map((cat) => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setSelectedCategory(cat)}
              style={[styles.catBtn, selectedCategory === cat && styles.catBtnActive]}
            >
              <Text style={[styles.catBtnText, selectedCategory === cat && styles.catBtnTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* --- MEAL LIST UNDER SELECTED CATEGORY --- */}
        <View style={styles.mealList}>
          {meals.filter(m => m.type === selectedCategory).map((item) => (
            <View key={item.id} style={styles.mealItem}>
              <Image source={{ uri: item.img }} style={styles.mealImg} />
              <View style={styles.mealDetails}>
                <Text style={styles.mealName}>{item.name}</Text>
                <Text style={styles.mealStats}>{item.cals} kcal • {item.prot} protein</Text>
              </View>
              <TouchableOpacity 
                style={styles.logBtn} 
                onPress={() => handleAddMeal(item)}
              >
                <Ionicons name="add-circle" size={32} color="#7E0054" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F9FB" },
  waterCard: {
    backgroundColor: "#E3F2FD",
    margin: 20,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  waterTitle: { fontFamily: 'RobotoCondensed-Bold', fontSize: 18, color: '#1976D2' },
  waterSub: { fontFamily: 'OpenSans-Regular', fontSize: 14, color: '#1976D2' },
  waterAddBtn: {
    backgroundColor: '#1976D2',
    width: 45,
    height: 45,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  summaryBox: {
    backgroundColor: '#FFF',
    width: '47%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryVal: { fontFamily: 'RobotoCondensed-Bold', fontSize: 24, color: '#333' },
  summaryLab: { fontFamily: 'OpenSans-Regular', fontSize: 12, color: '#777' },
  categoryScroll: { marginBottom: 20 },
  categoryContent: { paddingHorizontal: 20 },
  catBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#EEE',
  },
  catBtnActive: { backgroundColor: '#7E0054' },
  catBtnText: { fontFamily: 'OpenSans-Bold', color: '#666' },
  catBtnTextActive: { color: '#FFF' },
  mealList: { paddingHorizontal: 20 },
  mealItem: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  mealImg: { width: 65, height: 65, borderRadius: 15 },
  mealDetails: { flex: 1, marginLeft: 15 },
  mealName: { fontFamily: 'RobotoCondensed-Bold', fontSize: 16, color: '#333' },
  mealStats: { fontFamily: 'OpenSans-Regular', fontSize: 12, color: '#777' },
  logBtn: { padding: 5 },
});

export default FoodScreen;
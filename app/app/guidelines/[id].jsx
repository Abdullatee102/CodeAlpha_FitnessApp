import React from 'react';
import { 
  StyleSheet, Text, View, ScrollView, 
  ImageBackground, TouchableOpacity, Dimensions 
} from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { fitnessGuidelines } from '../../data/guidelinesData';

const { width, height } = Dimensions.get('window');

const GuidelineDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const item = fitnessGuidelines.find((g) => g.id === id);

  if (!item) return <View style={styles.centered}><Text>Guideline not found</Text></View>;

  return (
    <View style={styles.container}>
      {/* HEADER IMAGE WITH OVERLAY */}
      <ImageBackground source={{ uri: item.img }} style={styles.heroImage}>
        <View style={styles.imageOverlay}>
          <SafeAreaView>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={28} color="#FFF" />
            </TouchableOpacity>
          </SafeAreaView>
          
          <View style={styles.headerTextContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ELITE TIPS</Text>
            </View>
            <Text style={styles.mainTitle}>{item.title}</Text>
            <Text style={styles.subTitle}>{item.sub}</Text>
          </View>
        </View>
      </ImageBackground>

      {/* CONTENT AREA */}
      <View style={styles.contentWrapper}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.indicator} />
          
          <Text style={styles.bodyText}>
            {item.content}
          </Text>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.back()}>
            <Text style={styles.actionButtonText}>Got it, thanks!</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A1A" }, 
  heroImage: { width: width, height: height * 0.45 },
  imageOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    justifyContent: 'space-between', 
    padding: 20 
  },
  backButton: { 
    width: 45, 
    height: 45, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 10
  },
  headerTextContainer: { marginBottom: 40 },
  badge: { 
    backgroundColor: '#7E0054', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 6,
    marginBottom: 10
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  mainTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  subTitle: { color: '#DDD', fontSize: 16, marginTop: 5 },
  
  contentWrapper: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    marginTop: -30, 
    borderTopLeftRadius: 35, 
    borderTopRightRadius: 35,
    paddingHorizontal: 25
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: '#EEE',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 25
  },
  scrollContent: { paddingBottom: 40 },
  bodyText: { 
    fontSize: 17, 
    lineHeight: 28, 
    color: '#444', 
    textAlign: 'left' 
  },
  actionButton: {
    backgroundColor: '#1A1A1A',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 30
  },
  actionButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }
});

export default GuidelineDetail;
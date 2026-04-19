import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  StyleSheet, 
  Dimensions, 
  Pressable 
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../store/store';
import Button from "../components/ui/button";
import { onboardingPages } from '../data/onboarding';

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const setHasFinishedOnboarding = useAuthStore((state) => state.setHasFinishedOnboarding);

  const handleNext = () => {
    if (currentIndex < onboardingPages.length - 1) {
      flatListRef.current.scrollToIndex({ 
        index: currentIndex + 1,
        animated: true 
      });
    } else {
      setHasFinishedOnboarding(true);
      router.replace("/sign-up");
    }
  };

  const handleSkip = () => {
    flatListRef.current.scrollToIndex({ 
      index: onboardingPages.length - 1,
      animated: true 
    });
  };

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.skipContainer}>
        {currentIndex < onboardingPages.length - 1 && (
          <Pressable onPress={handleSkip} hitSlop={20}>
            <Text style={styles.skipText}>SKIP</Text>
          </Pressable>
        )}
      </View>

      <Image source={item.image} style={styles.image} resizeMode="contain" />

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.subtitle}</Text>

        <View style={styles.pagination}>
          {onboardingPages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <Button
          text={currentIndex === onboardingPages.length - 1 ? "GET STARTED" : "NEXT"}
          onPress={handleNext}
          style={styles.actionButton}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingPages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  skipContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: 20,
    height: 30,
  },
  skipText: {
    fontFamily: 'OpenSans-Regular',
    color: '#666',
    fontSize: 16,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginTop: 90,
  },
  content: {
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 26,
    fontFamily: 'RobotoCondensed-Bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 22,
    backgroundColor: '#7E0054',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#D1D1D1',
  },
  actionButton: {
    width: width * 0.7,
  },
});
import { Tabs } from "expo-router";
import { FontAwesome5, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#7E0054", 
        tabBarInactiveTintColor: "#000000",
        tabBarPressColor: "transparent",
        tabBarPressOpacity: 1,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "OpenSans-Bold", 
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          paddingTop: 5,
          height: 60 + insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome5
              name={focused ? "home" : "home"}
              size={22}
              color={color}
              style={{ fontWeight: focused ? "bold" : "normal" }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="food"
        options={{
          title: "Food",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? "silverware-fork-knife" : "silverware-clean"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="time"
        options={{
          title: "Schedule",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? "clock-check" : "clock-check-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? "cart" : "cart-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome
              name={focused ? "user-circle-o" : "user-circle"}
              size={20}
              color={color}
            />
          ),
        }}
      />
      
    </Tabs>
  );
}
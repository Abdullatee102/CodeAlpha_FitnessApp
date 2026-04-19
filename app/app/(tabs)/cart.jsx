import React, { useState } from "react";
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  FlatList, Image, Alert, ScrollView 
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const PRODUCTS = [
  { 
    id: "1", 
    name: "Whey Protein", 
    brand: "Optimum", 
    price: 45.99, 
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400" 
  },
  { 
    id: "2", 
    name: "Resistance Bands", 
    brand: "FitGear", 
    price: 24.50, 
    image: "https://images.pexels.com/photos/4662350/pexels-photo-4662350.jpeg?auto=compress&cs=tinysrgb&w=400" 
  },
  { 
    id: "3", 
    name: "Yoga Mat (Eco)", 
    brand: "ZenFlow", 
    price: 35.00, 
    image: "https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=400" 
  },
  { 
    id: "4", 
    name: "Dumbbell Set", 
    brand: "IronBody", 
    price: 89.99, 
    image: "https://images.pexels.com/photos/4325451/pexels-photo-4325451.jpeg?auto=compress&cs=tinysrgb&w=400" 
  },
];

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal > 0 ? subtotal + 5.00 : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fitness Shop</Text>
        <TouchableOpacity style={styles.cartIconBadge}>
          <Ionicons name="cart" size={24} color="#7E0054" />
          {cartItems.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{cartItems.length}</Text></View>}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Available Gear</Text>
        <FlatList
          data={PRODUCTS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingLeft: 20 }}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
                <Ionicons name="add" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        />

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Your Selection</Text>
        <View style={styles.cartList}>
          {cartItems.length === 0 ? (
            <View style={styles.emptyCart}>
              <MaterialCommunityIcons name="basket-outline" size={40} color="#CCC" />
              <Text style={styles.emptyText}>No items selected yet.</Text>
            </View>
          ) : (
            cartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.itemImageSmall} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.qtyBox}><Ionicons name="remove" size={16} /></TouchableOpacity>
                    <Text style={styles.qtyVal}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.qtyBox}><Ionicons name="add" size={16} /></TouchableOpacity>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.itemPriceTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)}><Text style={styles.removeText}>Remove</Text></TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* FOOTER SUMMARY */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => Alert.alert("Order Placed!", "You should receive your bookings in the next minutes...")}>
            <Text style={styles.checkoutText}>Confirm Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDFDFD" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  headerTitle: { fontFamily: "RobotoCondensed-Bold", fontSize: 22, color: "#333" },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#7E0054', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  sectionTitle: { fontFamily: "RobotoCondensed-Bold", fontSize: 18, color: "#333", marginLeft: 20, marginBottom: 15 },
  
  // PRODUCT BROWSE
  productCard: { width: 140, backgroundColor: '#FFF', borderRadius: 20, padding: 10, marginRight: 15, borderWidth: 1, borderColor: '#F0F0F0', elevation: 2 },
  productImage: { width: '100%', height: 100, borderRadius: 15, marginBottom: 10 },
  productName: { fontFamily: "OpenSans-Bold", fontSize: 14, color: "#333" },
  productPrice: { fontFamily: "OpenSans-Bold", fontSize: 16, color: "#7E0054", marginTop: 5 },
  addBtn: { position: 'absolute', bottom: 10, right: 10, backgroundColor: '#7E0054', borderRadius: 10, padding: 5 },

  // CART LIST
  cartList: { paddingHorizontal: 20 },
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 15, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#F5F5F5' },
  itemImageSmall: { width: 50, height: 50, borderRadius: 10 },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemName: { fontFamily: "OpenSans-Bold", fontSize: 14, color: "#333" },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  qtyBox: { padding: 4, backgroundColor: '#F0F0F0', borderRadius: 5 },
  qtyVal: { marginHorizontal: 10, fontFamily: "OpenSans-Bold" },
  itemPriceTotal: { fontFamily: "RobotoCondensed-Bold", fontSize: 16, color: "#333" },
  removeText: { color: '#FF4444', fontSize: 11, marginTop: 5 },
  emptyCart: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#999', fontSize: 14, marginTop: 10 },

  // FOOTER
  footer: { padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EEE' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontFamily: "OpenSans-Regular", fontSize: 16, color: "#777" },
  totalValue: { fontFamily: "RobotoCondensed-Bold", fontSize: 24, color: "#7E0054" },
  checkoutBtn: { backgroundColor: "#7E0054", height: 55, borderRadius: 15, justifyContent: "center", alignItems: "center" },
  checkoutText: { color: "#FFF", fontFamily: "RobotoCondensed-Bold", fontSize: 18 }
});

export default CartScreen;
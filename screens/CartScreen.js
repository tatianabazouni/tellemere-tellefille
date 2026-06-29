// CartScreen.js
import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CartContext } from "../contexts/CartContext"; // Make sure this path is correct

export default function CartScreen() {
  const navigation = useNavigation();
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // Example 5% VAT
  const total = subtotal + tax;

  const handleCheckout = () => {
    // Navigate to the Checkout screen (separate stack/page)
    navigation.navigate("Checkout", { cartItems, subtotal, tax, total });
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.icon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Cart</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={{ paddingHorizontal: 16 }}>
        {cartItems.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 50, color: "#777" }}>
            Your cart is empty
          </Text>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.item}>
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.image}
                imageStyle={{ borderRadius: 12 }}
              />
              <View style={styles.info}>
                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.details}>{item.desc}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              </View>

              <View style={styles.controls}>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text style={styles.delete}>🗑️</Text>
                </TouchableOpacity>

                <View style={styles.quantity}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    <Text>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Text>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tax (VAT)</Text>
          <Text style={styles.value}>${tax.toFixed(2)}</Text>
        </View>

        <View style={[styles.row, { marginTop: 6 }]}>
          <Text style={styles.total}>Total</Text>
          <Text style={styles.total}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  icon: { fontSize: 24 },
  title: { fontSize: 18, fontWeight: "bold" },
  item: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  image: { width: 80, height: 80 },
  info: { flex: 1, justifyContent: "center", marginLeft: 12 },
  name: { fontSize: 16, fontWeight: "600" },
  details: { color: "#777", marginTop: 2 },
  price: { marginTop: 6, fontWeight: "bold", fontSize: 16 },
  controls: { justifyContent: "space-between", alignItems: "flex-end" },
  delete: { fontSize: 20, color: "gray" },
  quantity: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { marginHorizontal: 8, fontSize: 16 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  label: { color: "#777" },
  value: { fontWeight: "500" },
  total: { fontSize: 16, fontWeight: "bold" },
  checkoutBtn: {
    marginTop: 16,
    backgroundColor: "#1A1A1A",
    paddingVertical: 14,
    borderRadius: 50,
  },
  checkoutText: { color: "white", textAlign: "center", fontWeight: "bold" },
});

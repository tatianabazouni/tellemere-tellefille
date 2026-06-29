import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { CartContext } from "../contexts/CartContext";

export default function CheckoutScreen({ navigation }) {
  const { cartItems, clearCart } = useContext(CartContext);

  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    const sub = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const taxAmount = sub * 0.05;
    const totalAmount = sub + taxAmount;

    setSubtotal(sub);
    setTax(taxAmount);
    setTotal(totalAmount);
  }, [cartItems]);

  const handlePlaceOrder = () => {
    // Validate payment info
    if (!paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvv) {
      Alert.alert("Incomplete Payment", "Please fill in all payment fields.");
      return;
    }

    // Success alert
    Alert.alert("Success", "Your order has been placed!", [
      {
        text: "OK",
        onPress: () => {
          clearCart();
          navigation.navigate("ProductsListScreen"); // Correct screen name
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Checkout</Text>

      <View style={styles.productsContainer}>
        {cartItems.length === 0 ? (
          <Text style={styles.empty}>Your cart is empty</Text>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <Image
                source={{ uri: item.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{item.title}</Text>
                <Text style={styles.productQty}>Qty: {item.quantity}</Text>
                <Text style={styles.productPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryHeader}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Subtotal</Text>
          <Text style={styles.summaryText}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Tax (5%)</Text>
          <Text style={styles.summaryText}>${tax.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>${total.toFixed(2)}</Text>
        </View>

        <Text style={styles.sectionHeader}>Payment</Text>
        <TextInput
          style={styles.input}
          placeholder="Card Number"
          keyboardType="numeric"
          value={paymentInfo.cardNumber}
          onChangeText={(text) =>
            setPaymentInfo({ ...paymentInfo, cardNumber: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="MM/YY"
          value={paymentInfo.expiry}
          onChangeText={(text) =>
            setPaymentInfo({ ...paymentInfo, expiry: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="CVV"
          keyboardType="numeric"
          value={paymentInfo.cvv}
          onChangeText={(text) =>
            setPaymentInfo({ ...paymentInfo, cvv: text })
          }
        />

        <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate("ProductsListScreen")}
        >
          <Text style={styles.continueText}>← Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7", padding: 16 },
  header: { fontSize: 28, fontWeight: "bold", textAlign: "center", color: "#800020", marginBottom: 16 },
  productsContainer: { marginBottom: 24 },
  empty: { textAlign: "center", color: "#777", marginTop: 40 },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  productImage: { width: 80, height: 100, borderRadius: 6 },
  productInfo: { marginLeft: 12, flex: 1 },
  productTitle: { fontSize: 16, fontWeight: "600" },
  productQty: { fontSize: 14, color: "#555", marginTop: 2 },
  productPrice: { fontSize: 16, fontWeight: "bold", marginTop: 6, color: "#eb4770" },

  summaryContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  summaryHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#800020" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
  summaryText: { fontSize: 16, color: "#555" },
  totalText: { fontSize: 18, fontWeight: "bold", color: "#eb4770" },
  sectionHeader: { fontSize: 16, fontWeight: "bold", marginTop: 16, marginBottom: 8, color: "#800020" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  placeOrderBtn: {
    backgroundColor: "#800020",
    paddingVertical: 16,
    borderRadius: 50,
    marginTop: 16,
  },
  placeOrderText: { color: "#fff", fontWeight: "bold", textAlign: "center", fontSize: 16 },
  continueBtn: { marginTop: 12 },
  continueText: { color: "#800020", fontSize: 14, textAlign: "center" },
});

import React, { useContext } from "react";
import { View, StyleSheet, Image, ScrollView, Share, Alert } from "react-native";
import { Text, Button } from "react-native-paper";
import { db } from "../firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import { CartContext } from "../contexts/CartContext"; // import your CartContext

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart } = useContext(CartContext); // get addToCart from context

  // Delete product with confirmation
  const deleteProduct = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "products", product.id));
              navigation.goBack(); // Go back to list after deletion
            } catch (error) {
              console.log("Delete error:", error);
              alert("Failed to delete product.");
            }
          },
        },
      ]
    );
  };

  // Share product
  const shareProduct = async () => {
    try {
      await Share.share({
        message: `${product.title}\nPrice: ${product.price}`,
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  // Add product to cart
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || product.image || "",
      desc: product.description || "",
      quantity: 1,
    });
    Alert.alert("Added to Cart", `${product.title} has been added to your cart.`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Product Images */}
      {product.images && product.images.length > 0
        ? product.images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.image} />
          ))
        : product.image
        ? <Image source={{ uri: product.image }} style={styles.image} />
        : null
      }

      {/* Product Info */}
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.text}>Price: ${product.price}</Text>
      <Text style={styles.text}>Category: {product.tag}</Text>
      {product.description && <Text style={styles.text}>Description: {product.description}</Text>}

      {/* Action Buttons */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate("ProductForm", { product })}
        style={styles.editButton}
        labelStyle={{ color: "#fff", fontWeight: "600" }}
      >
        Edit Product
      </Button>

      <Button
        mode="contained"
        onPress={deleteProduct}
        style={styles.deleteButton}
        labelStyle={{ color: "#eb4770", fontWeight: "600" }}
      >
        Delete
      </Button>

      <Button
        mode="outlined"
        onPress={shareProduct}
        style={styles.shareButton}
        labelStyle={{ color: "#eb4770", fontWeight: "600" }}
      >
        Share
      </Button>

      <Button
        mode="contained"
        onPress={handleAddToCart}
        style={styles.cartButton}
        labelStyle={{ color: "#fff", fontWeight: "600" }}
      >
        Add to Cart
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f6f6" },
  image: { width: "100%", height: 220, borderRadius: 10, marginTop: 10 },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 15 },
  text: { fontSize: 16, marginTop: 5 },

  editButton: { marginTop: 20, backgroundColor: "#eb4770" },
  deleteButton: { marginTop: 10, backgroundColor: "#fff", borderWidth: 1, borderColor: "#eb4770" },
  shareButton: { marginTop: 10, borderWidth: 1, borderColor: "#eb4770" },
  cartButton: { marginTop: 15, backgroundColor: "#eb4770" },
});

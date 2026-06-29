import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { CurrencyContext } from "../contexts/CurrencyContext";

const categories = [
  "All",
  "Newborn",
  "Baptism",
  "Wedding",
  "Holy Communion",
  "Birthday",
];

export default function ProductsListScreen({ navigation }) {
  const [selected, setSelected] = useState("All");
  const [itemsList, setItemsList] = useState([]);
  const { favorites, setFavorites } = useContext(FavoritesContext);
  const { selectedCurrency, currencyRates } = useContext(CurrencyContext);

  const loadProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const firebaseProducts = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        firebaseProducts.push({
          id: docSnap.id,
          title: data.title,
          price: data.price,
          category: data.category,
          image: data.images?.[0] || data.image || null,
          images: data.images || [],
          description: data.description || "",
        });
      });

      setItemsList(firebaseProducts);
    } catch (error) {
      console.log("Error loading products:", error);
    }
  };

  useEffect(() => {
    loadProducts();
    const focus = navigation.addListener("focus", loadProducts);
    return focus;
  }, [navigation]);

  const deleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      setItemsList((prev) => prev.filter((item) => item.id !== productId));
    } catch (error) {
      console.log("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  const confirmDelete = (productId) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteProduct(productId) },
      ]
    );
  };

  const toggleFavorite = (product) => {
    if (favorites.find((fav) => fav.id === product.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== product.id));
    } else {
      setFavorites([...favorites, product]);
    }
  };

  const convertPrice = (price) => {
    if (!currencyRates[selectedCurrency.currency]) return price.toFixed(2);
    return (price * currencyRates[selectedCurrency.currency]).toFixed(2);
  };

  const filteredItems =
    selected === "All"
      ? itemsList
      : itemsList.filter((item) => item.category === selected);

  return (
    <SafeAreaView style={styles.container}>
      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
      >
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setSelected(c)}
            style={[styles.chip, selected === c && styles.chipActive]}
          >
            <Text style={[styles.chipText, selected === c && styles.chipTextActive]}>
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product Grid */}
      <ScrollView
        contentContainerStyle={[styles.grid, { paddingTop: 25 }]}
      >
        {filteredItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.imageWrapper}>
              {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
              {/* Heart Icon */}
              <TouchableOpacity
                style={styles.heartIcon}
                onPress={() => toggleFavorite(item)}
              >
                <FontAwesome
                  name={favorites.find((fav) => fav.id === item.id) ? "heart" : "heart-o"}
                  size={22}
                  color="#eb4770"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardPrice}>
              {selectedCurrency.currency} {convertPrice(item.price)}
            </Text>
            <Text style={styles.tag}>{item.category}</Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate("ProductDetails", { product: item })}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(item.id)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f6f6" },
  filters: { paddingHorizontal: 12, paddingVertical: 29 },

  chip: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 20,
    backgroundColor: "#f3e7ea",
    marginRight: 8,
    justifyContent: "center",
  },
  chipActive: { backgroundColor: "#eb4770" },
  chipText: { fontSize: 14, color: "#1b0e11" },
  chipTextActive: { color: "#fff", fontWeight: "600" },

  grid: {
    paddingHorizontal: 12,
    paddingBottom: 40,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: { width: "48%", marginBottom: 20 },
  imageWrapper: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  image: { width: "100%", height: "100%" },

  heartIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ffffffaa",
    padding: 6,
    borderRadius: 20,
  },

  cardTitle: { marginTop: 6, fontWeight: "600", fontSize: 15 },
  cardPrice: { color: "#974e60", fontSize: 13, marginTop: 2 },
  tag: {
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: "#eb477033",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    color: "#eb4770",
    fontWeight: "500",
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  editButton: {
    backgroundColor: "#eb4770",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eb4770",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  editText: { color: "#fff", fontWeight: "600" },
  deleteText: { color: "#eb4770", fontWeight: "600" },
});

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput as RNTextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { db } from "../firebaseConfig";
import { collection, addDoc, updateDoc, doc, Timestamp } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

export default function AddProductScreen({ navigation, route }) {
  const editingProduct = route?.params?.product || null;
  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState(
    editingProduct
      ? {
          title: editingProduct.title,
          price: String(editingProduct.price),
          category: editingProduct.category,
          description: editingProduct.description,
          images: editingProduct.images.map((data, index) => ({
            id: index + 1,
            data,
            uploaded: true,
          })),
        }
      : { title: "", price: "", category: "", description: "", images: [] }
  );

  // Pick image
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted)
      return Alert.alert("Permission required", "Access to photos is needed.");

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
      allowsMultipleSelection: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.assets || result.assets.length === 0) return;

    const base64 = await fetch(result.assets[0].uri)
      .then(res => res.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));

    setProductData(prev => ({
      ...prev,
      images: [...prev.images, { id: Date.now(), data: base64, uploaded: true }],
    }));
  };

  // Save or update product
  const handleSave = async () => {
    if (loading) return;

    const { title, price, category, description, images } = productData;

    if (!title.trim() || !price.trim() || !category.trim())
      return Alert.alert("Missing fields", "Please fill required fields.");

    setLoading(true);

    try {
      const imageDataArray = images.map(img => img.data);

      const productPayload = {
        title,
        price: Number(price),
        category,
        description,
        images: imageDataArray,
        updatedAt: Timestamp.now(),
      };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), productPayload);
        Alert.alert("Success", "Product updated successfully.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        await addDoc(collection(db, "products"), {
          ...productPayload,
          createdAt: Timestamp.now(),
        });

        // Simply go back; ProductsListScreen will reload from Firestore
        navigation.goBack();
      }
    } catch (err) {
      console.log("SAVE ERROR:", err);
      Alert.alert("Error", err.message);
    }

    setLoading(false);
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.sectionTitle}>Product Images</Text>
        <View style={styles.imagesGrid}>
          {productData.images.map(img => (
            <View key={img.id} style={styles.imageBox}>
              <Image source={{ uri: img.data }} style={styles.image} />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                  setProductData(prev => ({
                    ...prev,
                    images: prev.images.filter(i => i.id !== img.id),
                  }))
                }
              >
                <MaterialIcons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addImageBox} onPress={pickImage}>
            <MaterialIcons name="add-photo-alternate" size={32} color="#777" />
            <Text style={styles.addImageText}>Add image</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Product Details</Text>
        <View style={styles.form}>
          {["title", "price", "category", "description"].map(field => (
            <View key={field} style={{ marginBottom: 12 }}>
              <Text style={styles.label}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Text>
              <RNTextInput
                value={productData[field]}
                style={[styles.input, field === "description" && { height: 100 }]}
                onChangeText={text => setProductData({ ...productData, [field]: text })}
                keyboardType={field === "price" ? "numeric" : "default"}
                multiline={field === "description"}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.submitBtn, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#4A2C2A" />
        ) : (
          <Text style={styles.submitText}>
            {editingProduct ? "Update Product" : "Save Product"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F5DC" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4A2C2A",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  imagesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, paddingHorizontal: 16 },
  imageBox: { width: "30%", aspectRatio: 1, borderRadius: 10, overflow: "hidden", position: "relative" },
  image: { width: "100%", height: "100%" },
  deleteButton: { position: "absolute", top: 4, right: 4, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 50, padding: 3 },
  addImageBox: { width: "30%", aspectRatio: 1, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  addImageText: { fontSize: 12, marginTop: 4, color: "#666" },
  form: { paddingHorizontal: 16, marginTop: 10 },
  label: { fontSize: 14, fontWeight: "600", color: "#4A2C2A" },
  input: { height: 45, borderWidth: 1, borderColor: "#E5E1D5", backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 10 },
  submitBtn: { position: "absolute", bottom: 20, left: 20, right: 20, height: 55, backgroundColor: "#E6B4B4", borderRadius: 12, justifyContent: "center", alignItems: "center" },
  submitText: { fontSize: 16, fontWeight: "700", color: "#4A2C2A" },
});

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput as RNTextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { db } from "../firebaseConfig";
import { collection, addDoc, updateDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

export default function ProductFormScreen({ route, navigation }) {
  const product = route.params?.product;

  const [title, setTitle] = useState(product?.title || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [category, setCategory] = useState(product?.category || "");
  const [image, setImage] = useState(product?.image || null);
  const [loading, setLoading] = useState(false);

  // Pick image from gallery and convert to base64
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("Permission denied", "Access to photos is needed.");

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

    setImage(base64);
  };

  const saveProduct = async () => {
    if (!title.trim() || !price.trim() || !category.trim()) {
      return Alert.alert("Missing fields", "Please fill all required fields.");
    }

    setLoading(true);

    try {
      const payload = {
        title,
        price: parseFloat(price),
        category,
        image: image || "",
        updatedAt: Timestamp.now(),
      };

      let productId = product?.id;

      if (productId) {
        await updateDoc(doc(db, "products", productId), payload);
      } else {
        const docRef = await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: Timestamp.now(),
        });
        productId = docRef.id;
      }

      const updatedDoc = await getDoc(doc(db, "products", productId));
      const updatedProduct = { id: updatedDoc.id, ...updatedDoc.data() };

      navigation.replace("ProductDetails", { product: updatedProduct });
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title</Text>
      <RNTextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter product title"
        style={styles.input}
      />

      <Text style={styles.label}>Price</Text>
      <RNTextInput
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="Enter price"
        style={styles.input}
      />

      <Text style={styles.label}>Category</Text>
      <RNTextInput
        value={category}
        onChangeText={setCategory}
        placeholder="Enter category"
        style={styles.input}
      />

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
        <Text style={styles.pickButtonText}>Pick Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={saveProduct} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>{product ? "Update Product" : "Save Product"}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F5DC",
    flexGrow: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#4A2C2A",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E1D5",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 12,
    color: "#4A2C2A",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginVertical: 10,
  },
  pickButton: {
    height: 50,
    backgroundColor: "#E6B4B4",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  pickButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A2C2A",
  },
  saveButton: {
    height: 55,
    backgroundColor: "#EB4770",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});

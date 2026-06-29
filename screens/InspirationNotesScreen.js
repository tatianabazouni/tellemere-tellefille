import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

export default function InspirationNotesScreen({ navigation, route }) {
  const stepFromPrev = route.params?.currentStep || 4;
  const [currentStep, setCurrentStep] = useState(stepFromPrev);

  // --- Receive previous step data ---
  const {
    tableDesignData,
    quantityBudgetData,
    locationContactData,
    inspirationData = {}, // NEW: defaults for editing
  } = route.params || {};

  // --- This screen data ---
  const [photos, setPhotos] = useState(inspirationData.photos || []);
  const [specialRequests, setSpecialRequests] = useState(
    inspirationData.specialRequests || ""
  );
  const [receiveNotifications, setReceiveNotifications] = useState(
    inspirationData.receiveNotifications ?? true
  );

  // --- Image Picker Handlers ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Allow access to your gallery to add photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Allow access to your camera to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 1 });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index) => setPhotos(photos.filter((_, i) => i !== index));

  // --- Navigate to Summary Screen ---
  const handleNext = () => {
    navigation.navigate("SummaryScreen", {
      tableDesignData,
      quantityBudgetData,
      locationContactData,
      inspirationData: { photos, specialRequests, receiveNotifications }, // UPDATED
      currentStep: currentStep + 1,
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={28} color="#4A2C2A" />
          </TouchableOpacity>
          <Text style={styles.title}>Inspiration & Notes</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Page Indicators */}
        <View style={styles.indicators}>
          {[...Array(5)].map((_, i) => (
            <View
              key={i}
              style={[styles.indicator, i < currentStep ? styles.activeIndicator : {}]}
            />
          ))}
        </View>

        {/* Inspiration Photos */}
        <Text style={styles.sectionTitle}>Inspiration Photos</Text>
        <Text style={styles.sectionSubtitle}>
          Upload images of your theme, venue, or desired style.
        </Text>

        <View style={styles.imageGrid}>
          {photos.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image style={styles.image} source={{ uri }} resizeMode="cover" />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removePhoto(index)}
              >
                <MaterialIcons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Add Photo Buttons */}
        <View style={styles.addPhotoContainer}>
          <TouchableOpacity style={styles.addPhotoBtn} onPress={pickImage}>
            <MaterialIcons name="photo-library" size={24} color="#eb4770" />
            <Text style={styles.addPhotoText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addPhotoBtn} onPress={takePhoto}>
            <MaterialIcons name="camera-alt" size={24} color="#eb4770" />
            <Text style={styles.addPhotoText}>Camera</Text>
          </TouchableOpacity>
        </View>

        {/* Special Requests */}
        <Text style={styles.sectionTitle}>Special Requests</Text>
        <Text style={styles.sectionSubtitle}>Any notes for our chocolatiers?</Text>
        <TextInput
          style={styles.textArea}
          placeholder="e.g., 'Please avoid nuts,' 'Match the color palette of the attached invitation.'"
          multiline
          value={specialRequests}
          onChangeText={setSpecialRequests}
        />

        {/* Notifications Toggle */}
        <View style={styles.notifications}>
          <Text style={styles.notificationText}>
            Receive notifications about this order
          </Text>
          <TouchableOpacity
            style={[styles.toggle, receiveNotifications ? styles.toggleActive : {}]}
            onPress={() => setReceiveNotifications(!receiveNotifications)}
          >
            <View
              style={[
                styles.toggleCircle,
                receiveNotifications ? styles.toggleCircleActive : {},
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const PRIMARY = "#B76E79";
const SECONDARY = "#4A2C2A";
const BG = "#FAF7F5";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  container: { paddingBottom: 24 },
  topBar: { flexDirection: "row", alignItems: "center", padding: 16, paddingBottom: 8 },
  title: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "bold", color: SECONDARY },
  indicators: { flexDirection: "row", justifyContent: "center", gap: 4, paddingVertical: 8, paddingHorizontal: 16 },
  indicator: { flex: 1, height: 4, backgroundColor: PRIMARY, opacity: 0.2, borderRadius: 2, marginHorizontal: 2 },
  activeIndicator: { opacity: 1 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: SECONDARY, paddingHorizontal: 16, paddingTop: 16 },
  sectionSubtitle: { fontSize: 14, color: SECONDARY + "80", paddingHorizontal: 16, paddingBottom: 8 },
  imageGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 16 },
  imageWrapper: { position: "relative", width: "30%", aspectRatio: 1, marginBottom: 8 },
  image: { width: "100%", height: "100%", borderRadius: 12 },
  removeBtn: { position: "absolute", top: 4, right: 4, backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 999, padding: 2 },
  addPhotoContainer: { flexDirection: "row", justifyContent: "space-around", marginHorizontal: 16, marginTop: 8 },
  addPhotoBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: PRIMARY, borderRadius: 12, padding: 12, gap: 8, flex: 1, marginHorizontal: 4 },
  addPhotoText: { color: PRIMARY, fontWeight: "bold" },
  textArea: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#ccc", padding: 12, marginHorizontal: 16, minHeight: 120 },
  notifications: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 16, marginVertical: 16, padding: 12, borderRadius: 12, backgroundColor: PRIMARY + "20" },
  notificationText: { color: SECONDARY, fontWeight: "500", flex: 1 },
  toggle: { width: 40, height: 20, borderRadius: 999, backgroundColor: "#ccc", justifyContent: "center", padding: 2 },
  toggleActive: { backgroundColor: PRIMARY },
  toggleCircle: { width: 16, height: 16, borderRadius: 999, backgroundColor: "#fff", transform: [{ translateX: 0 }] },
  toggleCircleActive: { transform: [{ translateX: 20 }] },
  nextBtn: { backgroundColor: PRIMARY, marginHorizontal: 16, paddingVertical: 16, borderRadius: 999, alignItems: "center", marginBottom: 32 },
  nextBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

export default function LocationContactScreen({ navigation, route }) {
  const PRIMARY = "#eb4770";
  const totalSteps = 5;
  const [currentStep, setCurrentStep] = useState(3);

  const { tableDesignData, quantityBudgetData } = route.params || {};

  const [locationURL, setLocationURL] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [useDefault, setUseDefault] = useState(false);

  // Load saved default location URL
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("defaultLocationURL");
      if (saved) setLocationURL(saved);
    })();
  }, []);

  const saveDefaultAddress = async () => {
    if (useDefault && locationURL.trim() !== "") {
      await AsyncStorage.setItem("defaultLocationURL", locationURL);
    }
  };

  // ➤ WhatsApp Us
  const whatsappUs = () => {
    Linking.openURL("https://wa.me/70788849");
  };

  // ➤ Boutique Location
  const openMaps = () => {
    Linking.openURL("https://maps.app.goo.gl/tv1HRav8YjM14yas9");
  };

  // ➤ Open event location link OR default Lebanon map
  const openEventLocation = () => {
    let url = locationURL.trim();

    // Default Lebanon map if user left it empty
    if (!url) {
      url = "https://www.google.com/maps/place/Lebanon/";
    }

    Linking.openURL(url);
  };

  const handleNext = async () => {
    if (!locationURL.trim()) {
      return Alert.alert("Error", "Please paste the event location URL.");
    }

    await saveDefaultAddress();

    navigation.navigate("InspirationNotes", {
      ...(route.params || {}),
      locationContactData: { locationURL, contactName, phone },
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Design My Table</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Indicators */}
        <View style={styles.indicators}>
          {[...Array(totalSteps)].map((_, i) => (
            <View key={i} style={styles.indicatorOuter}>
              <View
                style={[
                  styles.indicatorInner,
                  i < currentStep ? styles.activeIndicator : styles.inactiveIndicator,
                ]}
              />
            </View>
          ))}
        </View>

        {/* Headline */}
        <Text style={styles.headline}>Location & Contact</Text>
        <Text style={styles.subtitle}>
          Please provide the event location URL and contact information for our team.
        </Text>



        {/* Form */}
        <View style={styles.form}>

          {/* Event Location URL */}
          <View>
            <Text style={styles.label}>Event Location URL (Google Maps)</Text>
            <TextInput
              style={styles.input}
              placeholder="Paste Google Maps link here"
              value={locationURL}
              onChangeText={setLocationURL}
              autoCapitalize="none"
            />

            <TouchableOpacity onPress={openEventLocation}>
              <Text style={{ color: PRIMARY, marginTop: 6 }}>
                Open Location
              </Text>
            </TouchableOpacity>
          </View>

          {/* Default checkbox */}
          <View style={styles.checkboxRow}>
            <Text>Use this location as default for next time</Text>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setUseDefault(!useDefault)}
            >
              {useDefault && <View style={styles.checkboxInner} />}
            </TouchableOpacity>
          </View>

          {/* Contact Person */}
          <View>
            <Text style={styles.label}>Contact person name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Jane Doe"
              value={contactName}
              onChangeText={setContactName}
            />
          </View>

          {/* Phone */}
          <View>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., +961 70 000 000"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Contact Buttons */}
        <View style={styles.contactBtns}>
          <TouchableOpacity style={styles.contactBtn} onPress={whatsappUs}>
            <MaterialIcons name="chat" size={20} color={PRIMARY} />
            <Text style={styles.contactBtnText}>WhatsApp Us</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactBtn} onPress={openMaps}>
            <MaterialIcons name="location-pin" size={20} color={PRIMARY} />
            <Text style={styles.contactBtnText}>Telle Mère Telle Fille Location</Text>
          </TouchableOpacity>
        </View>

        {/* Next */}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* STYLES */
const PRIMARY = "#eb4770";
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8f6f6" },
  container: { paddingBottom: 32 },
  topBar: { flexDirection: "row", alignItems: "center", padding: 16, paddingBottom: 8 },
  title: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "bold" },
  indicators: { flexDirection: "row", justifyContent: "center", gap: 4, paddingVertical: 8, paddingHorizontal: 16 },
  indicatorOuter: { flex: 1, height: 4, borderRadius: 2, marginHorizontal: 2, backgroundColor: "#e0e0e0" },
  indicatorInner: { height: 4, borderRadius: 2 },
  activeIndicator: { backgroundColor: PRIMARY },
  inactiveIndicator: { backgroundColor: "#e0e0e0" },
  headline: { fontSize: 28, fontWeight: "bold", paddingHorizontal: 16, paddingTop: 8 },
  subtitle: { fontSize: 14, color: "#555", paddingHorizontal: 16, paddingBottom: 16 },
  mapWrapper: { paddingHorizontal: 16, marginBottom: 16 },
  map: { width: "100%", height: 200, borderRadius: 16, backgroundColor: "#ddd" },
  form: { paddingHorizontal: 16, flexDirection: "column", gap: 12 },
  label: { marginBottom: 4, fontSize: 14, fontWeight: "500" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 12, padding: 12, backgroundColor: "#fff" },
  checkboxRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: { width: 16, height: 16, backgroundColor: PRIMARY, borderRadius: 4 },
  contactBtns: { flexDirection: "row", gap: 12, paddingHorizontal: 16, marginVertical: 16 },
  contactBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: PRIMARY,
    borderRadius: 999,
    paddingVertical: 12,
  },
  contactBtnText: { color: PRIMARY, fontWeight: "bold" },
  nextBtn: {
    backgroundColor: PRIMARY,
    marginHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 32,
  },
  nextBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});

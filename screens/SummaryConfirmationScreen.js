import React from "react"; 
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Styles mapping
const stylesData = [
  { id: 1, name: "Minimalist", description: "Modern & clean" },
  { id: 2, name: "Boho", description: "Earthy & free-spirited" },
  { id: 3, name: "Classic Religious", description: "Timeless & elegant" },
];

export default function SummaryConfirmationScreen({ route, navigation }) {
  const {
    tableDesignData = {},
    quantityBudgetData = {},
    locationContactData = {},
    inspirationData = {},
  } = route.params || {};

  // Table Design
  const { styleId, palette, enhancements = {} } = tableDesignData;
  const selectedStyleObj = stylesData.find((s) => s.id === styleId);
  const styleName = selectedStyleObj?.name || "";
  const styleDescription = selectedStyleObj?.description || "";
  const colorPalette = palette || "";

  // Quantity & Budget
  const { guests = 0, tableSize = "", minBudget = "", maxBudget = "" } = quantityBudgetData;

  // Location & Contact
  const { locationURL = "", contactName = "", phone = "" } = locationContactData;

  // Inspiration Notes
  const { photos = [], specialRequests = "", receiveNotifications = true } = inspirationData;

  // --- Price Calculation ---
  const calculatePrice = () => {
    const baseTableCost = tableSize.toLowerCase() === "large" ? 1000 : 700;
    const perGuestCost = parseInt(guests) ? parseInt(guests) * 15 : 0;
    const enhancementsCost = Object.values(enhancements).filter(Boolean).length * 50;
    const tableCost = baseTableCost + perGuestCost + enhancementsCost;
    const deliveryCost = 150;
    const totalCost = tableCost + deliveryCost;

    return {
      table: `$${tableCost.toLocaleString()}`,
      delivery: `$${deliveryCost.toLocaleString()}`,
      total: `$${totalCost.toLocaleString()}`,
    };
  };

  const estimatedPrice = calculatePrice();

  // Navigate to edit
  const editSection = (section) => {
    switch (section) {
      case "TableDesign":
        navigation.navigate("TableDesign", { ...tableDesignData });
        break;
      case "QuantityBudget":
        navigation.navigate("QuantityBudget", { ...quantityBudgetData });
        break;
      case "LocationContact":
        navigation.navigate("LocationContact", { ...locationContactData });
        break;
      case "InspirationNotes":
        navigation.navigate("InspirationNotes", {
          ...inspirationData,
          tableDesignData,
          quantityBudgetData,
          locationContactData,
          currentStep: 4,
        });
        break;
    }
  };

  // --- Save Product ---
  const confirmAndSaveProduct = async () => {
    const newProduct = {
      title: `${styleName} Table Setup`,
      price: parseFloat(estimatedPrice.total.replace(/[$,]/g, "")), // Convert to number
      tag: "Custom Event",
      image: photos[0] || "https://via.placeholder.com/150",
      createdAt: Timestamp.now(),
    };

    try {
      const docRef = await addDoc(collection(db, "products"), newProduct);
      const savedProduct = { id: docRef.id, ...newProduct };

      // Navigate to ProductsList with the newly added product
      navigation.navigate("ProductsList", { newProduct: savedProduct });
    } catch (err) {
      alert("Failed to add product: " + err.message);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Summary & Confirmation</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Page Indicators */}
        <View style={styles.indicators}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={[styles.indicator, i < 5 ? styles.activeIndicator : {}]} />
          ))}
        </View>
        <Text style={styles.stepText}>Step 5 of 5: Review</Text>

        {/* Photos */}
        {photos.length > 0 && (
          <ScrollView horizontal style={styles.photosScroll} showsHorizontalScrollIndicator={false}>
            {photos.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.photo} />
            ))}
          </ScrollView>
        )}

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Section title="Design Summary" onEdit={() => editSection("TableDesign")}>
            <DetailRow label="Style" value={styleName} />
            <DetailRow label="Description" value={styleDescription} />
            <DetailRow label="Color Palette" value={colorPalette} />
            {Object.keys(enhancements).map((key) => (
              <DetailRow key={key} label={key} value={enhancements[key] ? "Yes" : "No"} />
            ))}
          </Section>

          <Section title="Quantity & Budget" onEdit={() => editSection("QuantityBudget")}>
            <DetailRow label="Guests" value={guests} />
            <DetailRow label="Table Size" value={tableSize} />
            <DetailRow label="Budget" value={`$${minBudget} - $${maxBudget}`} />
          </Section>

          <Section title="Location & Contact" onEdit={() => editSection("LocationContact")}>
            <DetailRow label="Event Location URL" value={locationURL || "-"} />
            <DetailRow label="Contact Person" value={contactName || "-"} />
            <DetailRow label="Phone" value={phone || "-"} />
          </Section>

          <Section title="Special Requests & Notifications" onEdit={() => editSection("InspirationNotes")}>
            <DetailRow label="Additional Notes" value={specialRequests || "-"} />
            <DetailRow label="Notifications" value={receiveNotifications ? "Enabled" : "Disabled"} />
          </Section>

          {/* Estimated Price */}
          <View style={styles.priceCard}>
            <Text style={styles.priceTitle}>Estimated Price</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Estimated Table Cost</Text>
              <Text style={styles.priceValue}>{estimatedPrice.table}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery & Setup</Text>
              <Text style={styles.priceValue}>{estimatedPrice.delivery}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.priceRow}>
              <Text style={styles.priceTotalLabel}>Estimated Total</Text>
              <Text style={styles.priceTotalValue}>{estimatedPrice.total}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmBtn} onPress={confirmAndSaveProduct}>
          <Text style={styles.confirmBtnText}>Confirm & Send Request</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- Helper Components ---
const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const Section = ({ title, onEdit, children }) => (
  <View style={{ marginBottom: 16 }}>
    <View style={styles.summaryHeader}>
      <Text style={styles.summaryTitle}>{title}</Text>
      <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
        <Text style={styles.editBtnText}>Edit Details</Text>
      </TouchableOpacity>
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1d1a15" },
  container: { paddingBottom: 100 },
  topBar: { flexDirection: "row", alignItems: "center", padding: 16, paddingBottom: 8 },
  backArrow: { color: "#fff", fontSize: 24 },
  title: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "bold", color: "#fff" },
  indicators: { flexDirection: "row", justifyContent: "center", paddingVertical: 8, paddingHorizontal: 16, gap: 4 },
  indicator: { flex: 1, height: 4, backgroundColor: "#D0BB95", opacity: 0.2, borderRadius: 2, marginHorizontal: 2 },
  activeIndicator: { opacity: 1 },
  stepText: { color: "#b89da4", fontSize: 12, textAlign: "center", marginBottom: 8 },
  photosScroll: { paddingHorizontal: 16, marginBottom: 12 },
  photo: { width: 100, height: 100, borderRadius: 12, marginRight: 8 },
  summaryCard: { backgroundColor: "#261c1e", borderRadius: 16, marginHorizontal: 16, padding: 16 },
  summaryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  summaryTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  editBtn: { backgroundColor: "#D0BB9533", borderRadius: 12, paddingVertical: 4, paddingHorizontal: 8 },
  editBtnText: { color: "#D0BB95", fontSize: 12, fontWeight: "500" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#fff1a0" },
  detailLabel: { color: "#b89da4", fontSize: 12 },
  detailValue: { color: "#fff", fontSize: 12, fontWeight: "600" },
  priceCard: { backgroundColor: "#261c1e", borderRadius: 16, marginHorizontal: 16, padding: 16, marginTop: 16 },
  priceTitle: { color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  priceLabel: { color: "#b89da4", fontSize: 12 },
  priceValue: { color: "#fff", fontSize: 12, fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#fff1a0", marginVertical: 4 },
  priceTotalLabel: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  priceTotalValue: { color: "#D0BB95", fontSize: 16, fontWeight: "bold" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: "#1d1a15" },
  confirmBtn: { backgroundColor: "#D0BB95", borderRadius: 999, paddingVertical: 16, alignItems: "center" },
  confirmBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

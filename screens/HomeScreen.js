import React, { useState, useEffect, useContext } from "react"; 
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CartContext } from "../contexts/CartContext"; 
import { CurrencyContext } from "../contexts/CurrencyContext";
const logoUri = require("../assets/logo.jpg");

const HERO_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCjv2rynCVU0zn7AcZq7DbgBvJRatPdHW9IB0WhZ_nkGG1OJZam-jwXhFSc9cz64VnGF0icu-HBM75B38kCMzc5KZA4i51jvm2QLAj7y7mUJhS31COGtfa4Ya5mSfDkZK9OIljAWyykwkh_tp2vj9CNLkbjhoIHZ4mDnvrk6xFdVIhznLmeMO6t41Pi5Rfuuquzb5Ocqj9n28Vwm86QMnqnbQAo9_EQJPSVYfsntEHB0Di-1FKHFaW9pjGTyhUr8xanrYJ3Vp68mpQj";
const PRODUCT_1 = "https://lh3.googleusercontent.com/aida-public/AB6AXuAHLbdqytASDPNVJp0hCdBI7KjTcG0-f4JPiKNlmkhpTSkTV32K7-kq45fS68uV33zCRO1B7eSJYr6IQWoDr2Iwj95boHQ6ZsqQHmqgU8Yx-c9jwxVI0mrfNCBS65wkGp23xW8KYLCoCVAFHJt8NYU_la0xfYG2TIIMw3h2NF68VyPu5p9rZIkcgioYPSxEFRx4iuO4YRRqWOAabQHogUQ73wFhb-bFvFXNqG1-g0iGxCOGcIYqdCgBIfZiTBv_olwJxGuzQ0VNcMbZ";
const PRODUCT_2 = "https://lh3.googleusercontent.com/aida-public/AB6AXuCTlG4uwii4Mp4WXJOtDKzeiSBCq0lByQ8TVsxyW8FqGSnmTZHh-cvyMdwHLy6e-ztgZyJ_SYmQd35yk9fJbE6NXqT3ePz8kQ7yJ9vtYnP5fiBPVJSJrf5hMeqljDBKajrxCcnIrRCfFJ4maAr5equ08469ZbK0oY1L8Z9RBVHdqkl17I0bZJ3kiXpZ01qyNuwO3s52QWxZWKlKMQzAFWUU2zorMge7-pGiFhkeLDI5PTacUpVT0hN3btsFmkkEsN67XkEQdtH7dEpy";
const PRODUCT_3 = "https://lh3.googleusercontent.com/aida-public/AB6AXuAGza6oIpXbWO1qCoegTgh3reN1FLhWUa0UAhiceqGAKlcyTowITvhet5AZ-4i-t7ROAPDxkf7SqqPd3fbiA7Ff95IZlO2HogjrjSO6tNrOFRlSqsusSD68fqy4Eyfs2KjdLCA1u8rr2zIVWeZIL2Rv3aR7tCvi1_pjBrtBSWGeKFECpar-xlhp-HMBwxUpZoXepVYwMRaWYD6GTHE1nE294sJGwq471PGBz0VJyhJlWdgUbQaHQtExRSSeFFVesFrQmw9wWUblBCRc";
const PRODUCT_4 = "https://lh3.googleusercontent.com/aida-public/AB6AXuB-pnl6Eez1vYT-FnQ-ly8KzdBIxuiR-bUwW8anjgeIRBpNoFcW6W7IfgEYfNftgeVfl1PTGJlI7UNhmdZR_Mng7ywcjFFGa5CWf21HhV7hJUg3AS_R_CpfTOMcp22F0egParCx4xAGdKRWAd9DItrerwwjEyrOdNnnwHXH9liO_1OWis8nWIwV9t40cbAmoT0CiKjHOgwlrs-8M5NEhDINqWzl5SMIGw2VI92gGPCSBbtVD7gN6UvczGFvW3UTeGKQ6lFq4jfpc77V";
const PRODUCT_5 = "https://lh3.googleusercontent.com/aida-public/AB6AXuC9WTXEtyBEFfTG5HsuA5aNoivBRoiY4Egb1twzyZLW_V6mTiPqsTZoNYY8iZyy4Y5vRsY09Zf1fLFUwANNYv83MK6e--vwYXjSf6XSqqpSbPph5qry2C6-xqJybfuhLO7HVnp7cwh1l6UnFsAPO4sYf-bu7eA7oEgta449nxsHDwF-0CYYvr4y5SkodfDEz3JQ4HB0DqPcVIaWvpE513oZ6NARZQdMBEbZ2W_oL6S-DKi9vNzUs1P48u65CEgVovSildqLojL9ldgx";
const PRODUCT_6 = "https://lh3.googleusercontent.com/aida-public/AB6AXuDf7C5jbBLLayzjV3UqENiRfDL8QwbK2Ea98ups5Gv07-mQyoJxnP5_GmrrFi9EGkX5YRuMVWPHDwNC04_qMH7osIHtHQcpUN2m7PSdlypBU7cu8-j1cDGEUX9tcT6g4WHwsAXGOGFPEaV0_UlXRIlyIaoQMHe9vo96vtHJEjLhQ_LnR7bTYzc333nP3eRrZcCHGZQiMAqce1S-kJ_v2w5weqcVxo1bolAJhCdSFVcPdI-NZIdEgSQN1_XY2w4-OhAGrQWMLx87LxCD";

const PRODUCTS = [
  { id: "r1", title: "Blissful Bites Box", desc: "A curated selection of 24 signature truffles.", price: 75, category: "Weddings", image: PRODUCT_1 },
  { id: "r2", title: "Rose Petal Dreams", desc: "White chocolate infused with delicate rose.", price: 22.5, category: "Baptism", image: PRODUCT_2 },
  { id: "r3", title: "Blush & Gold Wedding", desc: "Elegant white and gold chocolates for your wedding.", price: 450, category: "Weddings", image: PRODUCT_3 },
  { id: "r4", title: "Royal Baptism Collection", desc: "Chocolates fit for your little one’s special day.", price: 550, category: "Baptism", image: PRODUCT_4 },
  { id: "r5", title: "Enchanted Forest Newborn", desc: "Magical treats welcoming your newborn.", price: 600, category: "Newborn", image: PRODUCT_5 },
  { id: "r6", title: "Ethereal Spring Celebration", desc: "Delightful chocolates for birthdays and spring festivities.", price: 500, category: "Birthdays", image: PRODUCT_6 },
];

// Use only PRODUCTS for now
const ALL_PRODUCTS = [...PRODUCTS];

const EVENTS = [
  { id: "e1", title: "Maria's Baptism", daysLeft: 12 },
  { id: "e2", title: "John's Wedding", daysLeft: 25 },
];

const CURRENCY_OPTIONS = [
  { region: "United States", currency: "USD" },
  { region: "Canada", currency: "CAD" },
  { region: "Europe", currency: "EUR" },
  { region: "Lebanon", currency: "LBP" },
  { region: "United Kingdom", currency: "GBP" },
  { region: "Japan", currency: "JPY" },
];

export default function HomeScreen({ navigation }) {
  const { selectedCurrency, setSelectedCurrency, currencyRates, setCurrencyRates } = useContext(CurrencyContext);
  const [loadingRates, setLoadingRates] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChip, setSelectedChip] = useState("All");

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      setCurrencyRates(data.rates); 
    } catch (err) {
      console.error("Failed to fetch exchange rates", err);
    } finally {
      setLoadingRates(false);
    }
  };

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency); // ✅ update context
    setModalVisible(false);
  };

  const convertPrice = (price) => {
    if (!currencyRates[selectedCurrency.currency]) return price.toFixed(2);
    return (price * currencyRates[selectedCurrency.currency]).toFixed(2);
  };

  const nextEvent = EVENTS.sort((a, b) => a.daysLeft - b.daysLeft)[0];

  const filteredProducts =
    selectedChip === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedChip);

  if (loadingRates) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#eb4770" />
          <Text style={{ marginTop: 12 }}>Loading currency rates...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.root}>
        <TopBar navigation={navigation} />
        <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 140 }}>
          <Hero navigation={navigation} />
          <Chips selectedChip={selectedChip} setSelectedChip={setSelectedChip} />
          <SectionTitle title="Recommended for you" />
          <RecommendedGrid
            currency={selectedCurrency.currency}
            convertPrice={convertPrice}
            products={filteredProducts}
            addToCart={addToCart}
          />
          <IntegratedWidgets
            region={selectedCurrency.region}
            currency={selectedCurrency.currency}
            event={nextEvent}
            onPress={() => setModalVisible(true)}
          />
        </ScrollView>
        <FloatingButton navigation={navigation} />

        <Modal transparent visible={modalVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Region & Currency</Text>
              <FlatList
                data={CURRENCY_OPTIONS}
                keyExtractor={(item) => item.currency}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleCurrencySelect(item)}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={styles.modalItemText}>{item.region} ({item.currency})</Text>
                      {selectedCurrency.currency === item.currency && (
                        <MaterialIcons name="check" size={20} color="#eb4770" />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={[styles.modalItem, { alignItems: "center" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalItemText, { color: "red" }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

/* --- HERO SECTION --- */
function Hero({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.heroOverlay} />
        <View style={styles.heroTextWrap}>
          <Text style={styles.heroTitle}>The Wedding Collection</Text>
          <Text style={styles.heroSubtitle}>Exquisite chocolates for your unforgettable day.</Text>
          <TouchableOpacity style={styles.heroBtn} onPress={() => navigation.navigate("Shop", { screen: "OccasionScreen" })}>
            <Text style={styles.heroBtnText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

/* --- TOP BAR + CHIPS --- */
function TopBar({ navigation }) {
  return (
    <View style={styles.topbar}>
      <TouchableOpacity style={styles.drawerBtn} onPress={() => navigation.openDrawer()}>
        <View style={styles.drawerLine} />
        <View style={styles.drawerLine} />
        <View style={styles.drawerLine} />
      </TouchableOpacity>
      <View style={styles.logoWrap}>
        <Image source={logoUri} style={styles.logo} />
      </View>
    </View>
  );
}

function Chips({ selectedChip, setSelectedChip }) {
  const chips = ["All", "Weddings", "Newborn", "Baptism", "Birthdays"];
  return (
    <View style={styles.chipsWrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        {chips.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, selectedChip === c ? styles.chipPrimary : styles.chipNeutral]}
            onPress={() => setSelectedChip(c)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, selectedChip === c ? styles.chipTextPrimary : null]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function SectionTitle({ title }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

/* --- PRODUCT GRID --- */
function RecommendedGrid({ currency, convertPrice, products, addToCart }) {
  return (
    <View style={styles.container}>
      {products.map((it) => (
        <View key={it.id} style={styles.productCard}>
          <Image source={{ uri: it.image }} style={styles.productImage} />
          <View style={styles.productBody}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productTitle}>{it.title}</Text>
              <Text style={styles.productDesc}>{it.desc}</Text>
              {it.category && (
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryTagText}>{it.category}</Text>
                </View>
              )}
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.productPrice}>{currency} {convertPrice(it.price)}</Text>
              <TouchableOpacity
                style={styles.addToCartBtn}
                onPress={() => addToCart({ ...it, quantity: 1 })}
              >
                <MaterialIcons name="add-shopping-cart" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

/* --- INTEGRATED WIDGETS --- */
function IntegratedWidgets({ region, currency, event, onPress }) {
  return (
    <View style={[styles.container, { paddingTop: 12 }]}>
      {event && (
        <View style={styles.widget}>
          <View style={styles.widgetLeft}>
            <MaterialIcons name="celebration" size={28} color="#eb4770" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.widgetTitle}>Upcoming Event</Text>
              <Text style={styles.widgetSubtitle}>{event.title} in {event.daysLeft} days</Text>
            </View>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={18} color="#9b9b9b" />
        </View>
      )}
      <TouchableOpacity style={styles.widget} onPress={onPress}>
        <View style={styles.widgetLeft}>
          <MaterialIcons name="language" size={28} color="#eb4770" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.widgetTitle}>Region & Currency</Text>
            <Text style={styles.widgetSubtitle}>{region} ({currency})</Text>
          </View>
        </View>
        <MaterialIcons name="arrow-forward-ios" size={18} color="#9b9b9b" />
      </TouchableOpacity>
    </View>
  );
}

/* --- FLOATING BUTTON --- */
function FloatingButton({ navigation }) {
  return (
    <View style={styles.fabWrap}>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("Cart")}>
        <MaterialIcons name="shopping-cart" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

/* --- STYLES --- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8f6f6" },
  root: { flex: 1 },
  scroll: { flex: 1 },
  container: { paddingHorizontal: 20 },
  hero: { width: "100%", height: 240, justifyContent: "flex-end" },
  heroImage: { borderRadius: 16 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 16 },
  heroTextWrap: { padding: 16 },
  heroTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  heroSubtitle: { fontSize: 14, color: "#fff", marginVertical: 6 },
  heroBtn: { backgroundColor: "#eb4770", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignSelf: "flex-start" },
  heroBtnText: { color: "#fff", fontWeight: "bold" },
  topbar: { flexDirection: "row", alignItems: "center", padding: 16, justifyContent: "space-between" },
 drawerBtn: {
    width: 32,
    justifyContent: "space-between",
    height: 20,
  },
  drawerLine: { height: 3, backgroundColor: "#000", borderRadius: 2 },
  logoWrap: { flex: 0, alignItems: "flex-end" },
  logo: { width: 120, height: 40, resizeMode: "contain" },
  chipsWrap: { marginVertical: 12, paddingLeft: 16 },
  chipsRow: { paddingVertical: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, marginRight: 12 },
  chipPrimary: { backgroundColor: "#eb4770" },
  chipNeutral: { backgroundColor: "#e0e0e0" },
  chipText: { fontSize: 14 },
  chipTextPrimary: { color: "#fff" },
  sectionTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 12, marginTop: 8,paddingLeft: 16 },
  productCard: { marginBottom: 16, borderRadius: 12, backgroundColor: "#fff", overflow: "hidden", elevation: 2 },
  productImage: { width: "100%", height: 180 },
  productBody: { padding: 12 },
  productTitle: { fontSize: 16, fontWeight: "bold" },
  productDesc: { fontSize: 12, color: "#555", marginVertical: 4 },
  categoryTag: { backgroundColor: "#f0f0f0", alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginVertical: 4 },
  categoryTagText: { fontSize: 10, color: "#333" },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  productPrice: { fontSize: 14, fontWeight: "bold" },
  addToCartBtn: { backgroundColor: "#eb4770", padding: 6, borderRadius: 8 },
  widget: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: 12, borderRadius: 12, marginVertical: 6 },
  widgetLeft: { flexDirection: "row", alignItems: "center" },
  widgetTitle: { fontSize: 14, fontWeight: "bold" },
  widgetSubtitle: { fontSize: 12, color: "#555" },
  fabWrap: { position: "absolute", bottom: 20, right: 20 },
  fab: { backgroundColor: "#eb4770", padding: 16, borderRadius: 50, elevation: 5 },
  modalOverlay: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" },
  modalContainer: { margin: 20, backgroundColor: "#fff", borderRadius: 12, padding: 16, maxHeight: "80%" },
  modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  modalItem: { paddingVertical: 12, borderBottomWidth: 0.5, borderColor: "#ccc" },
  modalItemText: { fontSize: 14 },
});

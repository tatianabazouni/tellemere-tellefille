import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  PanResponder,
  Animated,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // ← Added for the arrow

export default function QuantityBudgetScreen({ navigation, route }) {
  const isDark = useColorScheme() === "dark";

  // Step indicators
  const totalSteps = 5;
  const currentStep = 2;

  // Guests
  const [guests, setGuests] = useState(50);

  // Table size
  const [tableSize, setTableSize] = useState("Medium");

  // Budget range
  const [minBudget, setMinBudget] = useState(500);
  const [maxBudget, setMaxBudget] = useState(800);

  const sliderWidth = 300;
  const trackHeight = 4;

  const panMin = useRef(new Animated.Value((minBudget - 100) / 1900 * sliderWidth)).current;
  const panMax = useRef(new Animated.Value((maxBudget - 100) / 1900 * sliderWidth)).current;

  // Minimum slider pan responder
  const panResponderMin = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      let x = Math.max(0, Math.min(gesture.dx + ((minBudget - 100) / 1900) * sliderWidth, sliderWidth));
      let value = Math.round((x / sliderWidth) * 1900 + 100);
      if (value < maxBudget) {
        setMinBudget(value);
        panMin.setValue(x);
      }
    },
  });

  // Maximum slider pan responder
  const panResponderMax = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      let x = Math.max(0, Math.min(gesture.dx + ((maxBudget - 100) / 1900) * sliderWidth, sliderWidth));
      let value = Math.round((x / sliderWidth) * 1900 + 100);
      if (value > minBudget) {
        setMaxBudget(value);
        panMax.setValue(x);
      }
    },
  });

  const handleNext = () => {
    navigation.navigate("LocationContact", {
      ...(route.params || {}),
      quantityBudgetData: { guests, tableSize, minBudget, maxBudget },
    });
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: isDark ? "#211115" : "#f8f6f6" }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { backgroundColor: isDark ? "#2a161b" : "#fff" }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons
            name="arrow-back"
            size={28}
            color={isDark ? "#f8f6f6" : "#181113"}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? "#f8f6f6" : "#181113" }]}>
          Design Your Table
        </Text>
        <View style={{ width: 28 }} /> {/* placeholder for alignment */}
      </View>

      {/* Step Indicators */}
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

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text style={[styles.headline, { color: isDark ? "#f8f6f6" : "#181113" }]}>
          Quantity & Budget
        </Text>

        {/* Guests */}
        <View style={[styles.section, { backgroundColor: isDark ? "#2a161b" : "#fff" }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#f8f6f6" : "#181113" }]}>
            How many guests are you expecting?
          </Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.counterBtn}
              onPress={() => setGuests(Math.max(0, guests - 1))}
            >
              <Text>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterText}>{guests}</Text>
            <TouchableOpacity
              style={styles.counterBtn}
              onPress={() => setGuests(guests + 1)}
            >
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Table Size */}
        <View style={[styles.section, { backgroundColor: isDark ? "#2a161b" : "#fff" }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#f8f6f6" : "#181113" }]}>
            Select your table size
          </Text>
          <View style={styles.row}>
            {["Small", "Medium", "Large"].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.tableSizeBtn,
                  {
                    backgroundColor:
                      tableSize === size ? "#eb4770" : isDark ? "#3c292e" : "#f4f0f1",
                  },
                ]}
                onPress={() => setTableSize(size)}
              >
                <Text style={{ color: tableSize === size ? "#fff" : isDark ? "#f8f6f6" : "#181113" }}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Budget Slider */}
        <View style={[styles.section, { backgroundColor: isDark ? "#2a161b" : "#fff" }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#f8f6f6" : "#181113" }]}>
            What is your budget?
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 8 }}>
            ${minBudget} - ${maxBudget}
          </Text>

          {/* Slider track */}
          <View
            style={{
              width: sliderWidth,
              height: trackHeight,
              backgroundColor: isDark ? "#3c292e" : "#f4f0f1",
              borderRadius: 999,
              alignSelf: "center",
              position: "relative",
              marginVertical: 16,
            }}
          >
            <View
              style={{
                position: "absolute",
                left: (minBudget - 100) / 1900 * sliderWidth,
                right: sliderWidth - (maxBudget - 100) / 1900 * sliderWidth,
                height: trackHeight,
                backgroundColor: "#eb4770",
                borderRadius: 999,
              }}
            />
            <Animated.View
              {...panResponderMin.panHandlers}
              style={{
                position: "absolute",
                left: panMin,
                top: -8,
                width: 20,
                height: 20,
                borderRadius: 999,
                backgroundColor: "#eb4770",
                borderWidth: 3,
                borderColor: isDark ? "#2a161b" : "#fff",
              }}
            />
            <Animated.View
              {...panResponderMax.panHandlers}
              style={{
                position: "absolute",
                left: panMax,
                top: -8,
                width: 20,
                height: 20,
                borderRadius: 999,
                backgroundColor: "#eb4770",
                borderWidth: 3,
                borderColor: isDark ? "#2a161b" : "#fff",
              }}
            />
          </View>
        </View>

        <View style={[styles.suggestionBox, { backgroundColor: "#fde3e9" }]}>
          <Text style={{ color: "#eb4770", fontWeight: "500" }}>
            ℹ️ Based on your selections, we will tailor the final design to fit perfectly within your budget.
          </Text>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: "#eb4770" }]}
          onPress={handleNext}
        >
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const PRIMARY = "#eb4770";

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },

  indicators: { flexDirection: "row", justifyContent: "center", gap: 4, paddingHorizontal: 16, paddingVertical: 8 },
  indicatorOuter: { flex: 1, height: 4, borderRadius: 2, marginHorizontal: 2, backgroundColor: "#e0e0e0" },
  indicatorInner: { height: 4, borderRadius: 2 },
  activeIndicator: { backgroundColor: PRIMARY },
  inactiveIndicator: { backgroundColor: "#e0e0e0" },

  headline: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
  section: { marginBottom: 16, borderRadius: 16, padding: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  counterBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#e0e0e0", alignItems: "center", justifyContent: "center" },
  counterText: { fontSize: 16, fontWeight: "600", marginHorizontal: 12 },
  tableSizeBtn: { flex: 1, paddingVertical: 10, marginHorizontal: 4, borderRadius: 16, alignItems: "center" },
  suggestionBox: { marginTop: 16, padding: 12, borderRadius: 16 },
  nextBtn: { marginHorizontal: 16, paddingVertical: 16, borderRadius: 999, alignItems: "center", marginBottom: 32 },
  nextBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});

import React, { useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FavoritesContext } from "../contexts/FavoritesContext"; // import context

export default function FavoriteScreen({ navigation }) {
  const { favorites, setFavorites } = useContext(FavoritesContext); // access favorites
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 48) / 2;

  // Remove from favorites
  const toggleFavorite = (item) => {
    setFavorites(favorites.filter((fav) => fav.id !== item.id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      <View style={styles.chipsContainer}>
        <View
          style={[styles.chip, { backgroundColor: "rgba(235,71,112,0.2)" }]}
        >
          <Text
            style={[
              styles.chipText,
              { color: "#eb4770", fontWeight: "600" },
            ]}
          >
            Collections
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {favorites.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 50, color: "#88636c" }}>
            No favorite items yet.
          </Text>
        ) : (
          favorites.map((item) => (
            <View key={item.id} style={[styles.card, { width: cardWidth }]}>
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.cardImage}
                imageStyle={{ borderRadius: 16 }}
              >
                <TouchableOpacity
                  style={styles.favButton}
                  onPress={() => toggleFavorite(item)}
                >
                  <MaterialIcons name="favorite" size={20} color="#eb4770" />
                </TouchableOpacity>
              </ImageBackground>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardPrice}>From ${item.price}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f6f6" },
  header: { paddingTop: 50, paddingBottom: 16, alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#181113" },
  chipsContainer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  chip: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: { fontSize: 14 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: { marginBottom: 16 },
  cardImage: { width: "100%", height: 160, justifyContent: "flex-end" },
  favButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 16,
    padding: 4,
  },
  cardTitle: { marginTop: 8, fontSize: 16, fontWeight: "600" },
  cardPrice: { fontSize: 12, color: "#88636c" },
  viewDetails: { fontSize: 12, color: "#eb4770", marginTop: 4 },
});

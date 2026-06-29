import React from "react";
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const collectionItems = [
  {
    id: 1,
    title: "Blush Newborn Delight",
    price: "From $850",
    category: "Newborn",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDu581OJMq51vnNLAA9NrzwyOLFHVHY-cMYW2ORmdL6cUIQUwziezLXZLBTq6w5rpB72XPxfXOjw1al9AVWWJxmNt_BIhGpZdSGL161vehsiJ5QU85JXC_RlKVjak4G7a3rwN7koPsJ3YYl6KLurOY59Wx3UaRj2lOJ4gZZHffqJjDUSLMBY0NEeaGGfyNgGhfv7elcFKEpgL02d30cmKT9iOmS1zt0qqwKFopSFXM5dsmt9dSk2ruMujS4ouzH0bw5V--lyCcHOYCK",
    favorite: false,
  },
  {
    id: 2,
    title: "The Royal Wedding Table",
    price: "From $1200",
    category: "Wedding",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2N0qm-v4z-frrxBH1AN2L9PxWGHcaxc10Q3gPvvSVJt1aLwQRPkQTWxYqS3fgmlQXaElEMQRMJvO95ibPC42zDDMjXqcHRgEjT0sLIOEhisrutHf94h3KWzgF4GIU-_WrYh87iSbOGPHgXQqhnptBPqkALAX04ugqu3mC8EWLaN4UvJ7onh-W3o81VcUvxOf4ssfc4LGveGKztGD2dQeofywjphjncq7bDut2hqM7HlpGN_urQwnzOPCP2hAHBT3ZpOf7B5SHbWbd",
    favorite: true,
  },
  {
    id: 3,
    title: "Golden Baptism",
    price: "From $900",
    category: "Baptism",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4h_Os98b5-EEvtU5xSWWin95I9PpvimF6We-t1bT-yX7PyLJAP31QLKW1JfI1aNR_b8CuXGLzVci-NIi_4GdONkH5mSgG-Y4yXlUyyKIbqNjWc4hu4PvI3PAOdU5tN5TOb16Dv7ukyZc335n3nuHSkYDnQuL-pcuT4H2feI5vxJTy2TpGfqQCU2n_jfrePdZmcw9pRmpC0g-b42AHy8R_QZAZh_B-vhtAiinhDX6P8ypBeT1zIimi5N4fBKKxBNw4K9w0WbtIGFil",
    favorite: false,
  },
  {
    id: 4,
    title: "Elegant Birthday Bash",
    price: "From $750",
    category: "Birthday",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDK_bwq9TaF76Xc-uu9sHm8EU4hFgTy8NIxTmfj5VYPj2k0tnDXz3jrDNhCh2XCLQHpaQCKgHDvoX4Q6k2eGUF2g8YfcTY9z91k79Q5E3xJFWklcGD98FFTMkOhBuP8Dc9M4YrM-y8zGWDHSjSkRawuhdjsDS9JD4Lb_xppliLchKBaRvwtD5cqwW4vH3wcFid0VcVzOjoMq1ir8q8PSuv2CZN1qrEcCyLZ35rridb2FIovs4om_wP6-vQYX9KDlYWKexcgX3495m0s",
    favorite: false,
  },
];

export default function CollectionsScreen() {
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 48) / 2; // 16px padding *2 + 16 gap

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <MaterialIcons name="arrow-back-ios" size={24} color="#181113" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Collections</Text>
        <TouchableOpacity>
          <MaterialIcons name="search" size={24} color="#181113" />
        </TouchableOpacity>
      </View>

      {/* Chips / Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
        {["Newborn", "Baptism", "Holy Communion", "Birthday", "Wedding"].map((chip, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.chip, chip === "Newborn" ? { backgroundColor: "#eb4770" } : { borderWidth: 1, borderColor: "#ccc" }]}
          >
            <Text style={[styles.chipText, chip === "Newborn" && { color: "#fff" }]}>{chip}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Grid */}
      <ScrollView contentContainerStyle={styles.grid}>
        {collectionItems.map((item) => (
          <View key={item.id} style={[styles.card, { width: cardWidth }]}>
            <ImageBackground source={{ uri: item.image }} style={styles.cardImage} imageStyle={{ borderRadius: 16 }}>
              <TouchableOpacity style={styles.favButton}>
                <MaterialIcons name={item.favorite ? "favorite" : "favorite-border"} size={20} color="#eb4770" />
              </TouchableOpacity>
            </ImageBackground>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardPrice}>{item.price}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { name: "Home", icon: "home" },
          { name: "Collections", icon: "category", active: true },
          { name: "Favorites", icon: "favorite" },
          { name: "Profile", icon: "person" },
        ].map((tab, index) => (
          <TouchableOpacity key={index} style={styles.navItem}>
            <MaterialIcons name={tab.icon} size={24} color={tab.active ? "#eb4770" : "#555"} />
            <Text style={[styles.navText, tab.active && { color: "#eb4770", fontWeight: "700" }]}>{tab.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f6f6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#181113" },
  chipsContainer: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingBottom: 12 },
  chip: { height: 40, borderRadius: 20, paddingHorizontal: 16, alignItems: "center", justifyContent: "center", marginRight: 8 },
  chipText: { fontSize: 14, color: "#181113", fontWeight: "500" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 100 },
  card: { marginBottom: 16 },
  cardImage: { width: "100%", height: 180, justifyContent: "flex-end" },
  favButton: { position: "absolute", top: 8, right: 8, backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 16, padding: 4 },
  cardTitle: { marginTop: 8, fontSize: 16, fontWeight: "700", color: "#181113" },
  cardPrice: { fontSize: 12, color: "#88636c" },
  categoryBadge: { marginTop: 4, backgroundColor: "rgba(235,71,112,0.1)", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, alignSelf: "flex-start" },
  categoryText: { fontSize: 10, color: "#eb4770", fontWeight: "500" },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#f8f6f6",
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 10, color: "#555" },
});

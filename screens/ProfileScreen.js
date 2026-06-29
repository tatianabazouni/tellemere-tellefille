import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import { auth, db, storage } from "../firebaseConfig";
import { signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({
          ...data,
          profileImage: data.profileImage || "https://via.placeholder.com/150",
        });
      } else {
        const initialData = {
          fullName: user.displayName || "",
          email: user.email,
          phone: "",
          shippingAddress: "",
          profileImage: user.photoURL || "https://via.placeholder.com/150",
        };
        await setDoc(docRef, initialData);
        setUserData(initialData);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted)
      return alert("Permission is required to access photos.");

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
      allowsEditing: true,
    });

    if (!pickerResult.assets || pickerResult.assets.length === 0) return;

    const imageUri = pickerResult.assets[0].uri;

    // Temporary preview
    setUserData(prev => ({ ...prev, profileImage: imageUri }));

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profileImages/${user.uid}.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // Save Firestore URL and update Auth
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { profileImage: downloadURL }, { merge: true });
      await updateProfile(user, { photoURL: downloadURL });

      // Sync state with Firestore URL
      setUserData(prev => ({ ...prev, profileImage: downloadURL }));
      Alert.alert("Success", "Profile image updated!");
    } catch (err) {
      alert("Failed to upload image: " + err.message);
    }
  };

  const saveChanges = async () => {
    try {
      await updateProfile(user, { displayName: userData.fullName });
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, userData, { merge: true });
      setEditMode(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (!userData)
    return (
      <Text style={{ flex: 1, textAlign: "center", marginTop: 50 }}>
        Loading...
      </Text>
    );

  return (
    <ScrollView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#4B4B4B" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>My Profile</Text>
      </View>

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={editMode ? pickImage : null}>
          <Image
            source={{ uri: userData.profileImage }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        {editMode ? (
          <RNTextInput
            value={userData.fullName}
            onChangeText={text =>
              setUserData(prev => ({ ...prev, fullName: text }))
            }
            style={[
              styles.profileName,
              { fontSize: 24, borderBottomWidth: 1, borderColor: "#ccc", textAlign: "center" },
            ]}
          />
        ) : (
          <Text style={styles.profileName}>
            {userData.fullName || "Your Name"}
          </Text>
        )}
      </View>

      {/* Information Card */}
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <MaterialIcons name="mail" size={24} color="#DAA520" />
          <View style={styles.infoText}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{userData.email}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="phone" size={24} color="#DAA520" />
          {editMode ? (
            <RNTextInput
              value={userData.phone}
              onChangeText={text =>
                setUserData(prev => ({ ...prev, phone: text }))
              }
              style={styles.inputField}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{userData.phone || "Not set"}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="local-shipping" size={24} color="#DAA520" />
          {editMode ? (
            <RNTextInput
              value={userData.shippingAddress}
              onChangeText={text =>
                setUserData(prev => ({ ...prev, shippingAddress: text }))
              }
              style={styles.inputFieldMultiLine}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholder="Enter your shipping address"
            />
          ) : (
            <Text style={styles.value}>
              {userData.shippingAddress || "Not set"}
            </Text>
          )}
        </View>

        <View style={styles.divider} />
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {editMode ? (
          <Button
            mode="contained"
            onPress={saveChanges}
            style={styles.editButton}
          >
            Save Changes
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={() => setEditMode(true)}
            style={styles.editButton}
          >
            Edit Profile
          </Button>
        )}
        <Button
          mode="outlined"
          onPress={() => signOut(auth)}
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
}

// Styles unchanged
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF9F6" },
  topBar: { flexDirection: "row", alignItems: "center", padding: 16 },
  topBarTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "600", color: "#4B4B4B" },
  profileHeader: { alignItems: "center", paddingVertical: 20 },
  profileImage: { width: 112, height: 112, borderRadius: 56, borderWidth: 4, borderColor: "#FFFFFF" },
  profileName: { fontSize: 32, fontFamily: "cursive", color: "#4B4B4B", marginTop: 10 },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  infoText: { flex: 1, marginLeft: 12 },
  label: { fontSize: 12, color: "#6E6E6E", fontWeight: "500" },
  value: { fontSize: 16, color: "#4B4B4B", fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 8 },
  actions: { paddingHorizontal: 16 },
  editButton: { backgroundColor: "#FADADD", marginBottom: 10 },
  logoutButton: { borderColor: "#F0F0F0", borderWidth: 1 },
  inputField: { flex: 1, borderBottomWidth: 1, borderColor: "#ccc", fontSize: 16, paddingVertical: 2 },
  inputFieldMultiLine: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 16,
    padding: 8,
    backgroundColor: "#FAF9F6",
  },
});

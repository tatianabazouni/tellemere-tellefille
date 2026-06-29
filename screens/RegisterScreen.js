// screens/RegisterScreen.js
import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { TextInput, Button, Text, Checkbox, useTheme } from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { MaterialIcons } from "@expo/vector-icons";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [celebration, setCelebration] = useState(""); // e.g., 'A New Baby'
  const theme = useTheme();

  const register = async () => {
  if (!termsChecked) return alert("You must agree to the Terms of Service.");
  if (password !== confirmPassword) return alert("Passwords do not match!");
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update displayName in Firebase Auth
    await updateProfile(user, { displayName: fullName });

    // Save additional info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName,
      email,
      phone,
      celebration,
      shippingAddress: "",
      profileImage: "",
    });

    alert("Account created successfully!");
  } catch (err) {
    alert(err.message);
  }
};

  const celebrationOptions = ["A New Baby", "My Wedding", "An Event", "Just Browsing"];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create an Account</Text>
      <Text style={styles.subheading}>Join us to create beautiful moments.</Text>

      <TextInput
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon={() => <MaterialIcons name="person" size={20} />} />}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        left={<TextInput.Icon icon={() => <MaterialIcons name="mail" size={20} />} />}
      />

      <View style={{ position: "relative" }}>
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon={() => <MaterialIcons name="lock" size={20} />} />}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            size={24}
            color={theme.colors.onSurfaceVariant || "#666"}
          />
        </TouchableOpacity>
      </View>

      <View style={{ position: "relative" }}>
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirm}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon={() => <MaterialIcons name="lock" size={20} />} />}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowConfirm(!showConfirm)}
        >
          <MaterialIcons
            name={showConfirm ? "visibility" : "visibility-off"}
            size={24}
            color={theme.colors.onSurfaceVariant || "#666"}
          />
        </TouchableOpacity>
      </View>

      <TextInput
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        mode="outlined"
        style={styles.input}
        keyboardType="phone-pad"
        left={<TextInput.Icon icon={() => <MaterialIcons name="phone" size={20} />} />}
      />

      <Text style={styles.label}>How are you celebrating?</Text>
      <View style={styles.celebrationContainer}>
        {celebrationOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.celebrationButton,
              celebration === option && styles.celebrationSelected,
            ]}
            onPress={() => setCelebration(option)}
          >
            <Text
              style={[
                styles.celebrationText,
                celebration === option && { color: "white" },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.termsContainer}>
        <Checkbox
          status={termsChecked ? "checked" : "unchecked"}
          onPress={() => setTermsChecked(!termsChecked)}
          color="#EAC9C1"
        />
        <Text style={styles.termsText}>
          I agree to the{" "}
          <Text style={{ fontWeight: "bold", color: "#EAC9C1" }}>Terms of Service & Privacy Policy</Text>.
        </Text>
      </View>

      <Button
        mode="contained"
        onPress={register}
        style={styles.createButton}
        contentStyle={{ height: 50 }}
      >
        Create Account
      </Button>

      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Text
          style={{ fontWeight: "bold", color: "#EAC9C1" }}
          onPress={() => navigation.goBack()}
        >
          Log in
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFBF7",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "serif",
    color: "#4A4A4A",
    marginBottom: 5,
    textAlign: "center",
  },
  subheading: {
    fontSize: 16,
    color: "#6B6B6B",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    marginBottom: 15,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
    color: "#4A4A4A",
    alignSelf: "flex-start",
  },
  celebrationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  celebrationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#EAE0DD",
    backgroundColor: "transparent",
  },
  celebrationSelected: {
    backgroundColor: "#EAC9C1",
    borderColor: "#EAC9C1",
  },
  celebrationText: {
    fontSize: 14,
    color: "#6B6B6B",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#6B6B6B",
  },
  createButton: {
    width: "100%",
    backgroundColor: "#EAC9C1",
    marginBottom: 10,
  },
  loginText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
  },
});

// screens/LoginScreen.js
import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { MaterialIcons } from "@expo/vector-icons";

// Import local logo
import Logo from "../assets/logo.jpg"; // make sure logo.jpg is in assets folder

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const login = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to home/dashboard after successful login
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.welcomeText}>Welcome Back</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={{ position: "relative" }}>
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            mode="outlined"
            style={styles.input}
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

        <TouchableOpacity onPress={() => alert("Forgot password pressed")}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={login}
          loading={loading}
          style={styles.loginButton}
          contentStyle={{ height: 50 }}
        >
          Login
        </Button>

      </View>

      <Text style={styles.registerText}>
        Don't have an account?{" "}
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate("Register")}
        >
          Create an account
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
    backgroundColor: "#fdf8f5", // background-light
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4a2c2a", // brand-brown
    fontFamily: "serif",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  forgotText: {
    textAlign: "right",
    color: "rgba(74,44,42,0.8)",
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#4a2c2a",
    marginBottom: 10,
  },
 
  registerText: {
    textAlign: "center",
    color: "rgba(74,44,42,0.8)",
  },
  registerLink: {
    fontWeight: "700",
    color: "#4a2c2a",
    textDecorationLine: "underline",
  },
});

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

import AuthStack from "./navigation/AuthStack";
import RootStack from "./navigation/RootStack";

import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { CurrencyProvider } from "./contexts/CurrencyContext"; // <-- import CurrencyProvider

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <PaperProvider>
      <CurrencyProvider> {/* <-- wrap app with CurrencyProvider */}
        <CartProvider>
          <FavoritesProvider>
            <NavigationContainer>
              {user ? <RootStack /> : <AuthStack />}
            </NavigationContainer>
          </FavoritesProvider>
        </CartProvider>
      </CurrencyProvider>
    </PaperProvider>
  );
}

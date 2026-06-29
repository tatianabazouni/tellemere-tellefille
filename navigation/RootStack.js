import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator"; // your existing drawer
import CheckoutScreen from "../screens/CheckoutScreen";
import ProductsListScreen from "../screens/ProductsListScreen";


const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator>
      {/* Main app (Drawer + Tabs) */}
      <Stack.Screen 
        name="Main" 
        component={DrawerNavigator} 
        options={{ headerShown: false }} 
      />
      
      {/* Checkout Screen */}
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen} 
        options={{ title: "Checkout" }} 
      />
      <Stack.Screen name="ProductsListScreen" component={ProductsListScreen} />

    </Stack.Navigator>
  );
}

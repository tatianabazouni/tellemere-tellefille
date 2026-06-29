import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, Text } from "react-native";

import ProductsListScreen from "../screens/ProductsListScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import AddProductScreen from "../screens/AddProductScreen";
import ProductFormScreen from "../screens/ProductFormScreen";
import OccasionThemeScreen from "../screens/OccasionThemeScreen";
import TableDesignScreen from "../screens/TableDesignScreen";
import QuantityBudgetScreen from "../screens/QuantityBudgetScreen";
import LocationContactScreen from "../screens/LocationContactScreen";
import InspirationNotesScreen from "../screens/InspirationNotesScreen";
import SummaryConfirmationScreen from "../screens/SummaryConfirmationScreen";

const Stack = createNativeStackNavigator();

export default function ProductsStack() {
  return (
    <Stack.Navigator>
      {/* Products List */}
      <Stack.Screen
        name="ProductsList"
        component={ProductsListScreen}
        options={({ navigation }) => ({
          title: "Products",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("AddProduct")}
              style={{ marginRight: 16 }}
            >
              <Text style={{ fontSize: 16, color: "#eb4770" }}>Add</Text>
            </TouchableOpacity>
          ),
        })}
      />

      {/* Add Product Screen */}
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ title: "Add Product" }}
      />

      {/* Product Form (Optional) */}
      <Stack.Screen
        name="ProductForm"
        component={ProductFormScreen}
        options={{ title: "Add / Edit Product" }}
      />

      {/* Product Details */}
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: "Details" }}
      />

      {/* Occasion Screen with custom back arrow */}
      <Stack.Screen
        name="OccasionScreen"
        component={OccasionThemeScreen}
        options={({ navigation }) => ({
          title: "Design My Table",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={{ marginLeft: 16 }}
            >
              <Text style={{ fontSize: 24 }}>←</Text>
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="TableDesign"
        component={TableDesignScreen}
        options={{ title: "Design Table" }}
      />

      <Stack.Screen
        name="QuantityBudget"
        component={QuantityBudgetScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="LocationContact"
        component={LocationContactScreen}
        options={{ title: "Location & Contact", headerShown: false }}
      />

      <Stack.Screen
        name="InspirationNotes"
        component={InspirationNotesScreen}
        options={{ title: "Inspiration & Notes", headerShown: false }}
      />

      <Stack.Screen
        name="SummaryScreen"
        component={SummaryConfirmationScreen}
        options={{ title: "Summary & Confirmation", headerShown: false }}
      />
    </Stack.Navigator>
  );
}

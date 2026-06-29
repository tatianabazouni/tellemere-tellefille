import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ProductsStack from "./ProductsStack";
import ProfileScreen from "../screens/ProfileScreen";
import FavoriteScreen from "../screens/FavoriteScreen";
import CartScreen from "../screens/CartScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#eb4770",
        tabBarInactiveTintColor: "#6b5a5f",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#eee",
          height: 70,
          paddingBottom: 10,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={26} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Shop"
        component={ProductsStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="storefront" size={26} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoriteScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite" size={26} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="shopping-bag" size={26} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

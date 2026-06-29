// navigation/DrawerNavigator.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import TabNavigator from "./TabNavigator";
import ProfileScreen from "../screens/ProfileScreen";
import ProductsListScreen from "../screens/ProductsListScreen";
import FavoriteScreen from "../screens/FavoriteScreen";
import { auth } from "../firebaseConfig";
import { Button } from "react-native-paper";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>

      <Drawer.Screen 
        name="Home" 
        component={TabNavigator} 
        options={{ headerShown: false }}
      />

      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Products" component={ProductsListScreen} />
      <Drawer.Screen name="Favorite" component={FavoriteScreen} />

      <Drawer.Screen 
        name="Logout" 
        component={LogoutComponent}
        options={{ title: "Log Out" }}
      />

    </Drawer.Navigator>
  );
}

// Simple component to handle logout
function LogoutComponent() {
  auth.signOut();
  return null;
}

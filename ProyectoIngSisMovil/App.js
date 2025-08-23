// IMPORTANT: Import URL polyfill FIRST to fix Hermes compatibility
import "react-native-url-polyfill/auto";

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Import screens
import LoginScreen from "./src/components/LoginScreen";
import SignUpScreen from "./src/components/SignUpScreen";
import ApplicationScreen from "./src/components/ApplicationScreen";
import StoreScreen from "./src/components/StoreScreen";
import GoalsScreen from "./src/components/GoalsScreen";
import TimerScreen from "./src/components/TimerScreen";

// Import contexts and store
import { UserProvider } from "./src/components/UserContext";
import { TimerProvider } from "./src/components/TimerContext";
import { store } from "./src/redux/store";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main App Tabs (after login)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Store") {
            iconName = focused ? "store" : "store-outline";
          } else if (route.name === "Goals") {
            iconName = focused ? "target" : "target-variant";
          } else if (route.name === "Timer") {
            iconName = focused ? "timer" : "timer-outline";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#6bb5a2",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={ApplicationScreen}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Store"
        component={StoreScreen}
        options={{
          tabBarLabel: "Store",
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          tabBarLabel: "Goals",
        }}
      />
      <Tab.Screen
        name="Timer"
        component={TimerScreen}
        options={{
          tabBarLabel: "Timer",
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <UserProvider>
          <TimerProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="Application" component={MainTabs} />
              </Stack.Navigator>
            </NavigationContainer>
          </TimerProvider>
        </UserProvider>
      </PaperProvider>
    </Provider>
  );
}

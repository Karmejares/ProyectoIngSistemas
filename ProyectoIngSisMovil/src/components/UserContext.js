import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export function UserProvider({ children }) {
  // State Management
  const [users, setUsers] = useState([]);
  const [coins, setCoins] = useState(0); // Start with 0, fetch from backend
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lastFed, setLastFed] = useState(null);
  const [foodInventory, setFoodInventory] = useState([]);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  // API URL
  const API_URL = "http://localhost:3001/api/auth";

  // Check token and fetch user profile on load
  useEffect(() => {
    const checkStoredToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          setIsLoggedIn(true);
          setLoading(true);

          // Fetch the user profile from the backend
          const response = await fetch(`${API_URL}/profile`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("✅ Profile fetched:", data);
            setUsername(data.username);
            setEmail(data.email);
            setCoins(data.coins); // Get the real coin value from the backend
          } else {
            console.error("❌ Error fetching user profile");
            logOutUser(); // Clear if the token is invalid
          }
        }
      } catch (error) {
        console.error("❌ Error checking stored token:", error.message);
      } finally {
        setLoading(false);
      }
    };

    checkStoredToken();
  }, []);

  // Add a user (for sign-up, now with 50 coins instead of 100)
  const addUser = async (userData) => {
    try {
      const newUser = {
        ...userData,
        coins: 50, // Start with 50 coins
      };
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      console.log("✅ New user registered:", data);

      setUsers((prevUsers) => [...prevUsers, data]);
      setUsername(data.username);
      setEmail(data.email);
      setCoins(data.coins);
      setIsLoggedIn(true);

      await AsyncStorage.setItem("token", data.token);
      setToken(data.token);
    } catch (error) {
      console.error("❌ Error registering user:", error.message);
    }
  };

  // Log in a user and fetch the profile
  const logInUser = async (newToken) => {
    setToken(newToken);
    setIsLoggedIn(true);
    await AsyncStorage.setItem("token", newToken);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Profile fetched after login:", data);
        setUsername(data.username);
        setEmail(data.email);
        console.log("💰 Coins from backend:", data.coins);
        setCoins(data.coins);
      } else {
        console.error("❌ Error fetching user profile after login");
      }
    } catch (error) {
      console.error(
        "❌ Error fetching user profile after login:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Log out user and clear token
  const logOutUser = async () => {
    setToken(null);
    setIsLoggedIn(false);
    setUsername(null);
    setEmail(null);
    setCoins(0);
    setFoodInventory([]);
    setLastFed(null);
    await AsyncStorage.removeItem("token");
  };

  // Manage coins with API sync
  const updateCoinsOnServer = async (newAmount) => {
    if (!token) return;

    try {
      await fetch(`${API_URL}/updateCoins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coins: newAmount }),
      });
      console.log("✅ Coins updated on server:", newAmount);
    } catch (error) {
      console.error("❌ Error updating coins on server:", error.message);
    }
  };

  const addCoins = (amount) => {
    setCoins((prevCoins) => {
      const newTotal = prevCoins + amount;
      updateCoinsOnServer(newTotal);
      return newTotal;
    });
  };

  const removeCoins = (amount) => {
    setCoins((prevCoins) => {
      const newTotal = Math.max(0, prevCoins - amount);
      updateCoinsOnServer(newTotal);
      return newTotal;
    });
  };

  // Manage food inventory
  const addFoodToInventory = (foodItem) => {
    setFoodInventory((prev) => [...prev, foodItem]);
  };

  // Feed the pet and remove from inventory
  const feedPet = (foodItemName) => {
    if (foodInventory.includes(foodItemName)) {
      setLastFed(foodItemName);
      setFoodInventory((prev) =>
        prev.filter((item, index) => index !== prev.indexOf(foodItemName))
      );
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        addUser,
        isLoggedIn,
        logInUser,
        logOutUser,
        token,
        username,
        email,
        coins,
        loading,
        addCoins,
        removeCoins,
        feedPet,
        lastFed,
        foodInventory,
        addFoodToInventory,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

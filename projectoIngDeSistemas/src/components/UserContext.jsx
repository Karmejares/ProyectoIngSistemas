import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export function UserProvider({ children }) {
  // ✅ State Management
  const [users, setUsers] = useState([]);
  const [coins, setCoins] = useState(0); // Start with 0, fetch from backend
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lastFed, setLastFed] = useState(null);
  const [foodInventory, setFoodInventory] = useState([]);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ API URL
  const API_URL = "http://localhost:3001/api/auth";

  // ✅ Check token and fetch user profile on load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      setLoading(true);

      // 🔥 Fetch the user profile from the backend
      axios
        .get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((response) => {
          console.log("✅ Profile fetched:", response.data);
          setUsername(response.data.username);
          setEmail(response.data.email);
          setCoins(response.data.coins); // 👉 Get the real coin value from the backend
        })
        .catch((error) => {
          console.error("❌ Error fetching user profile:", error.message);
          logOutUser(); // Clear if the token is invalid
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // ✅ Add a user (for sign-up, now with 50 coins instead of 100)
  const addUser = async (userData) => {
    try {
      const newUser = {
        ...userData,
        coins: 50, // 🪙 Start with 50 coins
      };
      const response = await axios.post(`${API_URL}/register`, newUser);
      console.log("✅ New user registered:", response.data);

      setUsers((prevUsers) => [...prevUsers, response.data]);
      setUsername(response.data.username);
      setEmail(response.data.email);
      setCoins(response.data.coins);
      setIsLoggedIn(true);

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
    } catch (error) {
      console.error("❌ Error registering user:", error.message);
    }
  };

  // ✅ Log in a user and fetch the profile
  const logInUser = (newToken) => {
    setToken(newToken);
    setIsLoggedIn(true);
    localStorage.setItem("token", newToken);
    setLoading(true);

    axios
      .get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      })
      .then((response) => {
        console.log("✅ Profile fetched after login:", response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
        console.log("💰 Coins from backend:", response.data.coins);
        setCoins(response.data.coins);
      })
      .catch((error) => {
        console.error(
          "❌ Error fetching user profile after login:",
          error.message
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ✅ Log out user and clear token
  const logOutUser = () => {
    setToken(null);
    setIsLoggedIn(false);
    setUsername(null);
    setEmail(null);
    setCoins(0);
    setFoodInventory([]);
    setLastFed(null);
    localStorage.removeItem("token");
  };

  // ✅ Manage coins with API sync
  const updateCoinsOnServer = async (newAmount) => {
    if (!token) return;

    try {
      await axios.post(
        `${API_URL}/updateCoins`,
        { coins: newAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  // ✅ Manage food inventory
  const addFoodToInventory = (foodItem) => {
    setFoodInventory((prev) => [...prev, foodItem]);
  };

  // ✅ Feed the pet and remove from inventory
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

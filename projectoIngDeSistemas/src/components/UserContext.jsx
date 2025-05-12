import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(); // ✅ This is the correct export

export function UserProvider({ children }) {
  // State Management
  const [users, setUsers] = useState([]);
  const [coins, setCoins] = useState(100);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lastFed, setLastFed] = useState(null);
  const [foodInventory, setFoodInventory] = useState([]);
  const [token, setToken] = useState(null); // Store the token here

  // ✅ Check token on load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      // You might also load user info or other data here if needed
    }
  }, []);

  // ✅ Add a user (for sign-up, not used in login)
  const addUser = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  // ✅ Log in a user
  const logInUser = (newToken) => {
    setToken(newToken);
    setIsLoggedIn(true);
    localStorage.setItem("token", newToken); // Store the token in localStorage
  };

  // ✅ Log out user and clear token
  const logOutUser = () => {
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("token"); // Remove the token from localStorage
  };

  // ✅ Manage coins
  const addCoins = (amount) => {
    setCoins((prevCoins) => prevCoins + amount);
  };

  const removeCoins = (amount) => {
    setCoins((prevCoins) => Math.max(0, prevCoins - amount));
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
        coins,
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

import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(); // ✅ This is the correct export

export function UserProvider({ children }) {
  // State Management
  const [users, setUsers] = useState([]);
  const [coins, setCoins] = useState(100);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lastFed, setLastFed] = useState(null);
  const [foodInventory, setFoodInventory] = useState([]);

  // ✅ Check token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // ✅ Add a user (for sign-up, not used in login)
  const addUser = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  // ✅ Log in a user
  const logInUser = () => {
    setIsLoggedIn(true);
  };

  // ✅ Log out a user
  const logOutUser = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
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

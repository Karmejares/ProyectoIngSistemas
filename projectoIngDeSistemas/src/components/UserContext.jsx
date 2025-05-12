import React, { createContext, useState } from "react";

export const UserContext = createContext(); // ✅ This is the correct export

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [coins, setCoins] = useState(100);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lastFed, setLastFed] = useState(null);
  const [foodInventory, setFoodInventory] = useState([]);

  const addUser = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const logInUser = () => {
    setIsLoggedIn(true);
  };

  const logOutUser = () => {
    setIsLoggedIn(false);
  };

  const addCoins = (amount) => {
    setCoins((prevCoins) => prevCoins + amount);
  };

  const removeCoins = (amount) => {
    setCoins((prevCoins) => Math.max(0, prevCoins - amount));
  };

  const addFoodToInventory = (foodItem) => {
    setFoodInventory((prev) => [...prev, foodItem]);
  };

  const feedPet = (foodItemName) => {
    setLastFed(foodItemName);
    setFoodInventory((prev) => prev.filter((item) => item !== foodItemName));
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

/*import React, { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [coins, setCoins] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  const addUser = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const logInUser = () => {
    setIsLoggedIn(true); // Set the user as logged in
  };

  const logOutUser = () => {
    setIsLoggedIn(false); // Log the user out
  };

  const addCoins = (amount) => {
    setCoins(prevCoins => prevCoins + amount);
  };

  const removeCoins = (amount) => {
    setCoins(prevCoins => Math.max(0, prevCoins - amount));
  };

  return (
    <UserContext.Provider
      value={{ users, addUser, isLoggedIn, logInUser, logOutUser, coins, addCoins, removeCoins, feedPet: () => {} }}
    >
      {children}
    </UserContext.Provider>
  );
}
*/
import React, { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // ← aquí se guarda el usuario logueado
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const addUser = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const logInUser = (user) => {
    setCurrentUser(user);   // ← guardamos el usuario que inicia sesión
    setIsLoggedIn(true);
  };

  const logOutUser = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider
      value={{ users, currentUser, addUser, logInUser, logOutUser, isLoggedIn }}
    >
      {children}
    </UserContext.Provider>
  );
}

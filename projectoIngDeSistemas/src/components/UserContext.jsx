import React, { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
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

  return (
    <UserContext.Provider
      value={{ users, addUser, isLoggedIn, logInUser, logOutUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

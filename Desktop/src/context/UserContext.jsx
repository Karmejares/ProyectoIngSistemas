import { createContext, useReducer, useEffect } from "react";
import { userReducer, initialState } from "./userReducer";
import { userService } from "../api/userService";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // 🔑 Verificar token al cargar app
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    userService
      .getProfile(storedToken)
      .then(({ data }) => {
        dispatch({
          type: "LOGIN",
          payload: {
            token: storedToken,
            username: data.username,
            email: data.email,
            coins: data.coins,
          },
        });
      })
      .catch(() => logOutUser());
  }, []);

  // 👉 Acciones
  const logInUser = (token, profile) => {
    localStorage.setItem("token", token);
    dispatch({ type: "LOGIN", payload: { token, ...profile } });
  };

  const logOutUser = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  const addCoins = (amount) => {
    const newTotal = state.coins + amount;
    if (state.token) userService.updateCoins(state.token, newTotal);
    dispatch({ type: "SET_COINS", payload: newTotal });
  };

  const removeCoins = (amount) => {
    const newTotal = Math.max(0, state.coins - amount);
    if (state.token) userService.updateCoins(state.token, newTotal);
    dispatch({ type: "SET_COINS", payload: newTotal });
  };

  const addFoodToInventory = (foodItem) => {
    dispatch({ type: "ADD_FOOD", payload: foodItem });
  };

  const feedPet = (foodItemName) => {
    dispatch({ type: "FEED_PET", payload: foodItemName });
  };

  return (
    <UserContext.Provider
      value={{
        ...state,
        logInUser,
        logOutUser,
        addCoins,
        removeCoins,
        addFoodToInventory,
        feedPet,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

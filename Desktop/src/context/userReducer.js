export const initialState = {
  users: [],
  coins: 0,
  isLoggedIn: false,
  lastFed: null,
  foodInventory: [],
  token: null,
  username: null,
  email: null,
  loading: true,
};

export function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, ...action.payload, isLoggedIn: true, loading: false };

    case "LOGOUT":
      return { ...initialState, loading: false };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_COINS":
      return { ...state, coins: action.payload };

    case "ADD_FOOD":
      return {
        ...state,
        foodInventory: [...state.foodInventory, action.payload],
      };

    case "FEED_PET":
      return {
        ...state,
        lastFed: action.payload,
        foodInventory: state.foodInventory.filter(
          (item, idx) => idx !== state.foodInventory.indexOf(action.payload)
        ),
      };

    default:
      return state;
  }
}

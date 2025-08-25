import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api/auth";

export const userService = {
  getProfile: (token) =>
    axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  register: (userData) => axios.post(`${API_URL}/register`, userData),

  updateCoins: (token, coins) =>
    axios.post(
      `${API_URL}/updateCoins`,
      { coins },
      { headers: { Authorization: `Bearer ${token}` } }
    ),
};

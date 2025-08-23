// API Configuration for React Native
// This handles different environments (development, production, etc.)

import { Platform } from "react-native";

// Get the local IP address for development
// You need to replace this with your actual local IP address
const getBaseURL = () => {
  if (__DEV__) {
    // For development - using localhost for all platforms as a test
    // This will help us identify if it's a platform-specific issue
    return "http://192.168.1.5:3001";
  } else {
    // For production, use your production server URL
    return "https://your-production-server.com";
  }
};

export const API_BASE_URL = getBaseURL();

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/usuarios/register`,

  // User endpoints
  USER_PROFILE: `${API_BASE_URL}/api/usuarios/profile`,

  // Goals endpoints
  GOALS: `${API_BASE_URL}/api/goals`,

  // Pet endpoints
  PET_STATUS: `${API_BASE_URL}/api/pet/status`,
  FEED_PET: `${API_BASE_URL}/api/pet/feed`,

  // Store endpoints
  STORE_ITEMS: `${API_BASE_URL}/api/store`,
  PURCHASE: `${API_BASE_URL}/api/store/purchase`,

  // Inventory endpoints
  INVENTORY: `${API_BASE_URL}/api/petInventory`,

  // Coins endpoints
  COINS: `${API_BASE_URL}/api/usuarios/coins`,
};

// Helper function to get your local IP address
export const getLocalIPInstructions = () => {
  return `
To fix network errors, you need to find your computer's IP address:

Windows:
1. Open Command Prompt
2. Type: ipconfig
3. Look for "IPv4 Address" under your network adapter

Mac/Linux:
1. Open Terminal
2. Type: ifconfig
3. Look for "inet" address (usually starts with 192.168.x.x)

Then update the IP address in src/config/api.js
  `;
};

export default API_BASE_URL;

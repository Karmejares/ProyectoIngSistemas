import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import {
  fetchInventory,
  removeFoodFromBackend,
} from "../redux/foodInventorySlice";
import { fetchHungerLevel, feedPet } from "../redux/petStatusSlice";

// Food emojis mapping
const foodEmojis = {
  Fish: "🐟",
  Cookies: "🍪",
  "Wet Food": "🥫",
  "Cat Food": "🍽️",
  Meat: "🥩",
  Chicken: "🍗",
};

const FoodButton = ({ food, onFed }) => {
  const dispatch = useDispatch();

  const handleFeedClick = async () => {
    try {
      await dispatch(removeFoodFromBackend({ foodItem: food }));
      await dispatch(fetchInventory());
      await dispatch(feedPet());
      await dispatch(fetchHungerLevel());
      onFed();
    } catch (error) {
      console.error("❌ Error feeding the pet:", error.message);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleFeedClick}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{foodEmojis[food] || "🍽️"}</Text>
        <Text style={styles.text}>{food}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F06292",
    borderRadius: 16,
    padding: 8,
    minWidth: 80,
    minHeight: 100,
    margin: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  emoji: {
    fontSize: 32,
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default FoodButton;

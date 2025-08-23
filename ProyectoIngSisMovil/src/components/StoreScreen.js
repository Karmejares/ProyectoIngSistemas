import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeCoins, updateCoinsOnServer } from "../redux/coinsSlice";
import { addFoodToBackend, fetchInventory } from "../redux/foodInventorySlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Snackbar,
} from "react-native-paper";

const StoreScreen = () => {
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.coins.amount);
  const foodInventory = useSelector((state) => state.foodInventory.items);

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const catFoodItems = [
    { id: 1, name: "Fish", price: 10, emoji: "🐟" },
    { id: 2, name: "Cookies", price: 5, emoji: "🍪" },
    { id: 3, name: "Wet Food", price: 15, emoji: "🥫" },
    { id: 4, name: "Cat Food", price: 8, emoji: "🍖" },
    { id: 5, name: "Meat", price: 12, emoji: "🥩" },
    { id: 6, name: "Chicken", price: 10, emoji: "🍗" },
  ];

  // Handle Purchase and Coin Deduction
  const handlePurchase = async (item) => {
    if (coins >= item.price) {
      const token = await AsyncStorage.getItem("token");

      // Remove coins via Redux
      dispatch(removeCoins(item.price));
      dispatch(updateCoinsOnServer({ amount: coins - item.price, token }));

      // Add to Redux Inventory
      dispatch(addFoodToBackend({ foodItem: item.name }));

      console.log("Dispatching addFoodToBackend for item:", item.name);

      // Snackbar Notification
      setSnackbar({
        visible: true,
        message: `You successfully purchased ${item.name}!`,
        type: "success",
      });
    } else {
      setSnackbar({
        visible: true,
        message: `Not enough coins to buy ${item.name}.`,
        type: "error",
      });
    }
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, visible: false });
  };

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Title style={styles.title}>Cat Food Store</Title>
        <Chip icon="coin" style={styles.coinsChip}>
          💰 Available Coins: {coins}
        </Chip>
      </View>

      {/* Store Items */}
      <View style={styles.itemsContainer}>
        {catFoodItems.map((item) => {
          const canAfford = coins >= item.price;
          return (
            <Card key={item.id} style={styles.itemCard}>
              <Card.Content style={styles.itemContent}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemEmoji}>{item.emoji}</Text>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{item.price} coins</Text>
                  </View>
                </View>
                <Button
                  mode="contained"
                  onPress={() => handlePurchase(item)}
                  disabled={!canAfford}
                  buttonColor={canAfford ? "#6bb5a2" : "#ccc"}
                  textColor="#fff"
                  style={styles.buyButton}
                  compact
                >
                  {canAfford ? "Buy" : "Not Enough"}
                </Button>
              </Card.Content>
            </Card>
          );
        })}
      </View>

      {/* Current Inventory */}
      <Card style={styles.inventoryCard}>
        <Card.Content>
          <Title>Your Inventory</Title>
          {foodInventory.length > 0 ? (
            <View style={styles.inventoryGrid}>
              {foodInventory.map((food, index) => {
                const foodItem = catFoodItems.find(
                  (item) => item.name === food
                );
                return (
                  <View key={index} style={styles.inventoryItem}>
                    <Text style={styles.inventoryEmoji}>
                      {foodItem ? foodItem.emoji : "🍖"}
                    </Text>
                    <Text style={styles.inventoryName}>{food}</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Paragraph>Your inventory is empty. Buy some food!</Paragraph>
          )}
        </Card.Content>
      </Card>

      {/* Snackbar Feedback */}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={handleCloseSnackbar}
        duration={3000}
        style={{
          backgroundColor: snackbar.type === "success" ? "#4CAF50" : "#F44336",
        }}
      >
        {snackbar.message}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    color: "#4a9c8c",
    fontWeight: "bold",
    marginBottom: 10,
  },
  coinsChip: {
    backgroundColor: "#ffd54f",
  },
  itemsContainer: {
    padding: 16,
  },
  itemCard: {
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  buyButton: {
    minWidth: 80,
  },
  inventoryCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inventoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 10,
  },
  inventoryItem: {
    alignItems: "center",
    padding: 10,
    margin: 5,
    backgroundColor: "#e8f5e8",
    borderRadius: 8,
    minWidth: 80,
  },
  inventoryEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  inventoryName: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
  },
});

export default StoreScreen;

import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoins } from "../redux/coinsSlice";
import { fetchInventory } from "../redux/foodInventorySlice";
import { fetchHungerLevel } from "../redux/petStatusSlice";
import { TimerContext } from "./TimerContext";
import { UserContext } from "./UserContext";
import FoodButton from "../atoms/FoodButton";
import PetCard from "./PetCard";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Chip,
  ProgressBar,
  Button,
  Snackbar,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

function ApplicationScreen() {
  const [goals, setGoals] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [timerSnackbarVisible, setTimerSnackbarVisible] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  const { remainingTime, formatTime } = useContext(TimerContext);
  const { logOutUser } = useContext(UserContext);

  const foodInventory = useSelector((state) => state.foodInventory.items);
  const { hungerLevel, status, lastFed } = useSelector(
    (state) => state.petStatus
  );

  const dispatch = useDispatch();
  const coins = useSelector((state) => state.coins.amount);

  useEffect(() => {
    const loadData = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        dispatch(fetchCoins(token));
        dispatch(fetchHungerLevel());
        dispatch(fetchInventory(token));
      }
    };

    loadData();
  }, [dispatch]);

  useEffect(() => {
    if (remainingTime === 0) {
      setTimerSnackbarVisible(true);
    }
  }, [remainingTime]);

  const triggerFeedAnimation = () => {
    setIsBouncing(true);
    setSnackbarMessage(`Yum! ${lastFed} was delicious! 😋`);
    setSnackbarVisible(true);
    setTimeout(() => {
      setIsBouncing(false);
    }, 1000);
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => logOutUser(),
      },
    ]);
  };

  const getPetStatusColor = () => {
    switch (status) {
      case "happy":
        return "#4CAF50";
      case "neutral":
        return "#FF9800";
      case "sad":
        return "#FF5722";
      case "very sad":
        return "#F44336";
      case "weak":
        return "#9C27B0";
      default:
        return "#4CAF50";
    }
  };

  const getPetEmoji = () => {
    switch (status) {
      case "happy":
        return "😊";
      case "neutral":
        return "😐";
      case "sad":
        return "😢";
      case "very sad":
        return "😭";
      case "weak":
        return "🤒";
      default:
        return "😊";
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with coins and logout */}
      <View style={styles.header}>
        <Chip icon="coin" style={styles.coinsChip}>
          💰 Coins: {coins}
        </Chip>
        <Button mode="outlined" onPress={handleLogout} compact>
          Logout
        </Button>
      </View>

      {/* Main Content Layout */}
      <View style={styles.mainContent}>
        {/* Food Inventory Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Food Inventory</Title>
            {foodInventory.length > 0 ? (
              <View style={styles.foodGrid}>
                {foodInventory.map((food, index) => (
                  <FoodButton
                    key={index}
                    food={food}
                    onFed={triggerFeedAnimation}
                  />
                ))}
              </View>
            ) : (
              <Paragraph style={styles.noFoodText}>
                No food available. Visit the store!
              </Paragraph>
            )}
          </Card.Content>
        </Card>

        {/* Pet Card */}
        <View style={[styles.petCardContainer, isBouncing && styles.bouncing]}>
          <PetCard />
        </View>

        {/* Pet Status Info Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Pet Status</Title>
            <Paragraph style={[styles.status, { color: getPetStatusColor() }]}>
              Status: {status}
            </Paragraph>
            <View style={styles.hungerContainer}>
              <Text style={styles.hungerLabel}>Hunger Level</Text>
              <ProgressBar
                progress={(100 - hungerLevel) / 100}
                color="#4CAF50"
                style={styles.progressBar}
              />
              <Text style={styles.hungerText}>{100 - hungerLevel}%</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Timer Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Study Timer</Title>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                Remaining Time: {formatTime(remainingTime || 0)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Snackbars */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.successSnackbar}
      >
        {snackbarMessage}
      </Snackbar>

      <Snackbar
        visible={timerSnackbarVisible}
        onDismiss={() => setTimerSnackbarVisible(false)}
        duration={5000}
        action={{
          label: "OK",
          onPress: () => setTimerSnackbarVisible(false),
        }}
        style={styles.warningSnackbar}
      >
        ⏰ Your time is up! Please take a break.
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  coinsChip: {
    backgroundColor: "#ffd54f",
  },
  mainContent: {
    padding: 8,
  },
  card: {
    margin: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#fff",
  },
  petCardContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: "#d0e3e8",
  },
  cardTitle: {
    color: "#1976d2",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  petContainer: {
    alignItems: "center",
    padding: 20,
  },
  petEmojiContainer: {
    marginBottom: 10,
  },
  bouncing: {
    transform: [{ scale: 1.1 }],
  },
  petEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  status: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  hungerContainer: {
    width: "100%",
    alignItems: "center",
  },
  hungerLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  progressBar: {
    width: "100%",
    height: 10,
    marginBottom: 8,
    backgroundColor: "#e0e0e0",
  },
  hungerText: {
    fontSize: 14,
    color: "#666",
  },
  timerContainer: {
    alignItems: "center",
    padding: 15,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    marginTop: 10,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976d2",
  },
  foodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  noFoodText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    marginTop: 10,
  },
  successSnackbar: {
    backgroundColor: "#4CAF50",
  },
  warningSnackbar: {
    backgroundColor: "#FF9800",
  },
});

export default ApplicationScreen;

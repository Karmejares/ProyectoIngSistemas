import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTenCoins,
  removeTenCoins,
  updateCoinsOnServer,
} from "../redux/coinsSlice";
import { fetchGoals } from "../redux/goalsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddGoal from "./AddGoal";
import useGoals from "../hooks/useGoals";
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
  Checkbox,
  IconButton,
  FAB,
} from "react-native-paper";

const GoalsScreen = () => {
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.coins.amount);
  const goals = useSelector((state) => state.goals?.items || []);

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [expandedGoals, setExpandedGoals] = useState({});
  const [addGoalVisible, setAddGoalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Calculate streak for a goal
  const calculateStreak = (goal) => {
    if (!goal.history || goal.history.length === 0) return 0;

    const sortedHistory = [...goal.history].sort(
      (a, b) => new Date(b) - new Date(a)
    );
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const dateStr of sortedHistory) {
      const historyDate = new Date(dateStr);
      historyDate.setHours(0, 0, 0, 0);

      if (historyDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (historyDate.getTime() < currentDate.getTime()) {
        break;
      }
    }

    return streak;
  };

  // Handle goal toggle
  const handleToggleGoal = async (goalId) => {
    const token = await AsyncStorage.getItem("token");
    const today = new Date().toISOString().slice(0, 10);
    const goal = goals.find((g) => g._id === goalId);

    if (!goal) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/goals/${goalId}/toggle`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Refresh goals
        dispatch(fetchGoals());

        // Handle coins
        if (goal.history.includes(today)) {
          dispatch(removeTenCoins());
          dispatch(updateCoinsOnServer({ amount: coins - 10, token }));
          setSnackbar({
            visible: true,
            message: "💔 10 Coins Removed!",
            type: "error",
          });
        } else {
          dispatch(addTenCoins());
          dispatch(updateCoinsOnServer({ amount: coins + 10, token }));
          setSnackbar({
            visible: true,
            message: "🎉 10 Coins Added!",
            type: "success",
          });
        }
      }
    } catch (error) {
      console.error("Error toggling goal:", error);
    }
  };

  // Toggle goal details expansion
  const toggleGoalExpansion = (goalId) => {
    setExpandedGoals((prev) => ({
      ...prev,
      [goalId]: !prev[goalId],
    }));
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, visible: false });
  };

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Title style={styles.title}>My Goals</Title>
        <Chip icon="target" style={styles.goalsChip}>
          🎯 {goals.length} Goals
        </Chip>
      </View>

      {/* Goals List */}
      <View style={styles.goalsContainer}>
        {goals.length > 0 ? (
          goals.map((goal) => {
            const isCompletedToday = goal.history?.includes(today) ?? false;
            const streak = calculateStreak(goal);
            const isExpanded = expandedGoals[goal._id];

            return (
              <Card key={goal._id} style={styles.goalCard}>
                <Card.Content>
                  {/* Goal Header */}
                  <View style={styles.goalHeader}>
                    <View style={styles.goalInfo}>
                      <Checkbox
                        status={isCompletedToday ? "checked" : "unchecked"}
                        onPress={() => handleToggleGoal(goal._id)}
                        color="#6bb5a2"
                      />
                      <View style={styles.goalText}>
                        <Text
                          style={[
                            styles.goalTitle,
                            isCompletedToday && styles.completedGoal,
                          ]}
                        >
                          {goal.title}
                        </Text>
                        <Text style={styles.streakText}>
                          🔥 Streak: {streak} days
                        </Text>
                      </View>
                    </View>
                    <IconButton
                      icon={isExpanded ? "chevron-up" : "chevron-down"}
                      onPress={() => toggleGoalExpansion(goal._id)}
                      size={20}
                    />
                  </View>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <View style={styles.goalDetails}>
                      <Text style={styles.goalDescription}>
                        {goal.description || "No description available"}
                      </Text>

                      {/* Recent History */}
                      <View style={styles.historySection}>
                        <Text style={styles.historyTitle}>
                          Recent Activity:
                        </Text>
                        <View style={styles.historyDots}>
                          {Array.from({ length: 7 }, (_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() - i);
                            const dateStr = date.toISOString().slice(0, 10);
                            const isCompleted = goal.history?.includes(dateStr);

                            return (
                              <View
                                key={i}
                                style={[
                                  styles.historyDot,
                                  isCompleted && styles.completedDot,
                                ]}
                              />
                            );
                          })}
                        </View>
                      </View>

                      {/* Goal Stats */}
                      <View style={styles.statsSection}>
                        <View style={styles.statItem}>
                          <Text style={styles.statNumber}>
                            {goal.history?.length || 0}
                          </Text>
                          <Text style={styles.statLabel}>Total Days</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statNumber}>{streak}</Text>
                          <Text style={styles.statLabel}>Current Streak</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statNumber}>
                            {Math.max(
                              ...(goal.history?.map((date) => {
                                // Calculate streak for each date (simplified)
                                return 1;
                              }) || [0])
                            )}
                          </Text>
                          <Text style={styles.statLabel}>Best Streak</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </Card.Content>
              </Card>
            );
          })
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text style={styles.emptyEmoji}>🎯</Text>
              <Title>No Goals Yet</Title>
              <Paragraph>
                Start by adding your first goal to begin tracking your progress!
              </Paragraph>
            </Card.Content>
          </Card>
        )}
      </View>

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

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          setEditingGoal(null);
          setAddGoalVisible(true);
        }}
        color="#fff"
      />

      {/* Add Goal Modal */}
      <AddGoal
        visible={addGoalVisible}
        onClose={() => {
          setAddGoalVisible(false);
          setEditingGoal(null);
        }}
        goalToEdit={editingGoal}
      />
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
  goalsChip: {
    backgroundColor: "#e3f2fd",
  },
  goalsContainer: {
    padding: 16,
  },
  goalCard: {
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  goalText: {
    flex: 1,
    marginLeft: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  completedGoal: {
    textDecorationLine: "line-through",
    color: "#666",
  },
  streakText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  goalDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  goalDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  historySection: {
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  historyDots: {
    flexDirection: "row",
    gap: 4,
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ddd",
  },
  completedDot: {
    backgroundColor: "#4CAF50",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a9c8c",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  emptyCard: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyContent: {
    alignItems: "center",
    padding: 20,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#4a9c8c",
  },
});

export default GoalsScreen;

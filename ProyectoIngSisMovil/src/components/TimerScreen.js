import React, { useState, useContext, useEffect } from "react";
import { TimerContext } from "./TimerContext";
import { View, Text, StyleSheet, Alert } from "react-native";
import {
  Card,
  Title,
  Button,
  TextInput,
  Chip,
  ProgressBar,
} from "react-native-paper";

const TimerScreen = () => {
  const { remainingTime, setRemainingTime, formatTime } =
    useContext(TimerContext);
  const [inputMinutes, setInputMinutes] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    setIsRunning(remainingTime > 0);
  }, [remainingTime]);

  const startTimer = () => {
    const minutes = parseInt(inputMinutes);
    if (isNaN(minutes) || minutes <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid number of minutes.");
      return;
    }

    const timeInMs = minutes * 60 * 1000;
    setRemainingTime(timeInMs);
    setTotalTime(timeInMs);
    setInputMinutes("");
  };

  const stopTimer = () => {
    Alert.alert("Stop Timer", "Are you sure you want to stop the timer?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Stop",
        style: "destructive",
        onPress: () => {
          setRemainingTime(0);
          setTotalTime(0);
        },
      },
    ]);
  };

  const addTime = (minutes) => {
    const additionalTime = minutes * 60 * 1000;
    setRemainingTime(remainingTime + additionalTime);
    setTotalTime(totalTime + additionalTime);
  };

  const getProgress = () => {
    if (totalTime === 0) return 0;
    return (totalTime - remainingTime) / totalTime;
  };

  const getStatusColor = () => {
    const progress = getProgress();
    if (progress < 0.5) return "#4CAF50"; // Green
    if (progress < 0.8) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  const getStatusText = () => {
    if (!isRunning && remainingTime === 0) return "Ready to start";
    if (isRunning) return "Timer running";
    return "Timer paused";
  };

  return (
    <View style={styles.container}>
      {/* Timer Display Card */}
      <Card style={styles.timerCard}>
        <Card.Content style={styles.timerContent}>
          <Title style={styles.timerTitle}>Study Timer</Title>

          <View style={styles.timerDisplay}>
            <Text style={[styles.timeText, { color: getStatusColor() }]}>
              {formatTime(remainingTime || 0)}
            </Text>
            <Chip
              icon="clock"
              style={[
                styles.statusChip,
                { backgroundColor: getStatusColor() + "20" },
              ]}
              textStyle={{ color: getStatusColor() }}
            >
              {getStatusText()}
            </Chip>
          </View>

          {totalTime > 0 && (
            <View style={styles.progressContainer}>
              <ProgressBar
                progress={getProgress()}
                color={getStatusColor()}
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {Math.round(getProgress() * 100)}% Complete
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Timer Controls Card */}
      <Card style={styles.controlsCard}>
        <Card.Content>
          <Title>Timer Controls</Title>

          {!isRunning ? (
            <View style={styles.inputSection}>
              <TextInput
                label="Minutes"
                value={inputMinutes}
                onChangeText={setInputMinutes}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                placeholder="Enter minutes"
              />
              <Button
                mode="contained"
                onPress={startTimer}
                style={styles.startButton}
                buttonColor="#4CAF50"
                icon="play"
              >
                Start Timer
              </Button>
            </View>
          ) : (
            <View style={styles.runningControls}>
              <Button
                mode="contained"
                onPress={stopTimer}
                style={styles.stopButton}
                buttonColor="#F44336"
                icon="stop"
              >
                Stop Timer
              </Button>

              <View style={styles.quickAddSection}>
                <Text style={styles.quickAddTitle}>Quick Add Time:</Text>
                <View style={styles.quickAddButtons}>
                  <Button
                    mode="outlined"
                    onPress={() => addTime(5)}
                    style={styles.quickAddButton}
                    compact
                  >
                    +5 min
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => addTime(10)}
                    style={styles.quickAddButton}
                    compact
                  >
                    +10 min
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => addTime(15)}
                    style={styles.quickAddButton}
                    compact
                  >
                    +15 min
                  </Button>
                </View>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Quick Start Presets */}
      {!isRunning && (
        <Card style={styles.presetsCard}>
          <Card.Content>
            <Title>Quick Start</Title>
            <View style={styles.presetButtons}>
              <Button
                mode="outlined"
                onPress={() => {
                  setInputMinutes("25");
                  const timeInMs = 25 * 60 * 1000;
                  setRemainingTime(timeInMs);
                  setTotalTime(timeInMs);
                }}
                style={styles.presetButton}
                icon="timer"
              >
                Pomodoro (25m)
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  setInputMinutes("45");
                  const timeInMs = 45 * 60 * 1000;
                  setRemainingTime(timeInMs);
                  setTotalTime(timeInMs);
                }}
                style={styles.presetButton}
                icon="book"
              >
                Study (45m)
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  setInputMinutes("90");
                  const timeInMs = 90 * 60 * 1000;
                  setRemainingTime(timeInMs);
                  setTotalTime(timeInMs);
                }}
                style={styles.presetButton}
                icon="school"
              >
                Deep Work (90m)
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
    paddingTop: 60,
  },
  timerCard: {
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timerContent: {
    alignItems: "center",
    padding: 20,
  },
  timerTitle: {
    color: "#4a9c8c",
    marginBottom: 20,
  },
  timerDisplay: {
    alignItems: "center",
    marginBottom: 20,
  },
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 10,
  },
  statusChip: {
    marginTop: 10,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 8,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
  },
  controlsCard: {
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputSection: {
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
  startButton: {
    marginTop: 8,
  },
  runningControls: {
    marginTop: 16,
  },
  stopButton: {
    marginBottom: 20,
  },
  quickAddSection: {
    alignItems: "center",
  },
  quickAddTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  quickAddButtons: {
    flexDirection: "row",
    gap: 8,
  },
  quickAddButton: {
    minWidth: 70,
  },
  presetsCard: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  presetButtons: {
    marginTop: 16,
    gap: 8,
  },
  presetButton: {
    marginBottom: 8,
  },
});

export default TimerScreen;

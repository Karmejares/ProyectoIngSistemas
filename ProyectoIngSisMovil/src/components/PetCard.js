import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { Card, Button } from "react-native-paper";
import { useSelector } from "react-redux";

// Import pet images
const Happy = require("../../assets/Happy.png");
const Neutral = require("../../assets/Neutral.png");
const Sad = require("../../assets/Sad.png");
const VerySad = require("../../assets/VerySad.png");
const Weak = require("../../assets/Weak.png");

const PetCard = () => {
  // ✅ Get the status from Redux
  const { status } = useSelector((state) => state.petStatus);

  // ✅ Map status to the corresponding image
  const petImage =
    {
      happy: Happy,
      neutral: Neutral,
      sad: Sad,
      "very sad": VerySad,
      weak: Weak,
    }[status?.toLowerCase()] || Happy;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={petImage}
            style={styles.petImage}
            resizeMode="contain"
          />
        </View>
        <Card.Content style={styles.cardContent}>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            YOUR PET
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 300,
    height: 300,
    borderRadius: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "linear-gradient(145deg, #83a4d4, #b6fbff)", // This won't work in RN, but we'll use a solid color
    backgroundColor: "#b6fbff",
  },
  petImage: {
    width: "100%",
    height: "100%",
  },
  cardContent: {
    padding: 0,
    height: 50,
    justifyContent: "center",
  },
  button: {
    borderRadius: 0,
    backgroundColor: "#1976d2",
    height: 50,
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PetCard;

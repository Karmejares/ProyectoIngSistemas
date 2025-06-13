import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoins } from "../redux/coinsSlice";
import {
  fetchInventory,
} from "../redux/foodInventorySlice";
import { fetchHungerLevel } from "../redux/petStatusSlice";
import PetCard from "./PetCard";
import { motion } from "framer-motion";
import { LinearProgress } from "@mui/material";
import { useContext } from "react";
import { TimerContext } from "./TimerContext";
import { Card, CardContent, Chip, Divider } from "@mui/material";
import { Grid } from "@mui/material";
import MainFooter from "./MainFooter";
import FoodButton from "../atoms/foodButton.jsx";

// Match food names to icons
const foodIcons = {
  Fish: "https://lottie.host/72ec3a40-8764-4c81-b46e-6394535763e4/Z6BlFXoYGI.lottie",
  Cookies:
    "https://lottie.host/396df011-adb5-4497-a678-c264206c9871/QJQOKzaNiD.lottie",
  "Wet Food":
    "https://lottie.host/f95ed49d-7095-4b34-96d0-923683b2f3e3/Lv0ZfawpeH.lottie",
  "Cat Food":
    "https://lottie.host/52cec1d5-798a-4025-aac4-efd24b05117f/Lj0VsKuw6T.lottie",
  Meat: "https://lottie.host/748c3ea7-cc6b-4c02-9b52-b852b2fb2ddb/azAVZsZZBZ.lottie",
  Chicken:
    "https://lottie.host/237f1138-b710-4068-bc20-2d97eac6f90e/MuWGVRcgSJ.lottie",
};

function Application() {
  const [goals, setGoals] = useState([]);
  const [isBouncing, setIsBouncing] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [openTimerSnackbar, setOpenTimerSnackbar] = useState(false); // ✅ Timer Alert
  const { remainingTime, formatTime } = useContext(TimerContext);
  const foodInventory = useSelector((state) => state.foodInventory.items);

  const { hungerLevel, status, lastFed } = useSelector(
    (state) => state.petStatus,
  );

  // ✅ Redux state and dispatch
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.coins.amount);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(fetchCoins(token));
      dispatch(fetchHungerLevel());
      dispatch(fetchInventory(token));
    }
  }, [token, dispatch]);


  // ✅ Fetch goals from the backend



  const triggerFeedAnimation = () => {
    setIsBouncing(true);
    setSnackbar(true);
    setTimeout(() => {
      setIsBouncing(false);
      setSnackbar(false);
    }, 1000);
  };


  useEffect(() => {
    if (remainingTime === 0) {
      setOpenTimerSnackbar(true);
    }
  }, [remainingTime]);

  // ✅ Close Timer Snackbar
  const handleCloseTimerSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenTimerSnackbar(false);
  };

  const cardStyles = {
    width: 300,
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: 4,
    background: "linear-gradient(145deg, #ffffff, #e1e1e1)",
  };

  const titleStyle = {
    mb: 2,
    color: "#1976d2",
    fontWeight: "bold",
    textAlign: "center",
  };

  return (
    <>
      <Grid
        sx={{
          marginTop: 22,
        }}
      ></Grid>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ minHeight: "100vh", padding: 3 }}
      >
        {/* Coins in top-right corner */}
        <Chip
          label={`💰 Coins: ${coins}`}
          color="primary"
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            fontSize: "1.2rem",
            backgroundColor: "#ffd54f", // Gold
            color: "#000", // For contrast
            boxShadow: 2,
            "&:hover": {
              transform: "scale(1.05)",
              transition: "0.2s",
            },
          }}
        />

        {/* ✅ Main layout row */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
          flexWrap="wrap"
          gap={3}
          sx={{ mt: 4, mb: 6 }}
        >
          {/* Food Inventory */}
          <Card sx={cardStyles}>
            <CardContent>
              <Typography variant="h6" sx={titleStyle}>
                Food Inventory
              </Typography>
            </CardContent>
            <Divider />
            <Box sx={{ display: "flex", gap: 1, p: 2, flexWrap: "wrap" }}>
              {foodInventory.length > 0 ? (
                  foodInventory.map((food, index) => (
                      <FoodButton
                          key={index}
                          food={food}
                          icon={foodIcons[food]}
                          onFed={triggerFeedAnimation}
                      />
                  ))
              ) : (
                  <Typography sx={{ mt: 1 }} color="textSecondary">
                    No food available. Visit the store!
                  </Typography>
              )}
            </Box>
          </Card>

          {/* Pet Card */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: 4,
              boxShadow: 3,
              border: "2px solid #d0e3e8",
              position: "relative", // for overlays if needed\
              padding: 3
            }}
          >
            <Card sx={cardStyles}>
              <motion.div
                animate={{
                  scale: isBouncing ? 1.1 : 1,
                  rotate: isBouncing ? [0, 15, -15, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <PetCard />
              </motion.div>
            </Card>
          </Box>
          {/* Hunger Level + Timer */}
          <Card sx={cardStyles}>
            <CardContent sx={{ textAlign: "center", paddingBottom: 0 }}>
              <Typography variant="h6" sx={titleStyle}>
                Hunger Level
              </Typography>
              <LinearProgress
                variant="determinate"
                value={100 - hungerLevel}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  mt: 2,
                  mb: 1,
                  backgroundColor: "#e0e0e0", // Track
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#aed581", // Fill
                  },
                }}
              />
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                Status: {status}
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  backgroundColor: "#fff",
                  padding: 1,
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <Typography>
                  Remaining Time: {formatTime(remainingTime)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Success snackbar */}
        {snackbar && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Yum! {lastFed} was delicious! 😋
          </Alert>
        )}

        {/* Timer snackbar */}
        <Snackbar
          open={openTimerSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseTimerSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseTimerSnackbar}
            severity="warning"
            sx={{ width: "100%" }}
          >
            ⏰ Your time is up! Please take a break.
          </Alert>
        </Snackbar>

        {/* Footer */}
        <MainFooter goals={goals} setGoals={setGoals} />
      </Box>
    </>
  );
}

export default Application;

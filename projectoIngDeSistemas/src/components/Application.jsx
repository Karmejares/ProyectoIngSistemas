import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoins, updateCoinsOnServer } from "../redux/coinsSlice";
import {
  fetchInventory,
  removeFoodFromBackend,
} from "../redux/foodInventorySlice";
import { fetchHungerLevel, feedPet } from "../redux/petStatusSlice";

import petImage from "../assets/CutePixelatedCat.png";
import { motion } from "framer-motion";
import { LinearProgress } from "@mui/material";
import { useContext } from "react";
import { TimerContext } from "./TimerContext";
import { Card, CardContent, CardMedia, Chip, Divider } from "@mui/material";
import { Grid } from "@mui/material";
import MainFooter from "./MainFooter";
import axios from "axios";
function Application() {
  const [goals, setGoals] = useState([]);
  const [isBouncing, setIsBouncing] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [openTimerSnackbar, setOpenTimerSnackbar] = useState(false); // ✅ Timer Alert
  const { remainingTime, formatTime } = useContext(TimerContext);
  const foodInventory = useSelector((state) => state.foodInventory.items);

  const { hungerLevel, status, lastFed } = useSelector(
    (state) => state.petStatus
  );

  // ✅ Redux state and dispatch
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.coins.amount);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(fetchCoins(token));
    }
  }, [token, dispatch]);

  // ✅ Load Pet Status from Local Storage

  useEffect(() => {
    if (token) {
      dispatch(fetchHungerLevel());
    }
  }, [token, dispatch]);

  // ✅ Fetch goals from the backend
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/goals");
        const data = await response.json();
        setGoals(data.goals);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []);

  // ✅ Fetch Inventory from the backend

  useEffect(() => {
    if (token) {
      dispatch(fetchInventory(token));
    }
  }, [token, dispatch]);

  // ✅ Handle Pet Animation when fed
  useEffect(() => {
    if (lastFed) {
      setIsBouncing(true);
      setSnackbar(true);
      setTimeout(() => {
        setIsBouncing(false);
        setSnackbar(false);
      }, 1000);
    }
  }, [lastFed]);

  // ✅ Handle Click to Feed Pet

  const handleFeedClick = async (food) => {
    try {
      // 🔄 Remove food from backend and refresh inventory
      await dispatch(removeFoodFromBackend({ foodItem: food }));

      // 🔄 Fetch the updated inventory
      dispatch(fetchInventory());

      // 🔄 Feed the pet
      dispatch(feedPet());

      // 🔄 Animations & Snackbars
      setIsBouncing(true);
      setSnackbar(true);

      setTimeout(() => {
        setIsBouncing(false);
        setSnackbar(false);
      }, 1000);
    } catch (error) {
      console.error("❌ Error feeding the pet:", error.message);
    }
  };

  // ✅ Trigger Alert when Time Runs Out
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

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ backgroundColor: "#f3f4f6", minHeight: "100vh", padding: 3 }}
    >
      {/* ✅ Floating Coins Display */}
      <Chip
        label={`💰 Coins: ${coins}`}
        color="primary"
        variant="filled"
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          fontSize: "1.2rem",
          boxShadow: 2,
          "&:hover": {
            transform: "scale(1.05)",
            transition: "0.2s",
          },
        }}
      />

      {/* ✅ Main Grid Layout */}
      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ maxWidth: 900, marginTop: 5 }}
      >
        {/* ✅ Food Inventory */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: 4,
              height: "100%",
              background: "linear-gradient(145deg, #ffffff, #e1e1e1)",
            }}
          >
            <CardContent sx={{ textAlign: "center", paddingBottom: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: "#1976d2",
                  fontWeight: "bold",
                }}
              >
                Food Inventory
              </Typography>
            </CardContent>
            <Divider />
            <Box sx={{ display: "flex", gap: 1, padding: 2, flexWrap: "wrap" }}>
              {foodInventory.length > 0 ? (
                foodInventory.map((food, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={() => handleFeedClick(food)}
                  >
                    {food}
                  </Button>
                ))
              ) : (
                <Typography sx={{ mt: 1 }} color="textSecondary">
                  No food available. Visit the store!
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>
        {/* ✅ Pet Status */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: 4,
              background: "linear-gradient(145deg, #ffffff, #e1e1e1)",
            }}
          >
            <CardContent sx={{ textAlign: "center", paddingBottom: 0 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#1976d2", fontWeight: "bold" }}
              >
                Hunger Level
              </Typography>
              <LinearProgress
                variant="determinate"
                value={hungerLevel}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography
                variant="subtitle1"
                sx={{ mt: 1 }}
              >{`Status: ${status}`}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* ✅ Pet Card */}
        <Grid item xs={12} md={4}>
          <motion.div
            animate={{
              scale: isBouncing ? 1.1 : 1,
              rotate: isBouncing ? [0, 15, -15, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: 4,
                height: "100%",
                background: "linear-gradient(145deg, #83a4d4, #b6fbff)",
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={petImage}
                alt="Pet"
              />
              <CardContent sx={{ textAlign: "center", padding: 0 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    width: "100%",
                    borderRadius: 0,
                    backgroundColor: "#1976d2",
                    "&:hover": {
                      backgroundColor: "#155a9c",
                    },
                  }}
                >
                  YOUR PET
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          {snackbar && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Yum! {lastFed} was delicious! 😋
            </Alert>
          )}
        </Grid>
      </Grid>

      <p>Remaining Time: {formatTime(remainingTime)}</p>

      {/* ✅ Timer Alert */}
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

      {/* ✅ Footer */}
      <Box sx={{ width: "100%", maxWidth: 900 }}>
        <MainFooter goals={goals} setGoals={setGoals} />
      </Box>
    </Box>
  );
}

export default Application;

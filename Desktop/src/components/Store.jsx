import React, { useState, useEffect } from "react";
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
import { removeCoins, updateCoinsOnServer } from "../redux/coinsSlice";
import { addFoodToBackend, fetchInventory } from "../redux/foodInventorySlice";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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

const Store = () => {
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.coins.amount);
  const foodInventory = useSelector((state) => state.foodInventory.items); // 🔄 Selector for food inventory
  const token = localStorage.getItem("token");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const catFoodItems = [
    { id: 1, name: "Fish", price: 10 },
    { id: 2, name: "Cookies", price: 5 },
    { id: 3, name: "Wet Food", price: 15 },
    { id: 4, name: "Cat Food", price: 8 },
    { id: 5, name: "Meat", price: 12 },
    { id: 6, name: "Chicken", price: 10 },
  ];

  // ✅ Handle Purchase and Coin Deduction
  const handlePurchase = (item) => {
    if (coins >= item.price) {
      // ✅ Remove coins via Redux
      dispatch(removeCoins(item.price));
      dispatch(updateCoinsOnServer({ amount: coins - item.price, token }));

      // ✅ Add to Redux Inventory
      dispatch(addFoodToBackend({ foodItem: item.name, token }));

      console.log("Dispatching addFoodToBackend for item:", item.name);
      // ✅ Snackbar Notification
      setSnackbar({
        open: true,
        message: `You successfully purchased ${item.name}!`,
        type: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: `Not enough coins to buy ${item.name}.`,
        type: "error",
      });
    }
  };

  // ✅ Close Snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "#ffffff",
        borderRadius: 3,
        boxShadow: 3,
        maxWidth: 500,
        margin: "auto",
      }}
    >
      <Typography
        variant="h5"
        sx={{ color: "#4a9c8c", fontWeight: "bold", mb: 1 }}
      >
        Cat Food Store
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "#6bb5a2", mb: 2 }}>
        Available Coins: {coins}
      </Typography>

      <List>
        {catFoodItems.map((item) => {
          const canAfford = coins >= item.price;
          return (
            <ListItem
              key={item.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #d0e3e8",
                py: 1.5,
                paddingRight: 19,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <DotLottieReact
                  src={foodIcons[item.name] || foodIcons["Cat Food"]}
                  autoplay
                  loop
                  style={{ width: 50, height: 50 }}
                />
                <Typography variant="body1" sx={{ color: "#333" }}>
                  {item.name} - {item.price} coins
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: canAfford ? "#6bb5a2" : "#ccc",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: canAfford ? "#5aa491" : "#bbb",
                  },
                }}
                onClick={() => handlePurchase(item)}
                disabled={!canAfford}
              >
                {canAfford ? "Buy" : "Not Enough"}
              </Button>
            </ListItem>
          );
        })}
      </List>

      {/* ✅ Snackbar Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Store;

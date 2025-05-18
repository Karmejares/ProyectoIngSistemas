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
import { addFoodToBackend, fetchInventory } from "../redux/foodInventorySlice"; // ✅ Import Redux action

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
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Cat Food Store
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Available Coins: {coins}
      </Typography>
      <List>
        {catFoodItems.map((item) => (
          <ListItem
            key={item.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #eee",
              py: 1,
            }}
          >
            <Typography variant="body1">
              {item.name} - {item.price} coins
            </Typography>
            <Button
              variant="contained"
              size="small"
              color={coins >= item.price ? "primary" : "error"}
              onClick={() => handlePurchase(item)}
              disabled={coins < item.price}
            >
              {coins >= item.price ? "Buy" : "Not Enough"}
            </Button>
          </ListItem>
        ))}
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

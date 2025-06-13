// src/atoms/FoodButton.jsx
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import {
    fetchInventory,
    removeFoodFromBackend,
} from "../redux/foodInventorySlice";
import { fetchHungerLevel, feedPet } from "../redux/petStatusSlice";

export default function FoodButton({ food, icon, onFed }) {
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
        <Button
            onClick={handleFeedClick}
            sx={{
                backgroundColor: "#F06292",
                color: "#fff",
                "&:hover": { backgroundColor: "#ec407a" },
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                borderRadius: "16px",
                padding: "8px",
                minWidth: 80,
                minHeight: 100,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                textTransform: "none",
            }}
        >
            <DotLottieReact
                src={icon}
                autoplay
                loop
                style={{ width: 50, height: 50 }}
            />
            <Typography>{food}</Typography>
        </Button>
    );
}

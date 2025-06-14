// hooks/useGoals.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGoals, removeGoal } from "../redux/goalsSlice";
import axios from "axios";

export default function useGoals() {
    const dispatch = useDispatch();
    const goals = useSelector((state) => state.goals.items);
    const status = useSelector((state) => state.goals.status);
    const error = useSelector((state) => state.goals.error);
    const [localError, setLocalError] = useState(null);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchGoals()).catch((err) => {
                console.error("Error fetching goals:", err);
                setLocalError("Failed to fetch goals.");
            });
        }
    }, [dispatch, status]);

    const handleDeleteGoal = async (id) => {
        try {
            await dispatch(removeGoal(id)).unwrap();
        } catch (err) {
            console.error("Error deleting goal:", err);
            setLocalError("Failed to delete goal.");
        }
    };

    // ✅ Toggle goal for today
    const handleToggleGoal = async (goalId) => {
        const token = localStorage.getItem("token");
        const today = new Date().toISOString().slice(0, 10);

        try {
            const response = await axios.put(
                `http://localhost:3001/api/goals/${goalId}/toggle`,
                { date: today },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            console.log("Response from toggle:", response.data);
            dispatch(fetchGoals());
        } catch (err) {
            console.error("Error toggling goal:", err);
            setLocalError("Failed to update goal.");
        }
    };

    // 🔁 Calculate streak
    const calculateStreak = (goal) => {
        const today = new Date();
        let todayStr = today.toISOString().slice(0, 10);
        const history = [...(goal.history || [])].sort();
        let streak = 0;

        for (let i = history.length - 1; i >= 0; i--) {
            if (history[i] === todayStr) {
                streak++;
                today.setDate(today.getDate() - 1);
                todayStr = today.toISOString().slice(0, 10);
            } else {
                break;
            }
        }

        return streak;
    };

    return {
        goals,
        loading: status === "loading",
        error: localError || error,
        handleDeleteGoal,
        handleToggleGoal,
        calculateStreak,
    };
}

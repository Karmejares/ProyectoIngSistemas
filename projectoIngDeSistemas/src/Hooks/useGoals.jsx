import {useEffect, useState} from "react";
import axios from "axios";

export default function useGoals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/goals");
                setGoals(response.data.goals);
            } catch (err) {
                setError(err);
                console.error("Error fetching goals:", err);
            } finally {
                setLoading(false);
            }
        };

        void fetchGoals()
    }, []);

    return { goals, setGoals, loading, error };
}

import { useEffect, useState } from "react";
import classes from "./Application.module.css";
import petImage from "../assets/CutePixelatedCat.png";
import MainFooter from "./MainFooter";
import { UserContext } from "./UserContext";

function Application() {
  const [fedStatus, setFedStatus] = useState(null);
  const [goals, setGoals] = useState([]); // State to store goals

  // Fetch goals from the backend
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/goals");
        const data = await response.json();
        setGoals(data.goals); // Update state with fetched goals
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []); // Empty dependency array ensures this runs once on mount

  const feedPet = (foodItemName) => {
    setFedStatus(foodItemName);
    setTimeout(() => {
      setFedStatus(null);
    }, 3000);
  };

  return (
    <div className={classes.mobileContainer}>
      <div className={classes.coinDisplay}>Coins: {"coins"}</div>
      <div className={classes.mainContent}>
        <div className={classes.petContainer}>
          <img src={petImage} alt="Pet" className={classes.petImage} />
        </div>
        <div className={classes.goalsContainer}>
          <h2>Your Goals</h2>
          {goals.length > 0 ? (
            <ul>
              {goals.map((goal) => (
                <li key={goal.id}>
                  {goal.name} (Streak: {goal.history.length})
                </li>
              ))}
            </ul>
          ) : (
            <p>No goals found.</p>
          )}
        </div>
      </div>
      <MainFooter goals={goals} setGoals={setGoals} />
    </div>
  );
}

export default Application;

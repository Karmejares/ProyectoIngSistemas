import React, { useState, useEffect, useContext } from "react";
import classes from "./CheckList.module.css";
import { FaTrash } from "react-icons/fa"; // Import the trash icon from react-icons
import { UserContext } from "./UserContext"; // Import UserContext

function CheckList() {
  const { addCoins } = useContext(UserContext); // Access addCoins from context

  const [goals, setGoals] = useState(() => {
    // Load goals from localStorage when the component mounts
    const savedGoals = localStorage.getItem("goals");
 return savedGoals ? JSON.parse(savedGoals).map(goal => ({ ...goal, frequency: goal.frequency || 'daily', history: goal.history || [] })) : [];
  });
  const [newGoal, setNewGoal] = useState("");
  const [newGoalFrequency, setNewGoalFrequency] = useState('daily');
  const [deleteMode, setDeleteMode] = useState(false); // State to enable/disable delete mode

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = () => {
    if (newGoal.trim() === "") return;
    setGoals([...goals, { id: Date.now(), name: newGoal, completed: false, frequency: newGoalFrequency, history: [] }]);
  };

  const handleDeleteGoal = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this goal?"
    );
    if (confirmDelete) {
      setGoals(goals.filter((goal) => goal.id !== id));
    }
  };

  const handleToggleGoal = (id) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddGoal();
    }
  };

  const toggleDeleteMode = () => {
    setDeleteMode((prevMode) => !prevMode);
  };

  return (
    <div className={classes.container}>
      <div className={classes.inputContainer}>
        <input
          type="text"
          placeholder="Add a new goal"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={handleKeyDown}
          className={classes.input}
        />
        <select
          value={newGoalFrequency}
          onChange={(e) => setNewGoalFrequency(e.target.value)}
          className={classes.frequencySelect}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <button onClick={handleAddGoal} className={classes.addButton}>
          Add
        </button>
      </div>
      <div className={classes.deleteModeContainer}></div>
      <ul className={classes.goalList}>
        {goals.map((goal) => (
          <li key={goal.id} className={classes.goalItem}>
            <label>
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => handleToggleGoal(goal.id)}
                disabled={deleteMode} // Disable checkbox in delete mode
              />
              <span
                className={
                  goal.completed ? classes.completedGoal : classes.goalName
                }
              >
                {goal.name}
              </span>
            </label>
            {deleteMode && (
              <button
                onClick={() => handleDeleteGoal(goal.id)}
                className={classes.deleteButton}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
      <button onClick={toggleDeleteMode} className={classes.trashButton}>
        <FaTrash />
      </button>
    </div>
  );
}

export default CheckList;

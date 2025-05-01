import React, { useState, useEffect } from "react";
import classes from "./CheckList.module.css";
import { FaTrash } from "react-icons/fa"; // Import the trash icon from react-icons

function CheckList() {
  const [goals, setGoals] = useState(() => {
    // Load goals from localStorage when the component mounts
    const savedGoals = localStorage.getItem("goals");
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  const [newGoal, setNewGoal] = useState("");
  const [deleteMode, setDeleteMode] = useState(false); // State to enable/disable delete mode

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = () => {
    if (newGoal.trim() === "") return;
    setGoals([...goals, { id: Date.now(), name: newGoal, completed: false }]);
    setNewGoal("");
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

// src/components/GoalList.jsx
import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";

function GoalList({ goals = [] }) {
  return (
    <List>
      {goals.map((goal, index) => (
        <ListItem key={index}>
          <ListItemText primary={goal} />
        </ListItem>
      ))}
    </List>
  );
}

export default GoalList;

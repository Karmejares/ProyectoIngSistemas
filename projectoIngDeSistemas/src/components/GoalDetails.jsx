import React from 'react';
import { Button } from '@mui/material';

const GoalDetails = ({ goal, onClose, onEdit }) => {
  if (!goal) {
    return null; // Or some loading/empty state
  }

  return (
    <div className="goal-details-modal">
      <div className="goal-details-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>{goal.title}</h2>
        <p>{goal.description}</p>
        {goal.plan && goal.plan.length > 0 && (
          <div>
            <h3>Plan:</h3>
            <ul>
              {goal.plan.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}
        <Button variant="outlined" color="primary" onClick={() => onEdit(goal)}>Edit</Button>
      </div>
    </div>
  );
};

export default GoalDetails;
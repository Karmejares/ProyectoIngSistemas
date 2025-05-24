import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { removeGoal, updateGoal } from "../redux/goalsSlice"; // Adjust the import path as necessary
import AddGoal from "./AddGoal";
import { useState } from "react";

const GoalDetails = ({ goal, onClose, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  if (!goal) return null;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      dispatch(removeGoal(goal._id))
        .unwrap()
        .then(() => {
          onClose(); // Close modal after deletion
        })
        .catch((error) => {
          console.error("Failed to delete goal:", error);
          alert("Error deleting goal.");
        });
    }
  };

  const handleEdit = () => {
    setIsEditing(true); // ✅ Open AddGoal in edit mode
  };

  const handleCloseEdit = () => {
    setIsEditing(false); // Close AddGoal modal
  };

  const handleUpdateGoal = (updatedGoal) => {
    dispatch(updateGoal(updatedGoal))
      .unwrap()
      .then(() => {
        setIsEditing(false); // Close after update
        onClose(); // Optionally close details too
      })
      .catch((error) => {
        console.error("Failed to update goal:", error);
        alert("Error updating goal.");
      });
  };

  const columns = [
    {
      field: "objective",
      headerName: "Objective",
      width: 150,
      valueGetter: (params) => {
        const id = params?.row?.id;
        return id ? `Objective ${id}` : "";
      },
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      width: 150,
    },
  ];

  const rows =
    goal.plan?.map((desc, index) => ({
      id: index + 1,
      description: desc,
    })) || [];

  return (
    <>
      <Dialog open={!!goal} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">{goal.title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {goal.description}
          </Typography>

          {rows.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Objectives
              </Typography>
              <Paper sx={{ height: 300, width: "100%", mb: 2 }}>
                <DataGrid
                  autoHeight
                  rows={rows}
                  columns={columns}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </Paper>
            </>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <Button variant="outlined" color="primary" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* ✅ Inline AddGoal shown when editing */}
      {isEditing && (
        <AddGoal
          open={isEditing}
          onClose={handleCloseEdit}
          goalToEdit={goal}
          onUpdate={handleUpdateGoal}
        />
      )}
    </>
  );
};

export default GoalDetails;

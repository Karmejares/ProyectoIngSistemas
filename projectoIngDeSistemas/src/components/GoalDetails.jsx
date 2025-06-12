import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { removeGoal, updateStepDate } from "../redux/goalsSlice";
import AddGoal from "./AddGoal";
import { useSelector } from "react-redux";


const GoalDetails = ({ goalId, onClose }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [optimisticSteps, setOptimisticSteps] = useState({});

  const goals = useSelector((state) => state.goals.items);
  console.log("Goals from Redux:", goals);
  console.log("Goal ID:", goalId);

  const goal = goals.find((g) => g._id === goalId);

  if (!goal) return null;

  const handleCheckboxClick = async (stepId) => {
    const date = new Date().toISOString();

    // Mark as complete locally
    setOptimisticSteps((prev) => ({ ...prev, [stepId]: date }));

    try {
      await dispatch(
        updateStepDate({ goalId: goal._id, stepId, date })
      ).unwrap();
      setRefreshFlag((prev) => !prev); // reload from Redux
    } catch (error) {
      console.error("Failed to update step date:", error);
      alert("Failed to mark step as complete.");

      // Roll back optimistic update
      setOptimisticSteps((prev) => {
        const newState = { ...prev };
        delete newState[stepId];
        return newState;
      });
    }
  };

  const handleDeleteConfirm = () => {
    dispatch(removeGoal(goal._id))
      .unwrap()
      .then(() => {
        setOpenDeleteDialog(false);
        onClose();
      })
      .catch((error) => {
        console.error("Failed to delete goal:", error);
        alert("Error deleting goal.");
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
      width: 250,
    },
    {
      field: "completed",
      headerName: "Completed",
      width: 120,
      renderCell: (params) => {
        const { stepId, date } = params.row;
        const isChecked = !!date || !!optimisticSteps[stepId];

        return (
          <input
            type="checkbox"
            checked={isChecked}
            disabled={!!date}
            onChange={() => {
              if (!date && !optimisticSteps[stepId]) {
                handleCheckboxClick(stepId);
              }
            }}
          />
        );
      },
    },

    {
      field: "date",
      headerName: "Completion Date",
      width: 180,
      renderCell: (params) => {
        const { stepId, date } = params.row;
        const displayDate = optimisticSteps[stepId] || date;

        return displayDate ? (
          new Date(displayDate).toLocaleString()
        ) : (
          <span style={{ color: "#1976d2", fontWeight: "bold" }}>
            You can do it!
          </span>
        );
      },
    },
  ];

  const rows =
    goal.plan?.map((step, index) => ({
      id: index + 1,
      stepId: step._id, // necesario para actualizarlo
      description: step.stepDescription || "",
      date: step.date, // muestra si ya tiene fecha
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
                  key={refreshFlag}
                  autoHeight
                  rows={rows}
                  columns={columns}
                  disableRowSelectionOnClick
                />
              </Paper>
            </>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpenDeleteDialog(true)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de edición */}
      {isEditing && (
        <AddGoal
          open={isEditing}
          onClose={() => setIsEditing(false)}
          goalToEdit={goal}
        />
      )}

      {/* Modal de confirmación de borrado */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this goal?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GoalDetails;

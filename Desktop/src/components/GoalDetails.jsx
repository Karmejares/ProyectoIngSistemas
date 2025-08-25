import React from "react";
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
import AddGoal from "./AddGoal";
import { useGoalDetails } from "../hooks/useGoalDetails";

const GoalDetails = ({ goalId, onClose }) => {
  const {
    goal,
    isEditing,
    setIsEditing,
    openDeleteDialog,
    setOpenDeleteDialog,
    handleDeleteConfirm,
    refreshFlag,
    rows,
    columns,
  } = useGoalDetails({ goalId, onClose });

  if (!goal) return null;

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

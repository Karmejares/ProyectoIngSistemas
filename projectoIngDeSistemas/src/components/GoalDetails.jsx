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
import { removeGoal } from "../redux/goalsSlice";
import AddGoal from "./AddGoal";
import { useSelector } from "react-redux";

const GoalDetails = ({ goalId, onClose }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Obtiene la lista de objetivos desde el store
  const goals = useSelector((state) => state.goals.items); // o como tengas el selector
  console.log("Goals from Redux:", goals);
  console.log("Goal ID:", goalId);
  // Busca el goal actualizado por id
  const goal = goals.find((g) => g._id === goalId);

  if (!goal) return null;

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
      width: 150,
    },
  ];

  const rows =
    goal.plan?.map((step, index) => ({
      id: index + 1,
      description: step.stepDescription || "",
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

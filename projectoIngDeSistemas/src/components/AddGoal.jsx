import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  IconButton,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addGoal, updateGoal, fetchGoals } from "../redux/goalsSlice";
import { useEffect } from "react";

const AddGoal = ({ open, onClose, goalToEdit }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [plan, setPlan] = useState([]);
  const [step, setStep] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setDescription(goalToEdit.description);
      setPlan(goalToEdit.plan || []); // Use || [] for safety
    } else {
      // Reset form when not in edit mode
      setTitle("");
      setDescription("");
      setPlan([]);
    }
  }, [goalToEdit]); // Re-run effect when goalToEdit changes

  // ✅ Validate Inputs
  const validateInputs = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!plan.length) newErrors.plan = "At least one step is required";
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ✅ Add a step to the plan
  const handleAddStep = () => {
    if (step.trim()) {
      setPlan([...plan, { stepDescription: step.trim(), date: null }]);
      setStep("");
    }
  };

  // ✅ Remove a step from the plan
  const handleRemoveStep = (index) => {
    setPlan(plan.filter((_, i) => i !== index));
  };

  const handleSaveOrUpdate = async () => {
    if (!validateInputs()) return;

    const normalizedPlan = plan.map((p) => ({
      stepDescription: typeof p === "string" ? p : p.stepDescription || "",
      date: p.date || null,
    }));

    const goalData = {
      title: title.trim(),
      description: description.trim(),
      plan: normalizedPlan,
      history: goalToEdit ? goalToEdit.history || [] : [],
    };
    try {
      if (goalToEdit) {
        // Actualizar goal existente
        await dispatch(updateGoal({ ...goalData, _id: goalToEdit._id }));
      } else {
        // Crear nuevo goal
        await dispatch(addGoal(goalData));
      }
      onClose(); // Cerrar el modal después de guardar
    } catch (error) {
      console.error("Error saving goal:", error);
    }
    await dispatch(fetchGoals()); // ← opcional para actualizar la lista
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{goalToEdit ? "Edit Goal" : "Add a New Goal"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {goalToEdit
            ? "Edit the details of your goal and update the plan as needed."
            : "Fill in the details for your new goal, and add steps to your plan."}
        </DialogContentText>

        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          helperText="What's your goal?"
          error={Boolean(errors.title)}
        />

        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          multiline
          maxRows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          helperText={`Describe your goal in details" (${description.length}/500)`}
          error={Boolean(errors.description)}
          inputProps={{ maxLength: 500 }}
          sx={{
            "& .MuiFormHelperText-root": {
              color: description.length > 450 ? "red" : "inherit",
            },
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <TextField
            label="Add Step"
            fullWidth
            value={step}
            onChange={(e) => setStep(e.target.value)}
            helperText="Create a timeline for your goal. Each step will be assigned a completion date when you mark it as done."
          />
          <IconButton
            color="primary"
            onClick={handleAddStep}
            disabled={!step.trim()}
          >
            <Add />
          </IconButton>
        </Box>
        <List>
          {plan.map((item, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleRemoveStep(index)}>
                  <Delete />
                </IconButton>
              }
            >
              <Typography>{item.stepDescription}</Typography>
            </ListItem>
          ))}
        </List>

        {errors.plan && (
          <Typography color="error" variant="body2">
            {errors.plan}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSaveOrUpdate}
          variant="contained"
          color="primary"
          disabled={!title.trim() || !description.trim() || !plan.length}
        >
          {goalToEdit ? "Update Goal" : "Save Goal"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGoal;

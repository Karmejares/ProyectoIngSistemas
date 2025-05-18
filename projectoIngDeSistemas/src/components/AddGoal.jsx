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
import { useDispatch } from "react-redux";
import { addGoal } from "../redux/goalsSlice";

const AddGoal = ({ open, onClose, onSave, loading }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [plan, setPlan] = useState([]);
  const [step, setStep] = useState("");
  const [errors, setErrors] = useState({});

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
    if (step.trim() !== "") {
      setPlan([...plan, step]);
      setStep("");
    }
  };

  // ✅ Remove a step from the plan
  const handleRemoveStep = (index) => {
    setPlan(plan.filter((_, i) => i !== index));
  };

  // ✅ Save the goal to Redux
  //   const handleSaveGoal = async () => {
  //     if (validateInputs()) {
  //       const newGoal = {
  //         title,
  //         description,
  //         plan,
  //         history: [], // Initialized empty for future achievements
  //       };

  //       try {
  //         await dispatch(addGoal(newGoal));
  //         await dispatch(fetchGoals()); // ✅ Sync state with backend
  //         console.log("🎉 Goal added successfully!");
  //       } catch (error) {
  //         console.error("❌ Error adding goal:", error.message);
  //       } finally {
  //         setLoading(false);
  //         onClose();
  //         setTitle("");
  //         setDescription("");
  //         setPlan([]);
  //         setErrors({});
  //       }
  //     } else {
  //       alert("Please fill out the Title and Description!");
  //     }
  //   };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add a New Goal</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill in the details for your new goal, and add steps to your plan.
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
            helperText="Create a timeline for your goal"
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
              <Typography>{item}</Typography>
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
          onClick={() =>
            onSave({
              title,
              description,
              plan,
              history: [],
            })
          }
          variant="contained"
          color="primary"
          disabled={!title.trim() || !description.trim() || !plan.length}
        >
          Save Goal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGoal;

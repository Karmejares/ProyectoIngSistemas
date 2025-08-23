import React from "react";
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
import { Controller } from "react-hook-form";
import { useGoalForm } from "../hooks/useGoalForm";

const AddGoal = ({ open, onClose, goalToEdit }) => {
  const {
    control,
    errors,
    handleSubmit,
    onSubmit,
    handleAddStep,
    handleRemoveStep,
    stepInput,
    description,
    plan,
    watch,
  } = useGoalForm({ goalToEdit, onClose });

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{goalToEdit ? "Edit Goal" : "Add a New Goal"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {goalToEdit
            ? "Edit the details of your goal and update the plan as needed."
            : "Fill in the details for your new goal, and add steps to your plan."}
        </DialogContentText>

        {/* Title */}
        <Controller
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Title"
              fullWidth
              margin="dense"
              error={!!errors.title}
              helperText={errors.title?.message || "What's your goal?"}
              autoFocus
            />
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          rules={{
            required: "Description is required",
            maxLength: { value: 500, message: "Max length is 500 characters" },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              fullWidth
              margin="dense"
              multiline
              maxRows={5}
              error={!!errors.description}
              helperText={
                errors.description?.message ||
                `Describe your goal in detail (${description?.length || 0}/500)`
              }
              inputProps={{ maxLength: 500 }}
              sx={{
                "& .MuiFormHelperText-root": {
                  color: description?.length > 450 ? "red" : "inherit",
                },
              }}
            />
          )}
        />

        {/* Step Input */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Controller
            name="stepInput"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Add Step"
                fullWidth
                helperText="Create a timeline for your goal. Each step will be assigned a completion date when you mark it as done."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddStep();
                  }
                }}
              />
            )}
          />
          <IconButton
            color="primary"
            onClick={handleAddStep}
            disabled={!stepInput?.trim()}
          >
            <Add />
          </IconButton>
        </Box>

        {/* Steps List */}
        <List>
          {plan?.map((item, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton onClick={() => handleRemoveStep(index)}>
                  <Delete />
                </IconButton>
              }
            >
              <Typography>{item.stepDescription}</Typography>
            </ListItem>
          ))}
        </List>

        {plan?.length === 0 && (
          <Typography color="error" variant="body2">
            At least one step is required.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={
            !watch("title")?.trim() ||
            !watch("description")?.trim() ||
            !plan.length
          }
        >
          {goalToEdit ? "Update Goal" : "Save Goal"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGoal;

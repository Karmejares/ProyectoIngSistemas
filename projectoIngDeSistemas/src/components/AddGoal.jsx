import React, { useEffect } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { addGoal, updateGoal, fetchGoals } from "../redux/goalsSlice";

const AddGoal = ({ open, onClose, goalToEdit }) => {
  const dispatch = useDispatch()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      stepInput: "",
      plan: [],
    },
  });

  const stepInput = watch("stepInput");

  useEffect(() => {
    if (goalToEdit) {
      reset({
        title: goalToEdit.title || "",
        description: goalToEdit.description || "",
        plan: goalToEdit.plan || [],
        stepInput: "",
      });
    } else {
      reset(); // Limpiar formulario si no hay goal a editar
    }
  }, [goalToEdit, reset]);

  const onSubmit = async (data) => {
    if (data.plan.length === 0) return;

    const normalizedPlan = data.plan.map((p) => ({
      stepDescription: typeof p === "string" ? p : p.stepDescription || "",
      date: p.date || null,
    }));

    const goalData = {
      title: data.title.trim(),
      description: data.description.trim(),
      plan: normalizedPlan,
      history: goalToEdit?.history || [],
    };

    try {
      if (goalToEdit) {
        await dispatch(updateGoal({ ...goalData, _id: goalToEdit._id }));
      } else {
        await dispatch(addGoal(goalData));
      }
      await dispatch(fetchGoals());
      onClose();
    } catch (err) {
      console.error("Error saving goal", err);
    }
  };

  // Añadir paso al plan
  const handleAddStep = () => {
    const currentStep = getValues("stepInput").trim();
    if (currentStep) {
      const currentPlan = getValues("plan");
      setValue("plan", [
        ...currentPlan,
        { stepDescription: currentStep, date: null },
      ]);
      setValue("stepInput", "");
    }
  };

  // Eliminar paso
  const handleRemoveStep = (index) => {
    const currentPlan = getValues("plan");
    const newPlan = [...currentPlan];
    newPlan.splice(index, 1);
    setValue("plan", newPlan);
  };

  const description = watch("description");
  const plan = watch("plan");

  return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>{goalToEdit ? "Edit Goal" : "Add a New Goal"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {goalToEdit
                ? "Edit the details of your goal and update the plan as needed."
                : "Fill in the details for your new goal, and add steps to your plan."}
          </DialogContentText>

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

          <Controller
              name="description"
              control={control}
              rules={{
                required: "Description is required",
                maxLength: {
                  value: 500,
                  message: "Max length is 500 characters",
                },
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
              disabled={!watch("title")?.trim() || !watch("description")?.trim() || !plan.length}
          >
            {goalToEdit ? "Update Goal" : "Save Goal"}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default AddGoal;

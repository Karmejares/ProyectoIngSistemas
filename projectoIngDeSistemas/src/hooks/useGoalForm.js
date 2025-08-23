import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { addGoal, updateGoal, fetchGoals } from "../redux/goalsSlice";

export const useGoalForm = ({ goalToEdit, onClose }) => {
  const dispatch = useDispatch();

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
  const description = watch("description");
  const plan = watch("plan");

  useEffect(() => {
    if (goalToEdit) {
      reset({
        title: goalToEdit.title || "",
        description: goalToEdit.description || "",
        plan: goalToEdit.plan || [],
        stepInput: "",
      });
    } else {
      reset();
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

  const handleRemoveStep = (index) => {
    const currentPlan = getValues("plan");
    const newPlan = [...currentPlan];
    newPlan.splice(index, 1);
    setValue("plan", newPlan);
  };

  return {
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
  };
};

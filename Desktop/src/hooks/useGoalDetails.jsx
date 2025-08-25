import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeGoal, updateStepDate } from "../redux/goalsSlice";

export const useGoalDetails = ({ goalId, onClose }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [optimisticSteps, setOptimisticSteps] = useState({});

  const goals = useSelector((state) => state.goals.items);
  const goal = goals.find((g) => g._id === goalId);

  const handleCheckboxClick = async (stepId) => {
    const date = new Date().toISOString();

    // marcar localmente
    setOptimisticSteps((prev) => ({ ...prev, [stepId]: date }));

    try {
      await dispatch(
        updateStepDate({ goalId: goal._id, stepId, date })
      ).unwrap();
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.error("Failed to update step date:", error);
      alert("Failed to mark step as complete.");
      // rollback
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

  const rows =
    goal?.plan?.map((step, index) => ({
      id: index + 1,
      stepId: step._id,
      description: step.stepDescription || "",
      date: step.date,
    })) || [];

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

  return {
    goal,
    isEditing,
    setIsEditing,
    openDeleteDialog,
    setOpenDeleteDialog,
    handleDeleteConfirm,
    refreshFlag,
    rows,
    columns,
  };
};

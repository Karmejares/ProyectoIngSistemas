import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeGoal, updateStepDate } from "../store/goalsSlice";

const STORAGE_KEY = "completedSteps";

const loadFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

const saveToStorage = (steps) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(steps));
};

export const useGoalDetails = ({ goalId, onClose }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [optimisticSteps, setOptimisticSteps] = useState(loadFromStorage);

  const goals = useSelector((state) => state.goals.items);
  const goal = goals.find((g) => g._id === goalId);

  // sincronizar steps confirmados por backend → limpiar localStorage
  useEffect(() => {
    if (!goal?.plan) return;
    const confirmed = goal.plan
      .filter((s) => s.date)
      .reduce((acc, s) => ({ ...acc, [s._id]: s.date }), {});

    setOptimisticSteps((prev) => {
      const merged = { ...prev };
      Object.keys(confirmed).forEach((id) => {
        delete merged[id];
      });
      saveToStorage(merged);
      return merged;
    });
  }, [goal]);

  const handleCheckboxClick = async (stepId) => {
    const date = new Date().toISOString();

    setOptimisticSteps((prev) => {
      const next = { ...prev, [stepId]: date };
      saveToStorage(next);
      return next;
    });

    try {
      await dispatch(
        updateStepDate({ goalId: goal._id, stepId, date })
      ).unwrap();
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.error("Failed to update step date:", error);
      alert("Failed to mark step as complete.");
      setOptimisticSteps((prev) => {
        const next = { ...prev };
        delete next[stepId];
        saveToStorage(next);
        return next;
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

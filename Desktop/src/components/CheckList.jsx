import { useState } from "react";
import { Box, Grid, Button, Alert, Typography } from "@mui/material";
import GoalList from "./GoalList";
import AddGoal from "./AddGoal";
import useGoals from "../hooks/useGoals"; //

function CheckList() {
  const [visibleCalendars, setVisibleCalendars] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [editGoal, setEditGoal] = useState(null);

  const {
    goals,
    loading,
    error,
    handleDeleteGoal,
    handleToggleGoal,
    calculateStreak,
  } = useGoals();

  const toggleCalendarVisibility = (id) => {
    setVisibleCalendars((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
      <>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Button
                variant="contained"
                onClick={handleOpenModal}
                sx={{
                  backgroundColor: "#6bb5a2",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#5da894",
                  },
                  textTransform: "none",
                }}
            >
              ➕ Add New Goal
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          {goals.length > 0 ? (
              <GoalList
                  handleToggleGoal={handleToggleGoal}
                  handleDeleteGoal={handleDeleteGoal}
                  toggleCalendarVisibility={toggleCalendarVisibility}
                  visibleCalendars={visibleCalendars}
                  calculateStreak={calculateStreak}
              />
          ) : (
              <Typography variant="h6" sx={{ color: "#4a9c8c" }}>
                No goals found. Try adding a new goal!
              </Typography>
          )}
        </Box>

        {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
        )}

        <AddGoal
            open={openModal}
            onClose={() => {
              setOpenModal(false);
              setEditGoal(null);
            }}
            loading={loading}
        />
      </>
  );
}

export default CheckList;

import { useEffect, useState, useContext } from "react";
import petImage from "../assets/CutePixelatedCat.png";
import MainFooter from "./MainFooter";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Grid,
  Button,
  Alert,
} from "@mui/material";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { UserContext } from "./UserContext";

function Application() {
  const { coins, lastFed, foodInventory, feedPet } = useContext(UserContext);
  const [goals, setGoals] = useState([]);
  const [isBouncing, setIsBouncing] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  // ✅ Fetch goals from the backend
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/goals");
        const data = await response.json();
        setGoals(data.goals);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []);

  // ✅ Handle Pet Animation when fed
  useEffect(() => {
    if (lastFed) {
      setIsBouncing(true);
      setSnackbar(true);
      setTimeout(() => {
        setIsBouncing(false);
        setSnackbar(false);
      }, 1000);
    }
  }, [lastFed]);

  // ✅ Handle Click to Feed Pet
  const handleFeedClick = (food) => {
    feedPet(food);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ backgroundColor: "#f3f4f6", minHeight: "100vh", padding: 3 }}
    >
      {/* ✅ Floating Coins Display */}
      <Chip
        label={`💰 Coins: ${coins}`}
        color="primary"
        variant="filled"
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          fontSize: "1.2rem",
          boxShadow: 2,
          "&:hover": {
            transform: "scale(1.05)",
            transition: "0.2s",
          },
        }}
      />

      {/* ✅ Main Grid Layout */}
      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ maxWidth: 900, marginTop: 5 }}
      >
        {/* ✅ Food Inventory */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: 4,
              height: "100%",
              background: "linear-gradient(145deg, #ffffff, #e1e1e1)",
            }}
          >
            <CardContent sx={{ textAlign: "center", paddingBottom: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: "#1976d2",
                  fontWeight: "bold",
                }}
              >
                Food Inventory
              </Typography>
            </CardContent>
            <Divider />
            <Box sx={{ display: "flex", gap: 1, padding: 2, flexWrap: "wrap" }}>
              {foodInventory.length > 0 ? (
                foodInventory.map((food, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={() => handleFeedClick(food)}
                  >
                    {food}
                  </Button>
                ))
              ) : (
                <Typography sx={{ mt: 1 }} color="textSecondary">
                  No food available. Visit the store!
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>
        {/* ✅ Pet Card */}
        <Grid item xs={12} md={4}>
          <motion.div
            animate={{
              scale: isBouncing ? 1.1 : 1,
              rotate: isBouncing ? [0, 15, -15, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: 4,
                height: "100%",
                background: "linear-gradient(145deg, #83a4d4, #b6fbff)",
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={petImage}
                alt="Pet"
              />
              <CardContent sx={{ textAlign: "center", padding: 0 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    width: "100%",
                    borderRadius: 0,
                    backgroundColor: "#1976d2",
                    "&:hover": {
                      backgroundColor: "#155a9c",
                    },
                  }}
                >
                  YOUR PET
                </Button>
                {lastFed && (
                  <Typography
                    variant="subtitle1"
                    sx={{ mt: 1, color: "#4CAF50" }}
                  >
                    Last fed with: {lastFed} 🍗
                  </Typography>
                )}
              </CardContent>
            </Card>
          </motion.div>
          {snackbar && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Yum! {lastFed} was delicious! 😋
            </Alert>
          )}
        </Grid>

        {/* ✅ Goals List */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: 4,
              height: "100%",
              background: "linear-gradient(145deg, #ffffff, #e1e1e1)",
            }}
          >
            <CardContent sx={{ textAlign: "center", paddingBottom: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: "#1976d2",
                  fontWeight: "bold",
                }}
              >
                Goal List
              </Typography>
            </CardContent>
            <Divider />
            <List sx={{ padding: "10px 20px" }}>
              {goals.length > 0 ? (
                goals.map((goal) => (
                  <ListItem
                    key={goal.id}
                    sx={{
                      padding: "10px 0",
                      transition: "0.3s",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        borderRadius: 2,
                        cursor: "pointer",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <FaCheckCircle style={{ color: "#4CAF50" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={goal.name}
                      secondary={`Streak: ${goal.history.length}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography color="textSecondary" sx={{ mt: 2 }}>
                  No goals found.
                </Typography>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>

      {/* ✅ Footer */}
      <Box sx={{ width: "100%", maxWidth: 900 }}>
        <MainFooter goals={goals} setGoals={setGoals} />
      </Box>
    </Box>
  );
}

export default Application;

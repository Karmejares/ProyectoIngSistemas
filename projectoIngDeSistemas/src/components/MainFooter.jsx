import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import Modal from "./Modal";

import CheckList from "./CheckList";
import OptionsMenu from "./OptionsMenu"; // Import the OptionsMenu component
import Store from "./Store"; // Import the Store component
import { FaStore, FaListAlt, FaCog } from "react-icons/fa"; // Import icons from react-icons

function MainFooter({ goals, setGoals }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  const openModalHandler = () => {
    setIsModalOpen(true);
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
  };

  const openOptionsModalHandler = () => {
    setIsOptionsModalOpen(true);
  };

  const closeOptionsModalHandler = () => {
    setIsOptionsModalOpen(false);
  };

  const openStoreModalHandler = () => {
    setIsStoreModalOpen(true);
  };

  const closeStoreModalHandler = () => {
    setIsStoreModalOpen(false);
  };

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("/api/goals");
        if (!response.ok) {
          throw new Error("Failed to fetch goals");
        }
        const data = await response.json();
        setGoals(data); // Ensure `data` is an array of goals
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };
    fetchGoals();
  }, []); // Empty dependency array means this effect runs only once after the initial render

  return (
    <>
      {isModalOpen && (
        <Modal onClose={closeModalHandler}>
          <h2>My Goals</h2>
          <p style={{ fontSize: "16px" }}>
            Here you can define and track your goals!
          </p>
          <CheckList goals={goals} setGoals={setGoals} />
        </Modal>
      )}
      {isOptionsModalOpen && (
        <Modal onClose={closeOptionsModalHandler}>
          <OptionsMenu />
        </Modal>
      )}
      {isStoreModalOpen && (
        <Modal onClose={closeStoreModalHandler}>
          <Store />
        </Modal>
      )}
      <AppBar
        position="static"
        sx={{ top: "auto", bottom: 0, backgroundColor: "#333" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-around" }}>
          <Button color="inherit" onClick={openStoreModalHandler}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <FaStore />
              <Typography variant="caption">Store</Typography>
            </Box>
          </Button>

          <Button color="inherit" onClick={openModalHandler}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <FaListAlt />
              <Typography variant="caption">My Goals</Typography>
            </Box>
          </Button>

          <Button color="inherit" onClick={openOptionsModalHandler}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <FaCog />
              <Typography variant="caption">Options</Typography>
            </Box>
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default MainFooter;

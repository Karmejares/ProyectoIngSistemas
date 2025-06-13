import { useState } from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import Modal from "./Modal";

import CheckList from "./CheckList";
import OptionsMenu from "./OptionsMenu"; // Import the OptionsMenu component
import Store from "./Store"; // Import the Store component
import { FaStore, FaListAlt, FaCog } from "react-icons/fa"; // Import icons from react-icons
import useGoals from "../Hooks/useGoals.jsx";

function MainFooter() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const { goals, setGoals } = useGoals();

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

  return (
    <>
      {isModalOpen && (
        <Modal onClose={closeModalHandler}>
          <Box
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 3,
              boxShadow: 3,
              padding: 3,
              maxWidth: 500,
              margin: "0 auto",
              marginRight: 2.5,
            }}
          >
            <h2>My Goals</h2>
            <p style={{ fontSize: "16px" }}>
              Here you can define and track your goals!
            </p>
            <CheckList goals={goals} setGoals={setGoals} />
          </Box>
        </Modal>
      )}
      {isOptionsModalOpen && (
        <Modal onClose={closeOptionsModalHandler}>
          <Box sx={{ marginRight: 2.5 }}>
            <OptionsMenu />
          </Box>
        </Modal>
      )}
      {isStoreModalOpen && (
        <Modal onClose={closeStoreModalHandler}>
          <Box sx={{ marginRight: 2.5 }}>
            <Store />
          </Box>
        </Modal>
      )}
      <AppBar
        position="fixed"
        sx={{
          top: "auto",
          bottom: 0,
          backgroundColor: "#ffffff", // Fondo de la barra
          boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)", // Sombra suave arriba
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-around",
            paddingY: 1,
          }}
        >
          {/* Store */}
          <Button
            onClick={openStoreModalHandler}
            size="large"
            sx={{
              color: "#4a9c8c", // Color de íconos y texto
              "&:hover": {
                backgroundColor: "#6bb5a220", // Acento con opacidad
              },
            }}
          >
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

          {/* My Goals */}
          <Button
            onClick={openModalHandler}
            size="large"
            sx={{
              color: "#4a9c8c",
              "&:hover": {
                backgroundColor: "#6bb5a220",
              },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FaListAlt />
            <Typography variant="caption">My Goals</Typography>
          </Button>

          {/* Options */}
          <Button
            onClick={openOptionsModalHandler}
            size="large"
            sx={{
              color: "#4a9c8c",
              "&:hover": {
                backgroundColor: "#6bb5a220",
              },
            }}
          >
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

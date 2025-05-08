import React from "react";
import { Modal as MuiModal, Box, Button, Typography } from "@mui/material";

function Modal({ onClose, children }) {
  return (
    <MuiModal
      open={true} // Assuming the modal is open when this component is rendered
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          minWidth: 300, // Adjust as needed
        }}
      >
        {children}
        <Button onClick={onClose} sx={{ mt: 2 }}>Close</Button>
      </Box>
    </MuiModal>
  );
}

export default Modal;

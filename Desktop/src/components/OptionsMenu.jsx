import TimerControl from "./TimerControl";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useOptionsMenu } from "../hooks/useOptionsMenu";

import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  Button,
  Modal,
  TextField,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";

function OptionsMenu({ open, onClose }) {
  const navigate = useNavigate();
  const { logOutUser, username, token } = useUser();

  const {
    showPasswordModal,
    currentPassword,
    newPassword,
    passwordError,
    passwordSuccess,
    loading,
    setShowPasswordModal,
    setCurrentPassword,
    setNewPassword,
    handleLogout,
    handleDeleteAccount,
    handleChangePassword,
    handleClosePasswordModal,
  } = useOptionsMenu({ logOutUser, username, token, navigate });

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box
          sx={{
            width: 300,
            bgcolor: "#ffffff",
            p: 2,
            borderRadius: "15px 0 0 15px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            height: "100%",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#1e88e5", mb: 2 }}
          >
            Options Menu
          </Typography>

          <List sx={{ p: 0 }}>
            <ListItem sx={{ justifyContent: "center", mb: 2 }}>
              <Button
                fullWidth
                onClick={handleLogout}
                sx={{
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "16px",
                  p: "12px 20px",
                  "&:hover": { backgroundColor: "#0056b3" },
                }}
              >
                Log Out
              </Button>
            </ListItem>

            <ListItem sx={{ justifyContent: "center", mb: 2 }}>
              <TimerControl username={username} />
            </ListItem>

            <ListItem sx={{ justifyContent: "center", mb: 2 }}>
              <Button
                fullWidth
                onClick={handleDeleteAccount}
                sx={{
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "16px",
                  p: "12px 20px",
                  "&:hover": { backgroundColor: "#0056b3" },
                }}
              >
                Delete Account
              </Button>
            </ListItem>

            <ListItem sx={{ justifyContent: "center", mb: 2 }}>
              <Button
                fullWidth
                onClick={() => setShowPasswordModal(true)}
                sx={{
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "16px",
                  p: "12px 20px",
                  "&:hover": { backgroundColor: "#0056b3" },
                }}
              >
                Change Password
              </Button>
            </ListItem>

            <ListItem sx={{ justifyContent: "center", mb: 2 }}>
              <Button
                fullWidth
                sx={{
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "16px",
                  p: "12px 20px",
                  "&:hover": { backgroundColor: "#0056b3" },
                }}
              >
                Privacy Settings
              </Button>
            </ListItem>

            <ListItem sx={{ justifyContent: "center", mb: 2 }}>
              <Button
                fullWidth
                sx={{
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "16px",
                  p: "12px 20px",
                  "&:hover": { backgroundColor: "#0056b3" },
                }}
              >
                View Profile
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Modal open={showPasswordModal} onClose={handleClosePasswordModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#ffffff",
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            borderRadius: 2,
            p: 3,
            width: 400,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: "#1e88e5" }}>
            Change Password
          </Typography>

          <Stack spacing={2}>
            <TextField
              type="password"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
            />
            <TextField
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
            />

            {passwordError && <Alert severity="error">{passwordError}</Alert>}
            {passwordSuccess && (
              <Alert severity="success">{passwordSuccess}</Alert>
            )}

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={loading}
                sx={{
                  backgroundColor: "#007bff",
                  "&:hover": { backgroundColor: "#0056b3" },
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Update Password"}
              </Button>
              <Button variant="outlined" onClick={handleClosePasswordModal}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

export default OptionsMenu;

import { Card, CardMedia, CardContent, Button, Box } from "@mui/material";
import { useSelector } from "react-redux";
import Happy from "../assets/Happy.png";
import Neutral from "../assets/Neutral.png";
import Sad from "../assets/Sad.png";
import VerySad from "../assets/VerySad.png";
import Weak from "../assets/Weak.png";

const PetCard = () => {
  const { status } = useSelector((state) => state.petStatus);
  const petImage = {
    happy: Happy,
    neutral: Neutral,
    sad: Sad,
    "very sad": VerySad,
    weak: Weak,
  }[status.toLowerCase()];

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Card
        sx={{
          width: 400,
          height: 400,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: 6,
          background: "linear-gradient(145deg, #83a4d4, #b6fbff)",
        }}
      >
        <CardMedia component="img" height="400" image={petImage} alt="Pet" />
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default PetCard;

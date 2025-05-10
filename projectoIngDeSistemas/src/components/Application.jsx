import classes from "./Application.module.css";
import petImage from "../assets/CutePixelatedCat.png";
import MainFooter from "./MainFooter";
import { useContext } from "react";
import { useState } from "react";
import { UserContext } from "./UserContext";

function Application() {
  const [fedStatus, setFedStatus] = useState(null);

  const feedPet = (foodItemName) => {
    setFedStatus(foodItemName);
    setTimeout(() => {
      setFedStatus(null);
    }, 3000);
  };
  return (
    <div className={classes.mobileContainer}>
 <div className={classes.coinDisplay}>Coins: {"coins"}</div>
      <div className={classes.mainContent}>
        <div className={classes.petContainer}>
          <img src={petImage} alt="Pet" className={classes.petImage} />
        </div>
      </div>
      <MainFooter />
    </div>
  );
}

export default Application;

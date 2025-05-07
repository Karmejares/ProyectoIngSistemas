import classes from "./Application.module.css";
import petImage from "../assets/CutePixelatedCat.png";
import MainFooter from "./MainFooter";
import { useContext } from "react";
import { UserContext } from "./UserContext";

function Application() {
  const { coins } = useContext(UserContext);
  return (
    <div className={classes.mobileContainer}>
      <div className={classes.coinDisplay}>
        Coins: {coins}
      </div>
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

import classes from "./Application.module.css";
import petImage from "../assets/CutePixelatedCat.png";
import MainFooter from "./MainFooter";

function Application() {
  return (
    <>
      <div className={classes.mainContent}>
        <div className={classes.petContainer}>
          <img src={petImage} alt="Pet" className={classes.petImage} />
        </div>
      </div>
      <MainFooter />
    </>
  );
}

export default Application;

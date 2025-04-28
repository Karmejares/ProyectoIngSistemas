import React from "react";
import classes from "./Modal.module.css";

function Modal({ onClose, children }) {
  return (
    <>
      <div className={classes.backdrop} onClick={onClose}></div>
      <div className={classes.modal}>
        {children}
        <button className={classes.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );
}

export default Modal;

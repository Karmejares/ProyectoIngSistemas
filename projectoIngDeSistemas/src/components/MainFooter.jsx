import React, { useState } from "react";
import classes from "./MainFooter.module.css";
import Modal from "./Modal";
import CheckList from "./CheckList";
import OptionsMenu from "./OptionsMenu"; // Import the OptionsMenu component
import Store from "./Store"; // Import the Store component
import { FaStore, FaListAlt, FaCog } from "react-icons/fa"; // Import icons from react-icons

function MainFooter() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  const openModalHandler = () => {
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
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
          <h2>My Goals</h2>
          <p style={{ fontSize: "16px" }}>
            Here you can define and track your goals!
          </p>
          <CheckList />
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
      <footer className={classes.footer}>
        <h2 onClick={openStoreModalHandler} style={{ cursor: "pointer" }}>
 <FaStore className={classes.icon} /> Store
        </h2>
        <h2 onClick={openModalHandler} style={{ cursor: "pointer" }}>
          <FaListAlt className={classes.icon} /> My Goals
        </h2>
        <h2 onClick={openOptionsModalHandler} style={{ cursor: "pointer" }}>
          <FaCog className={classes.icon} /> Options
        </h2>
      </footer>
    </>
  );
}

export default MainFooter;

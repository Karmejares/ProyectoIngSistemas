import { useState } from "react";

const useModalManager = () => {
    const [activeModal, setActiveModal] = useState(null);
    const [modalProps, setModalProps] = useState(null); // ← aquí guardamos los datos

    const open = (modalId, props = null) => {
        setActiveModal(modalId);
        setModalProps(props);
    };

    const close = () => {
        setActiveModal(null);
        setModalProps(null);
    };

    return {
        open,
        close,
        activeModal,
        modalProps, // ← devolvemos los props
    };
};

export default useModalManager;

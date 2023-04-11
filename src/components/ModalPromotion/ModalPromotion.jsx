import { useRef } from "react";
import styles from "./modal.module.css";

export const ModalPromotion = ({ onClose, children }) => {
  const modalWrapperRef = useRef(null);

  const handleClose = (event) => {
    if (
      modalWrapperRef?.current.contains(event.target) &&
      modalWrapperRef.current !== event.target
    ) {
      return;
    }
    onClose();
  };

  return (
    <div
      ref={modalWrapperRef}
      className={styles.modalWrapper}
      onMouseDown={handleClose}
    >
      {children}
    </div>
  );
};

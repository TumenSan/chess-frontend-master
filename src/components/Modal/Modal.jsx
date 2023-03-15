import { useCallback, useEffect, useRef } from "react";
import styles from "./modal.module.css";

export const Modal = ({ onClose, children }) => {
  const modalWrapperRef = useRef(null);

  const keyHandler = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        onClose(false);
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyHandler);

    return () => {
      document.removeEventListener("keydown", keyHandler);
    };
  }, [keyHandler]);

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

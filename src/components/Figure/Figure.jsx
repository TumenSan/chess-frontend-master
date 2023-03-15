import styles from "./figure.module.css";

export const Figure = ({ figure, currentPlayer }) => {
  return (
    <div
      className={`${currentPlayer === "b" ? styles.turn : ""} ${styles.figure}`}
    >
      {figure.icon}
    </div>
  );
};

import styles from "./square.module.css";

export const Square = ({
  color,
  rowCount,
  colCount,
  children,
  highlight,
  handleClick,
  isRevert,
}) => {
  return (
    <div
      className={`${styles.square} ${styles[color]} ${
        highlight ? styles.highlight : ""
      }`}
      onClick={handleClick}
    >
      {rowCount !== null ? <div className={`${styles.squareRowCount} ${isRevert ? styles.revert : ''}`}>{rowCount}</div> : null}
      {colCount !== null ? <div className={`${styles.squareColCount} ${isRevert ? styles.revert : ''}`}>{colCount}</div> : null}
      {children}
    </div>
  );
};

import styles from "./capturedPieces.module.css";

export const CapturedPieces = ({ capturedPieces, player }) => {
	const captured = Object.entries(capturedPieces).map(([key, value]) => {
		return `${styles.capturedPiece} ${styles[`capturedPiece${value}${key.toUpperCase()}`]} ${styles[`capturedPiece${player.toUpperCase()}${value}${key.toUpperCase()}`]}`;
	});

  return (
    <div className={styles.capturedWrapper}>
			{captured.map((_class, index) => <span key={index} className={_class}></span>)}
    </div>
  );
};
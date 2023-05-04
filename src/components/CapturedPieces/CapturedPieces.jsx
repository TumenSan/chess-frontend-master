import styles from "./capturedPieces.module.css";

export const CapturedPieces = ({ invert, capturedPieces, player }) => {
	const captured = Object.entries(capturedPieces).map(([key, value]) => {
        console.log("key ", key);
        if (key.toUpperCase() === "K") {
            console.log("!!!: ", `capturedPiece${key}`);
            return `${styles[`capturedPiece${key}`]}`;
        } else {
            console.log(`${styles.capturedPiece} ${styles[`capturedPiece${value}${key.toUpperCase()}`]} ${styles[`capturedPiece${player.toUpperCase()}${value}${key.toUpperCase()}`]}`);
        return `${styles.capturedPiece} ${styles[`capturedPiece${value}${key.toUpperCase()}`]} ${styles[`capturedPiece${player.toUpperCase()}${value}${key.toUpperCase()}`]}`;
        }
	});

  return (
    <div className={`${styles.capturedWrapper} ${invert ? styles.invert : ''}`}>
			{captured.map((_class, index) => <span key={index} className={_class}></span>)}
    </div>
  );
};

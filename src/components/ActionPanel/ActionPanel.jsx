import { useState, useRef } from "react";
import { CapturedPieces } from "../CapturedPieces";
import { Modal } from "../Modal";
import { Report } from "../Report";
import styles from "./actionPanel.module.css";

const normalizePosition = (position) => {
  const letter = ((position % 8) + 10).toString(36);
  const digit = 8 - Math.floor(position / 8);

  return `${letter}${digit}`;
};

const HistoryItem = ({ item }) => {
  return (
    <div className={styles.historyItem}>
      <CapturedPieces
        capturedPieces={{ [item.figure]: 1 }}
        player={item.figure.toLowerCase() === item.figure ? "b" : "w"}
      />
      {normalizePosition(item.start)}
      {" - "}
      {item.captured ? (
        <>
          <CapturedPieces
            capturedPieces={{ [item.captured]: 1 }}
            player={item.captured.toLowerCase() === item.captured ? "b" : "w"}
          />
          x
        </>
      ) : null}
      {normalizePosition(item.end)}
    </div>
  );
};

export const ActionPanel = ({ history, text }) => {
  const [showReport, setShowReport] = useState(false);
  const buttonType = useRef("");

  const chunkedArray = Array(Math.ceil(history.length / 2))
    .fill()
    .map((_, index) => index * 2)
    .map((begin) => history.slice(begin, begin + 2));

  const isAdmin = localStorage.getItem("isAdmin");

  return (
    <div className={styles.actionPanel}>
      {text}
      <div className={styles.history}>
        {chunkedArray.map(([first, second], index) => {
          return (
            <div className={styles.moves}>
              {index + 1}.
              {first && <HistoryItem item={first} step={index + 1} />}
              {second && <HistoryItem item={second} />}
            </div>
          );
        })}
      </div>
      {isAdmin && (
        <>
          <div className={styles.player}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-skip-backward"
              viewBox="0 0 16 16"
            >
              <path d="M.5 3.5A.5.5 0 0 1 1 4v3.248l6.267-3.636c.52-.302 1.233.043 1.233.696v2.94l6.267-3.636c.52-.302 1.233.043 1.233.696v7.384c0 .653-.713.998-1.233.696L8.5 8.752v2.94c0 .653-.713.998-1.233.696L1 8.752V12a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm7 1.133L1.696 8 7.5 11.367V4.633zm7.5 0L9.196 8 15 11.367V4.633z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-skip-start"
              viewBox="0 0 16 16"
            >
              <path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.52-.302 1.233.043 1.233.696v7.384c0 .653-.713.998-1.233.696L5 8.752V12a.5.5 0 0 1-1 0V4zm7.5.633L5.696 8l5.804 3.367V4.633z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-play"
              viewBox="0 0 16 16"
            >
              <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-skip-end"
              viewBox="0 0 16 16"
            >
              <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.713 3.31 4 3.655 4 4.308v7.384c0 .653.713.998 1.233.696L11.5 8.752V12a.5.5 0 0 0 1 0V4zM5 4.633 10.804 8 5 11.367V4.633z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-skip-forward"
              viewBox="0 0 16 16"
            >
              <path d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V8.752l-6.267 3.636c-.52.302-1.233-.043-1.233-.696v-2.94l-6.267 3.636C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696L7.5 7.248v-2.94c0-.653.713-.998 1.233-.696L15 7.248V4a.5.5 0 0 1 .5-.5zM1 4.633v6.734L6.804 8 1 4.633zm7.5 0v6.734L14.304 8 8.5 4.633z" />
            </svg>
          </div>
          <div className={styles.buttons}>
            <button
              type="button"
              className={`${styles.button} ${styles.warn}`}
              onClick={() => {
                buttonType.current = "Выдать предупреждение";
                setShowReport(true);
              }}
            >
              Предупреждение
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.ban}`}
              onClick={() => {
                buttonType.current = "Выдать бан";
                setShowReport(true);
              }}
            >
              Бан
            </button>
          </div>
        </>
      )}
      {showReport && (
        <Modal onClose={setShowReport}>
          <Report
            onClose={setShowReport}
            title={buttonType.current}
            adminView
          />
        </Modal>
      )}
    </div>
  );
};

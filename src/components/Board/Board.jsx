import { Square } from "../Square";
import { Figure } from "../Figure";
import { CapturedPieces } from "../CapturedPieces";
import {
  Pawn,
  King,
  Knight,
  Queen,
  Bishop,
  Rook,
  Empty,
  getRowColDiff,
} from "../figures";
import styles from "./board.module.css";
import { useState } from "react";

const calcBackgroundColor = (i, j) => {
  if ((i % 2 && j % 2) || (!(i % 2) && !(j % 2))) {
    return "white";
  }
  return "black";
};

const initializeBoard = () => {
  const squares = Array(64).fill(null);

  for (let i = 8; i < 16; i++) {
    squares[i] = new Pawn("b");
  }

  for (let i = 8 * 6; i < 8 * 6 + 8; i++) {
    squares[i] = new Pawn("w");
  }

  // black knights
  squares[1] = new Knight("b");
  squares[6] = new Knight("b");

  // white knights
  squares[56 + 1] = new Knight("w");
  squares[56 + 6] = new Knight("w");

  // black bishops
  squares[2] = new Bishop("b");
  squares[5] = new Bishop("b");

  // white bishops
  squares[56 + 2] = new Bishop("w");
  squares[56 + 5] = new Bishop("w");

  // black rooks
  squares[0] = new Rook("b");
  squares[7] = new Rook("b");

  // white rooks
  squares[56] = new Rook("w");
  squares[56 + 7] = new Rook("w");

  // black queen & king
  squares[3] = new Queen("b");
  squares[4] = new King("b");

  // white queen & king
  squares[56 + 3] = new Queen("w");
  squares[56 + 4] = new King("w");

  for (let i = 0; i < 64; i++) {
    if (squares[i] == null) squares[i] = new Empty(null);
  }

  return squares;
};

const generateBoard = (figures, handleClick) => {
  const board = [];
  for (let i = 0; i < 8; i++) {
    const squareRows = [];
    for (let j = 0; j < 8; j++) {
      const figure = figures[i * 8 + j];
      squareRows.push(
        <Square
          color={calcBackgroundColor(i, j)}
          highlight={figure.highlight}
          handleClick={() => handleClick(i * 8 + j)}
        >
          <span style={{ fontSize: "2rem" }}>{i * 8 + j}</span>
          <Figure figure={figure} />
        </Square>
      );
    }
    board.push(<div className={styles.row}>{squareRows}</div>);
  }

  return board;
};

const isBlocked = (start, end, figures) => {
  const { rowDiff, colDiff } = getRowColDiff(start, end);
  const startRow = 8 - Math.floor(start / 8);
  const startCol = (start % 8) + 1;
  let currentRow = 0;
  let currentCol = 0;

  while (currentRow !== rowDiff || currentCol !== colDiff) {
    const position =
      64 - startRow * 8 + -8 * currentRow + (startCol - 1 + currentCol);
    if (
      figures[position].ascii !== null &&
      figures[position] !== figures[start]
    ) {
      return true;
    }
    if (currentCol !== colDiff) {
      currentCol += 1 * (colDiff > 0 ? 1 : -1);
    }
    if (currentRow !== rowDiff) {
      currentRow += 1 * (rowDiff > 0 ? 1 : -1);
    }
  }

  return false;
};

const isGoodPawn = (start, end, figures, passantPos) => {
  return true;
};

const castlingAllowed = (start, end, figures) => {
  const player = figures[start].player;
  const delta = end - start;

  if (start !== (player === "w" ? 60 : 4)) {
    return false;
  }

  const rookPosition =
    player === "w" ? (delta === 2 ? 63 : 56) : delta === 2 ? 7 : 0;

  if (figures[rookPosition].ascii.toLowerCase() !== "r") {
    return false;
  }
  if (figures[start].isMoved) {
    return false;
  }
  if (figures[rookPosition].isMoved) {
    return false;
  }
};

const invalidMove = (start, end, figures, passantPos) => {
  const skipDisabled = ["b", "q", "r", "p", "k"];
  const currentFigure = figures[start].ascii?.toLowerCase();
  if (skipDisabled.includes(currentFigure) && isBlocked(start, end, figures)) {
    return true;
  }
  if (currentFigure === "p" && !isGoodPawn(start, end, figures, passantPos)) {
    return true;
  }
  if (
    currentFigure === "k" &&
    Math.abs(end - start) === 2 &&
    !castlingAllowed(start, end, figures)
  ) {
    return true;
  }

  return false;
};

const isInCheck = (player, figures) => {
  const king = player === "w" ? "K" : "k";
  let kingPosition = null;
  for (let i = 0; i < 64; i++) {
    if (figures[i].ascii === king) {
      kingPosition = i;
      break;
    }
  }

  for (let i = 0; i < 64; i++) {
    if (
      figures[i].player !== player &&
      figures[i].canMove(i, kingPosition) &&
      !invalidMove(i, kingPosition, figures)
    ) {
      return true;
    }
  }

  return false;
};

const checkCanMove = (start, end, figures, passantPos) => {
  if (start === end) {
    return false;
  }
  if (figures[start].player === figures[end].player) {
    return false;
  }
  if (!figures[start].canMove(start, end)) {
    return false;
  }
  console.log(end);
  if (invalidMove(start, end, figures, passantPos)) {
    return false;
  }
  // try to castle if in check position
  if (
    figures[start].ascii?.toLowerCase() === "k" &&
    Math.abs(end - start) === 2
  ) {
    if (isInCheck(figures[start].player, figures)) {
      return false;
    }
    const delta = end - start;
    const tempFigures = [...figures];
    tempFigures[start + (delta === 2 ? 1 : -1)] = tempFigures[start];
    tempFigures[start] = new Empty(null);
    if (isInCheck(figures[start].player, tempFigures)) {
      return false;
    }
  }

  const tempFigures = [...figures];
  tempFigures[end] = tempFigures[start];
  tempFigures[start] = new Empty(null);
  // TODO: what about pawns?
  if (isInCheck(figures[start].player, tempFigures)) {
    return false;
  }

  return true;
};

const resetHighlight = (figures) => {
  figures.forEach((figure) => {
    figure.highlight = false;
  });

  return figures;
};

export const Board = () => {
  const [figures, setFigures] = useState(() => initializeBoard());
  const [activePlayer, setActivePlayer] = useState("w");
  const [source, setSource] = useState(-1);
  const [capturedByWhite, setCapturedByWhite] = useState({});
  const [capturedByBlack, setCapturedByBlack] = useState({});

  const executeMove = (start, end) => {
    const newFigures = [...figures];
    resetHighlight(newFigures);
    // TODO: king highlight
    if (
      newFigures[start].ascii.toLowerCase() === "k" ||
      newFigures[start].ascii.toLowerCase() === "r"
    ) {
      newFigures[start].isMoved = true;
    }
    if (newFigures[end].ascii && newFigures[end].player !== activePlayer) {
      const updateFunction =
        activePlayer === "w" ? setCapturedByWhite : setCapturedByBlack;
      const asciiCode = newFigures[end].ascii.toUpperCase();
      updateFunction((prev) => ({
        ...prev,
        [asciiCode]: (prev[asciiCode] ?? 0) + 1,
      }));
    }
    newFigures[end] = newFigures[start];
    newFigures[start] = new Empty(null);
    setFigures(newFigures);
    setSource(-1);
    setActivePlayer((prev) => (prev === "w" ? "b" : "w"));
  };

  const handleClick = (index) => {
    const newFigures = [...figures];
    if (source === -1) {
      if (figures[index].player !== activePlayer) {
        return;
      }

      // TODO: clear highlight for king?
      newFigures[index].highlight = true;
      for (let j = 0; j < 64; j++) {
        if (checkCanMove(index, j, newFigures)) {
          newFigures[j].highlight = true;
        }
      }

      setFigures(newFigures);
      setSource(index);
    }

    // TODO: check
    if (source > -1) {
      const self = figures[index].player === activePlayer;

      if (self && source === index) {
        resetHighlight(newFigures);
        setFigures(newFigures);
        setSource(-1);

        return;
      }

      if (self && source !== index) {
        // resetHighlight(newFigures);
        for (let j = 0; j < 64; j++) {
          newFigures[j].highlight = checkCanMove(index, j, newFigures);
        }
        newFigures[index].highlight = true;
        setSource(index);
        setFigures(newFigures);

        return;
      }

      executeMove(source, index);
    }
  };

  const board = generateBoard(figures, handleClick);

  return (
    <div className="board">
      <CapturedPieces capturedPieces={capturedByBlack} player="w" />
      {board}
      <CapturedPieces capturedPieces={capturedByWhite} player="b" />
    </div>
  );
};

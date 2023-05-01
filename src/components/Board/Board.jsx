import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { SocketEventsEnum } from "../../connection/constants";
import { SocketContext } from "../../contexts/socketContext";
import { Square } from "../Square";
import { Figure } from "../Figure";
import { CapturedPieces } from "../CapturedPieces";
import { PawnPromotion } from "../PawnPromotion";
import { ModalPromotion } from "../ModalPromotion";
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

const calculateRowNumber = (currentPlayer, currentRow, currentCol) => {
  if (
    (currentCol !== 0 && currentPlayer !== "b") ||
    (currentCol !== 7 && currentPlayer === "b")
  ) {
    return null;
  }

  return 8 - currentRow;
};

const calculateColNumber = (currentPlayer, currentRow, currentCol) => {
  if (
    (currentRow !== 7 && currentPlayer !== "b") ||
    (currentRow !== 0 && currentPlayer === "b")
  ) {
    return null;
  }

  return (currentCol + 10).toString(36);
};

const generateBoard = (figures, handleClick, currentPlayer) => {
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
          rowCount={calculateRowNumber(currentPlayer, i, j)}
          colCount={calculateColNumber(currentPlayer, i, j)}
          isRevert={currentPlayer === "b"}
        >
          {/* <span style={{ fontSize: "2rem" }}>{i * 8 + j}</span> */}
          <Figure figure={figure} currentPlayer={currentPlayer} />
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
  //column check
  if(Math.abs(start - end) === 8)
    return true;
  if((((7 < start) && (start < 16)) || ((47 < start) && (start < 56))) 
    && (Math.abs(start - end) === 16))
    return true;
    
  //common take check
  const skipDisabled = ["b", "q", "r", "p", "k", "n"];
  if(skipDisabled.includes(figures[end].ascii?.toLowerCase()))
    return true;
  //taking on pass check?...
  return end === passantPos;
};

const castlingAllowed = (start, end, figures, castling) => {
  const player = figures[start].player;
  const delta = end - start;

  if (start !== (player === "w" ? 60 : 4)) {
    return false;
  }

  const rookPosition =
    player === "w" ? (delta === 2 ? 63 : 56) : delta === 2 ? 7 : 0;

  if (figures[rookPosition].ascii?.toLowerCase() !== "r") {
    return false;
  }
  //king move
  if ((player === "w") && ((castling.indexOf("K") < 0) && (castling.indexOf("Q") < 0))){
    return false;
  }
  if ((player === "b") && ((castling.indexOf("k") < 0) && (castling.indexOf("q") < 0))){
    return false;
  }
  //rook move
  if ((player === "w") && (castling.indexOf("K") < 0) && 
  (figures[end + 1].ascii?.toLowerCase() === "r"))
    return false;
  if ((player === "w") && (castling.indexOf("Q") < 0) && 
  (figures[end - 2].ascii?.toLowerCase() === "r"))
    return false;
  if ((player === "b") && (castling.indexOf("k") < 0) && 
  (figures[end + 1].ascii?.toLowerCase() === "r"))
    return false;
  if ((player === "b") && (castling.indexOf("q") < 0) &&
  (figures[end - 2].ascii?.toLowerCase() === "r"))
    return false;

  return true;
};

const invalidMove = (start, end, figures, passantPos, castling) => {
  //а n knight конь из-за прыжков так?
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
    !castlingAllowed(start, end, figures, castling)
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

const checkCanMove = (start, end, figures, passantPos, castling) => {
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
  if (invalidMove(start, end, figures, passantPos, castling)) {
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

function fmtMSS(s, min = 1000, max = 9999) {
  const isAdmin = localStorage.getItem("isAdmin");
  let rand = Math.floor(min + Math.random() * (max + 1 - min));
  return `${isAdmin ? `Игрок #${rand} | ` : ""}${(s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s}`;
}

export const Board = ({onStateChangeHistory, onStateChangeActivePlayer}) => {
  const [figures, setFigures] = useState(() => initializeBoard());
  const [activePlayer, setActivePlayer] = useState("w");
  const [source, setSource] = useState(-1);
  const [capturedByWhite, setCapturedByWhite] = useState({});
  const [capturedByBlack, setCapturedByBlack] = useState({});
  const socketData = useContext(SocketContext);
  const [currentPlayer, setCurrentPlayer] = useState("w");
  const [history, setHistory] = useState([]);
  const blackTimeoutPause = useRef(true);
  const whiteTimeoutPause = useRef(true);
  const [blackTime, setBlackTime] = useState(15 * 60);
  const [whiteTime, setWhiteTime] = useState(15 * 60);
  const [castling, setCastling] = useState("KQkq");
  const [passPawn, setPassPawn] = useState("-"); //проходная пешка
  const [pawnPromote, setShowPawnPromotion] = useState(false);

  useEffect(() => {
    const timeoutId = setInterval(() => {
      if (!blackTimeoutPause.current) {
        setBlackTime((t) => t - 1);
      }
    }, 1000);

    return () => {
      clearInterval(timeoutId);
    };
  }, []);

  useEffect(() => {
    const timeoutId = setInterval(() => {
      if (!whiteTimeoutPause.current) {
        setWhiteTime((t) => t - 1);
      }
    }, 1000);

    return () => {
      clearInterval(timeoutId);
    };
  }, []);

  // выполение хода
  const executeMove = useCallback(
    (start, end) => {
      const newFigures = [...figures];
      resetHighlight(newFigures);
      let historyRecord = {
        figure: figures[start].ascii,
        start,
        end,
        captured: null,
        castling: null,
      };
      if((newFigures[start].ascii.toLowerCase() === "p") &&
        ((end < 8) || (end > 55))){
        setShowPawnPromotion(true);
      }
      // ставим активным статус взятия на проходе
      if((newFigures[start].ascii.toLowerCase() === "p") && 
        (((23 < end) && (end < 32)) || ((31 < end) && (end < 40))) &&
        (Math.abs(end - start) === 16)){
          if (((newFigures[end + 1].ascii?.toLowerCase() === "p") && 
            (Math.floor((end + 1) / 8) === Math.floor((end) / 8))) || 
            ((newFigures[end - 1].ascii?.toLowerCase() === "p") && 
            (Math.floor((end - 1) / 8) === Math.floor((end) / 8))))
            {
              let point = (activePlayer === "w") ? end + 8 : end - 8;
              setPassPawn(point);
          }
      } else {
        setPassPawn("-"); // возможность взятия на проходе исчезла
      }
      // убираем пешку сзади
      if((newFigures[start].ascii.toLowerCase() === "p") && (end === passPawn)){
        let delPawn = (activePlayer === "w") ? end + 8 : end - 8;
        newFigures[delPawn] = new Empty(null);
        setPassPawn("-");
        // логика истории взятия этой пешки
        const updateFunction =
          activePlayer === "w" ? setCapturedByWhite : setCapturedByBlack;

        historyRecord.captured = (activePlayer === "w") ? "p" : "P";

        const asciiCode = "P";
        updateFunction((prev) => ({
          ...prev,
          [asciiCode]: (prev[asciiCode] ?? 0) + 1,
        }));
      }

      if (newFigures[start].ascii.toLowerCase() === "r"){
        if(activePlayer === "w")
          if(start === 63)
            setCastling(CastleState => CastleState.replace("K", ""));
          if(start === 56)
            setCastling(CastleState => CastleState.replace("Q", ""));
        else 
          if(start === 7)
            setCastling(CastleState => CastleState.replace("k", ""));
          if(start === 0)
            setCastling(CastleState => CastleState.replace("q", ""));
      }

      // TODO: king highlight
      // рокировка
      if (newFigures[start].ascii.toLowerCase() === "k"){
        if(activePlayer === "w")
          setCastling(CastleState => CastleState.replace("KQ", ""));
        else 
          setCastling(CastleState => CastleState.replace("kq", ""));
        if(((start === 4) || (start === 60)) && 
        (Math.abs(start - end) === 2)){
          let side = ((end - start) > 0) ? "0-0" : "0-0-0";
          if (side === "0-0"){
            newFigures[end - 1] = newFigures[end + 1];
            newFigures[end + 1] = new Empty(null);
            historyRecord.castling = "0-0";
          } else {
            newFigures[end + 1] = newFigures[end - 2];
            newFigures[end - 2] = new Empty(null);
            historyRecord.castling = "0-0-0";
          }
        }
      }
      
      // рокировка?
      if (
        newFigures[start].ascii.toLowerCase() === "k" ||
        newFigures[start].ascii.toLowerCase() === "r"
      ) {
        newFigures[start].isMoved = true;
      }
      if (newFigures[end].ascii && newFigures[end].player !== activePlayer) {
        const updateFunction =
          activePlayer === "w" ? setCapturedByWhite : setCapturedByBlack;

        historyRecord.captured = newFigures[end].ascii;

        const asciiCode = newFigures[end].ascii.toUpperCase();
        updateFunction((prev) => ({
          ...prev,
          [asciiCode]: (prev[asciiCode] ?? 0) + 1,
        }));
      }
      if((historyRecord.castling === "0-0") || (historyRecord.castling === "0-0-0")){
        historyRecord.start = null;
        historyRecord.end = null;
        historyRecord.captured = null;
      }
      newFigures[end] = newFigures[start];
      newFigures[start] = new Empty(null);
      setFigures(newFigures);
      setSource(-1);
      setHistory((h) => [...h, historyRecord]);
      onStateChangeHistory(history);
      setActivePlayer((prev) => {
        return prev === "w" ? "b" : "w";
      });
      onStateChangeActivePlayer(activePlayer);
    },
    //[activePlayer, figures]
    [activePlayer, figures, passPawn]
  );

  //обработка клика
  const handleClick = (index) => {
    //Проверяет, является ли текущий игрок активным игроком. Если нет, то выходит из функции.
    if (currentPlayer !== activePlayer) {
      return;
    }
    //Создание копии массива фигур, чтобы не изменять оригинальный массив.
    const newFigures = [...figures];
    /*Если исходный индекс равен -1, то проверяет, является ли 
    выбранная фигура фигурой текущего игрока. Если нет, то выходит из функции.*/
    if (source === -1) {
      if (figures[index].player !== activePlayer) {
        return;
      }
      /*Выделяет выбранную фигуру и определяет, какие клетки могут быть целевыми 
      клетками для хода этой фигуры. Выделяет эти целевые клетки на шахматной доске.*/
      // TODO: clear highlight for king?
      newFigures[index].highlight = true;
      for (let j = 0; j < 64; j++) {
        if (checkCanMove(index, j, newFigures, passPawn, castling)) {
          newFigures[j].highlight = true;
        }
      }
      //Устанавливает source для текущей фигуры в index.
      setFigures(newFigures);
      /*Если source уже установлен, то проверяет, принадлежит ли фигура 
      текущему игроку. Если да, то очищает выделение на 
      шахматной доске и устанавливает новые возможные целевые клетки. 
      Если нет, то переходит к ходу фигуры.*/
      setSource(index);
    }

    /*Если кликнули на фигуру того же игрока, то 
    снимает выделение фигур и сбрасывает source до -1.*/
    // TODO: check
    if (source > -1) {
      const self = figures[index].player === activePlayer;

      if (self && source === index) {
        resetHighlight(newFigures);
        setFigures(newFigures);
        setSource(-1);

        return;
      }
      /*Если кликнули на фигуру другого игрока, то проверяет, 
      может ли текущая фигура ходить в выбранную целевую клетку. 
      Если нет, то выходит из функции.*/
      if (self && source !== index) {
        // resetHighlight(newFigures);
        for (let j = 0; j < 64; j++) {
          newFigures[j].highlight = checkCanMove(index, j, newFigures, passPawn, castling);
        }
        newFigures[index].highlight = true;
        setSource(index);
        setFigures(newFigures);

        return;
      }

      if(!checkCanMove(source, index, newFigures, passPawn, castling)){
        return;
      }
      /*Если ход корректный, то передает данные о ходе на сервер 
      и запускает соответствующую функцию для выполнения хода 
      и переключения хода на другого игрока.*/
      whiteTimeoutPause.current = activePlayer === "w";
      blackTimeoutPause.current = activePlayer === "b";
      executeMove(source, index);
      socketData.send({
        type: SocketEventsEnum.MOVE,
        figure: newFigures[source].ascii,
        figureEnd: newFigures[index].ascii,
        start: source,
        end: index,
      });
    }
  };

  //useEffect каждого хода
  useEffect(() => {
    const processMes = (result) => {
      switch (result.type) {
        case SocketEventsEnum.START_GAME:
          setFigures(() => initializeBoard());
          setHistory([]);
          onStateChangeHistory(history);
          socketData.setSocket("STARTED");
          whiteTimeoutPause.current = false;
          setCurrentPlayer(result.side);
          setActivePlayer("w");
          onStateChangeActivePlayer(activePlayer);
          setSource(-1);
          setCapturedByWhite({});
          setCapturedByBlack({});
          setBlackTime(15 * 60);
          setWhiteTime(15 * 60);
          setCastling("KQkq");
          setPassPawn("-"); //проходная пешка
          setShowPawnPromotion(false);
          break;
        case SocketEventsEnum.GIVE_UP:
          socketData.setSocket(null);
          break;
        case SocketEventsEnum.MOVE:
          whiteTimeoutPause.current = !whiteTimeoutPause.current;
          blackTimeoutPause.current = !blackTimeoutPause.current;
          executeMove(result.start, result.end);
          // setActivePlayer(result.player);
          break;
        default:
          console.log("Unknown");
      }
    };

    socketData.subscribe(processMes);

    return () => {
      socketData.unsubscribe(processMes);
    };
  }, [socketData, executeMove]);

  const board = generateBoard(figures, handleClick, currentPlayer);

  return (
    <>
      <div className={styles.boardWrapper}>
        {currentPlayer === "b" ? fmtMSS(whiteTime) : fmtMSS(blackTime)}
        <div className={`${currentPlayer === "b" ? styles.blackSide : ""}`}>
          <CapturedPieces
            invert={currentPlayer === "b"}
            capturedPieces={capturedByBlack}
            player="w"
          />
          {board}
          <CapturedPieces
            invert={currentPlayer === "b"}
            capturedPieces={capturedByWhite}
            player="b"
          />
        </div>
        {currentPlayer === "b" ? fmtMSS(blackTime) : fmtMSS(whiteTime)}
      </div>
      {pawnPromote && (
        <ModalPromotion onClose={setShowPawnPromotion}>
          <PawnPromotion/>
        </ModalPromotion>
      )}
    </>
  );
};

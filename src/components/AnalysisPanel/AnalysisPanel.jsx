import {useEffect, useState} from "react";
import styles from "./actionPanel.module.css";
import GameState from "../../GameState";
import { observer } from 'mobx-react-lite';
import { Scrollbar } from "react-scrollbars-custom";
import { Loader } from "../commons/Loader";
import {useParams} from "react-router-dom";

function parseMove(pos, s) {
    let promotion = null;
    let castling = null; // Переменная для хранения информации о рокировке
    let captured = null; // Переменная для хранения информации о захваченной фигуре
    if((s === "0-0") || (s === "0-0-0") || (s === "O-O") || (s === "O-O-O")){
        if ((s === "O-O") || (s === "0-0")) {
            console.log("0-0!!!");
            let from, to;
            if (pos.w === "w") {
                from = { x: 4, y: 0 };
                to = { x: 6, y: 0 };
            } else {
                from = { x: 4, y: 7 };
                to = { x: 6, y: 7 };
            }
            return { from: from, to: to, piece: "K", castling: "0-0", promotion: null };
        } else if ((s === "O-O-O") || (s === "0-0-0")) {
            let from, to;
            if (pos.w === "w") {
                from = { x: 4, y: 0 };
                to = { x: 2, y: 0 };
            } else {
                from = { x: 4, y: 7 };
                to = { x: 2, y: 7 };
            }
            return { from: from, to: to, piece: "K", castling: "0-0-0", promotion: null };
        }
    }
    s = s.replace(/[\+|#|\?|!|x]/g, "");
    if (s.length >= 2 && s[s.length - 2] == "=") {
        promotion = s[s.length - 1]
        s = s.substring(0, s.length - 2);
    }
    if (s.length >= 3 && "NBRQ".indexOf(s[s.length - 1]) >= 0) {
        promotion = s[s.length - 1]
        s = s.substring(0, s.length - 1);
    }
    if ((!(s == "O-O" || s == "O-O-O")) || !(s == "0-0" || s == "0-0-0")) {
        var p;
        if ("PNBRQK".indexOf(s[0]) < 0) {
            p = "P";
        } else {
            p = s[0];
            s = s.substring(1);
        }
        if (s.length < 2 || s.length > 4) return null;
        var xto = "abcdefgh".indexOf(s[s.length - 2]);
        var yto = "87654321".indexOf(s[s.length - 1]);
        var xfrom = -1,
            yfrom = -1;
        if (s.length > 2) {
            xfrom = "abcdefgh".indexOf(s[0]);
            yfrom = "87654321".indexOf(s[s.length - 3]);
        }
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                if (xfrom != -1 && xfrom != x) continue;
                if (yfrom != -1 && yfrom != y) continue;
                if (pos.b[x][y] == (pos.w ? p : p.toLowerCase()) && isLegal(pos, {
                    x: x,
                    y: y
                }, {
                    x: xto,
                    y: yto
                })) {
                    xfrom = x;
                    yfrom = y;
                    if (pos.b[xto][yto] !== ".") {
                        captured = pos.b[xto][yto]; // Захваченная фигура
                        if (captured === "-")
                            captured = null;
                    }
                }
            }
        }
        if (xto < 0 || yto < 0 || xfrom < 0 || yfrom < 0) return null;
        return {
            from: {
                x: xfrom,
                y: yfrom
            },
            to: {
                x: xto,
                y: yto
            },
            piece: p,
            p: promotion,
            captured: captured,
            castling: castling
        };
    } else if ((s === "O-O") || (s === "0-0")) {
        console.log("0-0!!!");
        let from, to;
        if (pos.w === "w") {
            from = { x: 4, y: 0 };
            to = { x: 6, y: 0 };
        } else {
            from = { x: 4, y: 7 };
            to = { x: 6, y: 7 };
        }
        return { from: from, to: to, piece: "K", castling: "0-0" };
    } else if ((s === "O-O-O") || (s === "0-0-0")) {
        let from, to;
        if (pos.w === "w") {
            from = { x: 4, y: 0 };
            to = { x: 2, y: 0 };
        } else {
            from = { x: 4, y: 7 };
            to = { x: 2, y: 7 };
        }
        return { from: from, to: to, piece: "K", castling: "0-0-0" };
    }
}

function parseFEN(fen) {
    var board = new Array(8);
    for (var i = 0; i < 8; i++) board[i] = new Array(8);
    var a = fen.replace(/^\s+/, '').split(' '),
        s = a[0],
        x, y;
    for (x = 0; x < 8; x++)
        for (y = 0; y < 8; y++) {
            board[x][y] = '-';
        }
    // eslint-disable-next-line no-unused-expressions
    x = 0, y = 0;
    for (var i = 0; i < s.length; i++) {
        if (s[i] == ' ') break;
        if (s[i] == '/') {
            x = 0;
            y++;
        } else {
            if (!bounds(x, y)) continue;
            if ('KQRBNP'.indexOf(s[i].toUpperCase()) != -1) {
                board[x][y] = s[i];
                x++;
            } else if ('0123456789'.indexOf(s[i]) != -1) {
                x += parseInt(s[i]);
            } else x++;
        }
    }
    var castling, enpassant, whitemove = !(a.length > 1 && a[1] == 'b');
    if (a.length > 2) {
        castling = [a[2].indexOf('K') != -1, a[2].indexOf('Q') != -1,
            a[2].indexOf('k') != -1, a[2].indexOf('q') != -1
        ];
    } else {
        castling = [true, true, true, true];
    }
    if (a.length > 3 && a[3].length == 2) {
        var ex = 'abcdefgh'.indexOf(a[3][0]);
        var ey = '87654321'.indexOf(a[3][1]);
        enpassant = (ex >= 0 && ey >= 0) ? [ex, ey] : null;
    } else {
        enpassant = null;
    }
    var movecount = [(a.length > 4 && !isNaN(a[4]) && a[4] != '') ? parseInt(a[4]) : 0,
        (a.length > 5 && !isNaN(a[5]) && a[5] != '') ? parseInt(a[5]) : 1
    ];
    return {
        b: board,
        c: castling,
        e: enpassant,
        w: whitemove,
        m: movecount
    };
}

function colorflip(pos) {
    var board = new Array(8);
    for (var i = 0; i < 8; i++) board[i] = new Array(8);
    for (let x = 0; x < 8; x++)
        for (let y = 0; y < 8; y++) {
            board[x][y] = pos.b[x][7 - y];
            var color = board[x][y].toUpperCase() == board[x][y];
            board[x][y] = color ? board[x][y].toLowerCase() : board[x][y].toUpperCase();
        }
    return {
        b: board,
        c: [pos.c[2], pos.c[3], pos.c[0], pos.c[1]],
        e: pos.e == null ? null : [pos.e[0], 7 - pos.e[1]],
        w: !pos.w,
        m: [pos.m[0], pos.m[1]]
    };
}

function bounds(x, y) {
    return x >= 0 && x <= 7 && y >= 0 && y <= 7;
}

function doMove(pos, from, to, promotion) {
    if (pos.b[from.x][from.y].toUpperCase() != pos.b[from.x][from.y]) {
        var r = colorflip(doMove(colorflip(pos), {
            x: from.x,
            y: 7 - from.y
        }, {
            x: to.x,
            y: 7 - to.y
        }, promotion));
        r.m[1]++;
        return r;
    }
    var r = colorflip(colorflip(pos));
    r.w = !r.w;
    if (from.x == 7 && from.y == 7) r.c[0] = false;
    if (from.x == 0 && from.y == 7) r.c[1] = false;
    if (to.x == 7 && to.y == 0) r.c[2] = false;
    if (to.x == 0 && to.y == 0) r.c[3] = false;
    if (from.x == 4 && from.y == 7) r.c[0] = r.c[1] = false;
    r.e = pos.b[from.x][from.y] == 'P' && from.y == 6 && to.y == 4 ? [from.x, 5] : null;
    if (pos.b[from.x][from.y] == 'K') {
        if (Math.abs(from.x - to.x) > 1) {
            r.b[from.x][from.y] = '-';
            r.b[to.x][to.y] = 'K';
            r.b[to.x > 4 ? 5 : 3][to.y] = 'R';
            r.b[to.x > 4 ? 7 : 0][to.y] = '-';
            return r;
        }
    }
    if (pos.b[from.x][from.y] == 'P' && to.y == 0) {
        r.b[to.x][to.y] = promotion != null ? promotion : 'Q';
    } else if (pos.b[from.x][from.y] == 'P' &&
        pos.e != null && to.x == pos.e[0] && to.y == pos.e[1] &&
        Math.abs(from.x - to.x) == 1) {
        r.b[to.x][from.y] = '-';
        r.b[to.x][to.y] = pos.b[from.x][from.y];

    } else {
        r.b[to.x][to.y] = pos.b[from.x][from.y];
    }
    r.b[from.x][from.y] = '-';
    r.m[0] = (pos.b[from.x][from.y] == 'P' || pos.b[to.x][to.y] != '-') ? 0 : r.m[0] + 1;
    return r;
}

function board(pos, x, y) {
    if (x >= 0 && x <= 7 && y >= 0 && y <= 7) return pos.b[x][y];
    return "x";
}

function isLegal(pos, from, to) {
    if (!bounds(from.x, from.y)) return false;
    if (!bounds(to.x, to.y)) return false;
    if (from.x == to.x && from.y == to.y) return false;
    if (pos.b[from.x][from.y] != pos.b[from.x][from.y].toUpperCase()) {
        return isLegal(colorflip(pos), {
            x: from.x,
            y: 7 - from.y
        }, {
            x: to.x,
            y: 7 - to.y
        })
    }
    if (!pos.w) return false;
    var pfrom = pos.b[from.x][from.y];
    var pto = pos.b[to.x][to.y];
    if (pto.toUpperCase() == pto && pto != '-') return false;
    if (pfrom == '-') {
        return false;
    } else if (pfrom == 'P') {
        var enpassant = pos.e != null && to.x == pos.e[0] && to.y == pos.e[1];
        if (!((from.x == to.x && from.y == to.y + 1 && pto == '-') ||
            (from.x == to.x && from.y == 6 && to.y == 4 && pto == '-' && pos.b[to.x][5] == '-') ||
            (Math.abs(from.x - to.x) == 1 && from.y == to.y + 1 && (pto != '-' || enpassant))
        )) return false;
    } else if (pfrom == 'N') {
        if (Math.abs(from.x - to.x) < 1 || Math.abs(from.x - to.x) > 2) return false;
        if (Math.abs(from.y - to.y) < 1 || Math.abs(from.y - to.y) > 2) return false;
        if (Math.abs(from.x - to.x) + Math.abs(from.y - to.y) != 3) return false;
    } else if (pfrom == 'K') {
        var castling = true;
        if (from.y != 7 || to.y != 7) castling = false;
        if (from.x != 4 || (to.x != 2 && to.x != 6)) castling = false;
        if (to.x == 6 && !pos.c[0] || to.x == 2 && !pos.c[1]) castling = false;
        if (to.x == 2 && pos.b[0][7] + pos.b[1][7] + pos.b[2][7] + pos.b[3][7] != 'R---') castling = false;
        if (to.x == 6 && pos.b[5][7] + pos.b[6][7] + pos.b[7][7] != '--R') castling = false;
        if ((Math.abs(from.x - to.x) > 1 || Math.abs(from.y - to.y) > 1) && !castling) return false;
        if (castling && isWhiteCheck(pos)) return false;
        if (castling && isWhiteCheck(doMove(pos, from, {
            x: to.x == 2 ? 3 : 5,
            y: 7
        }))) return false;
    }
    if (pfrom == 'B' || pfrom == 'R' || pfrom == 'Q') {
        var a = from.x - to.x,
            b = from.y - to.y;
        var line = a == 0 || b == 0;
        var diag = Math.abs(a) == Math.abs(b);
        if (!line && !diag) return false;
        if (pfrom == 'R' && !line) return false;
        if (pfrom == 'B' && !diag) return false;
        var count = Math.max(Math.abs(a), Math.abs(b));
        var ix = a > 0 ? -1 : a < 0 ? 1 : 0,
            iy = b > 0 ? -1 : b < 0 ? 1 : 0;
        for (var i = 1; i < count; i++) {
            if (pos.b[from.x + ix * i][from.y + iy * i] != '-') return false;
        }
    }
    if (isWhiteCheck(doMove(pos, from, to))) return false;
    return true;
}

function isWhiteCheck(pos) {
    var kx = null,
        ky = null;
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            if (pos.b[x][y] == 'K') {
                kx = x;
                ky = y;
            }
        }
    }
    if (kx == null || ky == null) return false;
    if (board(pos, kx + 1, ky - 1) == 'p' ||
        board(pos, kx - 1, ky - 1) == 'p' ||
        board(pos, kx + 2, ky + 1) == 'n' ||
        board(pos, kx + 2, ky - 1) == 'n' ||
        board(pos, kx + 1, ky + 2) == 'n' ||
        board(pos, kx + 1, ky - 2) == 'n' ||
        board(pos, kx - 2, ky + 1) == 'n' ||
        board(pos, kx - 2, ky - 1) == 'n' ||
        board(pos, kx - 1, ky + 2) == 'n' ||
        board(pos, kx - 1, ky - 2) == 'n' ||
        board(pos, kx - 1, ky - 1) == 'k' ||
        board(pos, kx, ky - 1) == 'k' ||
        board(pos, kx + 1, ky - 1) == 'k' ||
        board(pos, kx - 1, ky) == 'k' ||
        board(pos, kx + 1, ky) == 'k' ||
        board(pos, kx - 1, ky + 1) == 'k' ||
        board(pos, kx, ky + 1) == 'k' ||
        board(pos, kx + 1, ky + 1) == 'k') return true;
    for (var i = 0; i < 8; i++) {
        var ix = (i + (i > 3)) % 3 - 1;
        var iy = (((i + (i > 3)) / 3) << 0) - 1;
        for (var d = 1; d < 8; d++) {
            var b = board(pos, kx + d * ix, ky + d * iy);
            var line = ix == 0 || iy == 0;
            if (b == 'q' || b == 'r' && line || b == 'b' && !line) return true;
            if (b != "-") break;
        }
    }
    return false;
}

function generateFEN(pos) {
    var s = '',
        f = 0,
        castling = pos.c,
        enpassant = pos.e,
        board = pos.b;
    for (var y = 0; y < 8; y++) {
        for (var x = 0; x < 8; x++) {
            if (board[x][y] == '-') {
                f++;
            } else {
                // eslint-disable-next-line no-unused-expressions
                if (f > 0) s += f, f = 0;
                s += board[x][y];
            }
        }
        // eslint-disable-next-line no-unused-expressions
        if (f > 0) s += f, f = 0;
        if (y < 7) s += '/';
    }
    s += ' ' + (pos.w ? 'w' : 'b') +
        ' ' + ((castling[0] || castling[1] || castling[2] || castling[3]) ?
            ((castling[0] ? 'K' : '') + (castling[1] ? 'Q' : '') +
                (castling[2] ? 'k' : '') + (castling[3] ? 'q' : '')) :
            '-') +
        ' ' + (enpassant == null ? '-' : ('abcdefgh' [enpassant[0]] + '87654321' [enpassant[1]])) +
        ' ' + pos.m[0] + ' ' + pos.m[1];
    return s;
}

function chessToCoords(chessPos) {
    const chessToIndex = {a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7};
    const col = chessToIndex[chessPos[0]];
    const row = 8 - parseInt(chessPos[1]);
    return { x: col, y: row };
}

function coordsToIndex(coords) {
    const col = coords.x;
    const row = coords.y;
    const index = row * 8 + col;
    return index;
}

export const AnalysisPanel = observer(({ onClose }) => {
    let { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [gameAnalysis, setGameAnalysis] = useState([]);
    const [game, setGame] = useState([]);

    let dataGame = {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        idGame: id,
        depth: 12,
        //pgn: "1. e4 e5 2. Nf3 Nc6 3. Bb5 d6 "
    };

    useEffect(() => {
        setIsLoading(true);

        fetch("http://localhost:5000/api/getgame", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(dataGame),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((payload) => {
                setGame(payload);
                console.log("payload: ", payload);

                let gameUser = {
                    //fen: "r1bq1rk1/p1ppbppp/p1n2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 7",
                    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                    depth: 12,
                    pgn: payload[0].pgn
                }
                let pgn = gameUser.pgn;
                let pos = parseFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
                const regex = /\d+\.\s|\s/g;
                const moves = pgn.split(regex).filter(move => move !== "");

                let historyRecord = [];

                for (let i = 0; i < moves.length; i++){
                    let move = parseMove(pos, moves[i]);
                    let moveUp = {
                        figure: move.piece,
                        start: coordsToIndex(move.from),
                        end: coordsToIndex(move.to),
                        captured: move.captured,
                        castling: move.castling,
                    };
                    historyRecord.push(moveUp);
                    if (move.p) pos = doMove(pos, move.from, move.to, move.p);
                    else pos = doMove(pos, move.from, move.to, null);
                    let fen = generateFEN(pos);
                    pos = parseFEN(fen);
                }

                GameState.history = historyRecord;

                //GameState.history = JSON.parse(history);
                /*
                let historyRecord = {
                    figure: figures[start].ascii,
                    start,
                    end,
                    captured: null,
                    castling: null,
                  };
                 */
                console.log("gameUser: ", gameUser);

                fetch("http://localhost:5000/api/sendposition", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(gameUser),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    })
                    .then((payload2) => {
                        setGameAnalysis(payload2);
                        console.log("payload: ", payload2);
                    })
                    .catch((e) => {
                        console.log(e);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                console.log("finallyGame")
            });

    }, []);

  GameState.isAnalysis = true;

  /*
  {gameAnalysis.conslusion.map((gameConslusion) => (
              <div>
                  {gameConslusion}
              </div>
          ))}
   */

  return (
    <div className={styles.actionPanel}>
      <Scrollbar style={{ width: "103%", height: "100%" }}>
          {isLoading && <Loader />}
          Анализ
          <p>1. e4 +0.4</p>
          <p>1...e5 +0.4</p>
          <p>2. Nf3 +0.3</p>
          <p>2...Nc6 +0.3</p>
          <p>3. Bc4 +0.2</p>
          <p>Удар на поле рядом с королем: f7</p>
          <p>3...Bc5 +0.2</p>
          <p>Удар на поле рядом с королем: f2</p>
          <p>Был разыгран дебют: Итальянская партия</p>
          <p>4. 0-0 +0.2</p>
          <p>4...Nf6 +0.2</p>
          <p>5. d3 +0.2</p>
          <p>5...0-0 +0.3</p>
          <p>Оба игрока развивают фигуры в дебюте</p>
          <p>6. c3 +0.1</p>
          <p>6...d6 +0.3</p>
          <p>7. Bg5 +0.3</p>
          <p>Конь f6 привязан и не может отойти из-за удара слона</p>
          <p>в дебюте оба игрока играли точно</p>
      </Scrollbar>
    </div>
  );
});

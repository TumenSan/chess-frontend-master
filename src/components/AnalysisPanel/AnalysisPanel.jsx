import {useEffect, useState} from "react";
import styles from "./actionPanel.module.css";
import GameState from "../../GameState";
import { observer } from 'mobx-react-lite';
import { Scrollbar } from "react-scrollbars-custom";
import { Loader } from "../commons/Loader";
import {useParams} from "react-router-dom";

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
                    fen: "r1bq1rk1/p1ppbppp/p1n2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 7",
                    depth: 12,
                    pgn: payload[0].pgn
                }
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
                        //dispatch({ type: SET_USER_ACTION, payload });
                        //onClose();
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

    /*
    useEffect(() => {
        console.log("game: ", game);
        let gameUser = {
            fen: "r1bq1rk1/p1ppbppp/p1n2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 7",
            depth: 12,
            pgn: game[0].pgn
        }
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
            .then((payload) => {
                setGameAnalysis(payload);
                console.log("payload: ", payload);
                //dispatch({ type: SET_USER_ACTION, payload });
                //onClose();
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [game]);

     */

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
      <Scrollbar style={{ width: "80%", height: 250 }}>
          {isLoading && <Loader />}
          Анализ
          <p>ходы были неплохими</p>
          <p>а ход e4 был вообще отличный</p>

      </Scrollbar>
    </div>
  );
});

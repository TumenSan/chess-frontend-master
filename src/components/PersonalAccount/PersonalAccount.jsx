import { useState, useEffect } from "react";
import { useUser } from "../../contexts/userContext";
import styles from "./account.module.css";
import { Loader } from "../commons/Loader";
import { Scrollbar } from "react-scrollbars-custom";

export const PersonalAccount = ({ onClose }) => {
  const [{ user }] = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const login = user;

    const data = { login };

    setIsLoading(true);
    fetch("http://localhost:5000/api/getgamesuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((payload) => {
        setGames(payload);
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
  }, [user]);

  return (
    <div className={styles.signUp}>
      <h3>{`${user.user?.login}`}</h3>
      <Scrollbar style={{ width: 900, height: 450 }}>
        <section>
          {isLoading && <Loader />}
          {games?.map((game, i) => (
                  <div className={styles.Games} key={i}>
                      <div className={styles.Game}>
                          <b>{`${game.playerWhiteLogin} - ${game.playerBlackLogin}`}</b> <br/>
                          <b>{game.gameResult}</b> <br/>
                          <b>{game?.date}</b> <br/>
                          <p>{game.pgn}</p>
                          <a href="http://localhost:3000/">Анализ партии</a>
                      </div>
                  </div>
              ))}
        </section>
      </Scrollbar>
    </div>
  );
};

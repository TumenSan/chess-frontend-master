import { useState, useEffect } from "react";
import { useUser } from "../../contexts/userContext";
import styles from "./account.module.css";
import { Loader } from "../commons/Loader";
import { Scrollbar } from "react-scrollbars-custom";
import { Link } from "react-router-dom";

export const PersonalAccount = ({ onClose }) => {
  const [{ user }] = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState([]);

  useEffect(() => {
    console.log(user);
    const login = user.user.login;

    const data = { userLogin: login };

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
      <Scrollbar style={{ width: "100%", height: 450 }}>
        <section>
          {isLoading && <Loader />}
          {games?.map((game, i) => (
                  <div className={styles.Games} key={i}>
                      <div className={styles.Game}>
                          <p>{`${game.playerWhiteLogin} - ${game.playerBlackLogin}`}</p>
                          <p>{game.gameResult}</p>
                          <p>{game?.date}</p>
                          <p>{game.pgn}</p>
                        <Link to={`/watchgames/${game._id}`}>Анализ партии</Link>
                      </div>
                  </div>
              ))}
        </section>
      </Scrollbar>
    </div>
  );
};

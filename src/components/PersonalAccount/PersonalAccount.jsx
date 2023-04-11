import { useState } from "react";
import { LoginFieldsEnum } from "./constants";
import { useUser } from "../../contexts/userContext";
import { SET_USER_ACTION } from "../../actions/userActions";
import styles from "./account.module.css";
import { Loader } from "../commons/Loader";

export const PersonalAccount = ({ onClose }) => {
  const [, dispatch] = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState([]);

  const userGames = (event) => {
    event.preventDefault();

    const login = event.target[0].value;

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
  };

  return (
    <div className={styles.signUp}>
      <h3>Пользователь</h3>
      <section>
        <form onSubmit={userGames}>
          <label htmlFor={LoginFieldsEnum.name}>
            <input
              type="text"
              id={LoginFieldsEnum.name}
              name={LoginFieldsEnum.name}
              placeholder="Логин"
            />
          </label>
          {isLoading && <Loader />}
          {!isLoading && <input type="submit" value="Найти игры" />}
        </form>
        {games?.map((game, i) => (
                <div className="Games" key={i}>
                    <div className="Game">
                        <b>{game.playerWhiteLogin}</b> <br/>
                        <b>{game.playerBlackLogin}</b> <br/>
                        <b>{game.gameResult}</b> <br/>
                        <p>{game.pgn}</p>
                    </div>
                </div>
            ))}
      </section>
    </div>
  );
};

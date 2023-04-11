import { useContext, useState, useEffect } from "react";
import { Modal } from "../Modal";
import { ModalPlayer } from '../ModalPlayer';
import { SignUp } from "../SignUp";
import { Login } from "../Login";
import { Report } from "../Report";
import { PersonalAccount } from "../PersonalAccount"
import styles from "./toolbar.module.css";
import { useUser } from "../../contexts/userContext";
import { SocketContext } from "../../contexts/socketContext";
import { LOGOUT_USER_ACTION } from "../../actions/userActions";
import { SocketEventsEnum } from "../../connection/constants";
import { Loader } from "../commons/Loader";

export const Toolbar = ({ setShowChat }) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showPersonalAccount, setShowPersonalAccount] = useState(false);
  const [GameStatus, isGame] = useState(false);
  const [opponent, setOpponent] = useState(false);
  const [{ user }, dispatch] = useUser();
  const socketData = useContext(SocketContext);


  const logout = () => {
    fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return "OK";
      })
      .then(() => {
        dispatch({ type: LOGOUT_USER_ACTION });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const searchGame = () => {
    try {
      socketData.connect();
      isGame("search");
    } catch (e) {
      console.log(e);
    }
  };

  const abortGame = () => {
    socketData.send({
      type: SocketEventsEnum.GIVE_UP,
    });
    socketData.status = null;
    isGame("gameWas");
  }

  //useEffect GiveUp
  useEffect(() => {
    const processMes = (result) => {
      switch (result.type) {
        case SocketEventsEnum.GIVE_UP:
          socketData.status = null;
          socketData.opponent = null;
          setOpponent(false);
          isGame("gameWas");
          break;
        case SocketEventsEnum.START_GAME:
          socketData.opponent = result.opponent;
          console.log("oppon: ", result.opponent);
          setOpponent(result.opponent);
          break;
        default:
          console.log("Unknown");
      }
    };

    socketData.subscribe(processMes);

    return () => {
      socketData.unsubscribe(processMes);
    };
  }, [socketData]);

  const isAdmin = localStorage.getItem("isAdmin");

  return (
    <div className={styles.toolbar}>
      {user && (
        <>
          <div
            type="button" 
            className={styles.loginName}
            onClick={() => setShowPersonalAccount(true)}
            >
              {`${user.user?.login}`}
          </div>
          {showPersonalAccount && (
            <ModalPlayer onClose={setShowPersonalAccount}>
              <PersonalAccount onClose={setShowPersonalAccount} />
            </ModalPlayer>
          )}
          {socketData.status !== "STARTED" && !isAdmin && (
            <button
              type="button"
              className={`${styles.button} ${styles.signUp}`}
              onClick={searchGame}
            >
              Новая игра
            </button>
          )}
          {(GameStatus === "search") && (socketData.status !== "STARTED") && !isAdmin && (
            <>
              <Loader />
            </>
          )}
          {socketData.status === "STARTED" && (
            <button
              type="button"
              className={`${styles.button} ${styles.login}`}
              onClick={() => abortGame()}
            >
              Сдаться
            </button>
          )}
          {socketData.status === "STARTED" && (
            <button
              type="button"
              className={`${styles.button} ${styles.login}`}
              onClick={() => setShowChat((show) => !show)}
            >
              1/2
            </button>
          )}
          {socketData.status === "STARTED" && (
            <button
              type="button"
              className={`${styles.button} ${styles.login}`}
              onClick={() => setShowChat((show) => !show)}
            >
              Чат
            </button>
          )}
          {socketData.status === "STARTED" && (
            <div
              type="button" 
              className={styles.loginName}
              onClick={() => setShowChat((show) => !show)}
              >
                {`${opponent}`}
            </div>
          )}
          {GameStatus === "gameWas" && (
            <button
              type="button"
              className={`${styles.button} ${styles.login}`}
              onClick={() => setShowReport((show) => !show)}
            >
              Отчет
            </button>
          )}
          {socketData.status === null && (
            <button
              type="button"
              className={`${styles.button} ${styles.login}`}
              onClick={logout}
            >
              Выйти
            </button>
          )}
        </>
      )}
      {!user && (
        <>
          <button
            type="button"
            className={`${styles.button} ${styles.signUp}`}
            onClick={() => setShowSignUp(true)}
          >
            Регистрация
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.login}`}
            onClick={() => setShowLogin(true)}
          >
            Войти
          </button>
        </>
      )}
      {showSignUp && (
        <Modal onClose={setShowSignUp}>
          <SignUp onClose={setShowSignUp} />
        </Modal>
      )}
      {showLogin && (
        <Modal onClose={setShowLogin}>
          <Login onClose={setShowLogin} />
        </Modal>
      )}
      {showReport && (
        <Modal onClose={setShowReport}>
          <Report onClose={setShowReport} />
        </Modal>
      )}
    </div>
  );
};

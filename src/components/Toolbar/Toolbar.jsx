import { useState } from "react";
import { Modal } from "../Modal";
import { SignUp } from "../SignUp";
import { Login } from "../Login";
import styles from "./toolbar.module.css";

export const Toolbar = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [showToolbar, setShowToolbar] = useState(true);

  function UserInfoFunction(){
    const [userInfo, setUserInfo] = useState("");

    return <h1>User: {userInfo}</h1> 
  }

  return (
    showToolbar && (
    <div className={styles.toolbar}>
      <UserInfoFunction/>
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
      {showSignUp && (
        <Modal onClose={setShowSignUp}>
          <SignUp />
        </Modal>
      )}
      {showLogin && (
        <Modal onClose={setShowLogin}>
          <Login />
        </Modal>
      )}
    </div>)
  );
};

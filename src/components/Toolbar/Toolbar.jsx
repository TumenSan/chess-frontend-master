import { useState } from "react";
import { Modal } from "../Modal";
import { SignUp } from "../SignUp";
import { Login } from "../Login";
import { UserInfo, ThemeContext } from "../UserInfo/UserInfo";
import styles from "./toolbar.module.css";

export const Toolbar = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [showAuthButton, setShowAuthButton] = useState(true);
  //const [showLoginButton, setShowLoginButton] = useState(true);

  const [userInfo, setUserInfo] = useState("");

  //<ThemeContext.Provider value={"Day"}>
  //{</ThemeContext.Provider>}

  return (
    <div className={styles.toolbar}>
      <UserInfo userInfo={userInfo}/>
      {showAuthButton && (
      <div>
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
      </div>
      )}
      {showSignUp && (
        <Modal onClose={setShowSignUp}>
          <SignUp 
          onClose={setShowSignUp} 
          onSetUserInfo={setUserInfo}
          onsetShowAuthButton={setShowAuthButton}
          />
        </Modal>
      )}
      {showLogin && (
        <Modal onClose={setShowLogin}>
          <Login 
          onClose={setShowLogin} 
          onSetUserInfo={setUserInfo} 
          onsetShowAuthButton={setShowAuthButton}
          />
        </Modal>
      )}
    </div>
  );
};

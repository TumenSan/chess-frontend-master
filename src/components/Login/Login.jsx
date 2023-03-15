import { useState } from "react";
import { LoginFieldsEnum } from "./constants";
import { useUser } from "../../contexts/userContext";
import { SET_USER_ACTION } from "../../actions/userActions";
import styles from "./login.module.css";
import { Loader } from "../commons/Loader";

export const Login = ({ onClose }) => {
  const [, dispatch] = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();

    const login = event.target[0].value;
    const password = event.target[1].value;

    const data = { login, password };

    setIsLoading(true);
    fetch("http://localhost:5000/api/login", {
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
        dispatch({ type: SET_USER_ACTION, payload });
        onClose();
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
      <h3>Войти</h3>
      <section>
        <form onSubmit={onSubmit}>
          <label htmlFor={LoginFieldsEnum.name}>
            <input
              type="text"
              id={LoginFieldsEnum.name}
              name={LoginFieldsEnum.name}
              placeholder="Логин"
            />
          </label>
          <label htmlFor={LoginFieldsEnum.password}>
            <input
              id={LoginFieldsEnum.password}
              type="password"
              name={LoginFieldsEnum.password}
              placeholder="Пароль"
            />
          </label>
          {isLoading && <Loader />}
          {!isLoading && <input type="submit" value="Войти" />}
        </form>
      </section>
    </div>
  );
};

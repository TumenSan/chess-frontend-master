import styles from "./signUp.module.css";
import { SignUpFieldsEnum } from "./constants";
import { useUser } from "../../contexts/userContext";
import { SET_USER_ACTION } from '../../actions/userActions';

export const SignUp = ({ onClose }) => {

  const [{ user }, dispatch] = useUser();

  console.log(user);

  const onSubmit = (event) => {
    event.preventDefault();

    const login = event.target[0].value;
    const password = event.target[1].value;
    const rpassword = event.target[2].value;

    if (password !== rpassword) {
      alert("Пароли не совпадают");
    }

    const data = { login, password };

    fetch("http://localhost:5000/api/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((payload) => {
        dispatch({ type: SET_USER_ACTION, payload});
        onClose();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className={styles.signUp}>
      <h3>Регистрация</h3>
      <section>
        <form onSubmit={onSubmit}>
          <label htmlFor={SignUpFieldsEnum.name}>
            <input
              type="text"
              id={SignUpFieldsEnum.name}
              name={SignUpFieldsEnum.name}
              placeholder="Логин"
            />
          </label>

          <label htmlFor={SignUpFieldsEnum.password}>
            <input
              id={SignUpFieldsEnum.password}
              type="password"
              name={SignUpFieldsEnum.password}
              placeholder="Пароль"
            />
          </label>

          <label htmlFor={SignUpFieldsEnum.rpassword}>
            <input
              type="password"
              id={SignUpFieldsEnum.rpassword}
              name={SignUpFieldsEnum.rpassword}
              placeholder="Повторите пароль"
            />
          </label>

          <input type="submit" value="Зарегистироваться" />
        </form>
      </section>
    </div>
  );
};

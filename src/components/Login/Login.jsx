import styles from "./login.module.css";
import { LoginFieldsEnum } from './constants';

export const Login = ({onClose, onSetUserInfo, onsetShowAuthButton}) => {
  
  const onSubmit = async (event) => {
    //onClose(false); //
    event.preventDefault();

    console.log('sign in');
    console.log(event.target[0].value);
    console.log(event.target[1].value);

    const formParams = {
      login: event.target[0].value,
      password : event.target[1].value
    }

    console.log(formParams);

    //var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)Bearer\s*\=\s*([^;]*).*$)|^.*$/, "$1"); //
    //console.log(cookieValue);

    //'Authorization': 'Bearer ' + cookieValue,

    const response = await fetch("http://localhost:5000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formParams),
      })
      .catch(error => {
        window.alert(error);
        return;
      });

      // если запрос прошел нормально
      if (response.ok === true) {
            // получаем данные
            const user = await response.json(); //was await

            console.log(user);

            // set token in cookie
            //document.cookie = "name=user;max-age=2629743";

            //var cookie_date = new Date();
            //cookie_date.setMonth(cookie_date.getHours() + 1);
            //document.cookie = "Bearer=" + user.token + ";expires=" + cookie_date.toUTCString();
            document.cookie = "Bearer=" + user.token + ";max-age=3600";

            //document.cookie = `Bearer=${user.token}`

            console.log('ok signin');


            sessionStorage.setItem( 'userInfo', formParams.login );
            onSetUserInfo(formParams.login);

            onClose(false);
            onsetShowAuthButton(false);
        }
        // если запрос прошел неправильно
        else {

        console.log('Error signup');
    }

    // make api call

  };

  return (
    <div className={styles.signUp}>
      <h3>Войти</h3>
      <section>
        <form onSubmit={onSubmit}>
          <label htmlFor={LoginFieldsEnum.name}>
            <input type="text" id={LoginFieldsEnum.name} name={LoginFieldsEnum.name} placeholder="Логин" />
          </label>
          <label htmlFor={LoginFieldsEnum.password}>
            <input
              id={LoginFieldsEnum.password}
              type="password"
              name={LoginFieldsEnum.password}
              placeholder="Пароль"
            />
          </label>
          <input type="submit" value="Войти" />
        </form>
      </section>
    </div>
  );
};

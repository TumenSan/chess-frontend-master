import styles from "./signUp.module.css";
import { SignUpFieldsEnum } from './constants';

export const SignUp = ({onClose, onSetUserInfo, onsetShowAuthButton}) => {

  const onSubmit = async (event) => {
    event.preventDefault();

    console.log('sign up');
    console.log(event.target[0].value);
    console.log(event.target[1].value);
    console.log(event.target[2].value);
    console.log(event.target[3].value);

    const formParams = {
      email : event.target[0].value,
      login: event.target[1].value,
      password : event.target[2].value,
      rpassword : event.target[3].value,
    }

    const formParams2 = {
      email: event.target[0].value,
      login: event.target[1].value,
      password : event.target[2].value
    }

    console.log(formParams);

    if (formParams.password !== formParams.rpassword) {
      alert('Пароли не совпадают');
    }

    const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formParams2),
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

            console.log('ok signup');


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
    
    //let d = new Date(); // 32 января 2013 ?!?
    //alert(d); // ... это 1 февраля 2013!
  };
  

  return (
    <div className={styles.signUp}>
      <h3>Регистрация</h3>
      <section>
        <form onSubmit={onSubmit}>
          <label htmlFor={SignUpFieldsEnum.email}>
            <input 
              type="text" 
              id={SignUpFieldsEnum.email} 
              name={SignUpFieldsEnum.email} 
              placeholder="email" 
            />
          </label>

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

import { useState } from "react";

import styles from "./toolbarGame.module.css";

export const ToolbarGame = () => {

  const GiveUp = async (event) => {
    //onClose(false); //
    event.preventDefault();

    let login = sessionStorage.getItem( 'userInfo' );

    console.log('give up');
    console.log(login);

    const response = await fetch("http://localhost:5000/giveup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
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

            console.log('ok give up');
        }
        // если запрос прошел неправильно
        else {

        console.log('Error GiveUp');
    }

    // make api call

  };

  const Draw = async (event) => {
    //onClose(false); //
    event.preventDefault();

    let login = sessionStorage.getItem( 'userInfo' );

    console.log('Draw');
    console.log(login);

    const response = await fetch("http://localhost:5000/draw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
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

            console.log('ok Draw');
        }
        // если запрос прошел неправильно
        else {

        console.log('Error Draw');
    }

    // make api call

  };


  return (
    <div className={styles.toolbar}>
      <div className={styles.signUp}>
        <div>
          <form onSubmit={GiveUp}>
            <input type="submit" value="Сдаться" />
          </form>
          <form onSubmit={Draw}>
            <input type="submit" value="Предложить ничью" />
          </form>
        </div>
      </div>
    </div>
  );
};

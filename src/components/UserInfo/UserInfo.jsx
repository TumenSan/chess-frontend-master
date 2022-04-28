import { useState } from "react";
//import * as React from 'react'
import styles from "./userinfo.module.css";


export const UserInfo = ({userInfo}) => {

    let userInfo2 = sessionStorage.getItem( 'userInfo' );

    //const [userInfo, setUserInfo] = useState("");

    //const CountStateContext = React.createContext()
    
    return(
        <div>
            <h1>User:</h1>
            <h3> {userInfo} </h3>
            <h3> 123 {userInfo2} </h3>  
        </div>
    );
}


/*
const CountContext = React.createContext()

function countReducer(state, action) {
  switch (action.type) {
    case 'increment': {
      return {count: state.count + 1}
    }
    case 'decrement': {
      return {count: state.count - 1}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function UserInfo({children}) {
  const [state, dispatch] = React.useReducer(countReducer, {count: 0})
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = {state, dispatch}
  return <CountContext.Provider value={value}>{children}</CountContext.Provider>
}
*/

//export {UserInfo}
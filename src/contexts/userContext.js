import React, { useEffect } from "react";
import { SET_USER_ACTION, LOGOUT_USER_ACTION } from '../actions/userActions';

const UserContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case SET_USER_ACTION: {
      return { user: action.payload };
    }
    case LOGOUT_USER_ACTION: {
      return { user: null };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  const [state, dispatch] = React.useReducer(userReducer, { user: null });

  useEffect(() => {
    fetch("http://localhost:5000/api/refresh", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((payload) => {
        dispatch({ type: SET_USER_ACTION, payload});
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const value = [state, dispatch];
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUser };

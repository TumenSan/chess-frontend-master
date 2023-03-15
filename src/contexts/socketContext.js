import React from "react";
import { useSocket } from '../connection/useSocket';

const SocketContext = React.createContext();

function SocketProvider({ children }) {
  const socketData = useSocket();

  return <SocketContext.Provider value={socketData}>{children}</SocketContext.Provider>;
}

export { SocketProvider, SocketContext };

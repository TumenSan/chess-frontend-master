import { useState } from "react";
import { Board } from "./components/Board";
import { Toolbar } from "./components/Toolbar";
import { Chat } from "./components/Chat";
import "./App.css";

const App = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="app">
      <Toolbar setShowChat={setShowChat} />
      <Board />
      <Chat visible={showChat} close={() => setShowChat(false)} />
    </div>
  );
};

export default App;

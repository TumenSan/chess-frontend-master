import { Board } from "./components/Board";
import { Toolbar } from "./components/Toolbar";
import { ToolbarGame } from "./components/ToolbarGame";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <Toolbar />
      <div className="boardWrapper">
        <Board />
      </div>
      <ToolbarGame/>
    </div>
  );
};

export default App;

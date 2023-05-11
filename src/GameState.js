import { observable } from 'mobx';

const GameState = observable({
    activePlayer: "",
    history: [],
    isAnalysis: "",
    tasksHistory: []
});

export default GameState;
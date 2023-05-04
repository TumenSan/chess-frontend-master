import { observable } from 'mobx';

const GameState = observable({
    activePlayer: "",
    history: [],
    isAnalysis: ""
});

export default GameState;
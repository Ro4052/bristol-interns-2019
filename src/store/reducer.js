export const initialState = {
    status: "NOT_STARTED",
    roundNum: 0,
    currentPlayer: null,
    allPlayers: [],
    currentCards: [],
    currentWord: '',
    socket: null
}

const reducer = (state = initialState, action) => {
    console.log(state);
    
    switch (action.type) {
        // case "SET_GAME_STATE":
        //     return {...state, gameState: action.gameState };
        case "SET_STATUS":
            return {...state, status: action.status };
        case "SET_ROUND_NUMBER":
            return {...state, roundNum: action.roundNum };
        case "SET_CURRENT_PLAYER":
            return {...state, currentPlayer: action.currentPlayer };
        case "SET_ALL_PLAYERS":
            return {...state, allPlayers: action.allPlayers };
        case "SET_CURRENT_CARDS":
            return {...state, currentCards: action.currentCards };
        case "SET_CURRENT_WORD":
            return {...state, currentWord: action.currentWord };
        case "SET_SOCKET":
            return {...state, socket: action.socket };
        default:
            return state;
    }
}

export default reducer;
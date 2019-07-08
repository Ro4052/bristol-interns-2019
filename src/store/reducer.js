export const initialState = {
    status: "NOT_STARTED",
    roundNum: 0,
    currentPlayer: null,
    players: [],
    currentCards: [],
    currentWord: '',
    socket: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_STATUS":
            return {...state, status: action.status };
        case "SET_ROUND_NUMBER":
            return {...state, roundNum: action.roundNum };
        case "SET_CURRENT_PLAYER":
            return {...state, currentPlayer: action.currentPlayer };
        case "SET_PLAYERS":
            return {...state, players: action.players };
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

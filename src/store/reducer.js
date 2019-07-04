export const initialState = {
    gameState: {
        started: false,
        roundNum: 0,
        currentPlayer: null,
        players: [],
        currentCards: [],
    },
    currentWord: '',
    socket: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_GAME_STATE":
            return {...state, gameState: action.gameState };
        case "SET_CURRENT_WORD":
            return {...state, message: action.currentWord };
        case "SET_SOCKET":
            return {...state, socket: action.socket };
        default:
            return state;
    }
}

export default reducer;
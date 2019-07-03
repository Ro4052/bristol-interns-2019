export const initialState = {
    gameState: {
        started: false,
        roundNum: 0,
        currentPlayer: null,
        players: [],
        currentCards: [],
    },
    message: ''
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_GAME_STATE":
            return {...state, gameState: action.gameState};
        case "SET_MESSAGE":
            return {...state, message: action.message };
        default:
            return state;
    }
}

export default reducer;
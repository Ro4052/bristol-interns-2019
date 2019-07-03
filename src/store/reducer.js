export const initialState = {
    gameState: {
        started: false,
        roundNum: 0,
        currentPlayer: null,
        players: [],
        currentCards: []
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_GAME_STATE":
            return {...state, gameState: action.gameState};
        default:
            return state;
    }
}

export default reducer;
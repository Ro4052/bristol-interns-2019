export const setGameState = gameState => {
    return {
        type: "SET_GAME_STATE",
        gameState
    }
}

export const setMessage = message => {
    return {
        type: "SET_MESSAGE",
        message
    }
}
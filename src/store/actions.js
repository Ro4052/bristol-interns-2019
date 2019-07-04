export const setGameState = gameState => {
    return {
        type: "SET_GAME_STATE",
        gameState
    }
}

export const setCurrentWord = currentWord => {
    return {
        type: "SET_CURRENT_WORD",
        currentWord
    }
}

/** @param {SocketIOClient.Socket} socket */
export const setSocket = socket => {
    return {
        type: "SET_SOCKET",
        socket
    }
}
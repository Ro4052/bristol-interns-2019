export const types = {
    SET_GAME_STATE: 'SET_GAME_STATE',
    SET_STATUS: 'SET_STATUS',
    SET_ROUND_NUMBER: 'SET_ROUND_NUMBER',
    SET_CURRENT_PLAYER: 'SET_CURRENT_PLAYER',
    SET_PLAYERS: 'SET_PLAYERS',
    SET_CURRENT_CARDS: 'SET_CURRENT_CARDS',
    SET_CURRENT_WORD: 'SET_CURRENT_WORD',
    SET_SOCKET: 'SET_SOCKET',
    RESET_STATE: 'RESET_STATE'
};

export const resetState = () => ({
    type: types.RESET_STATE
});

export const setGameState = gameState => ({
    type: types.SET_GAME_STATE,
    gameState
});

export const setStatus = status => ({
    type: types.SET_STATUS,
    status
});

export const setRoundNumber = roundNum => ({
    type: types.SET_ROUND_NUMBER,
    roundNum
});

export const setCurrentPlayer = currentPlayer => ({
    type: types.SET_CURRENT_PLAYER,
    currentPlayer
});

export const setPlayers = players => ({
    type: types.SET_PLAYERS,
    players
});

export const setCurrentCards = currentCards => ({
    type: types.SET_CURRENT_CARDS,
    currentCards
});

export const setCurrentWord = currentWord => ({
    type: types.SET_CURRENT_WORD,
    currentWord
});

/** @param {SocketIOClient.Socket} socket */
export const setSocket = socket => ({
    type: types.SET_SOCKET,
    socket
});
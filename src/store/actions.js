export const SET_GAME_STATE   = 'SET_GAME_STATE';
export const SET_STATUS   = 'SET_STATUS';
export const SET_ROUND_NUMBER   = 'SET_ROUND_NUMBER';
export const SET_CURRENT_PLAYER   = 'SET_CURRENT_PLAYER';
export const SET_PLAYERS   = 'SET_PLAYERS';
export const SET_CURRENT_CARDS   = 'SET_CURRENT_CARDS';
export const SET_CURRENT_WORD   = 'SET_CURRENT_WORD';
export const SET_SOCKET   = 'SET_SOCKET';

export const setGameState = gameState => ({
    type: SET_GAME_STATE,
    gameState
});

export const setStatus = status => ({
    type: SET_STATUS,
    status
});

export const setRoundNumber = roundNum => ({
    type: SET_ROUND_NUMBER,
    roundNum
});

export const setCurrentPlayer = currentPlayer => ({
    type: SET_CURRENT_PLAYER,
    currentPlayer
});

export const setPlayers = players => ({
    type: SET_PLAYERS,
    players
});

export const setCurrentCards = currentCards => ({
    type: SET_CURRENT_CARDS,
    currentCards
});

export const setCurrentWord = currentWord => ({
    type: SET_CURRENT_WORD,
    currentWord
});

/** @param {SocketIOClient.Socket} socket */
export const setSocket = socket => ({
    type: SET_SOCKET,
    socket
});
export const types = {
    SET_GAME_STATE: 'SET_GAME_STATE',
    SET_STATUS: 'SET_STATUS',
    SET_ROUND_NUMBER: 'SET_ROUND_NUMBER',
    SET_CURRENT_PLAYER: 'SET_CURRENT_PLAYER',
    SET_PLAYERS: 'SET_PLAYERS',
    SET_CURRENT_CARDS: 'SET_CURRENT_CARDS',
    SET_CURRENT_WORD: 'SET_CURRENT_WORD',
    SET_ALL_VOTES: 'SET_ALL_VOTES',
    SET_WINNER: 'SET_WINNER',
    SET_SOCKET: 'SET_SOCKET',
    RESET_STATE: 'RESET_STATE'
};

export const resetState = () => ({
    type: types.RESET_STATE
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

export const setAllVotes = allVotes => ({
    type: types.SET_ALL_VOTES,
    allVotes
});

export const setWinner = player => ({
    type: types.SET_WINNER,
    player
});

/** @param {SocketIOClient.Socket} socket */
export const setSocket = socket => ({
    type: types.SET_SOCKET,
    socket
});

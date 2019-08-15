import { types } from './PlayersActionTypes';

export const setPlayers = players => ({
    type: types.SET_PLAYERS,
    players
});

export const setScoresForRound = players => ({
    type: types.SET_SCORES_FOR_ROUND,
    players
});

export const setCurrentPlayer = currentPlayer => ({
    type: types.SET_CURRENT_PLAYER,
    currentPlayer
});

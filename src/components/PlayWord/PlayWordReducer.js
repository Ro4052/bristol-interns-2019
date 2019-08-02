import { types } from './PlayWordActionTypes';

export const initialState = {
    playWord: false,
    error: null,
    word: null
};

const playWordReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.VALIDATE_WORD_SUCCESS:
            return {...state, error: null };
        case types.VALIDATE_WORD_FAILURE:
            return {...state, error: action.error };
        case types.PLAY_WORD:
            return {...state, word: action.word, playWord: false };
        case types.SET_PLAY_WORD:
            return {...state, playWord: action.playWord };
        case types.RESET_PLAY_WORD:
            return {...state, word: null, error: null };
        default:
            return state;
    }
};

export default playWordReducer;

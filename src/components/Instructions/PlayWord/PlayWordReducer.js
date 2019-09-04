import { types } from './PlayWordActionTypes';

export const initialState = {
    playWord: false,
    word: null,
    error: null
};

const playWordReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.RESET_PLAY_WORD:
            return { ...state, word: null, error: null };
        case types.SET_PLAY_WORD:
            return { ...state, playWord: action.playWord };
        case types.SEND_WORD_SUCCESS:
            return { ...state, playWord: false, word: action.word, error: null};
        case types.SEND_WORD_FAILURE:
            return { ...state, word: null, error: action.error };
        default:
            return state;
    }
};

export default playWordReducer;

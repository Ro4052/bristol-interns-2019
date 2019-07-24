import { types } from './DashboardActionTypes';

export const initialState = {
    status: "NOT_STARTED",
    roundNum: 0,
    currentWord: ''
};

const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_STATUS:
            return {...state, status: action.status };
        case types.SET_ROUND_NUMBER:
            return {...state, roundNum: action.roundNum };
        case types.SET_CURRENT_WORD:
            return {...state, currentWord: action.currentWord };
        default:
            return state;
    }
};

export default dashboardReducer;

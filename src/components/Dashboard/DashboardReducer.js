import { types } from './DashboardActionTypes';
import { statusTypes } from '../../services/statusTypes';

export const initialState = {
    status: statusTypes.NOT_STARTED,
    roundNum: 0,
    currentWord: ''
};

const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_STATUS:
            return {...state, status: action.status };
        case types.SET_ROUND_NUMBER:
            return {...state, roundNum: action.roundNum, rounds: action.rounds };
        case types.SET_CURRENT_WORD:
            return {...state, currentWord: action.currentWord };
        default:
            return state;
    }
};

export default dashboardReducer;

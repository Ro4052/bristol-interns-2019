import { types } from './LeaderBoardActionTypes';
import axios from "axios";

const axiosInstance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const setPlayers = () => dispatch => {
    axiosInstance.get('/api/allPlayers')
    .then(res => {
        if (res.status !== 200) throw Error(res.data.message);
        dispatch(setPlayersSuccess(res.data.players));
    })
    .catch(err => dispatch(setPlayersFailure(err.message)));
};

export const setPlayersSuccess = (players) => ({
    type: types.SET_PLAYERS_SUCCESS,
    players
});

export const setPlayersFailure = (error) => ({
    type: types.SET_PLAYERS_FAILURE,
    error
});

import { types } from './LeaderboardActionTypes';
import axios from "axios";

const axiosInstance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

const sortPlayers = (players) => {
    return players.sort((first, next) => next.score - first.score);
}
export const getPlayers = () => dispatch => {
    axiosInstance.get('/api/all-players')
    .then(res => {
        if (res.status !== 200) throw Error(res.data.message);        
        dispatch(getPlayersSuccess(sortPlayers(res.data)));
    })
    .catch(err => dispatch(getPlayersFailure(err.message)));
};

export const getPlayersSuccess = (players) => ({
    type: types.GET_PLAYERS_SUCCESS,
    players
});

export const getPlayersFailure = (error) => ({
    type: types.GET_PLAYERS_FAILURE,
    error
});

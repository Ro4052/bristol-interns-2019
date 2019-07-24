import { types } from './GameOverActionTypes';
import axios from "axios";

let instance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const setWinner = winner => ({
    type: types.SET_WINNER,
    winner
});

export const endGame = () => dispatch => {
    instance.get('/api/end');
    // .catch(err => console.log(err));
};

import { types } from './CreateRoomActionTypes';
import axios from "axios";

const axiosInstance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const setRoundCount = numRounds => ({
    type: types.SET_ROUND_COUNT,
    numRounds
});

export const setGameMode = gameMode => ({
    type: types.SET_GAME_MODE,
    gameMode
});

export const createRoomSuccess = error => ({
    type: types.CREATE_ROOM_SUCCESS
});

export const createRoomFailure = error => ({
    type: types.CREATE_ROOM_FAILURE,
    error
});

export const createRoom = (numRounds, gameMode) => dispatch => {
    axiosInstance.post('/api/room/create', { numRounds, gameMode })
    .then(res => {
        if (res.status === 200) {
            dispatch(createRoomSuccess());
        } else {
            console.log(res);
            
            throw new Error(res.data.message);
        }
    })
    .catch(err => {
        console.log(err);
        
        dispatch(createRoomFailure(err.message))
    });
};

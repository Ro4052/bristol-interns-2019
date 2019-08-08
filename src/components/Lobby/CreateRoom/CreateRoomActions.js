import { types } from './CreateRoomActionTypes';
import axios from "axios";

const axiosInstance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const setRoundCount = numRounds => ({
    type: types.SET_ROUND_COUNT,
    numRounds
});

export const createRoomSuccess = error => ({
    type: types.CREATE_ROOM_SUCCESS
});

export const createRoomFailure = error => ({
    type: types.CREATE_ROOM_FAILURE,
    error
});

export const createRoom = numRounds => dispatch => {
    axiosInstance.post('/api/room/create', { numRounds })
    .then(res => {
        if (res.status === 200) {
            dispatch(createRoomSuccess());
        } else {
            throw Error(res.data.message);
        }
    })
    .catch(err => dispatch(createRoomFailure(err.message)));
};

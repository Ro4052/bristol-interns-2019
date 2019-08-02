import { types } from './LobbyActionTypes';
import axios from "axios";
import { setRoundCount } from '../RoundCount/RoundCountActions';

const axiosInstance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const setRooms = rooms => ({
    type: types.SET_ROOMS,
    rooms
});

export const createRoomFailure = error => ({
    type: types.CREATE_ROOM_FAILURE,
    error
});

export const joinRoomFailure = error => ({
    type: types.JOIN_ROOM_FAILURE,
    error
});

export const leaveRoomFailure = error => ({
    type: types.LEAVE_ROOM_FAILURE,
    error
});

export const createRoom = numRounds => dispatch => {
    axiosInstance.post('/api/room/create', { numRounds })
    .then(res => {
        if (res.status !== 200) throw Error(res.data.message);
        else dispatch(setRoundCount(null));
    })
    .catch(err => dispatch(createRoomFailure(err.message)));
};

export const joinRoom = roomId => dispatch => {
    axiosInstance.post('/api/room/join', { roomId })
    .then(res => {
        if (res.status !== 200) throw Error(res.data.message);
    })
    .catch(err => dispatch(joinRoomFailure(err.message)));
};

export const leaveRoom = roomId => dispatch => {
    axiosInstance.post('/api/room/leave')
    .then(res => {
        if (res.status !== 200) throw Error(res.data.message);
    })
    .catch(err => dispatch(joinRoomFailure(err.message)));
};

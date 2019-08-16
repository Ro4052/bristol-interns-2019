import { types } from './LobbyActionTypes';
import axios from "axios";
import history from '../../services/history';

const axiosInstance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const setRooms = rooms => ({
    type: types.SET_ROOMS,
    rooms
});

export const joinRoomFailure = error => ({
    type: types.JOIN_ROOM_FAILURE,
    error
});

export const addAutoFailure = error => ({
    type: types.ADD_AUTO_FAILURE,
    error
});

export const leaveRoomFailure = error => ({
    type: types.LEAVE_ROOM_FAILURE,
    error
});

export const startGameFailure = error => ({
    type: types.START_GAME_FAILURE,
    error
});

export const joinRoom = roomId => dispatch => {
    axiosInstance.post('/api/room/join', { roomId })
    .then(res => {
        if (res.status !== 200) throw Error(res.data.message);
    })
    .catch(err => dispatch(joinRoomFailure(err.message)));
};

export const leaveRoom = () => dispatch => {
    axiosInstance.post('/api/room/leave')
    .then(res => {
        if (res.status !== 200) throw Error(res.data.message);
    })
    .catch(err => dispatch(joinRoomFailure(err.message)));
};

export const addAIPlayer = roomId => dispatch => {
    axiosInstance.post('/api/room/addAIPlayer', { roomId })
    .then(res => {
        if (res.status !== 200) throw Error(res.data.message);
    })
    .catch(err => dispatch(addAutoFailure(err.message)));
};

export const startGame = () => dispatch => {
    axiosInstance.get('/api/start')
    .then(res => {
        if (res.status !== 200) throw Error(res.data.message);
        history.push('/dashboard');
    })
    .catch(err => dispatch(startGameFailure(err.message)));
};

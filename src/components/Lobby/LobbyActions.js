import { types } from './LobbyActionTypes';
import axios from "axios";

const axiosInstance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const joinRoom = roomId => dispatch => {
    axiosInstance.post('/api/room/join', { roomId })
    .then(res => {
        if (res.status !== 200) throw Error(res.data.message);
    })
    .catch(err => dispatch(joinRoomFailure(err.message)));
};

export const joinRoomFailure = error => ({
    type: types.JOIN_ROOM_FAILURE,
    error
});

export const setRooms = rooms => ({
    type: types.SET_ROOMS,
    rooms
});

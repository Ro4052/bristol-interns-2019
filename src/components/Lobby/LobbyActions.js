import { types } from './LobbyActionTypes';

export const setRooms = rooms => ({
    type: types.SET_ROOMS,
    rooms
});

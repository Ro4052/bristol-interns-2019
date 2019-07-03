import io from 'socket.io-client';
import { dispatch } from './store/store';
import { setGameState, setMessage } from './store/actions';

let socket;

const connect = (port = 8080) => {
    // const port = window.location.port === "3000" ? 8080: window.location.port;
    socket = io(`ws://${window.location.hostname}:${port}`, {
        transports:  ['websocket'],
        upgrade: false
    });

    socket.on("gameState", msg => {
        dispatch(setGameState(msg));
    });

    socket.on("messages", msg => {
        dispatch(setMessage(msg));
    });
}

export const sendWord = (msg) => {
    socket.emit("private message", msg);
}

export const sendCard = (msg) => {
    socket.emit("play card", msg);
}

export default connect;

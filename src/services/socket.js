import io from 'socket.io-client';
import { dispatch } from '../store/store';
import { setGameState, setMessage } from '../store/actions';

const connectSocket = () => {
    let connectionString;
    if (process.env.NODE_ENV === "development") {
        connectionString = "ws://localhost:8080";
    } else {
        connectionString = `wss://${window.location.host}`;
    }

    const socket = io(connectionString, {
        transports:  ['websocket'],
        upgrade: false
    });

    socket.on("gameState", msg => {
        console.log("HERE");
        console.log("gameState", msg);
        dispatch(setGameState(msg));
    });

    socket.on("messages", msg => {
        dispatch(setMessage(msg));
    });

    return socket;
}

export const sendWord = (socket, msg) => {
    socket.emit("play word", msg);
}

export const sendCard = (socket, msg) => {
    socket.emit("play card", msg);
}

export default connectSocket;

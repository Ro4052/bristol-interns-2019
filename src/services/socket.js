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
        console.log("Received an updated game state", msg);
        dispatch(setGameState(msg));
    });

    socket.on("messages", msg => {
        dispatch(setMessage(msg));
    });

    socket.on("played word", msg => {
        console.log("The current player played the word: ", msg);
    });

    socket.on("play word and card", () => {
        console.log("Your turn, play a word and a card");
    });

    socket.on("play card", () => {
        console.log("Play a card");
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

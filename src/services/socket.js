import io from 'socket.io-client';
import { dispatch } from '../store/store';
import { setCurrentWord, setStatus, setRoundNumber, setCurrentPlayer, setPlayers, setCurrentCards } from '../store/actions';
import { setPlayWordAndCard, setPlayCard, setPlayedCard } from '../store/playerActions';

const connectSocket = () => {
    let connectionString;
    if (process.env.NODE_ENV === "development") {
        connectionString = "ws://localhost:8080";
    } else {
        const wsProtocol = window.location.protocol === 'http' ? 'ws' : 'wss';
        connectionString = `${wsProtocol}://${window.location.host}`;
    }

    const socket = io(connectionString, {
        transports:  ['websocket'],
        upgrade: false
    });

    socket.on("players", msg => {
        dispatch(setPlayers(msg.players));
    });

    socket.on("new round", msg => {
        console.log("new round", msg);
        dispatch(setStatus(msg.status));
        dispatch(setRoundNumber(msg.roundNum));
        dispatch(setCurrentPlayer(msg.currentPlayer));
        dispatch(setCurrentWord(''));
        dispatch(setCurrentCards([]));
        dispatch(setPlayCard(false));
        dispatch(setPlayWordAndCard(false));
        dispatch(setPlayedCard(0));
        // Reset flags
    });

    socket.on("status", msg => {
        dispatch(setStatus(msg));
    });

    socket.on("played word", msg => {
        dispatch(setCurrentWord(msg));
    });

    socket.on("play word and card", () => {
        dispatch(setPlayWordAndCard(true));
    });

    socket.on("play card", () => {
        dispatch(setPlayCard(true));
    });

    socket.on("played cards", msg => {
        console.log("played cards", msg);
        dispatch(setCurrentCards(msg));
    });

    socket.on("vote", () => {
    });

    return socket;
}

export default connectSocket;

import io from 'socket.io-client';
import { dispatch } from '../store/store';
import { setCurrentWord, setStatus, setRoundNumber, setCurrentPlayer, setAllPlayers, setCurrentCards } from '../store/actions';
import { setPlayWordAndCard, setPlayCard, setPlayedCard } from '../store/playerActions';

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

    socket.on("all players", msg => {
        dispatch(setAllPlayers(msg.allPlayers));
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
        console.log("status", msg);
        dispatch(setStatus(msg));
    });

    socket.on("start game", msg => {
        console.log("start game", msg);
        dispatch(setAllPlayers(msg.allPlayers));
    });

    socket.on("played word", msg => {
        console.log("played word", msg);
        dispatch(setCurrentWord(msg));
    });

    socket.on("play word and card", () => {
        console.log("play word and card");
        dispatch(setPlayWordAndCard(true));
    });

    socket.on("play card", () => {
        console.log("play card");
        dispatch(setPlayCard(true));
    });

    socket.on("played cards", msg => {
        console.log("played cards", msg);
    });

    socket.on("vote", () => {
        console.log("vote");
    });

    return socket;
}

export default connectSocket;

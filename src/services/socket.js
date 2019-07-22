import io from 'socket.io-client';
import { dispatch } from '../store/store';
import { setCurrentWord, setStatus, setRoundNumber, setCurrentPlayer, setPlayers, setCurrentCards, setAllVotes, setWinner, resetState, setSocket } from '../store/gameActions';
import { setPlayWord, setPlayCard, setPlayedCard, setVoteCard, setVotedCard, playWord, resetFinishRound, resetPlayerState, resetCookie } from '../store/playerActions';

const connectSocket = () => {
    let connectionString;
    if (process.env.NODE_ENV === "development") {
        connectionString = "ws://localhost:8080";
    } else {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
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
        dispatch(setStatus(msg.status));
        dispatch(setRoundNumber(msg.roundNum));
        dispatch(setCurrentPlayer(msg.currentPlayer));
        dispatch(setCurrentWord(''));
        dispatch(setCurrentCards([]));
        dispatch(setPlayCard(false));
        dispatch(setVoteCard(false));
        dispatch(setPlayWord(false));
        dispatch(setPlayedCard(0));
        dispatch(setVotedCard(0));
        dispatch(playWord(""));
        dispatch(resetFinishRound());
    });

    socket.on("status", msg => {
        dispatch(setStatus(msg.status));
    });

    socket.on("played word", msg => {
        dispatch(setCurrentWord(msg));
    });

    socket.on("play word and card", () => {
        dispatch(setPlayWord(true));
        dispatch(setPlayCard(true));
    });

    socket.on("play card", () => {
        dispatch(setPlayCard(true));
    });

    socket.on("played cards", msg => {
        dispatch(setCurrentCards(msg));
    });

    socket.on("vote", () => {
        dispatch(setVoteCard(true));
    });

    socket.on("all votes", (msg) => {
        dispatch(setAllVotes(msg));
    });

    socket.on("winner", (msg) => {
        dispatch(setWinner(msg));
    });

    socket.on("end", () => {        
        dispatch(setStatus('NOT_STARTED'));
        dispatch(setRoundNumber(0));
        dispatch(setCurrentPlayer(null));
        dispatch(setCurrentWord(''));
        dispatch(setCurrentCards([]));
        dispatch(setPlayCard(false));
        dispatch(setVoteCard(false));
        dispatch(setPlayWord(false));
        dispatch(setPlayedCard(0));
        dispatch(setVotedCard(0));
        dispatch(playWord(""));
        dispatch(resetFinishRound());
        dispatch(setWinner(null));
        dispatch(resetState());
        dispatch(resetPlayerState());
        dispatch(resetCookie());
    });

    return new Promise((resolve, reject) => {
        socket.on('connect', () => {
            dispatch(setSocket(socket));
            resolve()
        });
        socket.on('error', (err) => reject(err));
    })
}

export default connectSocket;

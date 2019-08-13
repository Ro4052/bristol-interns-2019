import io from 'socket.io-client';
import history from './history';
import { dispatch } from '../store/store';
import { setPlayedCards, setVoteCard, setVotedCard } from '../components/PlayedCards/PlayedCardsActions';
import { setPlayCard, resetPlayedCardId, selectCardSuccess, fetchCards } from '../components/MyCards/MyCardsActions';
import { setPlayWord, resetWord } from '../components/PlayWord/PlayWordActions';
import { setPlayers, setCurrentPlayer } from '../components/Players/PlayersActions';
import { setWinner, setDrawers } from '../components/GameOver/GameOverActions';
import { setCurrentWord, setStatus, setRoundNumber } from '../components/Dashboard/DashboardActions';
import { removeCard } from '../components/MyCards/MyCardsActions';
import { setRooms } from '../components/Lobby/LobbyActions';
import { setVoteCardTimer, setPlayCardTimer, setStorytellerTimer } from '../components/Timer/TimerActions';
import { addMessage } from '../components/Chat/ChatActions';

let socket;

export const sendMessage = (username, message) => {
    socket.emit("send message", {username, message});
}

export const connectSocket = () => {
    let connectionString;
    if (process.env.NODE_ENV === "development") {
        connectionString = "ws://localhost:8080";
    } else {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        connectionString = `${wsProtocol}://${window.location.host}`;
    }

    socket = io(connectionString, {
        transports:  ['websocket'],
        upgrade: false
    });

    socket.on("message sent", msg => {
        const { username, message } = msg;        
        dispatch(addMessage(username, message));
    });

    socket.on("players", msg => {
        dispatch(setPlayers(msg.players));
    });

    socket.on("rooms", msg => {
        dispatch(setRooms(msg));
    });

    socket.on("start", () => {
        history.push('/dashboard');
    });

    socket.on("new round", msg => {
        dispatch(setStorytellerTimer(0));
        dispatch(setPlayCardTimer(0));
        dispatch(setVoteCardTimer(0));
        dispatch(setStatus(msg.status));
        dispatch(setRoundNumber(msg.roundNum));
        dispatch(setCurrentPlayer(msg.currentPlayer));
        dispatch(setCurrentWord(''));
        dispatch(setPlayedCards([]));
        dispatch(setPlayCard(false));
        dispatch(setVoteCard(false));
        dispatch(setPlayWord(false));
        dispatch(resetWord());
        dispatch(resetPlayedCardId());
        dispatch(setVotedCard(0));
        dispatch(resetWord());
        dispatch(fetchCards());
    });

    socket.on("status", msg => {
        dispatch(setStatus(msg.status));
    });

    socket.on("played word", msg => {
        dispatch(setCurrentWord(msg));
    });

    socket.on("play word and card", timeoutDuration => {
        dispatch(setStorytellerTimer(timeoutDuration));
        dispatch(setPlayWord(true));
        dispatch(setPlayCard(true));
    });

    socket.on("play card", timeoutDuration => {
        dispatch(setPlayCard(true));
        dispatch(setPlayCardTimer(timeoutDuration));
    });

    socket.on("played card", card => {
        dispatch(selectCardSuccess(card.cardId));
        dispatch(removeCard(card.cardId));
    });

    socket.on("played cards", msg => {
        dispatch(setPlayedCards(msg));
    });

    socket.on("vote", timeoutDuration => {
        dispatch(setVoteCard(true));
        dispatch(setVoteCardTimer(timeoutDuration));
    });

    socket.on("winner", msg => {
        dispatch(setWinner(msg));
        dispatch(setPlayCard(false));
        dispatch(setVoteCard(false));
        dispatch(setPlayWord(false));
    });
    
    socket.on("drawers", (msg) => {
        dispatch(setDrawers(msg));
    });

    socket.on("end", () => {
        dispatch(setStatus('NOT_STARTED'));
        dispatch(setRoundNumber(0));
        dispatch(setCurrentPlayer(null));
        dispatch(setCurrentWord(''));
        dispatch(setPlayedCards([]));
        dispatch(setVotedCard(0));
        dispatch(resetWord());
        dispatch(setWinner(null));
        dispatch(setDrawers([]));
        history.push('/lobby');
    });

    return new Promise((resolve, reject) => {
        socket.on('connect', () => {
            resolve();
        });
        socket.on('error', (err) => reject(err));
    });
}

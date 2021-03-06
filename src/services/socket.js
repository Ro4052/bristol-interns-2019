import io from 'socket.io-client';
import history from './history';
import { dispatch } from '../store/store';
import { setPlayedCards, setVoteCard, setVotedCard } from '../components/PlayedCards/PlayedCardsActions';
import { setPlayCard, resetPlayedCardId, selectCardSuccess, fetchCards } from '../components/MyCards/MyCardsActions';
import { setPlayWord, resetWord } from '../components/Instructions/PlayWord/PlayWordActions';
import { setPlayers, setCurrentPlayer, setScoresForRound } from '../components/Players/PlayersActions';
import { setWinners } from '../components/Instructions/GameOver/GameOverActions';
import { setCurrentWord, setStatus, setRoundNumber } from '../components/Dashboard/DashboardActions';
import { removeCard } from '../components/MyCards/MyCardsActions';
import { setRooms } from '../components/Lobby/LobbyActions';
import { setVoteCardTimer, setPlayCardTimer, setStorytellerTimer } from '../components/Timer/TimerActions';
import { addMessage, resetChat } from '../components/Chat/ChatActions';
import { setGameMode } from '../components/Lobby/CreateRoom/CreateRoomActions';

let socket;

export const sendMessage = message => {
    socket.emit("send message", message);
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

    socket.on("game state", currentGameState => {
        dispatch(setPlayedCards(currentGameState.playedCards));
        dispatch(setPlayCard(currentGameState.playCard));
        dispatch(setPlayWord(currentGameState.playWord));
        dispatch(setVoteCard(currentGameState.voteCard));
        dispatch(setCurrentPlayer(currentGameState.currentPlayer));
    });

    socket.on("message sent", msg => {
        const { senderUsername, message } = msg;
        dispatch(addMessage(senderUsername, message));
    });

    socket.on("players", msg => {
        dispatch(setScoresForRound(msg.players));
        dispatch(setPlayers(msg.players));
    });

    socket.on("rooms", msg => {
        dispatch(setRooms(msg));
    });

    socket.on("start", () => {
        dispatch(resetChat());
        history.push('/dashboard');
    });

    socket.on("new round", msg => {
        dispatch(setStorytellerTimer(0));
        dispatch(setPlayCardTimer(0));
        dispatch(setVoteCardTimer(0));
        dispatch(setGameMode(msg.mode || "original"));
        dispatch(setStatus(msg.status));
        dispatch(setRoundNumber(msg.roundNum, msg.rounds));
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

    socket.on("play word and card", msg => {
        dispatch(setStorytellerTimer(msg.timeoutDuration));
        dispatch(setPlayWord(msg.playWordAndCard));
        dispatch(setPlayCard(msg.playWordAndCard));
    });

    socket.on("play card", msg => {
        dispatch(setPlayCard(msg.playCard));
        dispatch(setPlayCardTimer(msg.timeoutDuration));
    });

    socket.on("played card", card => {
        dispatch(selectCardSuccess(card.cardId));
        dispatch(removeCard(card.cardId));
    });

    socket.on("played cards", cards => {
        dispatch(setPlayedCards(cards));
    });

    socket.on("vote", msg => {
        dispatch(setVoteCard(msg.voteCard));
        dispatch(setVoteCardTimer(msg.timeoutDuration));
    });

    socket.on('winners', winners => {
        dispatch(setWinners(winners));
    });

    socket.on("end", () => {
        dispatch(setPlayedCards([])); 
        dispatch(setPlayCard(false));
        dispatch(setVoteCard(false));
        dispatch(setPlayWord(false));
    });

    return new Promise((resolve, reject) => {
        socket.on('connect', () => {
            resolve();
        });
        socket.on('error', (err) => reject(err));
    });
}

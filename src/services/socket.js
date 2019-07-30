import io from 'socket.io-client';
import history from './history';
import { dispatch } from '../store/store';
import { setPlayedCards, setVoteCard, setVotedCard, setAllVotes } from '../components/PlayedCards/PlayedCardsActions';
import { setPlayCard, resetPlayedCardId, selectCardSuccess } from '../components/MyCards/MyCardsActions';
import { playWord, setPlayWord, resetWord } from '../components/PlayWord/PlayWordActions';
import { setPlayers, setCurrentPlayer } from '../components/Players/PlayersActions';
import { setWinner } from '../components/GameOver/GameOverActions';
import { setCurrentWord, setStatus, setRoundNumber } from '../components/Dashboard/DashboardActions';
import { resetFinishRound } from '../components/PlayerInteractions/PlayerInteractionsActions';
import { removeCard } from '../components/MyCards/MyCardsActions';
import { setRooms } from '../components/Lobby/LobbyActions';
import { setVoteCardTimer, setPlayCardTimer } from '../components/Timer/TimerActions';

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

    socket.on("rooms", msg => {
        dispatch(setRooms(msg));
    });

    socket.on("start", () => {
        history.push('/dashboard');
    });

    socket.on("new round", msg => {        
        dispatch(setStatus(msg.status));
        dispatch(setRoundNumber(msg.roundNum));
        dispatch(setCurrentPlayer(msg.currentPlayer));
        dispatch(setCurrentWord(''));
        dispatch(setPlayedCards({cards: [], hidden: true}));
        dispatch(setPlayCard(false));
        dispatch(setVoteCard(false));
        dispatch(setPlayWord(false));
        dispatch(resetWord());
        dispatch(resetPlayedCardId());
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

    socket.on("play card", (timeoutDuration) => {
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

    socket.on("vote", (timeoutDuration) => {
        dispatch(setVoteCard(true));
        dispatch(setVoteCardTimer(timeoutDuration));
    });

    socket.on("all votes", (msg) => {
        dispatch(setAllVotes(msg));
        dispatch(setVoteCard(false));
    });

    socket.on("winner", (msg) => {
        dispatch(setWinner(msg));
    });

    socket.on("end", () => {        
        dispatch(setStatus('NOT_STARTED'));
        dispatch(setRoundNumber(0));
        dispatch(setCurrentPlayer(null));
        dispatch(setCurrentWord(''));
        dispatch(setPlayedCards({cards: [], hidden: true}));
        dispatch(setPlayCard(false));
        dispatch(setVoteCard(false));
        dispatch(setPlayWord(false));
        dispatch(setVotedCard(0));
        dispatch(playWord(""));
        dispatch(resetFinishRound());
        dispatch(setWinner(null));
        history.push('/lobby');
    });

    return new Promise((resolve, reject) => {
        socket.on('connect', () => {
            resolve();
        });
        socket.on('error', (err) => reject(err));
    });
}

export default connectSocket;

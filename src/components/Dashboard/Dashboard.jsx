import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import styles from './Dashboard.module.css';
import Logout from './Logout/Logout';
import Monster from '../Monster/Monster';
import PlayedCards from '../PlayedCards/PlayedCards';
import MyCards from '../MyCards/MyCards';
import Players from '../Players/Players';
import StartGame from './StartGame/StartGame';
import GameOver from '../GameOver/GameOver';
import PlayerInteractions from '../PlayerInteractions/PlayerInteractions';

export class Dashboard extends React.Component {
    createRoom() {
        axios.get('/api/room/create')
        .catch((err) => {
            console.log(err.message);
        })
    }

    render() {
        const showPlayerInteractions = (this.props.playCard || this.props.playWord || this.props.voteCard)
                                    || ((this.props.currentPlayer) && 
                                        (!this.props.finishedRound && 
                                        this.props.cookie === this.props.currentPlayer.username && 
                                        this.props.playedCard !== 0));
        return (
            <div className={styles.dashboard}>
                <button data-cy="create-room" onClick={this.createRoom}>Create Room</button>
                {this.props.status === "NOT_STARTED" && <StartGame />}
                {this.props.status !== "NOT_STARTED" && <h2>Round: <span id="round-number" data-cy="round-number">{this.props.roundNum}</span></h2>}
                {this.props.currentPlayer && <h2>Current player: <span id="current-player" data-cy="current-player">{this.props.currentPlayer.username}</span></h2>}
                {this.props.winner && <GameOver />}
                {this.props.currentWord !== '' && <h1 id="message">Word: <span data-cy='current-word'>{this.props.currentWord}</span></h1>}
                <Players />
                <PlayedCards />
                {this.props.status !== "NOT_STARTED" && <MyCards />}
                {showPlayerInteractions && <PlayerInteractions />}
                <Logout />
                <Monster />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    status: state.gameReducer.status,
    roundNum: state.gameReducer.roundNum,
    currentPlayer: state.gameReducer.currentPlayer,
    playCard: state.playerReducer.playCard,
    playWord: state.playerReducer.playWord,
    voteCard: state.playerReducer.voteCard,
    currentWord: state.gameReducer.currentWord,
    winner: state.gameReducer.winner,
    finishedRound: state.playerReducer.finishedRound,
    myWord: state.playerReducer.myWord,
    playedCard: state.playerReducer.playedCard,
    cookie: state.playerReducer.cookie
});

export default connect(mapStateToProps)(Dashboard);

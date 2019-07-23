import React from 'react';
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
import { CreateRoom } from './CreateRoom/CreateRoom';

export class Dashboard extends React.Component {
    render() {
        const showPlayerInteractions = (this.props.playCard || this.props.playWord || this.props.voteCard)
                                    || ((this.props.currentPlayer) && 
                                        (!this.props.finishedRound && 
                                        this.props.username === this.props.currentPlayer.username && 
                                        this.props.playedCardId));
        return (
            <div className={styles.dashboard}>
                <CreateRoom />
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
    status: state.dashboardReducer.status,
    roundNum: state.dashboardReducer.roundNum,
    currentWord: state.dashboardReducer.currentWord,
    currentPlayer: state.playersReducer.currentPlayer,
    playCard: state.myCardsReducer.playCard,
    playWord: state.playWordReducer.playWord,
    voteCard: state.playedCardsReducer.voteCard,
    winner: state.gameOverReducer.winner,
    finishedRound: state.myCardsReducer.finishedRound,
    myWord: state.playWordReducer.word,
    playedCardId: state.myCardsReducer.playedCardId,
    username: state.authReducer.username
});

export default connect(mapStateToProps)(Dashboard);

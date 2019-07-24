import React from 'react';
import { connect } from 'react-redux';
import styles from './Dashboard.module.css';
import Logout from '../Logout/Logout';
import Monster from '../Monster/Monster';
import PlayedCards from '../PlayedCards/PlayedCards';
import MyCards from '../MyCards/MyCards';
import Players from '../Players/Players';
import StartGame from '../StartGame/StartGame';
import GameOver from '../GameOver/GameOver';
import PlayerInteractions from '../PlayerInteractions/PlayerInteractions';
import CreateRoom from '../CreateRoom/CreateRoom';
import Dixit from '../Dixit/Dixit';

export class Dashboard extends React.Component {
    render() {
        const showPlayerInteractions = (this.props.playCard || this.props.playWord || this.props.voteCard)
                                    || ((this.props.currentPlayer) && 
                                        (!this.props.finishedRound && 
                                        this.props.username === this.props.currentPlayer.username && 
                                        this.props.playedCardId));
        return (
            <div className={styles.dashboard}>
                <div className={styles.header}>
                    <Logout />
                    <div className={styles.logo}>
                        <Dixit />
                    </div>
                </div>
                <div className={styles.main}>
                    <div className={styles.left}>
                        <div className={styles.gameInfo}>
                            {this.props.status !== "NOT_STARTED" && <h2>Round: <span id="round-number" data-cy="round-number">{this.props.roundNum}</span></h2>}
                            {this.props.currentWord !== '' && <h2 id="message">Word: <span data-cy='current-word'>{this.props.currentWord}</span></h2>}
                            <Players />
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.interactions}>
                            {this.props.status === "NOT_STARTED" && <StartGame />}
                            {showPlayerInteractions && <PlayerInteractions />}
                            {this.props.winner && <GameOver />}
                            {this.props.status !== "GAME_OVER" && <PlayedCards />}
                        </div>
                        {this.props.status !== "NOT_STARTED" && this.props.status !== "GAME_OVER" && <MyCards />}
                    </div>
                </div>
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
    finishedRound: state.playerInteractionsReducer.finishedRound,
    playedCardId: state.myCardsReducer.playedCardId,
    username: state.authReducer.username,
    winner: state.gameOverReducer.winner
});

export default connect(mapStateToProps)(Dashboard);

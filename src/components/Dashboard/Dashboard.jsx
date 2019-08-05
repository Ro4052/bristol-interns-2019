import React from 'react';
import { connect } from 'react-redux';
import styles from './Dashboard.module.css';
import Monster from '../Monster/Monster';
import PlayedCards from '../PlayedCards/PlayedCards';
import MyCards from '../MyCards/MyCards';
import Players from '../Players/Players';
import GameOver from '../GameOver/GameOver';
import PlayerInteractions from '../PlayerInteractions/PlayerInteractions';
import Timer from '../Timer/Timer';
import { setVoteCardTimer, setPlayCardTimer, setStorytellerTimer } from '../Timer/TimerActions';
import Dixit from '../Dixit/Dixit';
import { authenticateUser } from '../Login/LoginActions';
import PlayWord from '../PlayWord/PlayWord';

export class Dashboard extends React.Component {

    componentDidMount() {
        this.props.authenticateUser();
    }

    render() {
        const showPIright = (this.props.voteCard || this.props.word || (!this.props.playWord && this.props.playCard)) && !(this.props.winner || this.props.drawers.length > 1);
        const showPImiddle = this.props.playWord && !this.props.word && !(this.props.winner || this.props.drawers.length > 1);
        return (
            <div className={styles.dashboard}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <Dixit />
                    </div>
                </div>
                <div className={styles.main}>
                    <div className={styles.side}>
                        {(this.props.status === 'WAITING_FOR_CURRENT_PLAYER' && this.props.storytellerDuration > 0) && <Timer cy="storyteller-timer" setDuration={this.props.setStorytellerTimer} duration={this.props.storytellerDuration} />}
                        {(this.props.status === 'WAITING_FOR_OTHER_PLAYERS' && this.props.playCardDuration > 0) && <Timer cy="card-timer" setDuration={this.props.setPlayCardTimer} duration={this.props.playCardDuration} />}
                        {(this.props.status === 'WAITING_FOR_VOTES' && this.props.voteCardDuration > 0) && <Timer cy="vote-timer" setDuration={this.props.setVoteCardTimer} duration={this.props.voteCardDuration} />}
                        <div className={styles.gameInfo}>
                            {this.props.status !== "NOT_STARTED" && <h2>Round: <span id="round-number" data-cy="round-number">{this.props.roundNum}</span></h2>}
                            <Players />
                        </div>
                    </div>
                    <div className={styles.middle}>
                        <div className={styles.playWord}>
                            {showPImiddle && <PlayWord />}
                            {(this.props.winner || this.props.drawers.length > 1) && <GameOver />}
                            {this.props.status !== "GAME_OVER" && <PlayedCards />}
                        </div>
                        {this.props.status !== "NOT_STARTED" && this.props.status !== "GAME_OVER" && <MyCards />}
                    </div>
                    <div className={styles.side}>
                        <div className={styles.interactions}>
                            {showPIright && <PlayerInteractions />}
                        </div>
                        <Monster />
                    </div>
                </div>
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
    winner: state.gameOverReducer.winner,
    drawers: state.gameOverReducer.drawers,
    playCardDuration: state.timerReducer.playCardDuration,
    voteCardDuration: state.timerReducer.voteCardDuration,
    storytellerDuration: state.timerReducer.storytellerDuration,
    word: state.playWordReducer.word
});

const mapDispatchToProps = (dispatch) => ({
    setPlayCardTimer: duration => dispatch(setPlayCardTimer(duration)),
    setVoteCardTimer: duration => dispatch(setVoteCardTimer(duration)),
    setStorytellerTimer: duration => dispatch(setStorytellerTimer(duration)),
    authenticateUser: () => dispatch(authenticateUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

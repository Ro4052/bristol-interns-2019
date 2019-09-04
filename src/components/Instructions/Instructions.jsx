import React from 'react';
import { connect } from 'react-redux';
import styles from './Instructions.module.css';
import Timothy from '../Timothy/Timothy';
import GameOver from './GameOver/GameOver';
import PlayerInteractions from './PlayerInteractions/PlayerInteractions';
import PlayWord from './PlayWord/PlayWord';
import Timer from '../Timer/Timer';
import { setVoteCardTimer, setPlayCardTimer, setStorytellerTimer, requestNextRound } from '../Timer/TimerActions';
import { statusTypes } from '../../services/statusTypes';

export class Instructions extends React.Component {
    render() {
        const { playWord, playedCardId, winners, word } = this.props;
        const isGameOver = winners.length > 0;
        const hasPlayedWord = word;
        const hasPlayedCard = playedCardId;
        const showPlayerInteractions = (!playWord || hasPlayedWord || !hasPlayedCard) && !isGameOver;
        const showPlayWord = playWord && !hasPlayedWord && hasPlayedCard && !isGameOver;
        return (
            <div className={styles.instructions}>
                <div className={styles.box}>
                    {showPlayerInteractions && <PlayerInteractions />}
                    {showPlayWord && <PlayWord />}
                    {isGameOver && <GameOver />}
                    {(this.props.status === statusTypes.WAITING_FOR_CURRENT_PLAYER && this.props.storytellerDuration > 0) && <Timer cy="storyteller-timer" setDuration={this.props.setStorytellerTimer} duration={this.props.storytellerDuration} />}
                    {(this.props.status === statusTypes.WAITING_FOR_OTHER_PLAYERS && this.props.playCardDuration > 0) && <Timer cy="card-timer" setDuration={this.props.setPlayCardTimer} duration={this.props.playCardDuration} />}
                    {(this.props.status === statusTypes.WAITING_FOR_VOTES && this.props.voteCardDuration > 0) && <Timer cy="vote-timer" setDuration={this.props.setVoteCardTimer} duration={this.props.voteCardDuration} />}
                </div>
                <div className={styles.timothy}>
                    <div className={styles.circle1}/>
                    <div className={styles.circle2}/>
                    <div className={styles.circle3}/>
                    <Timothy />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    status: state.dashboardReducer.status,
    playWord: state.playWordReducer.playWord,
    playedCardId: state.myCardsReducer.playedCardId,
    winners: state.gameOverReducer.winners,
    word: state.playWordReducer.word,
    playCardDuration: state.timerReducer.playCardDuration,
    voteCardDuration: state.timerReducer.voteCardDuration,
    storytellerDuration: state.timerReducer.storytellerDuration,
});

const mapDispatchToProps = dispatch => ({
    setPlayCardTimer: duration => dispatch(setPlayCardTimer(duration)),
    setVoteCardTimer: duration => dispatch(setVoteCardTimer(duration)),
    setStorytellerTimer: duration => dispatch(setStorytellerTimer(duration)),
    requestNextRound: () => dispatch(requestNextRound())
});

export default connect(mapStateToProps, mapDispatchToProps)(Instructions);

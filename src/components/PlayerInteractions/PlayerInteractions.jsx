import React from 'react';
import { connect } from 'react-redux';
import Timer from '../Timer/Timer';
import styles from './PlayerInteractions.module.css';
import classNames from 'classnames/bind';
import { setVoteCardTimer, setPlayCardTimer, setStorytellerTimer, requestNextRound } from '../Timer/TimerActions';
import { statusTypes } from '../../services/statusTypes';

const cx = classNames.bind(styles);

export class PlayerInteractions extends React.Component {
    render() {
        return (
            <div className={cx(styles.playerInteractions, {votePrompt: this.props.voteCard})}>
                <div>
                    {(this.props.status === statusTypes.WAITING_FOR_CURRENT_PLAYER && this.props.storytellerDuration > 0) && <Timer cy="storyteller-timer" setDuration={this.props.setStorytellerTimer} duration={this.props.storytellerDuration} />}
                    {(this.props.status === statusTypes.WAITING_FOR_OTHER_PLAYERS && this.props.playCardDuration > 0) && <Timer cy="card-timer" setDuration={this.props.setPlayCardTimer} duration={this.props.playCardDuration} />}
                    {(this.props.status === statusTypes.WAITING_FOR_VOTES && this.props.voteCardDuration > 0) && <Timer cy="vote-timer" setDuration={this.props.setVoteCardTimer} duration={this.props.voteCardDuration} />}
                </div>
                <div className={styles.text}>
                    {this.props.currentWord && (
                        this.props.username === this.props.currentPlayer.username ?
                        <span>You picked the word <span data-cy="current-word">"{this.props.currentWord}"</span>. </span> :
                        <span>The storyteller picked the word <span data-cy="current-word">"{this.props.currentWord}"</span>. </span>
                    )}
                    {this.props.status === statusTypes.WAITING_FOR_CURRENT_PLAYER && !this.props.playCard && !this.props.voteCard && <span data-cy='wait-for-storyteller' className={styles.justWait}>Waiting for the storyteller...</span>}
                    {this.props.playCard && !this.props.playedCardId && this.props.currentWord && <span data-cy="play-card">Pick a card from your hand that this word describes.</span>}
                    {this.props.playCard && !this.props.playedCardId && !this.props.currentWord && <span data-cy="play-card">You are the storyteller! Pick a card from your hand.</span>}
                    {this.props.voteCard && <span data-cy="vote-card">Vote on which card you think belonged to the storyteller.</span>}
                    {this.props.status === statusTypes.WAITING_FOR_OTHER_PLAYERS && this.props.playCardDuration > 0 && !this.props.playCard && <span data-cy='wait-for-cards' className={styles.justWait}>Waiting for other players to pick cards...</span>}
                    {this.props.status === statusTypes.WAITING_FOR_VOTES && this.props.voteCardDuration > 0 && !this.props.voteCard && <span data-cy='wait-for-votes' className={styles.justWait}>Waiting for the other players to vote...</span>}
                    {this.props.status === statusTypes.DISPLAY_ALL_VOTES && <button onClick={this.props.requestNextRound} data-cy='next-round'>Next round</button>}
                    {this.props.error && <span data-cy='error'>Error: {this.props.error}</span>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    status: state.dashboardReducer.status,
    playCard: state.myCardsReducer.playCard,
    voteCard: state.playedCardsReducer.voteCard,
    word: state.playWordReducer.word,
    playedCardId: state.myCardsReducer.playedCardId,
    currentWord: state.dashboardReducer.currentWord,
    playCardDuration: state.timerReducer.playCardDuration,
    voteCardDuration: state.timerReducer.voteCardDuration,
    storytellerDuration: state.timerReducer.storytellerDuration,
    error: state.timerReducer.error,
    currentPlayer: state.playersReducer.currentPlayer,
    username: state.authReducer.username
});

const mapDispatchToProps = dispatch => ({
    setPlayCardTimer: duration => dispatch(setPlayCardTimer(duration)),
    setVoteCardTimer: duration => dispatch(setVoteCardTimer(duration)),
    setStorytellerTimer: duration => dispatch(setStorytellerTimer(duration)),
    requestNextRound: () => dispatch(requestNextRound())
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerInteractions);

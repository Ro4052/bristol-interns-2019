import React from 'react';
import { connect } from 'react-redux';
import Prompt from '../shared/Prompt/Prompt';
import Timer from '../Timer/Timer';
import styles from './PlayerInteractions.module.css';
import classNames from 'classnames/bind';
import { setVoteCardTimer, setPlayCardTimer, setStorytellerTimer } from '../Timer/TimerActions';

const cx = classNames.bind(styles);

export class PlayerInteractions extends React.Component {
    render() {
        return (
            <div className={cx(styles.playerInteractions, {votePrompt: this.props.voteCard})}>
                {this.props.status === 'WAITING_FOR_CURRENT_PLAYER' && !this.props.playCard && !this.props.voteCard && <h2 data-cy='wait-for-storyteller' className={styles.justWait}>Waiting for the storyteller to play their turn</h2>}
                {this.props.currentWord !== '' && <h2 className={styles.word} id="message">Word: <span data-cy='current-word'>"{this.props.currentWord}"</span></h2>}
                {this.props.playCard && !this.props.playedCardId && <Prompt cy="play-card" text={(this.props.currentWord ? "Pick the card from your hand that the word best fits" : "Pick a card")} />}
                {this.props.voteCard && <Prompt cy="vote-card" text="Vote for the card from the list of played cards that the word best fits" />}
                {(this.props.status === 'WAITING_FOR_CURRENT_PLAYER' && this.props.storytellerDuration > 0) && <Timer cy="storyteller-timer" setDuration={this.props.setStorytellerTimer} duration={this.props.storytellerDuration} />}
                {(this.props.status === 'WAITING_FOR_OTHER_PLAYERS' && this.props.playCardDuration > 0) && <Timer cy="card-timer" setDuration={this.props.setPlayCardTimer} duration={this.props.playCardDuration} />}
                {this.props.status === 'WAITING_FOR_OTHER_PLAYERS' && this.props.playCardDuration > 0 && !this.props.playCard && <h2 data-cy='wait-for-cards' className={styles.justWait}>Waiting for the other players to play their cards</h2>}
                {(this.props.status === 'WAITING_FOR_VOTES' && this.props.voteCardDuration > 0) && <Timer cy="vote-timer" setDuration={this.props.setVoteCardTimer} duration={this.props.voteCardDuration} />}
                {this.props.status === 'WAITING_FOR_VOTES' && this.props.voteCardDuration > 0 && !this.props.voteCard && <h2 data-cy='wait-for-votes' className={styles.justWait}>Waiting for the other players to vote</h2>}
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
});

const mapDispatchToProps = dispatch => ({
    setPlayCardTimer: duration => dispatch(setPlayCardTimer(duration)),
    setVoteCardTimer: duration => dispatch(setVoteCardTimer(duration)),
    setStorytellerTimer: duration => dispatch(setStorytellerTimer(duration)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerInteractions);

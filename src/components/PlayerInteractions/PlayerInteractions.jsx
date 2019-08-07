import React from 'react';
import { connect } from 'react-redux';
import Prompt from '../shared/Prompt/Prompt';
import styles from './PlayerInteractions.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export class PlayerInteractions extends React.Component {
    render() {
        return (
            <div className={cx(styles.playerInteractions, {votePrompt: this.props.voteCard})}>
                {this.props.status === 'WAITING_FOR_CURRENT_PLAYER' && !this.props.playCard && !this.props.voteCard &&<h2 data-cy='wait-for-storyteller' className={styles.justWait} id="justWait">Waiting for the storyteller to play their turn</h2>}
                {this.props.currentWord !== '' && <h2 className={styles.word} id="message">Word: <span data-cy='current-word'>"{this.props.currentWord}"</span></h2>}
                {this.props.playCard && !this.props.playedCardId && (this.props.currentWord ? <Prompt cy="play-card" text="Pick a card that the word best fits" /> : <Prompt cy="play-card" text="Pick a card" />)}
                {this.props.voteCard && <Prompt cy="vote-card" text="Vote for the card that the word best fits" />}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    status: state.dashboardReducer.status,
    playCard: state.myCardsReducer.playCard,
    voteCard: state.playedCardsReducer.voteCard,
    word: state.playWordReducer.word,
    playedCardId: state.myCardsReducer.playedCardId,
    currentWord: state.dashboardReducer.currentWord
});

export default connect(mapStateToProps)(PlayerInteractions);

import React from 'react';
import { connect } from 'react-redux';
import Prompt from '../shared/Prompt/Prompt';
import PlayWord from '../PlayWord/PlayWord';
import { endTurn } from './PlayerInteractionsActions';
import styles from './PlayerInteractions.module.css';
import classNames from 'classnames/bind';
import Button from '../shared/Button/Button';

const cx = classNames.bind(styles);

export class PlayerInteractions extends React.Component {
    render() {
        return (
            <div className={cx(styles.playerInteractions, {votePrompt: this.props.voteCard})}>
                {this.props.playWord && <Prompt cy="play-word" text="Type in a word" />}
                {this.props.playCard && <Prompt cy="play-card" text="Pick a card" />}
                {this.props.playWord && <PlayWord />}
                {this.props.voteCard && <Prompt cy="vote-card" text="Vote for a card" />}
                {this.props.word && this.props.playedCardId && !this.props.finishedRound && <Button cy="end-turn" handleClick={this.props.endTurn} text="End my turn" />}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    playCard: state.myCardsReducer.playCard,
    playWord: state.playWordReducer.playWord,
    voteCard: state.playedCardsReducer.voteCard,
    finishedRound: state.playerInteractionsReducer.finishedRound,
    word: state.playWordReducer.word,
    playedCardId: state.myCardsReducer.playedCardId
});

const mapDispatchToProps = (dispatch) => ({
    endTurn: () => dispatch(endTurn())
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerInteractions);

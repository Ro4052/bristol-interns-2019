import React from 'react';
import { connect } from 'react-redux';
import Prompt from '../shared/Prompt/Prompt';
import PlayWord from '../PlayWord/PlayWord';
import EndTurn from '../Dashboard/EndTurn/EndTurn';
import styles from './PlayerInteractions.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export class PlayerInteractions extends React.Component {
    render() {
        return (
            <div className={cx(styles.playerInteractions, {votePrompt: this.props.voteCard})}>
                {this.props.playWord && <Prompt cy="play-word" text="Type in a word" />}
                {this.props.playCard && <Prompt cy="play-card" text="Pick a card" />}
                {this.props.playWord && <PlayWord />}
                {this.props.voteCard && <Prompt cy="vote-card" text="Vote for a card" />}
                {this.props.myWord && this.props.playedCard !== 0 && !this.props.finishedRound && <EndTurn />}
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
    playedCard: state.playerReducer.playedCard
});

export default connect(mapStateToProps)(PlayerInteractions);

import React from 'react';
import { connect } from 'react-redux';
import styles from './Dashboard.module.css';
import EndTurn from './EndTurn/EndTurn';
import Logout from './Logout/Logout';
import Monster from '../Monster/Monster';
import NewGame from './NewGame/NewGame';
import PlayedCards from '../Cards/PlayedCards/PlayedCards';
import MyCards from '../Cards/MyCards/MyCards';
import Players from '../Players/Players';
import PlayWord from '../PlayWord/PlayWord';
import Prompt from '../Prompt/Prompt';
import StartGame from './StartGame/StartGame';

export class Dashboard extends React.Component {
    render() {
        return (
            <div className={styles.roundInfo}>
                {this.props.status === "NOT_STARTED" && <StartGame />}
                {this.props.status !== "NOT_STARTED" && <h2>Round: <span id="round-number" data-cy="round-number">{this.props.roundNum}</span></h2>}
                {this.props.currentPlayer && <h2>Current player: <span id="current-player" data-cy="current-player">{this.props.currentPlayer.username}</span></h2>}
                {this.props.winner && 
                    <div className={styles.gameOverBox}>
                        <h2 className={styles.winnerText}>Winner is: <span>{this.props.winner.username}</span></h2>
                        <NewGame />
                    </div>
                }
                {this.props.currentWord !== '' && <h1 id="message">Word: <span data-cy='current-word'>{this.props.currentWord}</span></h1>}
                <Players />
                <PlayedCards />
                <MyCards />
                <div className={styles.playerInteractions}>
                    {this.props.playWord && <Prompt cy="play-word" text="Type in a word" />}
                    {this.props.playCard && <Prompt cy="play-card" text="Pick a card" />}
                    {this.props.playWord && <PlayWord />}
                    {this.props.voteCard && <Prompt cy="vote-card" text="Vote for a card" />}
                    {this.props.myWord && this.props.playedCard !== 0 && !this.props.finishedRound && <EndTurn />}
                </div>
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
    playedCard: state.playerReducer.playedCard
});

export default connect(mapStateToProps)(Dashboard);

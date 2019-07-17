import React from 'react';
import { connect } from 'react-redux';
import PlayerCards from '../Cards/PlayerCards/PlayerCards';
import LogoutButton from './LogoutButton/LogoutButton';
import Players from '../Players/Players';
import style from './Dashboard.module.css';
import { finishPlayCard } from '../../store/playerActions';
import { Prompt } from '../Prompt/Prompt';
import PlayWord from '../PlayWord/PlayWord';
import PlayedCards from '../Cards/PlayedCards/PlayedCards';
import axios from 'axios';
import { StartGameButton } from './StartGameButton/StartGameButton';
import EndTurnButton from './EndTurnButton/EndTurnButton';
import Monster from '../Monster/Monster';

export class Dashboard extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {}
        this.newGame = this.newGame.bind(this);
    }

    startGame() {
        axios.get('/api/start')
        .catch(err => {
            console.log(err);
        });
    }

    newGame() {
        axios.get('/api/end')
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className={style.roundInfo}>
                {this.props.status === "NOT_STARTED" && <StartGameButton />}
                {this.props.status !== "NOT_STARTED" && <h2>Round: <span id="round-number" data-cy="round-number">{this.props.roundNum}</span></h2>}
                {this.props.currentPlayer && <h2>Current player: <span id="current-player" data-cy="current-player">{this.props.currentPlayer.username}</span></h2>}
                {this.props.winner && 
                    <div className={style.gameOverBox}>
                        <h2 className={style.winnerText}>Winner is: <span>{this.props.winner.username}</span></h2>
                        <button id="start-game" onClick={this.newGame}>New game</button>
                    </div>
                }
                {this.props.currentWord !== '' && <h1 id="message">Word: <span data-cy='current-word'>{this.props.currentWord}</span></h1>}
                <Players />
                <PlayedCards />
                {this.props.status !=="NOT_STARTED" && <PlayerCards />}
                {this.props.playWord && <Prompt cy="play-word" text="Type in a word" />}
                {this.props.playCard && <Prompt cy="play-card" text="Pick a card" />}
                {this.props.playWord && <PlayWord />}
                {this.props.voteCard && <Prompt cy="vote-card" text="Vote for a card" />}
                {this.props.myWord && this.props.playedCard !== 0 && !this.props.finishedRound && <EndTurnButton />}
                <LogoutButton />
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

const mapDispatchToProps = (dispatch) => ({
    finishPlayCard: (id) => dispatch(finishPlayCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

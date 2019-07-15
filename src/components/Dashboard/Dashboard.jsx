import React from 'react';
import { connect } from 'react-redux';
import PlayerCards from '../Cards/PlayerCards';
import LogoutButton from '../Login/LogoutButton';
import Players from '../PlayerInfo/Players/Players';
import style from './Dashboard.module.css';
import { finishPlayCard } from '../../store/playerActions';
import { Prompt } from '../Prompt/Prompt';
import PlayWordAndCard from '../PlayerInfo/PlayWordAndCard/PlayWordAndCard';
import PlayedCards from '../Cards/PlayedCards/PlayedCards';
import axios from 'axios';
import { StartGameButton } from './StartGameButton/StartGameButton';

export class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.newGame = this.newGame.bind(this);
    }

    deleteAllCookies() {
        let cookies = document.cookie.split(";");
        cookies.forEach((cookie) => {
            let eqPos = cookie.indexOf("=");
            let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1975 00:00:00 GMT";
        });
    }

    newGame() {
        axios.get('/api/end')
        .catch(err => {
            console.log(err);
        });
        this.deleteAllCookies();
        this.props.history.push('/');
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
                <PlayerCards />
                {this.props.playWordAndCard && !this.props.finishedRound && <PlayWordAndCard />}
                {this.props.playCard && <Prompt cy="play-card" text="Pick a card" />}
                {this.props.voteCard && this.props.votedCard === 0 && <Prompt cy="vote-card" text="Vote for a card" />}
                <LogoutButton />
                <div className={style.ufo}>
                    <div className={style.monster}>
                        <div className={style.body}>
                            <div className={style.ear}></div>
                            <div className={style.ear}></div>
                            <div className={style.vampimouth}>
                                <div className={style.vampitooth}></div>
                            </div>
                        </div>
                        <div className={style.eyelid}>
                            <div className={style.eyes}>
                                <div className={style.eye}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
        status: state.gameReducer.status,
        roundNum: state.gameReducer.roundNum,
        currentPlayer: state.gameReducer.currentPlayer,
        playWordAndCard: state.playerReducer.playWordAndCard,
        playCard: state.playerReducer.playCard,
        voteCard: state.playerReducer.voteCard,
        votedCard: state.playerReducer.votedCard,
        currentWord: state.gameReducer.currentWord,
        winner: state.gameReducer.winner,
        finishedRound: state.playerReducer.finishedRound,
});

const mapDispatchToProps = (dispatch) => ({
    finishPlayCard: (id) => dispatch(finishPlayCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

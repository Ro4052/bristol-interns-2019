import React from 'react';
import { connect } from 'react-redux';
import PlayerCards from '../Cards/PlayerCards';
import LogoutButton from '../Login/LogoutButton';
import Players from '../PlayerInfo/Players/Players';
import style from './Dashboard.module.css';
import { finishPlayCard } from '../../store/playerActions';
import { PlayCard } from '../PlayerInfo/PlayCard/PlayCard';
import { VoteCard } from '../PlayerInfo/VoteCard/VoteCard';
import PlayWordAndCard from '../PlayerInfo/PlayWordAndCard/PlayWordAndCard';
import PlayedCards from '../Cards/PlayedCards/PlayedCards';
import axios from 'axios';

export class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    startGame() {
        axios.get('/api/start')
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className={style.roundInfo}>
                {this.props.status === "NOT_STARTED" && <button id="start-game" data-cy="start-game" onClick={this.startGame}>Start game</button>}
                {this.props.status !== "NOT_STARTED" && <h2>Round: <span id="round-number">{this.props.roundNum}</span></h2>}
                {this.props.currentPlayer && <h2>Current player: <span id="current-player">{this.props.currentPlayer.username}</span></h2>}
                {this.props.currentWord !== '' && <h1 id="message">Word: <span data-cy='current-word'>{this.props.currentWord}</span></h1>}
                <Players />
                <PlayedCards />
                <PlayerCards />
                {this.props.playWordAndCard && !this.props.finishedRound && <PlayWordAndCard />}
                {this.props.playCard && <PlayCard />}
                {this.props.voteCard && <VoteCard />}
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

const mapStateToProps = (state) => {
    return ({
        status: state.gameReducer.status,
        roundNum: state.gameReducer.roundNum,
        currentPlayer: state.gameReducer.currentPlayer,
        playWordAndCard: state.playerReducer.playWordAndCard,
        playCard: state.playerReducer.playCard,
        voteCard: state.playerReducer.voteCard,
        currentWord: state.gameReducer.currentWord,
        finishedRound: state.playerReducer.finishedRound,
        

    });
}

const mapDispatchToProps = (dispatch) => ({
    finishPlayCard: (id) => dispatch(finishPlayCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

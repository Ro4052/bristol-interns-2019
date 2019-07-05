import React from 'react';
import { connect } from 'react-redux';
import AllCards from '../Cards/AllCards'
import Message from '../Message/Message'
import PlayerCards from '../Cards/PlayerCards';
import LogoutButton from '../Login/LogoutButton'
import style from './Dashboard.module.css';
import axios from 'axios';
import { setGameState, setSocket } from '../../store/actions';
import connectSocket from '../../services/socket';
import { dispatch } from '../../store/store';
import { finishPlayCard } from '../../store/playerActions';

export class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.startGame = this.startGame.bind(this);
        this.endTurn = this.endTurn.bind(this);
    }
    startGame() {
        axios.get('/api/start')
        .then(res => {
            // console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
    }
    endTurn() {        
        if (this.props.myWord && this.props.playedCard) {
            axios.post('/api/playCardWord', {
                card: this.props.playedCard,
                word: this.props.myWord
            })
            .then(() => {
                this.props.finishPlayCard(this.props.playedCard)
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
    componentDidMount() {
        // If log in succeeds, connect to the socket
        const socket = connectSocket();
        dispatch(setSocket(socket));
    }
    render() {
        const startGameButton = <button id="start-game" onClick={this.startGame}>Start game</button>;
        const nextTurnButton = this.props.myTurn && <button id="end-turn" onClick={this.endTurn}>End my turn</button>;
        const pickWordText = (this.props.myTurn && !this.props.myWord) ? <h3>Type in a word</h3> : "";
        const pickCardText = ((this.props.myTurn || this.props.othersTurn) && !this.props.playedCard) ? <h3>Pick a card</h3> : "";
        return (
            <div className={style.roundInfo}>
                {this.props.gameState.started && <h2>Round: <span id="round-number">{this.props.gameState.roundNum}</span></h2>}
                <div className={style.currentPlayersBox}>
                    <h3>Players:</h3>
                    <ul id="players">
                        {this.props.gameState.players.map((player, key) => {
                            return <li key={key}>{player.username}</li>
                        })}
                    </ul>
                </div>
                <h2>Current player: {this.props.gameState.currentPlayer && <span id="current-player">{this.props.gameState.currentPlayer.username}</span>}</h2>
                <AllCards />
                <PlayerCards />
                <div className={style.playerInteractions}>
                    {pickWordText}
                    {(pickCardText && pickWordText) ? <h3>{"&"}</h3> : ""}
                    {pickCardText}
                    {!(pickCardText || pickWordText) && this.props.gameState.myTurn ? <h3>Now click "End my turn"</h3> : ""}
                    <Message />
                    {this.props.gameState.started ? nextTurnButton : startGameButton}
                </div>
                <LogoutButton/>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return({
        socket: state.reducer.socket,
        gameState: state.reducer.gameState,
        myWord: state.playerReducer.myWord,
        myTurn: state.playerReducer.myTurn,
        othersTurn: state.playerReducer.othersTurn,
        playedCard: state.playerReducer.playedCard
    });
}

const mapDispatchToProps = (dispatch) => ({
    setGameState: gameState => dispatch(setGameState(gameState)),
    finishPlayCard: (id) => dispatch(finishPlayCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

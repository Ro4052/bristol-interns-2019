import React from 'react';
import { connect } from 'react-redux';
import AllCards from '../Cards/AllCards'
import Message from '../Message/Message'
import PlayerCards from '../Cards/PlayerCards';
import LogoutButton from '../Login/LogoutButton'
import style from './Dashboard.module.css';
import axios from 'axios';
import { setGameState, setMessage } from '../../store/actions';
import connectSocket from '../../services/socket';
import { dispatch } from '../../store/store';
import { setSocket } from '../../store/actions';


export class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.startGame = this.startGame.bind(this);
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
        axios.get('/api/endTurn')
        .catch(err => {
            console.log(err);
        });
    }

    componentDidMount() {
        // If log in succeeds, connect to the socket
        const socket = connectSocket();
        dispatch(setSocket(socket));
    }
    
    render() {
        let currentUsername = 'no one';
        if (this.props.gameState.currentPlayer) {
            currentUsername = this.props.gameState.currentPlayer.username;
        }        
        return (
            <div className={style.roundInfo}>
                {this.props.gameState.started && <h2>Round: <span id="round-number">{this.props.gameState.roundNum}</span></h2>}
                <div className={style.currentPlayersBox}>
                    Players:
                    <ul id="players">
                        {this.props.gameState.players.map((player, key) => {
                            return <li key={key}>{player.username}</li>
                        })}
                    </ul>
                </div>
                <h2>Current player: {this.props.gameState.currentPlayer && <span id="current-player">{currentUsername}</span>}</h2>
                {!this.props.gameState.started && <button id="start-game" onClick={this.startGame}>Start game</button>}
                {this.props.gameState.started && <button id="end-turn" onClick={this.endTurn}>Next turn</button>}
                <AllCards />
                <PlayerCards />
                <Message />
                {/* <LogoutButton/> */}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return({
        gameState: state.reducer.gameState
    });
}

const mapDispatchToProps = (dispatch) => ({
    setGameState: gameState => dispatch(setGameState(gameState)),
    setMessage: message => dispatch(setMessage(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

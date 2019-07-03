import React from 'react';
import { connect } from 'react-redux';
import socket from '../../socket';
import AllCards from '../Cards/AllCards'
import Message from '../Message/Message'
import PlayerCards from '../Cards/PlayerCards';
import LogoutButton from '../Login/LogoutButton'
import style from './Dashboard.module.css';
import axios from 'axios';
import { setGameState, setMessage } from '../../store/actions';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.startGame = this.startGame.bind(this);
    }
    componentDidMount() {
        socket.on("gameState", msg => {
            this.props.setGameState(msg);
        });
        socket.on("messages", msg => {
            this.props.setMessage(msg);
        });
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
        console.log("endTurn");
        axios.get('/api/endTurn')
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err);
        })
    }
    render() {
        let currentUsername = 'no one';
        if (this.props.gameState.currentPlayer) {
            currentUsername = this.props.gameState.currentPlayer.username;
        }        
        return (
            <div className={style.roundInfo}>
                <h2>Round: {this.props.gameState.roundNum}</h2>
                <div className={style.currentPlayersBox}>
                    Players:
                    <ul>
                        {this.props.gameState.players.map((player, key) => {
                            return <li key={key}>{player.username}</li>
                        })}
                    </ul>
                </div>
                <h2>Current player: {this.props.gameState.currentPlayer && <span id="current-player">{currentUsername}</span>}</h2>
                {!this.props.gameState.started && <button onClick={this.startGame}>Start game</button>}
                <button onClick={this.endTurn}>Next turn</button>
                <AllCards />
                <PlayerCards />
                <Message />
                <LogoutButton/>
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

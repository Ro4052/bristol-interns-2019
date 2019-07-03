import React from 'react';
import socket from '../../socket';
import AllCards from '../Cards/AllCards'
import Message from '../Message/Message'
import PlayerCards from '../Cards/PlayerCards';
import style from './Dashboard.module.css';
import axios from 'axios';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            gameState: {
                started: false,
                roundNum: 0,
                currentPlayer: null,
                players: [],
                currentCards: []
            }
        }
        this.startGame = this.startGame.bind(this);
    }
    componentDidMount() {
        socket.on("gameState", msg => {
            this.setState({ gameState: msg });
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
        if (this.state.gameState.currentPlayer) {
            currentUsername = this.state.gameState.currentPlayer.username;
        }        
        return (
            <div className={style.roundInfo}>
                <h2>Round: {this.state.gameState.roundNum}</h2>
                <div className={style.currentPlayersBox}>
                    Players:
                    <ul>
                        {this.state.gameState.players.map((player, key) => {
                            return <li key={key}>{player.username}</li>
                        })}
                    </ul>
                </div>
                <h2>{`It's ${currentUsername}'s turn.`}</h2>
                {!this.state.gameState.started && <button onClick={this.startGame}>Start game</button>}
                <button onClick={this.endTurn}>Next turn</button>
                <AllCards cards={this.state.gameState.currentCards}/>
                <PlayerCards myTurn={this.state.gameState.myTurn}/>
                <Message myTurn={this.state.gameState.myTurn}/>
            </div>
        )
    }
}

export default Dashboard;

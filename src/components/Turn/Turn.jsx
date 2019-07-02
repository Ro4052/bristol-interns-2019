import React from 'react';
import socket from '../../socket';
import axios from 'axios';
import AllCards from '../Cards/AllCards'

class Turn extends React.Component {

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
            // console.log(msg);
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
        console.log(this.state.gameState.currentCards);
        
        let currentUsername = 'no one';
        if (this.state.gameState.currentPlayer) {
            currentUsername = this.state.gameState.currentPlayer.username;
        }
        return (
            <div>
                <div>Round: {this.state.gameState.roundNum}</div>
                Players:
                <ul>
                    {this.state.gameState.players.map((player, key) => {
                        return <li key={key}>{player.username}</li>
                    })}
                </ul>
                <div>
                    {`It's ${currentUsername}'s turn.`}
                </div>
                {!this.state.gameState.started && <button onClick={this.startGame}>Start game</button>}
                <button onClick={this.endTurn}>Next turn</button>
                <AllCards cards={this.state.gameState.currentCards}/>
            </div>
        )
    }
}

export default Turn;

import React from 'react';
import socket from '../../socket';
import axios from 'axios';

class Turn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            roundInfo: {}
        }
        this.startGame = this.startGame.bind(this);
    }

    componentDidMount() {
        socket.on("players", msg => {
            this.setState({users: msg});
        });
        socket.on("startRound", msg => {
            console.log("startRound", msg);
            this.setState({
                roundInfo: msg
            });
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
        if (this.state.roundInfo.currentPlayer) {
            currentUsername = this.state.roundInfo.currentPlayer.username || 'no one';
        }
        return (
            <div>
                <div>
                    <div>Round: {this.state.roundInfo.roundNum}</div>
                    Players:
                    <ul>
                        {this.state.users.map((user, key) => {
                            return <li key={key}>{user.username}</li>
                        })}
                    </ul>
                </div>
                <div>
                    {`It's ${currentUsername}'s turn.`}
                </div>
                <button onClick={this.startGame}>Start game</button>
                <button onClick={this.endTurn}>Next turn</button>
            </div>
        )
    }
}

export default Turn;

import React from 'react';
import socket from '../../socket';
import axios from 'axios';
import ChooseCard from '../ChooseCard/ChooseCard';

class Turn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            currentPlayer: null,
            chooseCard: false
        }
        this.startGame = this.startGame.bind(this);
    }

    componentDidMount() {
        socket.on("players", msg => {
            this.setState({users: msg});
        });
        socket.on("startRound", msg => {
            console.log(msg);
            this.setState({
                currentPlayer: msg.currentPlayer,
                chooseCard: true
            });
        });
    }

    startGame() {
        console.log("startGame");
        axios.get('/api/start')
        .then(response => {
            console.log(response);
            console.log(response.status)
            if (response.status === 200) this.setState({chooseCard: true});
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        const turn = this.state.currentPlayer ?
            `It's ${this.state.currentPlayer}'s turn.` :
            <button onClick={this.startGame}>Start game</button> ;

        return (
            <div>
                <div>
                    Players:
                    <ul>
                        {this.state.users.map((user, key) => {
                            return <li key={key}>{user}</li>
                        })}
                    </ul>
                </div>
                {turn}
                {this.state.chooseCard && <ChooseCard />}
            </div>
        )
    }
}

export default Turn;

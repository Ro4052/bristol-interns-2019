import React from 'react';
import axios from 'axios';
import history from '../../services/history';

export class StartGame extends React.Component {
    constructor(props) {
        super(props);
        this.startGame = this.startGame.bind(this);
    }

    startGame() {
        axios.get('/api/start')
        .then(() => history.push('/dashboard'))
        .catch(err => console.log(err));
    }

    render() {
        return (
            <div>
                <button onClick={this.startGame} data-cy="start-game" type='button'>Start game</button>
            </div>
        );
    }
}

export default StartGame;

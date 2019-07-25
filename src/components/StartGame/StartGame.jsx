import React from 'react';
import axios from 'axios';
import Button from '../shared/Button/Button';
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
            <Button cy="start-game" handleClick={this.startGame} text="Start game" />
        );
    }
}

export default StartGame;

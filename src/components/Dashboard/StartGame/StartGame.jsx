import React from 'react';
import axios from 'axios';
import Button from '../../shared/Button/Button';

export class StartGame extends React.Component {

    startGame() {
        axios.get('/api/start')
        .catch(err => console.log(err));
    }

    render() {
        return (
            <Button cy="start-game" handleClick={this.startGame} text="Start game" />
        );
    }
}

export default StartGame;
import React from 'react';
import axios from 'axios';

export class StartGameButton extends React.Component {

    startGame() {
        axios.get('/api/start')
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <button id="start-game" data-cy="start-game" onClick={this.startGame}>Start game</button>
        );
    }
}

export default StartGameButton;

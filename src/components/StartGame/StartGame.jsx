import React from 'react';
import axios from 'axios';
import Button from '../shared/Button/Button';
import history from '../../services/history';

export class StartGame extends React.Component {
    constructor(props) {
        super(props);
        this.startGame = this.startGame.bind(this);
    }

    startGame(e) {
        e.preventDefault();
        axios.get('/api/start')
        .then(() => history.push('/dashboard'))
        .catch(err => console.log(err));
    }

    render() {
        return (
            <form onSubmit={this.startGame}>
                <Button cy="start-game" text="Start game" />
            </form>
        );
    }
}

export default StartGame;

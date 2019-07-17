import React from 'react';
import axios from 'axios';
import Button from '../../shared/Button/Button';

export class NewGame extends React.Component {

    newGame() {
        axios.get('/api/end')
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <Button cy="new-game" handleClick={this.newGame} text="New game" />
        );
    }
}

export default NewGame;

import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import styles from './GameOver.module.css';
import Button from '../shared/Button/Button';

export class GameOver extends React.Component {

    newGame() {
        axios.get('/api/end')
        .catch(err => console.log(err));
    }

    render() {
        console.log(this.props.winner);
        return (
            <div className={styles.gameOverBox}>
                <h2 className={styles.winnerText}>Winner is: <span>{this.props.winner.username}</span></h2>
                <Button cy="new-game" handleClick={this.newGame} text="New game" />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    winner: state.gameReducer.winner
});

export default connect(mapStateToProps)(GameOver);

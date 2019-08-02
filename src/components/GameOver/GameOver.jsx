import React from 'react';
import { connect } from 'react-redux';
import styles from './GameOver.module.css';
import Button from '../shared/Button/Button';
import { endGame } from './GameOverActions';

export class GameOver extends React.Component {
    render() {
        return (
            <div data-cy='game-over' className={styles.gameOverBox}>
                {(this.props.username === this.props.winner.username) 
                ? <h2>You win!</h2>
                : <h2>You lose! <br/> Winner is: <span data-cy='winner'>{this.props.winner.username}</span></h2>}
                <Button cy="new-game" handleClick={this.props.endGame} text="Back to Lobby" />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    winner: state.gameOverReducer.winner,
    username: state.authReducer.username
});

const mapDispatchToProps = (dispatch) => ({
    endGame: () => dispatch(endGame())
});

export default connect(mapStateToProps, mapDispatchToProps)(GameOver);

import React from 'react';
import { connect } from 'react-redux';
import styles from './GameOver.module.css';
import Button from '../shared/Button/Button';
import { endGame } from './GameOverActions';

export class GameOver extends React.Component {
    render() {
        return (
            <div className={styles.gameOverBox}>
                <h2>Winner is: <span data-cy='winner'>{this.props.winner.username}</span></h2>
                <Button cy="new-game" handleClick={this.props.endGame} text="New game" />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    winner: state.gameOverReducer.winner
});

const mapDispatchToProps = (dispatch) => ({
    endGame: () => dispatch(endGame())
});

export default connect(mapStateToProps, mapDispatchToProps)(GameOver);

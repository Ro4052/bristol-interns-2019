import React from 'react';
import { connect } from 'react-redux';
import styles from './GameOver.module.css';
import Button from '../shared/Button/Button';
import { endGame } from './GameOverActions';

export class GameOver extends React.Component {
    render() {
        return (
            <div className={styles.gameOverBox}>
                { //Check if draw or win
                (this.props.drawers.length===0)
                ? <h2 className={styles.drawer}> Winner is: <span data-cy='winner'>{this.props.winner.username}</span></h2>
                : (<h2 data-cy='drawers'>Draw between {this.props.drawers.map((player, key) => <span key={key}>{player.username}{key < this.props.drawers.length - 1 ? ' and' : ''} </span>)}</h2>)
                }
                <Button cy="new-game" handleClick={this.props.endGame} text="New game" />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    winner: state.gameOverReducer.winner,
    drawers: state.gameOverReducer.drawers
});

const mapDispatchToProps = (dispatch) => ({
    endGame: () => dispatch(endGame())
});

export default connect(mapStateToProps, mapDispatchToProps)(GameOver);

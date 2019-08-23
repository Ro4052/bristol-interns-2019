import React from 'react';
import { connect } from 'react-redux';
import styles from './GameOver.module.css';
import { backToLobby } from './GameOverActions';

export class GameOver extends React.Component {
    render() {
        return (
            <div data-cy='game-over' className={styles.gameOverBox}>
                {
                (this.props.winners.length > 1)
                ? <h2 data-cy='drawers'>Draw between {this.props.winners.map((winner, key) => <span key={winner.username}>{winner.username}{key < this.props.winners.length - 1 ? ' and' : ''} </span>)}</h2>
                : (this.props.username === this.props.winners[0].username) 
                    ? <h2 data-cy='winner'>You win</h2>
                    : <h2>You lose<br/> Winner is <span data-cy='winner'>{this.props.winners[0].username}</span></h2>
                }
                <button onClick={this.props.backToLobby} data-cy="new-game" type='button'>Back to Lobby</button>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    winners: state.gameOverReducer.winners,
    username: state.authReducer.username
});

const mapDispatchToProps = dispatch => ({
    backToLobby: () => dispatch(backToLobby())
});

export default connect(mapStateToProps, mapDispatchToProps)(GameOver);

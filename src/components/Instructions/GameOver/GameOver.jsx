import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './GameOver.module.css';
import { backToLobby } from './GameOverActions';

function GameOver() {
    const { username } = useSelector(state => state.authReducer);
    const { winners } = useSelector(state => state.gameOverReducer);
    const dispatch = useDispatch();

    const draw = winners.length > 1;

    return (
        <div data-cy='game-over' className={styles.gameOverBox}>
            {
            (draw)
            ? <h2 data-cy='drawers'>Draw between {winners.map((winner, key) => <span key={winner.username}>{winner.username}{key < winners.length - 1 ? ' and' : ''} </span>)}</h2>
            : (username === winners[0].username) 
                ? <h2 data-cy='winner'>You win</h2>
                : <h2>You lose<br/> Winner is <span data-cy='winner'>{winners[0].username}</span></h2>
            }
            <button onClick={() => dispatch(backToLobby())} data-cy="back-to-lobby" type='button'>Back to Lobby</button>
        </div>
    );
}

export default GameOver;

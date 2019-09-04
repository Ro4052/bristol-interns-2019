import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Leaderboard.module.css';
import { getPlayers } from './LeaderboardActions';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Leaderboard(props) {
    const { history} = props;
    const { players } = useSelector(state => state.leaderboardReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPlayers());
    });

    return (
        <div className={styles.leaderboardPage}>
            <div className={styles.backButton}>
                <button onClick={() => history.push('/lobby')} data-cy="back" type='button'>Back</button>
            </div>
            <div className={styles.scrollbarPadding}>
                <div className={cx(styles.leaderboard, 'arrowScrollbar')}>
                    <h2 className={styles.leaderboardHeader}>Leaderboard</h2>
                    <table>
                        <tbody>
                        <tr>
                            <th><h3 className={styles.leaderboardTableColumn}>Username</h3></th>
                            <th><h3 className={styles.leaderboardTableColumn}>Score</h3></th>
                        </tr>
                        {players.map(player => (
                            <tr key={player.id} data-cy="player-row">
                                <td><h4 data-cy="player-username" className={styles.leaderboardTableRow}>{player.username}</h4></td>
                                <td><h4 data-cy="player-score" className={styles.leaderboardTableRow}>{player.score}</h4></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;

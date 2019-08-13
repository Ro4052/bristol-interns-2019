import React from 'react';
import { connect } from 'react-redux';
import styles from './Leaderboard.module.css';
import history from '../../services/history';
import { getPlayers } from './LeaderboardActions';
import Button from '../shared/Button/Button';

export class Leaderboard extends React.Component {
    componentDidMount() {
        this.props.getPlayers();
    }

    goToLobby(e) {
        e.preventDefault();
        history.push('/lobby');
    }

    render() {        
        return (
            <div className={styles.leaderboardPage}>
                <form onSubmit={this.goToLobby} className={styles.backButton}>
                    <Button data-cy="back" text="Back" />
                </form>
                <div className={styles.leaderboard}>
                    <h2 className={styles.leaderboardHeader}>Leaderboard</h2>
                    <table>
                        <tbody>
                        <tr>
                            <th><h3 className={styles.leaderboardTableColumn}>Username</h3></th>
                            <th><h3 className={styles.leaderboardTableColumn}>Score</h3></th>
                        </tr>
                        {this.props.players.map(player => (
                            <tr key={player.id} data-cy="player-row">
                                <td><h4 data-cy="player-username" className={styles.leaderboardTableRow}>{player.username}</h4></td>
                                <td><h4 data-cy="player-score" className={styles.leaderboardTableRow}>{player.score}</h4></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    players: state.leaderboardReducer.players
});

const mapDispatchToProps = dispatch => ({
    getPlayers: () => dispatch(getPlayers())
});

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboard);

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

    goToLobby() {
        history.push('/lobby');
    }

    render() {
        return (
            <div className={styles.leaderboardPage}>
                <div className={styles.backButton}>
                    <Button data-cy="back" handleClick={this.goToLobby} text="Back" />
                </div>
                <div className={styles.leaderboard}>
                    <h2>Leader Board</h2>
                    <table>
                        <tbody>
                        <tr>
                            <th><h3>Username</h3></th>
                            <th><h3>Score</h3></th>
                        </tr>
                        {this.props.players && this.props.players.map(player => <tr key={player.id} data-cy="player-row"><td><h4 data-cy="player-username">{player.username}</h4></td><td><h4 data-cy="player-score">{player.score}</h4></td></tr>)}
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

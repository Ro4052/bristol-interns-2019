import React from 'react';
import styles from './Players.module.css';
import { connect } from 'react-redux';

export class Players extends React.PureComponent {
    render() {        
        return (
            <div className={styles.currentPlayersBox}>
                <h3 data-cy="players-heading">Players:</h3>
                <ul id="players" data-cy='players-list'>
                    {this.props.players.map((player, key) => <li key={key}><span data-cy='player-username'>{player.username}</span>: <span data-cy='player-score'>{player.score}</span> points</li>)}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    players: state.gameReducer.players
});

export default connect(mapStateToProps)(Players);

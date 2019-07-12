import React from 'react';
import style from '../../Dashboard/Dashboard.module.css';
import { connect } from 'react-redux';

export class Players extends React.PureComponent {
    render() {
        return (
            <div className={style.currentPlayersBox}>
                <h3>Players:</h3>
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

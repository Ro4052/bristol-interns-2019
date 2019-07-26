import React from 'react';
import styles from './Players.module.css';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export class Players extends React.PureComponent {
    render() {
        return (
            <table className={styles.players} data-cy='players-list'>
                {this.props.players.map((player, key) => {
                    return (
                        <tr data-cy="player" key={key} className={cx({ current: this.props.currentPlayer && this.props.currentPlayer.username === player.username })}>
                            <td className={styles.playerUsername} data-cy='player-username'>{player.username}</td>
                            <td data-cy='player-score'>{player.score}</td>
                            <td data-cy='finished-turn'>{player.finishedTurn && "✓"}</td>
                        </tr>
                    );
                })}
            </table>
        )
    }
}

const mapStateToProps = (state) => ({
    players: state.playersReducer.players,
    currentPlayer: state.playersReducer.currentPlayer,
});

export default connect(mapStateToProps)(Players);

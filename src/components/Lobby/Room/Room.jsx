import React from 'react';
import { connect } from 'react-redux';
import styles from './Room.module.css';
import { startGame, joinRoom, leaveRoom, addAIPlayer, removeAIPlayer } from '../LobbyActions';

export class Room extends React.Component {
    render() {
        const inRoom = this.props.room.players.some(player => player.username === this.props.username);
        const isStarted = this.props.room.started;
        const hasMaxPlayers = this.props.room.players.length >= this.props.room.maxPlayers;
        const hasMinPlayers = this.props.room.players.length >= this.props.room.minPlayers;
        return (
            <div className={styles.room} data-cy="room">
                <h2 className={styles.title} data-cy="room-title">{`Room: ${this.props.room.title}`}</h2>
                <table className={styles.players}>
                    <tbody data-cy='room-players'>
                        {this.props.room.players.map((player, index) => (
                            <tr className={styles.player} key={index}>
                                <td className={styles.username} data-cy='player-username'>{player.username}</td>
                                <td className={styles.remove}>{!player.real && inRoom && !isStarted && <button className={styles.removeAIButton} onClick={() => this.props.removeAIPlayer(this.props.room.roomId, player.username)} data-cy='remove-ai'>X</button>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!isStarted && <>
                    {!hasMinPlayers && <span className={styles.waiting} data-cy="players-needed">Waiting for {this.props.room.minPlayers - this.props.room.players.length} more players</span>}
                    <div className={styles.roomButtons}>
                        {inRoom && hasMinPlayers && <button className={styles.roomButton} onClick={this.props.startGame} data-cy="start-game" type='button'>Start game</button>}
                        {inRoom && <button className={styles.roomButton} onClick={() => this.props.leaveRoom(this.props.room.roomId)} data-cy="leave-room" type='button'>Leave room</button>}
                        {!hasMaxPlayers && !inRoom && <button className={styles.roomButton} onClick={() => this.props.joinRoom(this.props.room.roomId)} data-cy="join-room" type='button'>Join room</button>}
                        {!hasMaxPlayers && inRoom && <button className={styles.roomButton} data-cy="automated-player" onClick={() => this.props.addAIPlayer(this.props.room.roomId)} >Add AI player</button>}
                    </div>
                </>}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    username: state.authReducer.username
});

const mapDispatchToProps = dispatch => ({
    joinRoom: roomId => dispatch(joinRoom(roomId)),
    leaveRoom: roomId => dispatch(leaveRoom(roomId)),
    removeAIPlayer: (roomId, username) => dispatch(removeAIPlayer(roomId, username)),
    addAIPlayer: roomId => dispatch(addAIPlayer(roomId)),
    startGame: () => dispatch(startGame())
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);

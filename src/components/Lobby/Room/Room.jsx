import React from 'react';
import { connect } from 'react-redux';
import styles from './Room.module.css';
import { startGame, joinRoom, leaveRoom, addAIPlayer, removeAIPlayer } from '../LobbyActions';

export class Room extends React.Component {
    render() {
        const inRoom = this.props.room.players.some(player => player.username === this.props.username);
        const startGameVisible = !this.props.room.started && inRoom && !(this.props.room.minPlayers - this.props.room.players.length > 0);
        const waitingVisible = !this.props.room.started && (this.props.room.minPlayers - this.props.room.players.length > 0);
        return (
            <div className={styles.room} key={this.props.room.roomId} data-cy="room">
                <h2 className={styles.roomHeader} data-cy="room-title">{"Room: " + this.props.room.roomId}</h2>
                <ul className={styles.roomPlayers} id="players" data-cy='room-players'>
                    {this.props.room.players.map((player, key) => (
                        <li className={styles.playerInRoom} key={key}>
                            <span className={styles.roomPlayer}data-cy='player-username'>{player.username}</span>
                            {player.username.includes("Computer") && <button className={styles.removeAIButton} onClick={() => this.props.removeAIPlayer(this.props.room.roomId, player.username)} data-cy='remove-ai'>-</button>}
                        </li>
                    ))}
                </ul>
                {startGameVisible && <button className={styles.roomButton} onClick={this.props.startGame} data-cy="start-game" type='button'>Start game</button>}
                {waitingVisible && <span className = {styles.waiting} data-cy="players-needed">Waiting for {this.props.room.minPlayers - this.props.room.players.length} more players</span>}
                {!this.props.room.started && (inRoom ?
                    <button className={styles.roomButton} onClick={() => this.props.leaveRoom(this.props.room.roomId)} data-cy="leave-room" type='button'>Leave room</button> :
                    <button className={styles.roomButton} onClick={() => this.props.joinRoom(this.props.room.roomId)} data-cy="join-room" type='button'>Join room</button>
                )}
                {!this.props.room.started && inRoom && <button className={styles.roomButton} data-cy="automated-player" onClick={() => this.props.addAIPlayer(this.props.room.roomId)} >Add AI player</button>}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    username: state.authReducer.username
});

const mapDispatchToProps = (dispatch) => ({
    joinRoom: (roomId) => dispatch(joinRoom(roomId)),
    leaveRoom: (roomId) => dispatch(leaveRoom(roomId)),
    removeAIPlayer: (roomId, username) => dispatch(removeAIPlayer(roomId, username)),
    addAIPlayer: (roomId) => dispatch(addAIPlayer(roomId)),
    startGame: () => dispatch(startGame())
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);

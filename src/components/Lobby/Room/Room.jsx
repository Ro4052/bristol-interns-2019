import React from 'react';
import { connect } from 'react-redux';
import styles from './Room.module.css';
import { startGame, joinRoom, leaveRoom } from '../LobbyActions';

export class Room extends React.Component {
    render() {
        const inRoom = this.props.room.players.some(player => player.username === this.props.username);
        const startGameVisible = !this.props.room.started && inRoom && !(this.props.room.minPlayers - this.props.room.players.length > 0);
        const waitingVisible = !this.props.room.started && (this.props.room.minPlayers - this.props.room.players.length > 0);
        return (
            <div className={styles.room} key={this.props.room.roomId} data-cy="room">
                <h2 data-cy="room-title">{"Room: " + this.props.room.roomId}</h2>
                <ul id="players" data-cy='room-players'>
                    {this.props.room.players.map((player, key) => <li key={key}><span data-cy='player-username'>{player.username}</span></li>)}
                </ul>
                {startGameVisible && <button onClick={this.props.startGame} data-cy="start-game" type='button'>Start game</button>}
                {waitingVisible && <span className = {styles.waiting} data-cy="players-needed">Waiting for {this.props.room.minPlayers - this.props.room.players.length} more players</span>}
                {!this.props.room.started && (inRoom ?
                    <button onClick={() => this.props.leaveRoom(this.props.room.roomId)} data-cy="leave-room" type='button'>Leave room</button> :
                    <button onClick={() => this.props.joinRoom(this.props.room.roomId)} data-cy="join-room" type='button'>Join room</button>
                )}
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
    startGame: () => dispatch(startGame())
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);

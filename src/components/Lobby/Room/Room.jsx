import React from 'react';
import { connect } from 'react-redux';
import styles from './Room.module.css';
import StartGame from '../../StartGame/StartGame';
import Button from '../../shared/Button/Button';
import { joinRoom, leaveRoom } from '../LobbyActions';

export class Room extends React.Component {
    constructor(props) {
        super(props);
        this.joinRoom = this.joinRoom.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
    }

    joinRoom(e) {
        e.preventDefault();
        this.props.joinRoom(this.props.room.roomId);
    }

    leaveRoom(e) {
        e.preventDefault();
        this.props.leaveRoom(this.props.room.roomId)
    }

    render() {
        const waiting = <span className = {styles.waiting} data-cy="players-needed">Waiting for {this.props.room.minPlayers - this.props.room.players.length} more players</span>;
        const inRoom = this.props.room.players.some(player => player.username === this.props.username);
        return (
            <div className={styles.room} key={this.props.room.roomId} data-cy="room">
                <h2 data-cy="room-title">{"Room: " + this.props.room.roomId}</h2>
                <ul id="players" data-cy='room-players'>
                    {this.props.room.players.map((player, key) => <li key={key}><span data-cy='player-username'>{player.username}</span></li>)}
                </ul>
                {!this.props.room.started && inRoom && !(this.props.room.minPlayers - this.props.room.players.length > 0) && <StartGame />}
                {!this.props.room.started && (this.props.room.minPlayers - this.props.room.players.length > 0 ? waiting : null)}
                {!this.props.room.started && (inRoom ?
                    <form data-cy="leave-room-form" onSubmit={this.leaveRoom}>
                        <Button cy="leave-room" text="Leave room" />
                    </form>
                    :
                    <form data-cy="join-room-form" onSubmit={this.joinRoom}>
                        <Button cy="join-room" text="Join room" />
                    </form>
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
    leaveRoom: roomId => dispatch(leaveRoom(roomId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);

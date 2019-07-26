import React from 'react';
import { connect } from 'react-redux';
import styles from './Room.module.css';
import StartGame from '../../StartGame/StartGame';
import Button from '../../shared/Button/Button';
import { joinRoom, leaveRoom } from '../LobbyActions';

export class Room extends React.Component {
    render() {
        const waiting = <span data-cy="players-needed">Waiting for {this.props.room.minPlayers - this.props.room.players.length} more players</span>;
        const inRoom = this.props.room.players.some(player => player.username === this.props.username);
        return (
            <li className={styles.singleRoom} key={this.props.room.roomId} data-cy="room">
                <h2 data-cy="room-title">{"Room: " + this.props.room.roomId}</h2>
                <ul id="players" data-cy='room-players'>
                    {this.props.room.players.map((player, key) => <li key={key}><span data-cy='player-username'>{player.username}</span></li>)}
                </ul>
                {!this.props.room.started && inRoom && !(this.props.room.minPlayers - this.props.room.players.length) && <StartGame />}
                {!this.props.room.started && (this.props.room.minPlayers - this.props.room.players.length ? waiting : null)}
                {!this.props.room.started && (inRoom ?
                    <Button cy="leave-room" handleClick={() => this.props.leaveRoom(this.props.room.roomId)} text="Leave room" /> :
                    <Button cy="join-room" handleClick={() => this.props.joinRoom(this.props.room.roomId)} text="Join room" />
                )}
            </li>
        );
    }
}

const mapStateToProps = (state) => ({
    username: state.authReducer.username
});

const mapDispatchToProps = (dispatch) => ({
    joinRoom: (roomId) => dispatch(joinRoom(roomId)),
    leaveRoom: (roomId) => dispatch(leaveRoom(roomId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);

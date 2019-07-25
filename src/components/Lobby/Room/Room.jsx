import React from 'react';
import { connect } from 'react-redux';
import styles from './Room.module.css';
import StartGame from '../../StartGame/StartGame';
import Button from '../../shared/Button/Button';
import { joinRoom } from '../LobbyActions';

export class Room extends React.Component {
    render() {
        console.log(this.props.room);
        const waiting = (<>Waiting for {this.props.room.minPlayers - this.props.room.players.length} more players</>);
        const inRoom = this.props.room.players.some(player => player.username === this.props.username);
        return (
            <li className={styles.singleRoom} key={this.props.room.roomId} data-cy="single-room">
                <h2 data-cy="room-title">{"Room: " + this.props.room.roomId}</h2>
                <ul id="players" data-cy='players-list'>
                    {this.props.room.players.map((player, key) => <li key={key}><span data-cy='player-username'>{player.username}</span></li>)}
                </ul>
                {this.props.room.minPlayers - this.props.room.players.length ? waiting : <StartGame />}
                {inRoom ?
                    <Button cy="leave-room" handleClick={() => {}} text="Leave room" /> :
                    <Button cy="join-room" handleClick={() => this.props.joinRoom(this.props.room.roomId)} text="Join room" />
                }
            </li>
        );
    }
}

const mapStateToProps = (state) => ({
    username: state.authReducer.username
});

const mapDispatchToProps = (dispatch) => ({
    joinRoom: (roomId) => dispatch(joinRoom(roomId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);

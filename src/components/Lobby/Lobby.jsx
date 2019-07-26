import React from 'react';
import { connect } from 'react-redux';
import styles from './Lobby.module.css';
import { createRoom } from './LobbyActions';
import Room from './Room/Room';
import Button from '../shared/Button/Button';

export class Lobby extends React.Component {
    render() {
        return (
            <>
                <Button cy="create-room" handleClick={this.props.createRoom} text="Create Room" />
                <ul className={styles.currentRooms} data-cy="current-rooms">
                    {this.props.rooms.map(room => <Room room={room} key={room.roomId} />)}
                </ul>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    rooms: state.lobbyReducer.rooms
});

const mapDispatchToProps = (dispatch) => ({
    createRoom: () => dispatch(createRoom())
});

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);

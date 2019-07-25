import React from 'react';
import { connect } from 'react-redux';
import styles from './Lobby.module.css';
import CreateRoom from './CreateRoom/CreateRoom';
import Room from './Room/Room';

export class Lobby extends React.Component {
    render() {
        return (
            <>
                <CreateRoom />
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

export default connect(mapStateToProps)(Lobby);

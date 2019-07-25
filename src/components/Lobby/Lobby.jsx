import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import styles from './Lobby.module.css';
import { CreateRoom } from './CreateRoom/CreateRoom';
import Room from './Room/Room';

export class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            joined: false
        };
        this.createRoom = this.createRoom.bind(this);
    }

    createRoom() {
        axios.get('/api/room/create')
        .then(() => {
            this.setState({joined: true});
        })
        .catch((err) => {
            window.alert(err.message);
        })
    }

    render() {
        return (
            <>
                <CreateRoom createRoom={this.createRoom}/>
                <ul className={styles.currentRooms} data-cy="current-rooms">
                    {this.props.rooms.map(room => 
                        <Room room={room} key={room.roomId} history={this.props.history} />
                    )}
                </ul>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    rooms: state.lobbyReducer.rooms
});

export default connect(mapStateToProps)(Lobby);

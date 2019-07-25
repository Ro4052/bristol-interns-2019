import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import styles from './Lobby.module.css';
import { CreateRoom } from './CreateRoom/CreateRoom';
import Room from './Room/Room';
import { authenticateUser } from '../shared/Auth/AuthActions';

export class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            joined: false
        };
        this.createRoom = this.createRoom.bind(this);
        this.joinRoom = this.joinRoom.bind(this);
    }

    componentDidMount() {
        this.props.authenticateUser();
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

    joinRoom(id) {
        axios.post('/api/room/join', {
            roomId: id
        })
        .catch((err) => console.log(err.message));
    }

    render() {
        return (
            <>
                <CreateRoom createRoom={this.createRoom}/>
                <ul className={styles.currentRooms} data-cy="current-rooms">
                    {this.props.rooms.map(room => 
                        <Room room={room} key={room.id} handleClick={this.joinRoom} />
                    )}
                </ul>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    rooms: state.lobbyReducer.rooms
});

const mapDispatchToProps = (dispatch) => ({
    authenticateUser: () => dispatch(authenticateUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);

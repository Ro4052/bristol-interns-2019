import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import styles from './Lobby.module.css';
import { CreateRoom } from './CreateRoom/CreateRoom';
import Room from './Room/Room';
import Dixit from '../Dixit/Dixit';
import Logout from '../Logout/Logout';
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
            <div className={styles.lobby}>
                <div className={styles.header}>
                    <Logout />
                    <div className={styles.logo}>
                        <Dixit />
                    </div>
                </div>
                <div className={styles.rooms}>
                    <CreateRoom createRoom={this.createRoom}/>
                    <ul className={styles.currentRooms} data-cy="current-rooms">
                        {this.props.rooms.map(room => 
                            <Room room={room} key={room.id} handleClick={this.joinRoom} />
                        )}
                    </ul>
                </div>
            </div>
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

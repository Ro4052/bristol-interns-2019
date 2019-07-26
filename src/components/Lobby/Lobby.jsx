import React from 'react';
import { connect } from 'react-redux';
import styles from './Lobby.module.css';
import { createRoom } from './LobbyActions';
import Room from './Room/Room';
import Button from '../shared/Button/Button';
import Dixit from '../Dixit/Dixit';
import Logout from '../Logout/Logout';
import { authenticateUser } from '../shared/Auth/AuthActions';

export class Lobby extends React.Component {

    //     constructor(props) {
//         super(props);
//         this.state = {
//             joined: false
//         };
//         this.createRoom = this.createRoom.bind(this);
//         this.joinRoom = this.joinRoom.bind(this);
//     }

//     componentDidMount() {
//         this.props.authenticateUser();
//     }

//     render() {
//         return (
//             <>
//                 <Button cy="create-room" handleClick={this.props.createRoom} text="Create Room" />
//                 <ul className={styles.currentRooms} data-cy="current-rooms">
//                     {this.props.rooms.map(room => <Room room={room} key={room.roomId} />)}
//                 </ul>
//             </>

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
                    <Button cy="create-room" handleClick={this.props.createRoom} text="Create Room" />
                    <ul className={styles.currentRooms} data-cy="current-rooms">
                        {this.props.rooms.map(room => 
                            <Room room={room} key={room.roomId} handleClick={this.joinRoom} />
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
    createRoom: () => dispatch(createRoom()),
    authenticateUser: () => dispatch(authenticateUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);

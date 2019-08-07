import React from 'react';
import { connect } from 'react-redux';
import styles from './Lobby.module.css';
import { createRoom } from './LobbyActions';
import Room from './Room/Room';
import Logo from '../Logo/Logo';
import Logout from '../Logout/Logout';
import { authenticateUser } from '../Login/LoginActions';
import CreateRoom from './CreateRoom/CreateRoom';
import history from '../../services/history';

export class Lobby extends React.Component {
    componentDidMount() {
        this.props.authenticateUser();
        if (this.props.status !== 'NOT_STARTED') {
            history.push('/dashboard');
        }
    }

    render() {
        return (
            <div className={styles.lobby}>
                <div className={styles.header}>
                    <Logout />
                    <Logo />
                </div>
                <div className={styles.rooms}>
                    <CreateRoom />
                    <ul className={styles.currentRooms} data-cy="current-rooms">
                        {this.props.rooms.map(room => <Room room={room} key={room.roomId} />)}
                    </ul>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    rooms: state.lobbyReducer.rooms,
    numRounds: state.createRoomReducer.numRounds,
    status: state.dashboardReducer.status
});

const mapDispatchToProps = dispatch => ({
    createRoom: numRounds => dispatch(createRoom(numRounds)),
    authenticateUser: () => dispatch(authenticateUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);

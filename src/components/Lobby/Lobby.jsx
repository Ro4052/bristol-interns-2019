import React from 'react';
import { connect } from 'react-redux';
import styles from './Lobby.module.css';
import { createRoom } from './LobbyActions';
import Room from './Room/Room';
import Button from '../shared/Button/Button';
import Dixit from '../Dixit/Dixit';
import Logout from '../Logout/Logout';
import { authenticateUser } from '../Login/LoginActions';
import RoundCount from '../RoundCount/RoundCount';
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
                    <div className={styles.logo}>
                        <Dixit />
                    </div>
                </div>
                <div className={styles.rooms}>
                    <div className={styles.createRoom}>
                        {!this.props.number ? <h1>Create room: </h1> : <Button cy="create-room" handleClick={() => this.props.createRoom(this.props.number)} text="Create Room" />}
                        {!this.props.number && this.props.createRoom && <RoundCount />}
                    </div>
                    <ul className={styles.currentRooms} data-cy="current-rooms">
                        {this.props.rooms.map(room => <Room room={room} key={room.roomId} />)}
                    </ul>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    rooms: state.lobbyReducer.rooms,
    number: state.roundCountReducer.number,
    status: state.dashboardReducer.status
});

const mapDispatchToProps = (dispatch) => ({
    createRoom: number => dispatch(createRoom(number)),
    authenticateUser: () => dispatch(authenticateUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);

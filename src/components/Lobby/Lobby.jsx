import React from 'react';
import { connect } from 'react-redux';
import styles from './Lobby.module.css';
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
            <>
                <div className={styles.header}>
                    <Logout />
                    <Logo />
                </div>
                <div className={styles.currentRooms} data-cy="current-rooms">
                    <CreateRoom />
                    {this.props.rooms.map(room => <Room room={room} key={room.roomId} />)}
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    rooms: state.lobbyReducer.rooms,
    status: state.dashboardReducer.status
});

const mapDispatchToProps = dispatch => ({
    authenticateUser: () => dispatch(authenticateUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);

import React from 'react';
import { connect } from 'react-redux';
import styles from './Lobby.module.css';
import Room from './Room/Room';
import Logo from '../Logo/Logo';
import Logout from '../Logout/Logout';
import { authenticateUser } from '../Login/LoginActions';
import CreateRoom from './CreateRoom/CreateRoom';
import history from '../../services/history';
import Chat from '../Chat/Chat';

export class Lobby extends React.Component {
    componentDidMount() {
        this.props.authenticateUser();
        if (this.props.status !== 'NOT_STARTED') {
            history.push('/dashboard');
        }
    }

    render() {
        return (
            <div className={styles.main}>
                <div className={styles.header}>
                    <Logout />
                    <Logo />
                </div>
                <div className={styles.container}>
                    <div className={styles.leftSide}>
                        <CreateRoom />
                        <Chat />
                    </div>
                    <div className={styles.roomArea} data-cy="current-rooms">
                        {this.props.rooms.map(room => <Room room={room} key={room.roomId} />)}                    
                    </div>
                </div>
            </div>
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

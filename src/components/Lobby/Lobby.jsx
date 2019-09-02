import React from 'react';
import { connect } from 'react-redux';
import styles from './Lobby.module.css';
import CreateRoom from './CreateRoom/CreateRoom';
import Upload  from '../Upload/Upload';
import { authenticateUser } from '../Login/LoginActions';
import history from '../../services/history';
import Chat from '../Chat/Chat';
import { statusTypes } from '../../services/statusTypes';
import Header from './Header/Header';
import Room from './Room/Room';

export class Lobby extends React.Component {
    componentDidMount() {
        this.props.authenticateUser();
        if (this.props.status !== statusTypes.NOT_STARTED) {
            history.push('/dashboard');
        }
    }

    render() {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.lobby}>
                    <div className={styles.left}>
                        <Upload />
                        <Chat showOnDefault={true} />
                    </div>
                    <div className={styles.right}>
                        <CreateRoom />
                        {this.props.rooms.map(room => (<Room room={room} key={room.roomId} />))}
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

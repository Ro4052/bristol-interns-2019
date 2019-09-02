import React from 'react';
import { connect } from 'react-redux';
import styles from './Lobby.module.css';
import { statusTypes } from '../../services/statusTypes';
import history from '../../services/history';
import { authenticateUser } from '../Login/LoginActions';
import Chat from '../Chat/Chat';
import CreateRoom from './CreateRoom/CreateRoom';
import Header from './Header/Header';
import Room from './Room/Room';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export class Lobby extends React.Component {
    constructor() {
        super();
        this.state = {
            chatVisible: false
        };
        this.toggleChat = this.toggleChat.bind(this);
    }

    componentDidMount() {
        this.props.authenticateUser();
        if (this.props.status !== statusTypes.NOT_STARTED) {
            history.push('/dashboard');
        }
    }

    toggleChat() {
        this.setState({ chatVisible: !this.state.chatVisible });
    }

    render() {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.chatButton}>
                    <button type='button' onClick={this.toggleChat}>{this.state.chatVisible ? "Hide chat" : "Show chat"}</button>
                </div>
                <div className={styles.lobby}>
                    <div className={cx(styles.chatContainer, { chatOverlay: this.state.chatVisible })}>
                        <Chat />
                    </div>
                    <div className={styles.roomsOuter}>
                        <div className={cx(styles.roomsInner, "arrowScrollbar")}>
                            <CreateRoom />
                            {this.props.rooms.map(room => <Room room={room} key={room.roomId} />)}
                        </div>
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

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Lobby.module.css';
import { statusTypes } from '../../services/statusTypes';
import { authenticateUser } from '../Login/LoginActions';
import { viewMessages } from '../Chat/ChatActions';
import Chat from '../Chat/Chat';
import CreateRoom from './CreateRoom/CreateRoom';
import Header from './Header/Header';
import Room from './Room/Room';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export function Lobby(props) {
    const [chatVisible, setChatVisible] = React.useState(false);
    const { rooms } = useSelector(state => state.lobbyReducer);
    const { status } = useSelector(state => state.dashboardReducer);
    const { newMessages } = useSelector(state => state.chatReducer);
    const dispatch = useDispatch();
    const { history } = props;

    useEffect(() => {
        dispatch(authenticateUser());
        if (status !== statusTypes.NOT_STARTED) {
            history.push('/dashboard');
        }
    });

    const toggleChat = () => {
        setChatVisible(!chatVisible);
        dispatch(viewMessages());
    }

    return (
        <div className={styles.container}>
            <Header history={history} />
            <div>
                <button className={styles.chatButton} type='button' onClick={toggleChat} data-cy='toggle-chat'>
                    {chatVisible ? "Hide chat" : "Show chat"}
                    {!chatVisible && newMessages.length !== 0 && !chatVisible && <div className={styles.newMessage} data-cy='new-message'>+{newMessages.length}</div>}
                </button>
            </div>
            <div className={styles.lobby}>
                <div className={cx(styles.chatContainer, { chatOverlay: chatVisible })}>
                    <Chat />
                </div>
                <div className={styles.roomsOuter}>
                    <div className={cx(styles.roomsInner, "arrowScrollbar")}>
                        <CreateRoom />
                        {rooms.map(room => <Room room={room} key={room.roomId} />)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lobby;

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Dashboard.module.css';
import PlayedCards from '../PlayedCards/PlayedCards';
import MyCards from '../MyCards/MyCards';
import Players from '../Players/Players';
import Chat from '../Chat/Chat';
import { authenticateUser } from '../Login/LoginActions';
import { viewMessages } from '../Chat/ChatActions';
import { statusTypes } from '../../services/statusTypes';
import Instructions from '../Instructions/Instructions';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Dashboard() {
    const [chatVisible, setChatVisible] = React.useState(false);
    const { newMessages } = useSelector(state => state.chatReducer);
    const { status, roundNum, rounds } = useSelector(state => state.dashboardReducer);
    const { playCard, playedCardId } = useSelector(state => state.myCardsReducer);
    const { playWord, word } = useSelector(state => state.playWordReducer);
    const { cards } = useSelector(state => state.playedCardsReducer);
    const { winners } = useSelector(state => state.gameOverReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authenticateUser());
    }, [dispatch]);

    const toggleChat = () => {
        setChatVisible(!chatVisible);
        dispatch(viewMessages());
    }

    const showMyCards = playCard || (playWord && !word && playedCardId && !winners.length);
    const showPlayedCards = status !== statusTypes.GAME_OVER && !playCard && cards.length > 0;
    return (
        <div className={styles.container}>
            <div>
                <button className={styles.chatButton} type='button' onClick={toggleChat} data-cy='toggle-chat'>
                    {chatVisible ? "Hide chat" : "Show chat"}
                    {!chatVisible && newMessages.length !== 0 && !chatVisible && <div className={styles.newMessage} data-cy='new-message'>+{newMessages.length}</div>}
                </button>
            </div>
            <div className={styles.dashboard}>
                <div className={styles.left}>
                    <div className={styles.gameInfo}>
                        {status !== statusTypes.NOT_STARTED && <h2>Round: <span id="round-number" data-cy="round-number">{roundNum}/{rounds}</span></h2>}
                        <Players />
                    </div>
                    <div className={cx(styles.chatContainer, { chatOverlay: chatVisible })}>
                        <Chat />
                    </div>
                </div>
                <div className={styles.right}>
                    <Instructions />
                    {showPlayedCards && <PlayedCards />}
                    {showMyCards && <MyCards />}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

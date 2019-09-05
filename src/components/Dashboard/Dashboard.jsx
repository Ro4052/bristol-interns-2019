import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Dashboard.module.css';
import PlayedCards from '../PlayedCards/PlayedCards';
import MyCards from '../MyCards/MyCards';
import Players from '../Players/Players';
import Chat from '../Chat/Chat';
import { authenticateUser } from '../Login/LoginActions';
import { statusTypes } from '../../services/statusTypes';
import Instructions from '../Instructions/Instructions';

function Dashboard() {
    const { status, roundNum, rounds } = useSelector(state => state.dashboardReducer);
    const { playCard, playedCardId } = useSelector(state => state.myCardsReducer);
    const { playWord, word } = useSelector(state => state.playWordReducer);
    const { cards } = useSelector(state => state.playedCardsReducer);
    const { winners } = useSelector(state => state.gameOverReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authenticateUser());
    }, [dispatch]);

    const showMyCards = playCard || (playWord && !word && playedCardId && !winners.length);
    const showPlayedCards = status !== statusTypes.GAME_OVER && !playCard && cards.length > 0;
    return (
        <div className={styles.dashboard}>
            <div className={styles.left}>
                <div className={styles.gameInfo}>
                    {status !== statusTypes.NOT_STARTED && <h2>Round: <span id="round-number" data-cy="round-number">{roundNum}/{rounds}</span></h2>}
                    <Players />
                </div>
                <div className={styles.chatContainer}>
                    <Chat />
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.rightInner}>
                    <Instructions />
                    {showPlayedCards && <PlayedCards />}
                    {showMyCards && <MyCards />}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

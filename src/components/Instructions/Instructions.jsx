import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Instructions.module.css';
import Timothy from '../Timothy/Timothy';
import GameOver from './GameOver/GameOver';
import PlayerInteractions from './PlayerInteractions/PlayerInteractions';
import PlayWord from './PlayWord/PlayWord';
import Timer from '../Timer/Timer';
import { setVoteCardTimer, setPlayCardTimer, setStorytellerTimer } from '../Timer/TimerActions';
import { statusTypes } from '../../services/statusTypes';

function Instructions() {
    const { status } = useSelector(state => state.dashboardReducer);
    const { winners } = useSelector(state => state.gameOverReducer);
    const { playedCardId } = useSelector(state => state.myCardsReducer);
    const { playWord, word } = useSelector(state => state.playWordReducer);
    const { storytellerDuration, playCardDuration, voteCardDuration } = useSelector(state => state.timerReducer);
    const dispatch = useDispatch();

    const isGameOver = winners.length > 0;
    const showPlayerInteractions = (!playWord || word || !playedCardId) && !isGameOver;
    const showPlayWord = playWord && !word && playedCardId && !isGameOver;

    return (
        <div className={styles.instructions}>
            <div className={styles.box}>
                {showPlayerInteractions && <PlayerInteractions />}
                {showPlayWord && <PlayWord />}
                {isGameOver && <GameOver />}
                {(status === statusTypes.WAITING_FOR_CURRENT_PLAYER && storytellerDuration > 0) && <Timer cy="storyteller-timer" setDuration={duration => dispatch(setStorytellerTimer(duration))} duration={storytellerDuration} />}
                {(status === statusTypes.WAITING_FOR_OTHER_PLAYERS && playCardDuration > 0) && <Timer cy="card-timer" setDuration={duration => dispatch(setPlayCardTimer(duration))} duration={playCardDuration} />}
                {(status === statusTypes.WAITING_FOR_VOTES && voteCardDuration > 0) && <Timer cy="vote-timer" setDuration={duration => dispatch(setVoteCardTimer(duration))} duration={voteCardDuration} />}
            </div>
            <div className={styles.circles}>
                <div className={styles.circle1}/>
                <div className={styles.circle2}/>
                <div className={styles.circle3}/>
            </div>
            <div className={styles.timothy}>
                <Timothy />
            </div>
        </div>
    );
}

export default Instructions;

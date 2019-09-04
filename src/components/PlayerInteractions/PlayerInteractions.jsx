import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './PlayerInteractions.module.css';
import classNames from 'classnames/bind';
import { requestNextRound } from '../Timer/TimerActions';
import { statusTypes } from '../../services/statusTypes';

export function PlayerInteractions() {
    const { status, currentWord } = useSelector(state => state.dashboardReducer);
    const { username } = useSelector(state => state.authReducer);
    const { currentPlayer } = useSelector(state => state.playersReducer);
    const { playCard, playedCardId } = useSelector(state => state.myCardsReducer);
    const { voteCard } = useSelector(state => state.playedCardsReducer);
    const { playCardDuration, voteCardDuration } = useSelector(state => state.timerReducer);

    const dispatch = useDispatch();

    const isStatus = checkStatus => status === checkStatus;
    const isCurrentPlayer = ()  => currentPlayer && currentPlayer.username === username;

    return (
        <div className={classNames(styles.playerInteractions)}>
            {currentWord && isCurrentPlayer() && <span>You picked the word <span data-cy="current-word">"{currentWord}"</span>. </span>}
            {currentWord && !isCurrentPlayer() && <span>The storyteller picked the word <span data-cy="current-word">"{currentWord}"</span>. </span>}
            {isStatus(statusTypes.WAITING_FOR_CURRENT_PLAYER) && !isCurrentPlayer() && <span data-cy='wait-for-storyteller'>Waiting for the storyteller...</span>}
            {playCard && !playedCardId && currentWord && <span data-cy="play-card">Pick a card from your hand that this word describes.</span>}
            {playCard && !playedCardId && !currentWord && <span data-cy="play-card">You are the storyteller! Pick a card from your hand.</span>}
            {voteCard && <span data-cy="vote-card">Vote on which card you think is the storyteller's one.</span>}
            {isStatus(statusTypes.WAITING_FOR_OTHER_PLAYERS) && playCardDuration > 0 && !playCard && <span data-cy='wait-for-cards'>Waiting for other players to pick cards...</span>}
            {isStatus(statusTypes.WAITING_FOR_VOTES) && voteCardDuration > 0 && !voteCard && <span data-cy='wait-for-votes'>Waiting for the other players to vote...</span>}
            {isStatus(statusTypes.DISPLAY_ALL_VOTES) && <button onClick={() => dispatch(requestNextRound())} data-cy='next-round'>Next round</button>}
        </div>
    );
}

export default PlayerInteractions;

import { types } from './GameOverActionTypes';
import history from '../../services/history';
import { setVotedCard } from '../PlayedCards/PlayedCardsActions';
import { resetWord } from '../PlayWord/PlayWordActions';
import { setCurrentPlayer } from '../Players/PlayersActions';
import { setCurrentWord, setStatus, setRoundNumber } from '../Dashboard/DashboardActions';
import { resetChat } from '../Chat/ChatActions';

export const setWinner = winner => ({
    type: types.SET_WINNER,
    winner
});

export const setDrawers = drawers => ({
    type: types.SET_DRAWERS,
    drawers
});

export const backToLobby = () => dispatch => {
    dispatch(setStatus('NOT_STARTED'));
    dispatch(setRoundNumber(0, 0));
    dispatch(setCurrentPlayer(null));
    dispatch(setCurrentWord(''));
    dispatch(setVotedCard(0));
    dispatch(resetWord());
    dispatch(setWinner(null));
    dispatch(setDrawers([]));
    dispatch(resetChat());
    history.push('/lobby');
};

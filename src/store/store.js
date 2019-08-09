import { createStore, applyMiddleware, combineReducers  } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import thunk from 'redux-thunk';

import authReducer from '../components/Login/LoginReducer';
import myCardsReducer from '../components/MyCards/MyCardsReducer';
import playedCardsReducer from '../components/PlayedCards/PlayedCardsReducer';
import playWordReducer from '../components/PlayWord/PlayWordReducer';
import playersReducer from '../components/Players/PlayersReducer';
import gameOverReducer from '../components/GameOver/GameOverReducer';
import dashboardReducer from '../components/Dashboard/DashboardReducer';
import lobbyReducer from '../components/Lobby/LobbyReducer';
import timerReducer from '../components/Timer/TimerReducer';
import createRoomReducer from '../components/Lobby/CreateRoom/CreateRoomReducer';
import leaderBoardReducer from '../components/LeaderBoard/LeaderBoardReducer';

// Combine all reducers
const allReducers = combineReducers({
    authReducer,
    myCardsReducer,
    playedCardsReducer,
    playWordReducer,
    playersReducer,
    gameOverReducer,
    dashboardReducer,
    lobbyReducer,
    timerReducer,
    createRoomReducer,
    leaderBoardReducer
});

// Wrap in reset functionality
const rootReducer = (state, action) => {
    if (action.type === 'RESET_STORE') state = undefined;
    return allReducers(state, action);
}

// Create persistedReducer
const rootPersistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2
}
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

// Create exports
let store = createStore(
    persistedReducer,
    applyMiddleware(thunk)
);
const dispatch = store.dispatch;
let persistor = persistStore(store);

export { store, dispatch, persistor };

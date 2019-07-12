import { createStore, applyMiddleware, combineReducers  } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import gameReducer from './gameReducer';
import playerReducer from './playerReducer';
import thunk from 'redux-thunk';

const rootPersistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2,
    blacklist: ['gameReducer']
}

const reducerPersistConfig = {
    key: 'gameReducer',
    storage: storage,
    stateReconciler: autoMergeLevel2,
    blacklist: ['socket']
}

const rootReducer = combineReducers({
    gameReducer: persistReducer(reducerPersistConfig, gameReducer),
    playerReducer
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

let store = createStore(
    persistedReducer,
    applyMiddleware(thunk)
);

const dispatch = store.dispatch;

let persistor = persistStore(store);

export { store, dispatch, persistor };

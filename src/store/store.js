import { createStore, applyMiddleware, combineReducers  } from 'redux';
import reducer from './reducer';
import playerReducer from './playerReduce';
import thunk from 'redux-thunk';

const store = createStore(
    combineReducers({reducer, playerReducer}),
    applyMiddleware(thunk)
);

const dispatch = store.dispatch;

export { store, dispatch };

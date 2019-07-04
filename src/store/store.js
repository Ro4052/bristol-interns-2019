import { createStore, applyMiddleware, combineReducers  } from 'redux';
import reducer from './reducer';
import cardReducer from '../components/Cards/CardReducer';
import thunk from 'redux-thunk';

const store = createStore(
    combineReducers({reducer, cardReducer}),
    applyMiddleware(thunk)
);
export { store };